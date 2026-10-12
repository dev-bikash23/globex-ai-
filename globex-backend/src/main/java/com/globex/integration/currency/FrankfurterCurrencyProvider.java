package com.globex.integration.currency;

import com.globex.integration.currency.dto.CurrencyRateResponse;
import com.globex.integration.currency.dto.external.FrankfurterRatesResponse;
import com.globex.integration.currency.mapper.CurrencyMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Component
public class FrankfurterCurrencyProvider implements CurrencyProvider {
    private static final Logger log = LoggerFactory.getLogger(FrankfurterCurrencyProvider.class);

    private final CurrencyClient currencyClient;
    private final CurrencyMapper currencyMapper;

    public FrankfurterCurrencyProvider(CurrencyClient currencyClient, CurrencyMapper currencyMapper) {
        this.currencyClient = currencyClient;
        this.currencyMapper = currencyMapper;
    }

    @Override
    public String getProviderName() {
        return "frankfurter";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public Optional<CurrencyRateResponse> getExchangeRate(String baseCurrency, String targetCurrency) {
        String base   = baseCurrency.toUpperCase();
        String target = targetCurrency.toUpperCase();

        if (base.equals(target)) {
            return Optional.of(new CurrencyRateResponse(
                    base, target, 1.0, null,
                    Instant.now().toString(), "Internal",
                    "Base equals target", "Identity conversion"
            ));
        }

        // Try direct fetch first (works when base is EUR or another supported currency)
        Optional<FrankfurterRatesResponse> direct = currencyClient.fetchRates(base, target);
        if (direct.isPresent()) {
            return direct.map(res -> currencyMapper.toCurrencyRateResponse(base, target, res));
        }

        // Fallback: cross-rate via EUR pivot  ->  rate = EUR->target / EUR->base
        // Frankfurter only supports ~33 base currencies; currencies like INR, JPY
        // are only available as *target* currencies against EUR.
        log.debug("Direct rate unavailable for {}/{}; computing cross-rate via EUR pivot", base, target);
        Optional<FrankfurterRatesResponse> eurRates =
                currencyClient.fetchRates("EUR", base + "," + target);

        if (eurRates.isEmpty()) {
            return Optional.empty();
        }

        Map<String, Double> rates = eurRates.get().rates();
        if (rates == null || !rates.containsKey(base) || !rates.containsKey(target)) {
            log.warn("EUR pivot missing rate for base={} or target={}", base, target);
            return Optional.empty();
        }

        double eurToBase   = rates.get(base);
        double eurToTarget = rates.get(target);
        double crossRate   = eurToTarget / eurToBase;

        return Optional.of(new CurrencyRateResponse(
                base, target, crossRate, null,
                Instant.now().toString(),
                "frankfurter (EUR cross-rate)",
                String.format("1 %s = %.6f %s", base, crossRate, target),
                "Cross-rate computed via EUR pivot"
        ));
    }

    @Override
    public Optional<Map<String, String>> getSupportedCurrencies() {
        return currencyClient.fetchCurrencies();
    }
}
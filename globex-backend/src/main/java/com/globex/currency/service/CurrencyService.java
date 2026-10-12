package com.globex.currency.service;

import com.globex.integration.currency.CurrencyProvider;
import com.globex.integration.currency.dto.CurrencyRateResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class CurrencyService {
    private static final Logger log = LoggerFactory.getLogger(CurrencyService.class);

    private final CurrencyProvider currencyProvider;

    public CurrencyService(CurrencyProvider currencyProvider) {
        this.currencyProvider = currencyProvider;
    }

    @Cacheable(value = "currency_rates", key = "#base.toUpperCase() + '_' + #target.toUpperCase()")
    public CurrencyRateResponse getExchangeRate(String base, String target) {
        log.info("Fetching exchange rate for {} -> {}", base, target);
        return currencyProvider.getExchangeRate(base, target)
                .orElseGet(() -> new CurrencyRateResponse(
                        base.toUpperCase(),
                        target.toUpperCase(),
                        1.0,
                        null,
                        Instant.now().toString(),
                        "Unavailable",
                        "Failed to retrieve rate from provider",
                        "Rates by Frankfurter / ECB"
                ));
    }

    @Cacheable(value = "supported_currencies", key = "'all'")
    public Map<String, String> getSupportedCurrencies() {
        return currencyProvider.getSupportedCurrencies()
                .orElseGet(() -> Map.of(
                        "USD", "United States Dollar",
                        "EUR", "Euro",
                        "GBP", "British Pound",
                        "JPY", "Japanese Yen",
                        "INR", "Indian Rupee",
                        "AUD", "Australian Dollar",
                        "CAD", "Canadian Dollar",
                        "CHF", "Swiss Franc",
                        "CNY", "Chinese Renminbi Yuan",
                        "BRL", "Brazilian Real"
                ));
    }
}

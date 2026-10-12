package com.globex.integration.currency.mapper;

import com.globex.integration.currency.dto.CurrencyRateResponse;
import com.globex.integration.currency.dto.external.FrankfurterRatesResponse;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class CurrencyMapper {

    public CurrencyRateResponse toCurrencyRateResponse(String base, String target, FrankfurterRatesResponse raw) {
        if (raw == null || raw.rates() == null || !raw.rates().containsKey(target)) {
            return new CurrencyRateResponse(
                    base,
                    target,
                    1.0,
                    null,
                    Instant.now().toString(),
                    "Frankfurter / European Central Bank",
                    "Rate unavailable for currency pair",
                    "Rates by Frankfurter / ECB (Updated each European business day)"
            );
        }

        Double rate = raw.rates().get(target);

        return new CurrencyRateResponse(
                base,
                target,
                rate != null ? rate : 1.0,
                raw.date(),
                Instant.now().toString(),
                "Frankfurter / European Central Bank",
                "Daily ECB reference rate published ~16:00 CET",
                "Rates by Frankfurter / ECB (Updated each European business day)"
        );
    }
}

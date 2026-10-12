package com.globex.integration.currency;

import com.globex.integration.currency.dto.CurrencyRateResponse;

import java.util.Map;
import java.util.Optional;

public interface CurrencyProvider {
    String getProviderName();
    boolean isAvailable();
    Optional<CurrencyRateResponse> getExchangeRate(String baseCurrency, String targetCurrency);
    Optional<Map<String, String>> getSupportedCurrencies();
}

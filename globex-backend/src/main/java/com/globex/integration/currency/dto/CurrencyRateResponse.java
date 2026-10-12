package com.globex.integration.currency.dto;

public record CurrencyRateResponse(
        String baseCurrency,
        String targetCurrency,
        double rate,
        String date,
        String updatedAt,
        String source,
        String note,
        String attribution
) {}

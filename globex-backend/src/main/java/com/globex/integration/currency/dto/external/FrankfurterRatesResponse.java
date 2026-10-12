package com.globex.integration.currency.dto.external;

import java.util.Map;

public record FrankfurterRatesResponse(
        Double amount,
        String base,
        String date,
        Map<String, Double> rates
) {}

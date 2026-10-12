package com.globex.integration.weather.dto;

public record ForecastDay(
        String date,
        double maxTemperature,
        double minTemperature,
        int precipitationProbabilityMax,
        int weatherCode,
        String condition,
        String conditionIcon
) {}

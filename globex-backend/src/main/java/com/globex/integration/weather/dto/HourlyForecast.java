package com.globex.integration.weather.dto;

public record HourlyForecast(
        String time,
        double temperature,
        int precipitationProbability,
        int weatherCode,
        String condition,
        String conditionIcon
) {}

package com.globex.integration.weather.dto;

import java.util.List;

public record WeatherResponse(
        String destinationId,
        double temperature,
        double feelsLike,
        int humidity,
        double windSpeed,
        double precipitation,
        int weatherCode,
        String condition,
        String conditionIcon,
        List<HourlyForecast> hourlyForecast,
        List<ForecastDay> dailyForecast,
        String updatedAt,
        String source,
        String dataFreshness,
        String attribution
) {
    public static WeatherResponse unavailable(String destinationId, String reason) {
        return new WeatherResponse(
                destinationId,
                0.0,
                0.0,
                0,
                0.0,
                0.0,
                -1,
                "Temporarily Unavailable (" + reason + ")",
                "cloud",
                List.of(),
                List.of(),
                null,
                "None",
                "UNAVAILABLE",
                "Weather data unavailable"
        );
    }
}

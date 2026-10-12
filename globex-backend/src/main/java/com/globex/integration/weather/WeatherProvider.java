package com.globex.integration.weather;

import com.globex.integration.weather.dto.WeatherResponse;

import java.util.Optional;

public interface WeatherProvider {
    String getProviderName();
    boolean isAvailable();
    Optional<WeatherResponse> fetchWeather(String destinationId, double latitude, double longitude);
}

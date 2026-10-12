package com.globex.integration.weather;

import com.globex.integration.weather.dto.WeatherResponse;
import com.globex.integration.weather.dto.external.OpenMeteoApiResponse;
import com.globex.integration.weather.mapper.WeatherMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OpenMeteoWeatherProvider implements WeatherProvider {

    private final WeatherClient weatherClient;
    private final WeatherMapper weatherMapper;

    public OpenMeteoWeatherProvider(WeatherClient weatherClient, WeatherMapper weatherMapper) {
        this.weatherClient = weatherClient;
        this.weatherMapper = weatherMapper;
    }

    @Override
    public String getProviderName() {
        return "open-meteo";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public Optional<WeatherResponse> fetchWeather(String destinationId, double latitude, double longitude) {
        Optional<OpenMeteoApiResponse> raw = weatherClient.fetchForecast(latitude, longitude);
        return raw.map(res -> weatherMapper.toWeatherResponse(destinationId, res));
    }
}

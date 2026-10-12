package com.globex.integration.weather;

import com.globex.integration.weather.dto.external.OpenMeteoApiResponse;
import com.globex.shared.config.GlobexProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Component
public class WeatherClient {
    private static final Logger log = LoggerFactory.getLogger(WeatherClient.class);

    private final RestClient restClient;
    private final GlobexProperties properties;

    public WeatherClient(RestClient.Builder restClientBuilder, GlobexProperties properties) {
        this.properties = properties;
        this.restClient = restClientBuilder
                .baseUrl(properties.getIntegration().getWeather().getBaseUrl())
                .build();
    }

    public Optional<OpenMeteoApiResponse> fetchForecast(double latitude, double longitude) {
        try {
            log.debug("Calling Open-Meteo API for lat={}, lng={}", latitude, longitude);
            OpenMeteoApiResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/forecast")
                            .queryParam("latitude", latitude)
                            .queryParam("longitude", longitude)
                            .queryParam("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m")
                            .queryParam("hourly", "temperature_2m,precipitation_probability,weather_code")
                            .queryParam("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max")
                            .queryParam("timezone", "auto")
                            .build())
                    .retrieve()
                    .body(OpenMeteoApiResponse.class);

            return Optional.ofNullable(response);
        } catch (Exception e) {
            log.error("Failed to fetch weather from Open-Meteo for lat={}, lng={}: {}", latitude, longitude, e.getMessage());
            return Optional.empty();
        }
    }
}

package com.globex.weather.service;

import com.globex.destination.domain.Destination;
import com.globex.destination.repository.DestinationRepository;
import com.globex.integration.weather.WeatherProvider;
import com.globex.integration.weather.dto.WeatherResponse;
import com.globex.shared.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WeatherService {
    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final DestinationRepository destinationRepository;
    private final WeatherProvider weatherProvider;

    public WeatherService(DestinationRepository destinationRepository, WeatherProvider weatherProvider) {
        this.destinationRepository = destinationRepository;
        this.weatherProvider = weatherProvider;
    }

    @Cacheable(value = "weather", key = "#destinationId", unless = "#result == null || #result.condition().startsWith('Temporarily Unavailable')")
    public WeatherResponse getWeatherForDestination(String destinationId) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        log.info("Fetching real-time weather for destination: {} ({}, {})", destination.getName(), destination.getLatitude(), destination.getLongitude());

        Optional<WeatherResponse> weather = weatherProvider.fetchWeather(
                destination.getId(),
                destination.getLatitude(),
                destination.getLongitude()
        );

        return weather.orElseGet(() -> {
            log.warn("Weather provider returned empty for destination: {}", destination.getName());
            return WeatherResponse.unavailable(destination.getId(), "Provider unavailable");
        });
    }
}

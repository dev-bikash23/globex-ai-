package com.globex.admin.integration.service;

import com.globex.admin.integration.dto.ProviderHealthStatus;
import com.globex.integration.currency.CurrencyProvider;
import com.globex.integration.images.ImageProvider;
import com.globex.integration.places.PlacesProvider;
import com.globex.integration.weather.WeatherProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class IntegrationHealthService {

    private final WeatherProvider weatherProvider;
    private final CurrencyProvider currencyProvider;
    private final PlacesProvider placesProvider;
    private final ImageProvider unsplashImageProvider;

    public IntegrationHealthService(
            WeatherProvider weatherProvider,
            CurrencyProvider currencyProvider,
            PlacesProvider placesProvider,
            @Qualifier("unsplashImageProvider") ImageProvider unsplashImageProvider) {
        this.weatherProvider = weatherProvider;
        this.currencyProvider = currencyProvider;
        this.placesProvider = placesProvider;
        this.unsplashImageProvider = unsplashImageProvider;
    }

    public List<ProviderHealthStatus> checkAllProviders() {
        List<ProviderHealthStatus> statuses = new ArrayList<>();

        // 1. Weather
        long start = System.currentTimeMillis();
        boolean weatherOk = weatherProvider.isAvailable();
        long weatherLatency = System.currentTimeMillis() - start;
        statuses.add(new ProviderHealthStatus(
                "WEATHER",
                weatherProvider.getProviderName(),
                weatherOk ? "AVAILABLE" : "UNAVAILABLE",
                weatherLatency,
                Instant.now().toString(),
                "Real-time forecasts via Open-Meteo"
        ));

        // 2. Currency
        start = System.currentTimeMillis();
        boolean currencyOk = currencyProvider.isAvailable();
        long currencyLatency = System.currentTimeMillis() - start;
        statuses.add(new ProviderHealthStatus(
                "CURRENCY",
                currencyProvider.getProviderName(),
                currencyOk ? "AVAILABLE" : "UNAVAILABLE",
                currencyLatency,
                Instant.now().toString(),
                "ECB exchange rates via Frankfurter"
        ));

        // 3. Places
        start = System.currentTimeMillis();
        boolean placesOk = placesProvider.isAvailable();
        long placesLatency = System.currentTimeMillis() - start;
        statuses.add(new ProviderHealthStatus(
                "PLACES",
                placesProvider.getProviderName(),
                placesOk ? "AVAILABLE" : "UNAVAILABLE",
                placesLatency,
                Instant.now().toString(),
                "Points of interest via OpenStreetMap Overpass"
        ));

        // 4. Images
        start = System.currentTimeMillis();
        boolean imageOk = unsplashImageProvider.isAvailable();
        long imageLatency = System.currentTimeMillis() - start;
        statuses.add(new ProviderHealthStatus(
                "IMAGES",
                unsplashImageProvider.getProviderName(),
                imageOk ? "AVAILABLE" : "DEGRADED",
                imageLatency,
                Instant.now().toString(),
                imageOk ? "Live photography via Unsplash API" : "Unsplash key not set, using curated dev fallback"
        ));

        return statuses;
    }
}

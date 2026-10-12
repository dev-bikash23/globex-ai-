package com.globex.integration.images;

import com.globex.integration.images.dto.external.UnsplashSearchResponse;
import com.globex.shared.config.GlobexProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Component
public class ImageClient {
    private static final Logger log = LoggerFactory.getLogger(ImageClient.class);

    private final RestClient restClient;
    private final GlobexProperties properties;

    public ImageClient(RestClient.Builder restClientBuilder, GlobexProperties properties) {
        this.properties = properties;
        String accessKey = properties.getIntegration().getImages().getAccessKey();
        var builder = restClientBuilder
                .baseUrl(properties.getIntegration().getImages().getBaseUrl());

        if (accessKey != null && !accessKey.isBlank()) {
            builder.defaultHeader("Authorization", "Client-ID " + accessKey.trim());
        }

        this.restClient = builder.build();
    }

    public Optional<UnsplashSearchResponse> searchPhotos(String query, int count) {
        String accessKey = properties.getIntegration().getImages().getAccessKey();
        if (accessKey == null || accessKey.isBlank()) {
            log.debug("Unsplash Access Key not configured, skipping live API call");
            return Optional.empty();
        }

        try {
            log.debug("Calling Unsplash search for query={}, count={}", query, count);
            UnsplashSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search/photos")
                            .queryParam("query", query)
                            .queryParam("per_page", Math.min(count, 12))
                            .queryParam("orientation", "landscape")
                            .build())
                    .retrieve()
                    .body(UnsplashSearchResponse.class);

            return Optional.ofNullable(response);
        } catch (Exception e) {
            log.error("Failed to query Unsplash API: query={}, err={}", query, e.getMessage());
            return Optional.empty();
        }
    }
}

package com.globex.integration.duffel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globex.integration.duffel.dto.DuffelOfferRequestResponse;
import com.globex.shared.config.GlobexProperties;
import com.globex.shared.exception.ProviderUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

/**
 * Low-level HTTP client for the Duffel API.
 *
 * Responsibilities:
 *  - Add Authorization: Bearer {token} header
 *  - Add Duffel-Version header
 *  - Handle HTTP errors and map to ProviderUnavailableException
 *  - Never log the API token value
 *
 * Provider-specific logic (search, normalize) lives in DuffelFlightProvider.
 * This class is just the transport layer.
 */
@Component
public class DuffelClient {

    private static final Logger log = LoggerFactory.getLogger(DuffelClient.class);

    private final GlobexProperties.Integration.Duffel duffelConfig;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public DuffelClient(GlobexProperties properties, ObjectMapper objectMapper) {
        this.duffelConfig = properties.getIntegration().getDuffel();
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofMillis(duffelConfig.getConnectTimeoutMs()))
            .build();
    }

    /**
     * POST a flight offer request to Duffel API.
     * @param requestBody the JSON body to send
     * @return parsed DuffelOfferRequestResponse
     */
    public DuffelOfferRequestResponse postOfferRequest(Map<String, Object> requestBody) {
        String token = duffelConfig.getApiToken();
        if (token == null || token.isBlank()) {
            throw new ProviderUnavailableException("duffel",
                "Flight search is temporarily unavailable. Provider not configured.");
        }

        try {
            String bodyJson = objectMapper.writeValueAsString(requestBody);
            String url = duffelConfig.getBaseUrl() + "/air/offer_requests";

            log.debug("[Duffel] POST {} (token present: {})", url, !token.isBlank());

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .header("Duffel-Version", duffelConfig.getApiVersion())
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .timeout(Duration.ofMillis(duffelConfig.getReadTimeoutMs()))
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .build();

            HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());

            int status = response.statusCode();
            log.debug("[Duffel] Response status: {}", status);

            if (status == 200 || status == 201) {
                return objectMapper.readValue(response.body(), DuffelOfferRequestResponse.class);
            }

            // Map provider HTTP errors to user-friendly messages
            String userMessage = mapDuffelError(status);
            log.warn("[Duffel] Error {}: {}", status, response.body());
            throw new ProviderUnavailableException("duffel", status, userMessage);

        } catch (ProviderUnavailableException e) {
            throw e;
        } catch (java.net.http.HttpTimeoutException e) {
            log.warn("[Duffel] Request timed out: {}", e.getMessage());
            throw new ProviderUnavailableException("duffel",
                "Flight search timed out. Please try again.");
        } catch (Exception e) {
            log.error("[Duffel] Unexpected error: {}", e.getMessage(), e);
            throw new ProviderUnavailableException("duffel",
                "Flight search is temporarily unavailable. Please try again.", e);
        }
    }

    private String mapDuffelError(int statusCode) {
        return switch (statusCode) {
            case 400 -> "Invalid search parameters. Please check your origin, destination, and dates.";
            case 401 -> "Flight search is temporarily unavailable. Authentication failed.";
            case 403 -> "Flight search is temporarily unavailable. Access denied.";
            case 404 -> "No flight routes found for the selected airports.";
            case 422 -> "Invalid search parameters. Please check all fields.";
            case 429 -> "Too many flight searches. Please wait a moment and try again.";
            case 500, 502, 503, 504 -> "Flight search provider is temporarily unavailable. Please try again.";
            default -> "Flight search encountered an unexpected error. Please try again.";
        };
    }

    public boolean isConfigured() {
        String token = duffelConfig.getApiToken();
        return token != null && !token.isBlank();
    }

    public boolean isTestMode() {
        String token = duffelConfig.getApiToken();
        return token != null && token.startsWith("duffel_test_");
    }
}

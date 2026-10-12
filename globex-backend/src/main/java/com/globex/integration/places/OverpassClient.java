package com.globex.integration.places;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globex.integration.places.dto.external.OverpassResponse;
import com.globex.shared.config.GlobexProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

/**
 * Client for the Overpass API (OpenStreetMap query engine).
 * Uses java.net.http.HttpClient with a strict per-request timeout
 * and tries multiple public mirrors in sequence for resilience.
 */
@Component
public class OverpassClient {
    private static final Logger log = LoggerFactory.getLogger(OverpassClient.class);

    private static final List<String> MIRROR_URLS = List.of(
            "https://overpass-api.de/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter",
            "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
    );

    /** Hard per-mirror timeout — fail fast and try the next mirror. */
    private static final Duration PER_MIRROR_TIMEOUT = Duration.ofSeconds(8);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final GlobexProperties properties;

    public OverpassClient(GlobexProperties properties) {
        this.properties = properties;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    public Optional<OverpassResponse> queryPlaces(double latitude, double longitude, int radiusMeters, String category) {
        String filterBlock = buildFilterBlock(category, radiusMeters, latitude, longitude);
        String ql = "[out:json][timeout:7];(" + filterBlock + ");out center 30;";
        String body;
        try {
            body = "data=" + URLEncoder.encode(ql, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to encode Overpass query: {}", e.getMessage());
            return Optional.empty();
        }

        for (String mirrorUrl : MIRROR_URLS) {
            try {
                log.debug("Querying Overpass mirror={} lat={} lng={} radius={}", mirrorUrl, latitude, longitude, radiusMeters);
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(mirrorUrl))
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .header("User-Agent", properties.getIntegration().getGeocoding().getUserAgent())
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .timeout(PER_MIRROR_TIMEOUT)
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    OverpassResponse parsed = objectMapper.readValue(response.body(), OverpassResponse.class);
                    int count = parsed.elements() == null ? 0 : parsed.elements().size();
                    log.debug("Overpass OK from mirror={} elements={}", mirrorUrl, count);
                    return Optional.of(parsed);
                } else {
                    log.warn("Overpass mirror {} returned HTTP {}", mirrorUrl, response.statusCode());
                }
            } catch (java.net.http.HttpTimeoutException e) {
                log.warn("Overpass mirror {} timed out after {}s — trying next", mirrorUrl, PER_MIRROR_TIMEOUT.getSeconds());
            } catch (Exception e) {
                log.warn("Overpass mirror {} failed: {} — trying next", mirrorUrl, e.getMessage());
            }
        }

        log.error("All Overpass mirrors failed for lat={}, lng={}", latitude, longitude);
        return Optional.empty();
    }

    private String buildFilterBlock(String category, int radius, double lat, double lon) {
        String loc = "(around:" + radius + "," + lat + "," + lon + ");";
        if (category == null || category.isBlank() || category.equalsIgnoreCase("all") || category.equalsIgnoreCase("tourism")) {
            return "nwr[\"tourism\"~\"attraction|museum|viewpoint|gallery|theme_park|zoo|aquarium\"]" + loc +
                   "nwr[\"historic\"~\"monument|memorial|castle|ruins|archaeological_site\"]" + loc +
                   "nwr[\"leisure\"~\"park|garden\"]" + loc;
        } else if (category.equalsIgnoreCase("museum")) {
            return "nwr[\"tourism\"=\"museum\"]" + loc + "nwr[\"tourism\"=\"gallery\"]" + loc;
        } else if (category.equalsIgnoreCase("park")) {
            return "nwr[\"leisure\"~\"park|garden\"]" + loc;
        } else if (category.equalsIgnoreCase("historic")) {
            return "nwr[\"historic\"]" + loc;
        } else if (category.equalsIgnoreCase("food")) {
            return "nwr[\"amenity\"~\"restaurant|cafe\"]" + loc;
        }
        return "nwr[\"tourism\"]" + loc;
    }
}
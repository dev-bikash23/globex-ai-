package com.globex.integration.places.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OverpassResponse(
        Double version,
        String generator,
        List<Element> elements
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Element(
            String type,
            Long id,
            Double lat,
            Double lon,
            Map<String, String> tags,
            @JsonProperty("center") Center center
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Center(
            Double lat,
            Double lon
    ) {}
}

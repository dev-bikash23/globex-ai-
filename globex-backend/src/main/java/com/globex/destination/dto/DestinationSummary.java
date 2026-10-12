package com.globex.destination.dto;

import com.globex.destination.domain.Destination;

/**
 * Lightweight DTO for globe markers — only coordinates and names.
 * Avoids loading full description/image data for the globe view.
 */
public record DestinationSummary(
        String id,
        String name,
        String slug,
        Double latitude,
        Double longitude,
        boolean featured,
        String countryName,
        String countryCode,
        String flagEmoji
) {
    public static DestinationSummary from(Destination d) {
        var country = d.getCity().getCountry();
        return new DestinationSummary(
                d.getId(), d.getName(), d.getSlug(),
                d.getLatitude(), d.getLongitude(), d.isFeatured(),
                country.getName(), country.getCode(), country.getFlagEmoji()
        );
    }
}

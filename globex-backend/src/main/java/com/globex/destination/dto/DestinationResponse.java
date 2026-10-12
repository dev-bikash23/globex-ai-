package com.globex.destination.dto;

import com.globex.destination.domain.Destination;

public record DestinationResponse(
        String id,
        String name,
        String slug,
        String description,
        Double latitude,
        Double longitude,
        String imageUrl,
        boolean featured,
        CityResponse city,
        CountryResponse country
) {
    public static DestinationResponse from(Destination d) {
        CityResponse city = CityResponse.from(d.getCity());
        return new DestinationResponse(
                d.getId(), d.getName(), d.getSlug(), d.getDescription(),
                d.getLatitude(), d.getLongitude(), d.getImageUrl(), d.isFeatured(),
                city, city.country()
        );
    }
}

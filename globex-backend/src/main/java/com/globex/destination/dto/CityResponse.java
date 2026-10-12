package com.globex.destination.dto;

import com.globex.destination.domain.City;

public record CityResponse(
        String id,
        String name,
        Double latitude,
        Double longitude,
        String timezone,
        CountryResponse country
) {
    public static CityResponse from(City c) {
        return new CityResponse(
                c.getId(), c.getName(), c.getLatitude(), c.getLongitude(),
                c.getTimezone(), CountryResponse.from(c.getCountry())
        );
    }
}

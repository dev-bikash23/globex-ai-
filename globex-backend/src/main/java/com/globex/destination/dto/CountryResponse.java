package com.globex.destination.dto;

import com.globex.destination.domain.Country;

public record CountryResponse(
        String id,
        String code,
        String name,
        String officialName,
        String continent,
        Double latitude,
        Double longitude,
        String timezone,
        String currencyCode,
        String primaryLanguage,
        String flagEmoji
) {
    public static CountryResponse from(Country c) {
        return new CountryResponse(
                c.getId(), c.getCode(), c.getName(), c.getOfficialName(),
                c.getContinent(), c.getLatitude(), c.getLongitude(),
                c.getTimezone(), c.getCurrencyCode(), c.getPrimaryLanguage(), c.getFlagEmoji()
        );
    }
}

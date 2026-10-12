package com.globex.travel.hotel.dto;

import com.globex.travel.domain.HotelOffer;

import java.time.Instant;
import java.util.List;

/**
 * Hotel search response returned to frontend API consumers.
 */
public record HotelSearchResponse(
    String searchId,
    String provider,
    boolean isTestData,
    String dataNotice,
    int totalResults,
    String sortBy,
    List<HotelOffer> hotels,
    Instant searchedAt,
    HotelSearchFilters availableFilters
) {

    public record HotelSearchFilters(
        double minPricePerNight,
        double maxPricePerNight,
        String priceCurrency,
        int minStars,
        int maxStars,
        List<String> amenities,
        boolean hasFreeBreakfast,
        boolean hasFreeCancellation
    ) {}
}

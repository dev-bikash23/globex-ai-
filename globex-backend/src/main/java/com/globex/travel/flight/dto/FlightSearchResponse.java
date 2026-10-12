package com.globex.travel.flight.dto;

import com.globex.travel.domain.FlightOffer;

import java.time.Instant;
import java.util.List;

/**
 * Flight search response returned to frontend API consumers.
 * Wraps a list of normalized FlightOffers with metadata.
 */
public record FlightSearchResponse(
    String searchId,                 // UUID for this search (for history)
    String provider,                 // Which provider served this result
    boolean isTestData,              // True = sandbox/test data, NOT live fares
    String dataNotice,               // Human-readable notice when isTestData=true
    int totalResults,                // Total offers found (before any pagination)
    String sortBy,                   // How results are sorted
    List<FlightOffer> offers,        // Sorted, filtered offers
    Instant searchedAt,             // When the search was performed
    FlightSearchFilters availableFilters  // Filter ranges for UI
) {

    public record FlightSearchFilters(
        double minPrice,
        double maxPrice,
        String priceCurrency,
        int minDurationMinutes,
        int maxDurationMinutes,
        List<String> airlines,
        List<Integer> stopCounts,    // [0, 1, 2]
        List<String> cabinClasses
    ) {}
}

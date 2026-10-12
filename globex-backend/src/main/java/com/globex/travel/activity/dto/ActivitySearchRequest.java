package com.globex.travel.activity.dto;

import jakarta.validation.constraints.*;

/**
 * Activity search request from frontend → backend API.
 */
public record ActivitySearchRequest(

    @NotBlank(message = "Destination is required")
    String destination,             // City name for display

    double latitude,                // Destination latitude (for provider)
    double longitude,               // Destination longitude (for provider)

    String category,                // SIGHTSEEING, TOURS, FOOD, ADVENTURE, MUSEUMS, NATURE, FAMILY

    @Min(value = 1, message = "At least 1 participant required")
    int participants,

    String currency,                // ISO 4217

    String sortBy                   // RATING, PRICE_ASC, DURATION
) {

    public String normalizedCurrency() {
        if (currency == null || currency.isBlank()) return "USD";
        return currency.toUpperCase();
    }

    public String normalizedSortBy() {
        if (sortBy == null || sortBy.isBlank()) return "RATING";
        return sortBy.toUpperCase();
    }
}

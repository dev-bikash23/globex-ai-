package com.globex.travel.flight.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Flight search request from frontend → backend API.
 * Validated before being passed to FlightProvider.
 */
public record FlightSearchRequest(

    @NotBlank(message = "Origin airport/city code is required")
    @Size(min = 2, max = 7, message = "Origin code must be 2-7 characters")
    String origin,

    @NotBlank(message = "Destination airport/city code is required")
    @Size(min = 2, max = 7, message = "Destination code must be 2-7 characters")
    String destination,

    @NotNull(message = "Departure date is required")
    @FutureOrPresent(message = "Departure date must be today or in the future")
    LocalDate departureDate,

    LocalDate returnDate,           // null = one-way trip

    @Min(value = 1, message = "At least 1 adult required")
    @Max(value = 9, message = "Maximum 9 adults per search")
    int adults,

    @Min(value = 0, message = "Children count cannot be negative")
    @Max(value = 8, message = "Maximum 8 children per search")
    int children,

    @Min(value = 0, message = "Infants count cannot be negative")
    @Max(value = 4, message = "Maximum 4 infants per search")
    int infants,

    String cabinClass,              // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST

    String currency,                // ISO 4217, e.g. "INR", "USD", "GBP"

    String sortBy,                  // CHEAPEST, FASTEST, BEST, EARLIEST — default CHEAPEST

    Integer maxPrice                // Optional price filter (in requested currency)
) {

    public boolean isRoundTrip() {
        return returnDate != null;
    }

    public String normalizedCabinClass() {
        if (cabinClass == null || cabinClass.isBlank()) return "economy";
        return cabinClass.toLowerCase().replace("_", " ")
            .replaceAll("premium economy", "premium_economy");
    }

    public String normalizedCurrency() {
        if (currency == null || currency.isBlank()) return "USD";
        return currency.toUpperCase();
    }

    public String normalizedSortBy() {
        if (sortBy == null || sortBy.isBlank()) return "CHEAPEST";
        return sortBy.toUpperCase();
    }
}

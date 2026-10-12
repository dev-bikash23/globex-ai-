package com.globex.travel.hotel.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Hotel search request from frontend → backend API.
 */
public record HotelSearchRequest(

    @NotBlank(message = "Destination is required")
    String destination,             // City name or IATA city code

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    LocalDate checkIn,

    @NotNull(message = "Check-out date is required")
    LocalDate checkOut,

    @Min(value = 1, message = "At least 1 adult required")
    @Max(value = 20, message = "Maximum 20 adults per search")
    int adults,

    @Min(value = 0, message = "Children count cannot be negative")
    int children,

    @Min(value = 1, message = "At least 1 room required")
    @Max(value = 9, message = "Maximum 9 rooms per search")
    int rooms,

    String currency,                // ISO 4217

    String sortBy,                  // PRICE_ASC, PRICE_DESC, RATING, RECOMMENDED

    Integer minStars,               // Filter: minimum star rating
    Integer maxPrice                // Filter: max price per night (in requested currency)
) {

    public int nights() {
        if (checkIn == null || checkOut == null) return 0;
        return (int) checkIn.until(checkOut, java.time.temporal.ChronoUnit.DAYS);
    }

    public String normalizedCurrency() {
        if (currency == null || currency.isBlank()) return "USD";
        return currency.toUpperCase();
    }

    public String normalizedSortBy() {
        if (sortBy == null || sortBy.isBlank()) return "RECOMMENDED";
        return sortBy.toUpperCase();
    }
}

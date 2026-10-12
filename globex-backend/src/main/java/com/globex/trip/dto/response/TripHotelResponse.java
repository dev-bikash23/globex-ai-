package com.globex.trip.dto.response;
import java.math.BigDecimal;
import java.time.Instant;
public record TripHotelResponse(
    String id, String tripId, String provider, String providerOfferId,
    String hotelName, String checkIn, String checkOut, String roomType,
    BigDecimal priceAmount, String currency, String status,
    Instant lastValidatedAt, Instant createdAt, String statusNote
) {}

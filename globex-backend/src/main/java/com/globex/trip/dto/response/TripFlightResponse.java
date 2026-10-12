package com.globex.trip.dto.response;
import java.math.BigDecimal;
import java.time.Instant;
public record TripFlightResponse(
    String id, String tripId, String provider, String providerOfferId,
    String origin, String destination, Instant departureTime, Instant arrivalTime,
    String airline, String cabinClass, BigDecimal priceAmount, String currency,
    String status, Instant lastValidatedAt, Instant createdAt,
    String statusNote
) {}

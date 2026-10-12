package com.globex.trip.dto.response;
import java.math.BigDecimal;
import java.time.Instant;
public record TripActivityResponse(
    String id, String tripId, String provider, String providerOfferId,
    String activityName, String activityDate, String startTime,
    Integer durationMinutes, BigDecimal priceAmount, String currency,
    String category, String status, Instant createdAt
) {}

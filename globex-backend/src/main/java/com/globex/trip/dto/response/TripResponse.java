package com.globex.trip.dto.response;
import com.globex.trip.domain.TripStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record TripResponse(
    String id, String userId, String destinationId, DestinationInfo destination,
    String title, String description, String startDate, String endDate,
    TripStatus status, String currency, BigDecimal budgetLimit,
    String coverImageUrl, int durationDays, int travelerCount,
    Instant createdAt, Instant updatedAt
) {
    public record DestinationInfo(String id, String name, String slug, String imageUrl, String cityName, String countryName) {}
}

package com.globex.trip.dto.response;
import java.math.BigDecimal;
import java.time.Instant;
public record ItineraryItemResponse(
    String id, String dayId, String title, String description, String itemType,
    String startTime, String endTime, String locationName, Double latitude, Double longitude,
    BigDecimal estimatedCost, String currency, int sortOrder, String notes,
    Instant createdAt, Instant updatedAt
) {}

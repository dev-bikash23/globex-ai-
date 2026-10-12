package com.globex.trip.dto.response;
import java.time.Instant;
import java.util.List;
public record ItineraryDayResponse(
    String id, String tripId, int dayNumber, String date,
    String title, String notes, List<ItineraryItemResponse> items,
    Instant createdAt, Instant updatedAt
) {}

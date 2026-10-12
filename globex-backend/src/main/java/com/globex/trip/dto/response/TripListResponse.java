package com.globex.trip.dto.response;
import java.util.List;
public record TripListResponse(
    List<TripSummaryResponse> upcoming,
    List<TripSummaryResponse> planning,
    List<TripSummaryResponse> past,
    int totalCount
) {}

package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
public record CreateItineraryDayRequest(
    @Min(1) int dayNumber,
    @NotNull String date,
    @Size(max=200) String title,
    String notes
) {}

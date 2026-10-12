package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
public record UpdateItineraryDayRequest(
    @Size(max=200) String title,
    String notes
) {}

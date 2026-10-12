package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Partial update — all fields are optional except validation constraints.
 * Only non-null fields are applied by TripService.updateTrip().
 */
public record UpdateTripRequest(
    @Size(min=2, max=200) String title,
    @Size(max=2000) String description,
    String startDate,
    String endDate,
    @Size(min=3, max=3) String currency,
    @DecimalMin("0") BigDecimal budgetLimit,
    String coverImageUrl
) {}
package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record UpdateItineraryItemRequest(
    @NotBlank @Size(max=200) String title,
    String description,
    @NotBlank String itemType,
    String startTime,
    String endTime,
    @Size(max=200) String locationName,
    Double latitude,
    Double longitude,
    @DecimalMin("0") BigDecimal estimatedCost,
    @Size(min=3, max=3) String currency,
    int sortOrder,
    String notes
) {}

package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateTripRequest(
    String destinationId,
    @NotBlank @Size(min=2, max=200) String title,
    @Size(max=2000) String description,
    @NotNull String startDate,
    @NotNull String endDate,
    @NotBlank @Size(min=3, max=3) String currency,
    @DecimalMin("0") BigDecimal budgetLimit
) {}

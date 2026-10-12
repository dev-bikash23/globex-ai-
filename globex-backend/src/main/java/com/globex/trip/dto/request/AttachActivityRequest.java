package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record AttachActivityRequest(
    String provider,
    String providerOfferId,
    @NotBlank @Size(max=200) String activityName,
    String activityDate,
    String startTime,
    Integer durationMinutes,
    @DecimalMin("0") BigDecimal priceAmount,
    @Size(min=3, max=3) String currency,
    String category
) {}

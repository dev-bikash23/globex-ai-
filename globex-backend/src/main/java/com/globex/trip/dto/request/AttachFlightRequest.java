package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record AttachFlightRequest(
    @NotBlank String provider,
    @NotBlank String providerOfferId,
    @NotBlank String origin,
    @NotBlank String destination,
    String departureTime,
    String arrivalTime,
    String airline,
    String cabinClass,
    @NotNull @DecimalMin("0") BigDecimal priceAmount,
    @NotBlank @Size(min=3, max=3) String currency
) {}

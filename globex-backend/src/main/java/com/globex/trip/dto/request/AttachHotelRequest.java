package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record AttachHotelRequest(
    @NotBlank String provider,
    @NotBlank String providerOfferId,
    @NotBlank @Size(max=200) String hotelName,
    @NotNull String checkIn,
    @NotNull String checkOut,
    String roomType,
    @NotNull @DecimalMin("0") BigDecimal priceAmount,
    @NotBlank @Size(min=3, max=3) String currency
) {}

package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
public record UpdateTripStatusRequest(@NotBlank String status) {}

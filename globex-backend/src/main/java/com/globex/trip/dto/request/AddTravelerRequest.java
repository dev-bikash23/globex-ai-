package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
public record AddTravelerRequest(
    @Size(max=100) String firstName,
    @Size(max=100) String lastName,
    @NotBlank String travelerType
) {}

package com.globex.trip.dto.response;
import java.time.Instant;
public record TravelerResponse(String id, String tripId, String firstName, String lastName, String travelerType, Instant createdAt) {}

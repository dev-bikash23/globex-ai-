package com.globex.integration.places.dto;

public record PlaceResponse(
        String id,
        String name,
        String category,
        String type,
        double latitude,
        double longitude,
        Double distanceMeters,
        String address,
        String description,
        String website,
        String openingHours,
        String source,
        String attribution
) {}

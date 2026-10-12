package com.globex.integration.places;

import com.globex.integration.places.dto.PlaceResponse;

import java.util.List;

public interface PlacesProvider {
    String getProviderName();
    boolean isAvailable();
    List<PlaceResponse> fetchPlacesNear(double latitude, double longitude, int radiusMeters, String category, int limit);
}

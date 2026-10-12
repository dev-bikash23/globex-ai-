package com.globex.integration.places;

import com.globex.integration.places.dto.PlaceResponse;
import com.globex.integration.places.dto.external.OverpassResponse;
import com.globex.integration.places.mapper.PlacesMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class OverpassPlacesProvider implements PlacesProvider {

    private final OverpassClient overpassClient;
    private final PlacesMapper placesMapper;

    public OverpassPlacesProvider(OverpassClient overpassClient, PlacesMapper placesMapper) {
        this.overpassClient = overpassClient;
        this.placesMapper = placesMapper;
    }

    @Override
    public String getProviderName() {
        return "overpass-openstreetmap";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public List<PlaceResponse> fetchPlacesNear(double latitude, double longitude, int radiusMeters, String category, int limit) {
        Optional<OverpassResponse> raw = overpassClient.queryPlaces(latitude, longitude, radiusMeters, category);
        return raw.map(res -> placesMapper.toPlaceResponses(latitude, longitude, res, limit)).orElse(List.of());
    }
}

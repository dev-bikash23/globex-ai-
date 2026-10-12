package com.globex.places.service;

import com.globex.destination.domain.Destination;
import com.globex.destination.repository.DestinationRepository;
import com.globex.integration.places.PlacesProvider;
import com.globex.integration.places.dto.PlaceResponse;
import com.globex.shared.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlacesService {
    private static final Logger log = LoggerFactory.getLogger(PlacesService.class);

    private final DestinationRepository destinationRepository;
    private final PlacesProvider placesProvider;

    public PlacesService(DestinationRepository destinationRepository, PlacesProvider placesProvider) {
        this.destinationRepository = destinationRepository;
        this.placesProvider = placesProvider;
    }

    @Cacheable(value = "places", key = "#destinationId + '_' + (#category != null ? #category : 'all') + '_' + #limit")
    public List<PlaceResponse> getPlacesForDestination(String destinationId, String category, int radiusMeters, int limit) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        int effectiveRadius = radiusMeters > 0 ? radiusMeters : 4000;
        int effectiveLimit = (limit > 0 && limit <= 50) ? limit : 20;

        log.info("Fetching places for destination: {} ({}, {}) [category={}, radius={}m, limit={}]",
                destination.getName(), destination.getLatitude(), destination.getLongitude(), category, effectiveRadius, effectiveLimit);

        return placesProvider.fetchPlacesNear(
                destination.getLatitude(),
                destination.getLongitude(),
                effectiveRadius,
                category,
                effectiveLimit
        );
    }
}

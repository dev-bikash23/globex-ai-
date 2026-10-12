package com.globex.destination.service;

import com.globex.destination.dto.DestinationResponse;
import com.globex.destination.dto.DestinationSummary;
import com.globex.destination.repository.DestinationRepository;
import com.globex.shared.exception.ResourceNotFoundException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    /**
     * Returns only featured destinations — used for globe markers.
     * Cached: globe markers don't change frequently.
     */
    @Cacheable(value = "destinations", key = "'featured'")
    public List<DestinationSummary> getFeaturedDestinations() {
        return destinationRepository.findByFeaturedTrue().stream()
                .map(DestinationSummary::from)
                .toList();
    }

    /**
     * Paginated destination list.
     * Cached per page — stable data.
     */
    @Cacheable(value = "destinations", key = "'page-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DestinationResponse> getAllDestinations(Pageable pageable) {
        return destinationRepository.findAll(pageable)
                .map(DestinationResponse::from);
    }

    /**
     * Single destination by ID.
     * Cached per ID.
     */
    @Cacheable(value = "destinations", key = "'id-' + #id")
    public DestinationResponse getDestinationById(String id) {
        return destinationRepository.findById(id)
                .map(DestinationResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found: " + id));
    }

    /**
     * Single destination by slug.
     * NOT cached — slugs can change and slug→id mapping would need invalidation.
     */
    public DestinationResponse getDestinationBySlug(String slug) {
        return destinationRepository.findBySlug(slug)
                .map(DestinationResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found: " + slug));
    }

    /**
     * Cross-entity search — NOT cached (query is dynamic).
     * Searches destination name, city name, and country name.
     */
    public Page<DestinationSummary> searchDestinations(String query, Pageable pageable) {
        return destinationRepository.search(query, pageable)
                .map(DestinationSummary::from);
    }
}

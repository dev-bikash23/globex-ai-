package com.globex.images.service;

import com.globex.destination.domain.Destination;
import com.globex.destination.repository.DestinationRepository;
import com.globex.images.domain.DestinationImage;
import com.globex.images.repository.DestinationImageRepository;
import com.globex.integration.images.ImageProvider;
import com.globex.integration.images.dto.DestinationImageResponse;
import com.globex.shared.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DestinationImageService {
    private static final Logger log = LoggerFactory.getLogger(DestinationImageService.class);

    private final DestinationRepository destinationRepository;
    private final DestinationImageRepository destinationImageRepository;
    private final ImageProvider unsplashImageProvider;
    private final ImageProvider mockImageProvider;

    public DestinationImageService(
            DestinationRepository destinationRepository,
            DestinationImageRepository destinationImageRepository,
            @Qualifier("unsplashImageProvider") ImageProvider unsplashImageProvider,
            @Qualifier("mockImageProvider") ImageProvider mockImageProvider) {
        this.destinationRepository = destinationRepository;
        this.destinationImageRepository = destinationImageRepository;
        this.unsplashImageProvider = unsplashImageProvider;
        this.mockImageProvider = mockImageProvider;
    }

    @Transactional
    @Cacheable(value = "destination_images", key = "#destinationId + '_' + #count")
    public List<DestinationImageResponse> getImagesForDestination(String destinationId, int count) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        int effectiveCount = (count > 0 && count <= 12) ? count : 6;
        String query = destination.getName() + " " + destination.getCity().getName() + " " + destination.getCity().getCountry().getName();

        List<DestinationImageResponse> images = List.of();

        if (unsplashImageProvider.isAvailable()) {
            log.info("Fetching real Unsplash images for query: {}", query);
            images = unsplashImageProvider.searchImages(query, effectiveCount);
        }

        if (images.isEmpty()) {
            log.debug("Falling back to curated mock images for {}", destination.getName());
            images = mockImageProvider.searchImages(query, effectiveCount);
        }

        // Cache metadata in database if empty
        if (destinationImageRepository.findByDestinationId(destinationId).isEmpty() && !images.isEmpty()) {
            for (DestinationImageResponse img : images) {
                DestinationImage entity = new DestinationImage();
                entity.setDestinationId(destinationId);
                entity.setProvider(img.source());
                entity.setImageUrl(img.imageUrl());
                entity.setThumbnailUrl(img.thumbnailUrl());
                entity.setPhotographer(img.photographer());
                entity.setPhotographerUrl(img.photographerUrl());
                entity.setAttributionHtml(img.attributionHtml());
                destinationImageRepository.save(entity);
            }
        }

        return images;
    }
}

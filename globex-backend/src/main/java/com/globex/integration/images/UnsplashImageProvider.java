package com.globex.integration.images;

import com.globex.integration.images.dto.DestinationImageResponse;
import com.globex.integration.images.dto.external.UnsplashSearchResponse;
import com.globex.integration.images.mapper.ImageMapper;
import com.globex.shared.config.GlobexProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component("unsplashImageProvider")
public class UnsplashImageProvider implements ImageProvider {

    private final ImageClient imageClient;
    private final ImageMapper imageMapper;
    private final GlobexProperties properties;

    public UnsplashImageProvider(ImageClient imageClient, ImageMapper imageMapper, GlobexProperties properties) {
        this.imageClient = imageClient;
        this.imageMapper = imageMapper;
        this.properties = properties;
    }

    @Override
    public String getProviderName() {
        return "unsplash";
    }

    @Override
    public boolean isAvailable() {
        String key = properties.getIntegration().getImages().getAccessKey();
        return key != null && !key.isBlank();
    }

    @Override
    public List<DestinationImageResponse> searchImages(String query, int count) {
        Optional<UnsplashSearchResponse> raw = imageClient.searchPhotos(query, count);
        return raw.map(imageMapper::toDestinationImageResponses).orElse(List.of());
    }
}

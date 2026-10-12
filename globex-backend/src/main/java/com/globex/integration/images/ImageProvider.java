package com.globex.integration.images;

import com.globex.integration.images.dto.DestinationImageResponse;

import java.util.List;

public interface ImageProvider {
    String getProviderName();
    boolean isAvailable();
    List<DestinationImageResponse> searchImages(String query, int count);
}

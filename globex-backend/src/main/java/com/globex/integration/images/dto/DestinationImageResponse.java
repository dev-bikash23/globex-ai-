package com.globex.integration.images.dto;

public record DestinationImageResponse(
        String id,
        String imageUrl,
        String thumbnailUrl,
        String photographer,
        String photographerUrl,
        String attributionHtml,
        String source
) {}

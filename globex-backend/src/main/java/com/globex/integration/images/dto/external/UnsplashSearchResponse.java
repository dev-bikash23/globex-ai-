package com.globex.integration.images.dto.external;

import java.util.List;
import java.util.Map;

public record UnsplashSearchResponse(
        Integer total,
        Integer totalPages,
        List<Result> results
) {
    public record Result(
            String id,
            String description,
            String altDescription,
            Map<String, String> urls,
            User user,
            Map<String, String> links
    ) {}

    public record User(
            String name,
            String username,
            Map<String, String> links
    ) {}
}

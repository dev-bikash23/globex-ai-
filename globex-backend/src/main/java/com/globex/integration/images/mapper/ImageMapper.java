package com.globex.integration.images.mapper;

import com.globex.integration.images.dto.DestinationImageResponse;
import com.globex.integration.images.dto.external.UnsplashSearchResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ImageMapper {

    private static final String UTM_PARAMS = "?utm_source=globex_ai&utm_medium=referral";

    public List<DestinationImageResponse> toDestinationImageResponses(UnsplashSearchResponse raw) {
        if (raw == null || raw.results() == null) {
            return List.of();
        }

        List<DestinationImageResponse> list = new ArrayList<>();

        for (UnsplashSearchResponse.Result r : raw.results()) {
            if (r.urls() == null) continue;

            String imageUrl = r.urls().get("regular");
            if (imageUrl == null) imageUrl = r.urls().get("small");
            String thumbUrl = r.urls().get("thumb");
            if (thumbUrl == null) thumbUrl = r.urls().get("small");

            String photographer = (r.user() != null && r.user().name() != null) ? r.user().name() : "Unsplash Creator";
            String photographerUrl = (r.user() != null && r.user().links() != null && r.user().links().get("html") != null)
                    ? r.user().links().get("html") + UTM_PARAMS
                    : "https://unsplash.com" + UTM_PARAMS;

            String attributionHtml = "Photo by <a href=\"" + photographerUrl + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
                    + photographer + "</a> on <a href=\"https://unsplash.com" + UTM_PARAMS + "\" target=\"_blank\" rel=\"noopener noreferrer\">Unsplash</a>";

            list.add(new DestinationImageResponse(
                    r.id(),
                    imageUrl,
                    thumbUrl,
                    photographer,
                    photographerUrl,
                    attributionHtml,
                    "Unsplash"
            ));
        }

        return list;
    }
}

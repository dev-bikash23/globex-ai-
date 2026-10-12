package com.globex.integration.images;

import com.globex.integration.images.dto.DestinationImageResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * DEV ONLY: Mock image provider used when no external image key is available.
 * Returns curated high-quality travel images from Wikimedia Commons / Unsplash CDN.
 */
@Component("mockImageProvider")
public class MockImageProvider implements ImageProvider {

    @Override
    public String getProviderName() {
        return "mock-dev-only";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public List<DestinationImageResponse> searchImages(String query, int count) {
        List<DestinationImageResponse> list = new ArrayList<>();
        int limit = Math.min(count > 0 ? count : 4, 6);

        String[] demoUrls = {
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80"
        };

        for (int i = 0; i < limit; i++) {
            String url = demoUrls[i % demoUrls.length];
            list.add(new DestinationImageResponse(
                    "mock-" + (i + 1),
                    url,
                    url,
                    "GlobeX Curated Travel",
                    "https://unsplash.com?utm_source=globex_ai&utm_medium=referral",
                    "Photo by GlobeX Curated (Demo/Dev Mode)",
                    "Demo Collection"
            ));
        }

        return list;
    }
}

package com.globex.travel.activity.provider;

import com.globex.travel.domain.ActivityOffer;
import com.globex.travel.activity.dto.ActivitySearchRequest;

import java.util.List;

/**
 * Provider-agnostic interface for activity/tour/experience search.
 *
 * Architecture:
 *   ActivityService
 *        ↓
 *   ActivityProvider
 *        ↓
 *   MockActivityProvider (demo) / ViatorProvider / GetYourGuideProvider / etc.
 */
public interface ActivityProvider {

    /**
     * Search for activities near a destination.
     *
     * @param request search parameters including coordinates
     * @return normalized list of activity offers (may be empty, never null)
     */
    List<ActivityOffer> searchActivities(ActivitySearchRequest request);

    /** Human-readable provider name. */
    String providerName();

    /** True if this returns demo/sample data rather than live inventory. */
    boolean isTestMode();
}

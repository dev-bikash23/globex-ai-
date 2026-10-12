package com.globex.travel.activity.dto;

import com.globex.travel.domain.ActivityOffer;

import java.time.Instant;
import java.util.List;

/**
 * Activity search response returned to frontend API consumers.
 */
public record ActivitySearchResponse(
    String searchId,
    String provider,
    boolean isTestData,
    String dataNotice,
    int totalResults,
    String sortBy,
    List<ActivityOffer> activities,
    Instant searchedAt
) {}

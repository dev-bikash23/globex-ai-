package com.globex.travel.domain;

import java.time.Instant;
import java.util.List;

/**
 * Normalized activity/tour offer — provider-agnostic domain model.
 *
 * Activities are experiences like guided tours, museum entries, food walks.
 * This is NOT a confirmed booking. Use bookingLink to redirect to provider.
 *
 * When isTestData=true, this is DEMO DATA clearly labeled in UI.
 */
public record ActivityOffer(
    String activityId,               // Provider activity ID
    String provider,                 // "viator", "getyourguide", "mock", etc.
    String name,
    String shortDescription,
    String description,
    String category,                 // "SIGHTSEEING", "FOOD", "ADVENTURE", etc.
    Double latitude,
    Double longitude,
    String durationDisplay,          // "2 hours", "Half day", "3h 30m"
    int durationMinutes,             // 0 if unknown
    OfferPrice pricePerPerson,
    Double rating,                   // 0.0–5.0 scale, null if unavailable
    int reviewCount,
    String bookingLink,              // Redirect to provider for booking (affiliate)
    List<String> pictures,           // Image URLs
    String cancellationPolicy,       // Human-readable cancellation info
    boolean freeCancellation,
    List<String> inclusions,         // What's included
    List<String> exclusions,         // What's NOT included
    Instant lastUpdated,
    boolean isTestData               // True = demo/mock data, clearly shown in UI
) {}

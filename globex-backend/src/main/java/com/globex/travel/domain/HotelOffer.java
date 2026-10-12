package com.globex.travel.domain;

import java.time.Instant;
import java.util.List;

/**
 * Normalized hotel offer — provider-agnostic domain model.
 *
 * NOTE: This is a search result, NOT a confirmed reservation.
 * Hotel availability and prices change frequently.
 * Always revalidate before booking.
 *
 * When isTestData=true, this is DEMO DATA clearly labeled in UI.
 */
public record HotelOffer(
    String hotelId,                  // Provider hotel ID
    String provider,                 // "duffel_stays", "mock", etc.
    String name,                     // Hotel name
    String description,              // Short description if available
    int stars,                       // Star rating (0 if unknown)
    Double guestRating,              // Guest review rating (0.0–10.0 scale) if available
    String location,                 // City, Country
    String address,                  // Street address if available
    Double latitude,
    Double longitude,
    List<String> amenities,          // ["WIFI", "POOL", "GYM", ...]
    String imageUrl,                 // Primary image URL
    List<String> additionalImages,   // Extra images if available
    String roomType,                 // "Deluxe Room", "Standard Twin", etc.
    OfferPrice pricePerNight,        // Per night, per room
    OfferPrice totalPrice,           // Total for entire stay
    String cancellationPolicy,       // Human-readable cancellation info
    boolean freeCancellation,        // True if free cancellation available
    boolean breakfastIncluded,
    String checkIn,                  // ISO 8601 date
    String checkOut,                 // ISO 8601 date
    int nights,
    Instant lastUpdated,
    boolean isTestData               // True = demo/mock data, clearly shown in UI
) {}

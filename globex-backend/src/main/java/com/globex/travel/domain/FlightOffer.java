package com.globex.travel.domain;

import java.time.Instant;
import java.util.List;

/**
 * Normalized flight offer — provider-agnostic domain model.
 * Never expose provider-specific DTOs (Duffel, Amadeus, etc.) to API consumers.
 *
 * IMPORTANT: A FlightOffer is NOT a booking. It is a search result only.
 * Prices can expire. Do not treat this as a confirmed fare.
 */
public record FlightOffer(
    String offerId,                  // Provider-specific offer ID (for revalidation)
    String provider,                 // "duffel", "amadeus", etc.
    String airline,                  // Primary operating airline name
    String airlineCode,              // 2-letter IATA code
    String airlineLogoUrl,           // Logo URL if available
    OfferPrice totalPrice,           // Total price for all passengers
    OfferPrice baseFare,             // Base fare (before taxes)
    OfferPrice taxAmount,            // Tax portion
    String cabinClass,               // ECONOMY, BUSINESS, FIRST, PREMIUM_ECONOMY
    String cabinClassDisplay,        // "Economy", "Business Class" etc.
    int stops,                       // Total stops across all slices
    int totalDurationMinutes,        // Total journey time (all slices)
    List<FlightSegment> outboundSegments,   // Departure journey
    List<FlightSegment> returnSegments,     // Return journey (null for one-way)
    String baggageAllowance,         // Baggage info if available
    boolean refundable,              // True if refund is permitted (before departure)
    boolean changeable,              // True if changes are permitted
    String conditions,               // Human-readable fare conditions summary
    Instant lastUpdated,             // When this offer was fetched from provider
    boolean isTestData               // True when using Duffel test/sandbox mode
) {

    /** Compute a "best" score for ranking (lower = better).
     * Score = normalized_price * 0.40 + normalized_duration * 0.35 + stops * 0.25
     * This is a weighted heuristic, NOT AI. Documents openly in Phase 5.
     */
    public double bestScore(double minPrice, double maxPrice, int minDur, int maxDur) {
        double priceNorm = (maxPrice > minPrice)
            ? (totalPrice.amount().doubleValue() - minPrice) / (maxPrice - minPrice) : 0;
        double durNorm = (maxDur > minDur)
            ? (double)(totalDurationMinutes - minDur) / (maxDur - minDur) : 0;
        return (priceNorm * 0.40) + (durNorm * 0.35) + (stops * 0.25 / 3.0);
    }
}

package com.globex.trip.ai;

/**
 * Phase 7 AI foundation — interface only, not implemented in Phase 6.
 *
 * This interface defines the contract for the AI Travel Planner
 * which will be built in Phase 7. It is placed here so that
 * Phase 6 services can reference it as a dependency and Phase 7
 * can inject a real implementation without changing service code.
 *
 * DO NOT add an implementation in Phase 6.
 */
public interface ItineraryAssistant {
    // Phase 7 — AI itinerary suggestions
    // CompletableFuture<List<ItineraryItemSuggestion>> suggestItinerary(Trip trip, String preferenceHints);
    // Phase 7 — AI budget optimization
    // CompletableFuture<BudgetOptimization> optimizeBudget(Trip trip, BigDecimal targetBudget);
    // Phase 7 — AI activity recommendations
    // CompletableFuture<List<ActivitySuggestion>> recommendActivities(String destinationName, String category, int count);
}

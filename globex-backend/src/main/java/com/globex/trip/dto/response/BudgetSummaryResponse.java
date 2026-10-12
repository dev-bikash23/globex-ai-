package com.globex.trip.dto.response;
import java.math.BigDecimal;
import java.util.Map;

public record BudgetSummaryResponse(
    String tripId, String currency, BigDecimal budgetLimit,
    BigDecimal plannedFlights, BigDecimal plannedHotels, BigDecimal plannedActivities,
    BigDecimal plannedItineraryItems, BigDecimal plannedTotal,
    BigDecimal actualTotal, BigDecimal remaining,
    Map<String,BigDecimal> actualByCategory,
    boolean isOverBudget, String currencyNote
) {}

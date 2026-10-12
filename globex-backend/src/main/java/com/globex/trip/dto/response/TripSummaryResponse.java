package com.globex.trip.dto.response;
import com.globex.trip.domain.TripStatus;
import java.math.BigDecimal;

public record TripSummaryResponse(
    String id, String title, String destinationName, String destinationSlug,
    String destinationImageUrl, String startDate, String endDate, TripStatus status,
    String currency, BigDecimal budgetLimit, int travelerCount,
    int flightCount, int hotelCount, int activityCount, int itineraryDayCount,
    BigDecimal plannedTotal, BigDecimal actualTotal
) {}

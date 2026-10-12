package com.globex.trip.dto.response;
import java.util.List;
public record ItineraryResponse(String tripId, int totalDays, List<ItineraryDayResponse> days) {}

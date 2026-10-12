package com.globex.trip.service;

import com.globex.trip.domain.*;
import com.globex.trip.dto.response.BudgetSummaryResponse;
import com.globex.trip.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TripBudgetService {

    private final TripExpenseRepository  expenseRepo;
    private final TripFlightRepository   flightRepo;
    private final TripHotelRepository    hotelRepo;
    private final TripActivityRepository actRepo;
    private final TripService            tripService;

    public TripBudgetService(TripExpenseRepository er, TripFlightRepository fr,
                               TripHotelRepository hr, TripActivityRepository ar,
                               TripService ts) {
        this.expenseRepo = er;
        this.flightRepo  = fr;
        this.hotelRepo   = hr;
        this.actRepo     = ar;
        this.tripService = ts;
    }

    public BudgetSummaryResponse getBudgetSummary(String tripId, String userId) {
        Trip trip = tripService.findAndVerifyOwner(tripId, userId);
        UUID uuid = trip.getId();

        BigDecimal pFlights = flightRepo.findByTripId(uuid).stream()
            .filter(f -> f.getStatus() == TripFlight.OfferStatus.SELECTED)
            .map(TripFlight::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pHotels = hotelRepo.findByTripId(uuid).stream()
            .filter(h -> h.getStatus() == TripHotel.OfferStatus.SELECTED)
            .map(TripHotel::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pActs = actRepo.findByTripId(uuid).stream()
            .filter(a -> a.getStatus() == TripActivity.ActivityStatus.PLANNED)
            .map(TripActivity::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal plannedTotal = pFlights.add(pHotels).add(pActs);
        BigDecimal actualTotal  = expenseRepo.sumAmountByTripId(uuid);
        BigDecimal remaining    = trip.getBudgetLimit() != null
            ? trip.getBudgetLimit().subtract(actualTotal) : null;
        boolean overBudget = remaining != null && remaining.compareTo(BigDecimal.ZERO) < 0;

        Map<String, BigDecimal> byCategory = new HashMap<>();
        List<Object[]> rows = expenseRepo.sumByCategory(uuid);
        for (Object[] row : rows) {
            byCategory.put(row[0].toString(), (BigDecimal) row[1]);
        }

        String note = "Offer prices shown are in their original currencies. " +
                      "Totals are indicative only — not guaranteed payment amounts.";

        return new BudgetSummaryResponse(
            tripId, trip.getCurrency(), trip.getBudgetLimit(),
            pFlights, pHotels, pActs, BigDecimal.ZERO,
            plannedTotal, actualTotal, remaining,
            byCategory, overBudget, note
        );
    }
}
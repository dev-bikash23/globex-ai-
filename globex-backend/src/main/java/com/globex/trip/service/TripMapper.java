package com.globex.trip.service;

import com.globex.destination.domain.Destination;
import com.globex.trip.domain.*;
import com.globex.trip.dto.response.*;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

public final class TripMapper {

    private TripMapper() {}

    public static TripResponse toResponse(Trip t, Destination dest, int travelerCount) {
        TripResponse.DestinationInfo destInfo = null;
        if (dest != null) {
            String cityName    = dest.getCity() != null ? dest.getCity().getName() : null;
            String countryName = dest.getCity() != null && dest.getCity().getCountry() != null ? dest.getCity().getCountry().getName() : null;
            destInfo = new TripResponse.DestinationInfo(dest.getId(), dest.getName(), dest.getSlug(), dest.getImageUrl(), cityName, countryName);
        }
        return new TripResponse(
            t.getId() != null ? t.getId().toString() : null,
            t.getUserId(), t.getDestinationId(), destInfo,
            t.getTitle(), t.getDescription(),
            t.getStartDate() != null ? t.getStartDate().toString() : null,
            t.getEndDate()   != null ? t.getEndDate().toString()   : null,
            t.getStatus(), t.getCurrency(), t.getBudgetLimit(),
            t.getCoverImageUrl(), t.getDurationDays(), travelerCount,
            t.getCreatedAt(), t.getUpdatedAt());
    }

    public static TripSummaryResponse toSummary(Trip t, String destName, String destSlug, String destImage,
                                                  int travelers, int flights, int hotels, int activities,
                                                  int days, BigDecimal planned, BigDecimal actual) {
        return new TripSummaryResponse(
            t.getId() != null ? t.getId().toString() : null,
            t.getTitle(), destName, destSlug, destImage,
            t.getStartDate() != null ? t.getStartDate().toString() : null,
            t.getEndDate()   != null ? t.getEndDate().toString()   : null,
            t.getStatus(), t.getCurrency(), t.getBudgetLimit(),
            travelers, flights, hotels, activities, days, planned, actual);
    }

    public static TravelerResponse toTraveler(TripTraveler tv) {
        return new TravelerResponse(
            tv.getId() != null ? tv.getId().toString() : null,
            tv.getTripId() != null ? tv.getTripId().toString() : null,
            tv.getFirstName(), tv.getLastName(),
            tv.getTravelerType().name(), tv.getCreatedAt());
    }

    public static TripFlightResponse toFlight(TripFlight f) {
        String note = switch (f.getStatus()) {
            case SELECTED -> "Selected -- not a confirmed booking";
            case EXPIRED  -> "This offer has expired";
            case REMOVED  -> "Removed from trip";
        };
        return new TripFlightResponse(
            f.getId() != null ? f.getId().toString() : null,
            f.getTripId() != null ? f.getTripId().toString() : null,
            f.getProvider(), f.getProviderOfferId(),
            f.getOrigin(), f.getDestination(), f.getDepartureTime(), f.getArrivalTime(),
            f.getAirline(), f.getCabinClass(), f.getPriceAmount(), f.getCurrency(),
            f.getStatus().name(), f.getLastValidatedAt(), f.getCreatedAt(), note);
    }

    public static TripHotelResponse toHotel(TripHotel h) {
        String note = switch (h.getStatus()) {
            case SELECTED -> "Selected -- not a confirmed reservation";
            case EXPIRED  -> "This offer has expired";
            case REMOVED  -> "Removed from trip";
        };
        return new TripHotelResponse(
            h.getId() != null ? h.getId().toString() : null,
            h.getTripId() != null ? h.getTripId().toString() : null,
            h.getProvider(), h.getProviderOfferId(), h.getHotelName(),
            h.getCheckIn()  != null ? h.getCheckIn().toString()  : null,
            h.getCheckOut() != null ? h.getCheckOut().toString() : null,
            h.getRoomType(), h.getPriceAmount(), h.getCurrency(),
            h.getStatus().name(), h.getLastValidatedAt(), h.getCreatedAt(), note);
    }

    public static TripActivityResponse toActivity(TripActivity a) {
        return new TripActivityResponse(
            a.getId() != null ? a.getId().toString() : null,
            a.getTripId() != null ? a.getTripId().toString() : null,
            a.getProvider(), a.getProviderOfferId(), a.getActivityName(),
            a.getActivityDate() != null ? a.getActivityDate().toString() : null,
            a.getStartTime()    != null ? a.getStartTime().toString()    : null,
            a.getDurationMinutes(), a.getPriceAmount(), a.getCurrency(),
            a.getCategory(), a.getStatus().name(), a.getCreatedAt());
    }

    public static ItineraryItemResponse toItem(ItineraryItem i) {
        return new ItineraryItemResponse(
            i.getId() != null ? i.getId().toString() : null,
            i.getDayId() != null ? i.getDayId().toString() : null,
            i.getTitle(), i.getDescription(), i.getItemType().name(),
            i.getStartTime() != null ? i.getStartTime().toString() : null,
            i.getEndTime()   != null ? i.getEndTime().toString()   : null,
            i.getLocationName(), i.getLatitude(), i.getLongitude(),
            i.getEstimatedCost(), i.getCurrency(), i.getSortOrder(), i.getNotes(),
            i.getCreatedAt(), i.getUpdatedAt());
    }

    public static ItineraryDayResponse toDay(ItineraryDay d, List<ItineraryItemResponse> items) {
        return new ItineraryDayResponse(
            d.getId() != null ? d.getId().toString() : null,
            d.getTripId() != null ? d.getTripId().toString() : null,
            d.getDayNumber(),
            d.getDate() != null ? d.getDate().toString() : null,
            d.getTitle(), d.getNotes(),
            items != null ? items : Collections.emptyList(),
            d.getCreatedAt(), d.getUpdatedAt());
    }

    public static ExpenseResponse toExpense(TripExpense e) {
        return new ExpenseResponse(
            e.getId() != null ? e.getId().toString() : null,
            e.getTripId() != null ? e.getTripId().toString() : null,
            e.getCategory().name(), e.getDescription(), e.getAmount(), e.getCurrency(),
            e.getExpenseDate() != null ? e.getExpenseDate().toString() : null,
            e.getNotes(), e.getCreatedAt(), e.getUpdatedAt());
    }
}

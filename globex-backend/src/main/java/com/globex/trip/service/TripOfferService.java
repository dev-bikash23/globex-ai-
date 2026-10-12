package com.globex.trip.service;

import com.globex.shared.exception.BadRequestException;
import com.globex.shared.exception.ResourceNotFoundException;
import com.globex.trip.domain.*;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.*;
import com.globex.trip.exception.TripOwnershipException;
import com.globex.trip.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class TripOfferService {

    private final TripFlightRepository flightRepo;
    private final TripHotelRepository  hotelRepo;
    private final TripActivityRepository actRepo;
    private final TripService tripService;

    public TripOfferService(TripFlightRepository fr, TripHotelRepository hr,
                             TripActivityRepository ar, TripService ts) {
        this.flightRepo  = fr;
        this.hotelRepo   = hr;
        this.actRepo     = ar;
        this.tripService = ts;
    }

    // ── Flights ───────────────────────────────────────────────────────────────
    public List<TripFlightResponse> getFlights(String tripId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        return flightRepo.findByTripId(trip.getId()).stream().map(TripMapper::toFlight).toList();
    }

    @Transactional
    public TripFlightResponse attachFlight(String tripId, AttachFlightRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        if (flightRepo.existsByTripIdAndProviderOfferId(trip.getId(), req.providerOfferId()))
            throw new BadRequestException("DUPLICATE_OFFER", "This flight offer is already attached to the trip");
        TripFlight f = new TripFlight();
        f.setTripId(trip.getId());
        f.setProvider(req.provider());
        f.setProviderOfferId(req.providerOfferId());
        f.setOrigin(req.origin());
        f.setDestination(req.destination());
        f.setAirline(req.airline());
        f.setCabinClass(req.cabinClass());
        f.setPriceAmount(req.priceAmount());
        f.setCurrency(req.currency());
        if (req.departureTime() != null && !req.departureTime().isBlank())
            f.setDepartureTime(Instant.parse(req.departureTime()));
        if (req.arrivalTime() != null && !req.arrivalTime().isBlank())
            f.setArrivalTime(Instant.parse(req.arrivalTime()));
        f.setLastValidatedAt(Instant.now());
        return TripMapper.toFlight(flightRepo.save(f));
    }

    @Transactional
    public void removeFlight(String tripId, String flightId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripFlight f = flightRepo.findById(UUID.fromString(flightId))
            .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        if (!f.getTripId().equals(trip.getId()))
            throw new TripOwnershipException("Flight not in trip");
        flightRepo.delete(f);
    }

    // ── Hotels ────────────────────────────────────────────────────────────────
    public List<TripHotelResponse> getHotels(String tripId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        return hotelRepo.findByTripId(trip.getId()).stream().map(TripMapper::toHotel).toList();
    }

    @Transactional
    public TripHotelResponse attachHotel(String tripId, AttachHotelRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        if (hotelRepo.existsByTripIdAndProviderOfferId(trip.getId(), req.providerOfferId()))
            throw new BadRequestException("DUPLICATE_OFFER", "This hotel offer is already attached to the trip");
        TripHotel h = new TripHotel();
        h.setTripId(trip.getId());
        h.setProvider(req.provider());
        h.setProviderOfferId(req.providerOfferId());
        h.setHotelName(req.hotelName());
        h.setCheckIn(LocalDate.parse(req.checkIn()));
        h.setCheckOut(LocalDate.parse(req.checkOut()));
        h.setRoomType(req.roomType());
        h.setPriceAmount(req.priceAmount());
        h.setCurrency(req.currency());
        h.setLastValidatedAt(Instant.now());
        return TripMapper.toHotel(hotelRepo.save(h));
    }

    @Transactional
    public void removeHotel(String tripId, String hotelId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripHotel h = hotelRepo.findById(UUID.fromString(hotelId))
            .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        if (!h.getTripId().equals(trip.getId()))
            throw new TripOwnershipException("Hotel not in trip");
        hotelRepo.delete(h);
    }

    // ── Activities ────────────────────────────────────────────────────────────
    public List<TripActivityResponse> getActivities(String tripId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        return actRepo.findByTripId(trip.getId()).stream().map(TripMapper::toActivity).toList();
    }

    @Transactional
    public TripActivityResponse attachActivity(String tripId, AttachActivityRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripActivity a = new TripActivity();
        a.setTripId(trip.getId());
        a.setProvider(req.provider());
        a.setProviderOfferId(req.providerOfferId());
        a.setActivityName(req.activityName());
        if (req.activityDate() != null && !req.activityDate().isBlank())
            a.setActivityDate(LocalDate.parse(req.activityDate()));
        if (req.startTime() != null && !req.startTime().isBlank())
            a.setStartTime(LocalTime.parse(req.startTime()));
        a.setDurationMinutes(req.durationMinutes());
        a.setPriceAmount(req.priceAmount() != null ? req.priceAmount() : BigDecimal.ZERO);
        a.setCurrency(req.currency() != null ? req.currency() : "USD");
        a.setCategory(req.category());
        return TripMapper.toActivity(actRepo.save(a));
    }

    @Transactional
    public void removeActivity(String tripId, String actId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripActivity a = actRepo.findById(UUID.fromString(actId))
            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        if (!a.getTripId().equals(trip.getId()))
            throw new TripOwnershipException("Activity not in trip");
        actRepo.delete(a);
    }
}
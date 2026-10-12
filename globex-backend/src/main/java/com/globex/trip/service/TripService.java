package com.globex.trip.service;

import com.globex.auth.repository.UserRepository;
import com.globex.destination.domain.Destination;
import com.globex.destination.repository.DestinationRepository;
import com.globex.shared.exception.BadRequestException;
import com.globex.shared.exception.ResourceNotFoundException;
import com.globex.trip.domain.*;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.*;
import com.globex.trip.exception.*;
import com.globex.trip.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class TripService {

    private final TripRepository             tripRepo;
    private final TripTravelerRepository     travelerRepo;
    private final TripFlightRepository       flightRepo;
    private final TripHotelRepository        hotelRepo;
    private final TripActivityRepository     activityRepo;
    private final ItineraryDayRepository     dayRepo;
    private final TripExpenseRepository      expenseRepo;
    private final DestinationRepository      destinationRepo;
    private final UserRepository             userRepo;

    public TripService(TripRepository tripRepo,
                       TripTravelerRepository travelerRepo,
                       TripFlightRepository flightRepo,
                       TripHotelRepository hotelRepo,
                       TripActivityRepository activityRepo,
                       ItineraryDayRepository dayRepo,
                       TripExpenseRepository expenseRepo,
                       DestinationRepository destinationRepo,
                       UserRepository userRepo) {
        this.tripRepo        = tripRepo;
        this.travelerRepo    = travelerRepo;
        this.flightRepo      = flightRepo;
        this.hotelRepo       = hotelRepo;
        this.activityRepo    = activityRepo;
        this.dayRepo         = dayRepo;
        this.expenseRepo     = expenseRepo;
        this.destinationRepo = destinationRepo;
        this.userRepo        = userRepo;
    }

    // ── Create ────────────────────────────────────────────────────────────────
    @Transactional
    public TripResponse createTrip(CreateTripRequest req, String principalName) {
        String userId = resolveUserId(principalName);
        LocalDate start = LocalDate.parse(req.startDate());
        LocalDate end   = LocalDate.parse(req.endDate());
        if (end.isBefore(start)) {
            throw new BadRequestException("INVALID_DATES", "End date cannot be before start date");
        }
        Destination dest = null;
        if (req.destinationId() != null && !req.destinationId().isBlank()) {
            dest = destinationRepo.findById(req.destinationId()).orElse(null);
        }
        Trip trip = new Trip();
        trip.setUserId(userId);
        trip.setDestinationId(req.destinationId());
        trip.setTitle(req.title());
        trip.setDescription(req.description());
        trip.setStartDate(start);
        trip.setEndDate(end);
        trip.setCurrency(req.currency() != null ? req.currency().toUpperCase() : "USD");
        trip.setBudgetLimit(req.budgetLimit());
        if (dest != null) trip.setCoverImageUrl(dest.getImageUrl());
        tripRepo.save(trip);

        // Auto-generate itinerary day stubs
        for (int i = 0; i < trip.getDurationDays(); i++) {
            ItineraryDay day = new ItineraryDay();
            day.setTripId(trip.getId());           // UUID
            day.setDayNumber(i + 1);
            day.setDate(start.plusDays(i));
            day.setTitle("Day " + (i + 1));
            dayRepo.save(day);
        }
        return TripMapper.toResponse(trip, dest, 0);
    }

    // ── List ──────────────────────────────────────────────────────────────────
    public TripListResponse getUserTrips(String principalName) {
        String userId  = resolveUserId(principalName);
        LocalDate today = LocalDate.now();
        List<Trip> all  = tripRepo.findByUserIdOrderByStartDateDesc(userId);
        List<TripSummaryResponse> upcoming = new ArrayList<>();
        List<TripSummaryResponse> planning = new ArrayList<>();
        List<TripSummaryResponse> past     = new ArrayList<>();
        for (Trip t : all) {
            if (t.getStatus() == TripStatus.ARCHIVED) continue;
            TripSummaryResponse s = buildSummary(t);
            if (t.getStatus() == TripStatus.PLANNING)     planning.add(s);
            else if (!t.getEndDate().isBefore(today))      upcoming.add(s);
            else                                           past.add(s);
        }
        return new TripListResponse(upcoming, planning, past, all.size());
    }

    // ── Get single ────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public TripResponse getTripById(String tripId, String principalName) {
        Trip trip = findAndVerifyOwner(tripId, principalName);
        Destination dest = trip.getDestinationId() != null
            ? destinationRepo.findById(trip.getDestinationId()).orElse(null) : null;
        int tc = travelerRepo.findByTripId(trip.getId()).size();
        return TripMapper.toResponse(trip, dest, tc);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    @Transactional
    public TripResponse updateTrip(String tripId, UpdateTripRequest req, String principalName) {
        Trip trip   = findAndVerifyOwner(tripId, principalName);
        if (req.title()       != null) trip.setTitle(req.title());
        if (req.description() != null) trip.setDescription(req.description());
        if (req.coverImageUrl() != null) trip.setCoverImageUrl(req.coverImageUrl());
        if (req.startDate() != null) trip.setStartDate(LocalDate.parse(req.startDate()));
        if (req.endDate()   != null) trip.setEndDate(LocalDate.parse(req.endDate()));
        if (req.currency()  != null) trip.setCurrency(req.currency().toUpperCase());
        if (req.budgetLimit() != null) trip.setBudgetLimit(req.budgetLimit());
        Destination dest = trip.getDestinationId() != null
            ? destinationRepo.findById(trip.getDestinationId()).orElse(null) : null;
        int tc = travelerRepo.findByTripId(trip.getId()).size();
        return TripMapper.toResponse(tripRepo.save(trip), dest, tc);
    }

    // ── Status ────────────────────────────────────────────────────────────────
    @Transactional
    public TripResponse updateStatus(String tripId, String newStatusStr, String principalName) {
        Trip trip = findAndVerifyOwner(tripId, principalName);
        TripStatus newStatus;
        try { newStatus = TripStatus.valueOf(newStatusStr.toUpperCase()); }
        catch (IllegalArgumentException e) {
            throw new BadRequestException("INVALID_STATUS", "Unknown status: " + newStatusStr);
        }
        if (!trip.canTransitionTo(newStatus)) {
            throw new InvalidTripStatusTransitionException(trip.getStatus().name(), newStatus.name());
        }
        trip.setStatus(newStatus);
        return TripMapper.toResponse(tripRepo.save(trip), null, 0);
    }

    // ── Archive / Delete ──────────────────────────────────────────────────────
    @Transactional
    public void archiveTrip(String tripId, String principalName) {
        Trip trip = findAndVerifyOwner(tripId, principalName);
        trip.setStatus(TripStatus.ARCHIVED);
        tripRepo.save(trip);
    }

    @Transactional
    public void deleteTrip(String tripId, String principalName) {
        Trip trip = findAndVerifyOwner(tripId, principalName);
        tripRepo.delete(trip);
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    public TripSummaryResponse getTripSummary(String tripId, String principalName) {
        Trip trip = findAndVerifyOwner(tripId, principalName);
        return buildSummary(trip);
    }

    // ── Budget limit ──────────────────────────────────────────────────────────
    @Transactional
    public TripResponse setBudgetLimit(String tripId, BigDecimal limit, String principalName) {
        Trip trip = findAndVerifyOwner(tripId, principalName);
        trip.setBudgetLimit(limit);
        tripRepo.save(trip);
        return TripMapper.toResponse(trip, null, 0);
    }

    // ── Ownership guard ───────────────────────────────────────────────────────
    /**
     * Resolves a principal name (email) to the matching trip and verifies ownership.
     * Accepts either email (from JWT principal) or UUID string (for internal use).
     */
    public Trip findAndVerifyOwner(String tripId, String principalName) {
        String userId = resolveUserId(principalName);
        UUID uuid = UUID.fromString(tripId);
        Trip trip = tripRepo.findById(uuid)
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));
        if (!trip.getUserId().equals(userId)) {
            throw new TripOwnershipException("Access denied to trip: " + tripId);
        }
        return trip;
    }

    // ── Internal helpers ──────────────────────────────────────────────────────
    /**
     * Translates principal username (email) into user UUID.
     * If the input looks like a UUID it is returned as-is (internal calls).
     */
    private String resolveUserId(String principalName) {
        if (principalName == null) throw new ResourceNotFoundException("No authenticated user");
        // If it already looks like a UUID, use it directly
        if (principalName.length() == 36 && principalName.contains("-")) {
            return principalName;
        }
        // Otherwise treat as email — look up the user
        return userRepo.findByEmail(principalName)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principalName))
            .getId();
    }

    private TripSummaryResponse buildSummary(Trip t) {
        String destName = null, destSlug = null, destImg = null;
        if (t.getDestinationId() != null) {
            Optional<Destination> d = destinationRepo.findById(t.getDestinationId());
            if (d.isPresent()) {
                destName = d.get().getName();
                destSlug = d.get().getSlug();
                destImg  = d.get().getImageUrl();
            }
        }
        UUID id = t.getId();
        int tc = travelerRepo.findByTripId(id).size();
        int fc = flightRepo.findByTripId(id).size();
        int hc = hotelRepo.findByTripId(id).size();
        int ac = activityRepo.findByTripId(id).size();
        int dc = dayRepo.findByTripIdOrderByDayNumber(id).size();
        BigDecimal planned = calculatePlanned(id);
        BigDecimal actual  = expenseRepo.sumAmountByTripId(id);
        return TripMapper.toSummary(t, destName, destSlug, destImg, tc, fc, hc, ac, dc, planned, actual);
    }

    BigDecimal calculatePlanned(UUID tripId) {
        BigDecimal flights = flightRepo.findByTripId(tripId).stream()
            .filter(f -> f.getStatus() == TripFlight.OfferStatus.SELECTED)
            .map(TripFlight::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal hotels = hotelRepo.findByTripId(tripId).stream()
            .filter(h -> h.getStatus() == TripHotel.OfferStatus.SELECTED)
            .map(TripHotel::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal acts = activityRepo.findByTripId(tripId).stream()
            .filter(a -> a.getStatus() == TripActivity.ActivityStatus.PLANNED)
            .map(TripActivity::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return flights.add(hotels).add(acts);
    }
}
package com.globex.trip.service;

import com.globex.shared.exception.ResourceNotFoundException;
import com.globex.trip.domain.TripTraveler;
import com.globex.trip.dto.request.AddTravelerRequest;
import com.globex.trip.dto.response.TravelerResponse;
import com.globex.trip.exception.TripOwnershipException;
import com.globex.trip.repository.TripTravelerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TripTravelerService {

    private final TripTravelerRepository repo;
    private final TripService tripService;

    public TripTravelerService(TripTravelerRepository repo, TripService tripService) {
        this.repo = repo;
        this.tripService = tripService;
    }

    public List<TravelerResponse> getTravelers(String tripId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        return repo.findByTripId(trip.getId()).stream().map(TripMapper::toTraveler).toList();
    }

    @Transactional
    public TravelerResponse addTraveler(String tripId, AddTravelerRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripTraveler tv = new TripTraveler();
        tv.setTripId(trip.getId());
        tv.setFirstName(req.firstName());
        tv.setLastName(req.lastName());
        try { tv.setTravelerType(TripTraveler.TravelerType.valueOf(req.travelerType().toUpperCase())); }
        catch (IllegalArgumentException e) { tv.setTravelerType(TripTraveler.TravelerType.ADULT); }
        return TripMapper.toTraveler(repo.save(tv));
    }

    @Transactional
    public void removeTraveler(String tripId, String travelerId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripTraveler tv = repo.findById(UUID.fromString(travelerId))
            .orElseThrow(() -> new ResourceNotFoundException("Traveler not found"));
        if (!tv.getTripId().equals(trip.getId()))
            throw new TripOwnershipException("Traveler does not belong to this trip");
        repo.delete(tv);
    }
}
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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class ItineraryService {

    private final ItineraryDayRepository  dayRepo;
    private final ItineraryItemRepository itemRepo;
    private final TripService             tripService;

    public ItineraryService(ItineraryDayRepository dayRepo,
                             ItineraryItemRepository itemRepo,
                             TripService tripService) {
        this.dayRepo     = dayRepo;
        this.itemRepo    = itemRepo;
        this.tripService = tripService;
    }

    // ── Full itinerary ────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public ItineraryResponse getItinerary(String tripId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        List<ItineraryDay> days = dayRepo.findByTripIdOrderByDayNumber(trip.getId());
        List<ItineraryDayResponse> dayResponses = days.stream().map(d -> {
            List<ItineraryItemResponse> items =
                itemRepo.findByDayIdOrderBySortOrder(d.getId())
                        .stream().map(TripMapper::toItem).toList();
            return TripMapper.toDay(d, items);
        }).toList();
        return new ItineraryResponse(tripId, days.size(), dayResponses);
    }

    // ── Days ──────────────────────────────────────────────────────────────────
    @Transactional
    public ItineraryDayResponse createDay(String tripId, CreateItineraryDayRequest req, String userId) {
        Trip trip = tripService.findAndVerifyOwner(tripId, userId);
        if (dayRepo.existsByTripIdAndDayNumber(trip.getId(), req.dayNumber()))
            throw new BadRequestException("DUPLICATE_DAY", "Day " + req.dayNumber() + " already exists in this trip");
        LocalDate date = LocalDate.parse(req.date());
        if (date.isBefore(trip.getStartDate()) || date.isAfter(trip.getEndDate()))
            throw new BadRequestException("INVALID_DATES", "Day date must be within the trip date range");
        ItineraryDay day = new ItineraryDay();
        day.setTripId(trip.getId());
        day.setDayNumber(req.dayNumber());
        day.setDate(date);
        day.setTitle(req.title());
        day.setNotes(req.notes());
        dayRepo.save(day);
        return TripMapper.toDay(day, List.of());
    }

    @Transactional
    public ItineraryDayResponse updateDay(String tripId, String dayId,
                                           UpdateItineraryDayRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        ItineraryDay day = findDay(trip.getId(), dayId);
        if (req.title() != null) day.setTitle(req.title());
        if (req.notes()  != null) day.setNotes(req.notes());
        dayRepo.save(day);
        List<ItineraryItemResponse> items =
            itemRepo.findByDayIdOrderBySortOrder(UUID.fromString(dayId))
                    .stream().map(TripMapper::toItem).toList();
        return TripMapper.toDay(day, items);
    }

    @Transactional
    public void deleteDay(String tripId, String dayId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        ItineraryDay day = findDay(trip.getId(), dayId);
        dayRepo.delete(day);
    }

    // ── Items ─────────────────────────────────────────────────────────────────
    @Transactional
    public ItineraryItemResponse createItem(String tripId, String dayId,
                                             CreateItineraryItemRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        findDay(trip.getId(), dayId);
        ItineraryItem item = buildItem(req, UUID.fromString(dayId));
        return TripMapper.toItem(itemRepo.save(item));
    }

    @Transactional
    public ItineraryItemResponse updateItem(String tripId, String dayId, String itemId,
                                             UpdateItineraryItemRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        ItineraryDay day = findDay(trip.getId(), dayId);
        ItineraryItem item = itemRepo.findById(UUID.fromString(itemId))
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!item.getDayId().equals(day.getId()))
            throw new TripOwnershipException("Item not in this day");
        item.setTitle(req.title());
        item.setDescription(req.description());
        try { item.setItemType(ItineraryItem.ItemType.valueOf(req.itemType().toUpperCase())); }
        catch (Exception e) { item.setItemType(ItineraryItem.ItemType.OTHER); }
        if (req.startTime() != null && !req.startTime().isBlank())
            item.setStartTime(LocalTime.parse(req.startTime()));
        if (req.endTime() != null && !req.endTime().isBlank())
            item.setEndTime(LocalTime.parse(req.endTime()));
        item.setLocationName(req.locationName());
        item.setLatitude(req.latitude());
        item.setLongitude(req.longitude());
        if (req.estimatedCost() != null) item.setEstimatedCost(req.estimatedCost());
        if (req.currency() != null) item.setCurrency(req.currency().toUpperCase());
        item.setSortOrder(req.sortOrder());
        item.setNotes(req.notes());
        return TripMapper.toItem(itemRepo.save(item));
    }

    @Transactional
    public void deleteItem(String tripId, String dayId, String itemId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        ItineraryDay day = findDay(trip.getId(), dayId);
        ItineraryItem item = itemRepo.findById(UUID.fromString(itemId))
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!item.getDayId().equals(day.getId()))
            throw new TripOwnershipException("Item not in this day");
        itemRepo.delete(item);
    }

    @Transactional
    public void reorderItems(String tripId, String dayId, ReorderItemsRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        ItineraryDay day = findDay(trip.getId(), dayId);
        for (ReorderItemsRequest.ItemOrder order : req.items()) {
            itemRepo.findById(UUID.fromString(order.itemId())).ifPresent(item -> {
                if (item.getDayId().equals(day.getId())) {
                    item.setSortOrder(order.sortOrder());
                    itemRepo.save(item);
                }
            });
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private ItineraryDay findDay(UUID tripUuid, String dayId) {
        ItineraryDay day = dayRepo.findById(UUID.fromString(dayId))
            .orElseThrow(() -> new ResourceNotFoundException("Itinerary day not found"));
        if (!day.getTripId().equals(tripUuid))
            throw new TripOwnershipException("Day not in this trip");
        return day;
    }

    private ItineraryItem buildItem(CreateItineraryItemRequest req, UUID dayUuid) {
        ItineraryItem item = new ItineraryItem();
        item.setDayId(dayUuid);
        item.setTitle(req.title());
        item.setDescription(req.description());
        try { item.setItemType(ItineraryItem.ItemType.valueOf(req.itemType().toUpperCase())); }
        catch (Exception e) { item.setItemType(ItineraryItem.ItemType.OTHER); }
        if (req.startTime() != null && !req.startTime().isBlank())
            item.setStartTime(LocalTime.parse(req.startTime()));
        if (req.endTime() != null && !req.endTime().isBlank())
            item.setEndTime(LocalTime.parse(req.endTime()));
        item.setLocationName(req.locationName());
        item.setLatitude(req.latitude());
        item.setLongitude(req.longitude());
        if (req.estimatedCost() != null) item.setEstimatedCost(req.estimatedCost());
        if (req.currency() != null) item.setCurrency(req.currency().toUpperCase());
        else item.setCurrency("USD");
        item.setSortOrder(req.sortOrder());
        item.setNotes(req.notes());
        return item;
    }
}
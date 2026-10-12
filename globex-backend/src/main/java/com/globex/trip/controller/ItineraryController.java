package com.globex.trip.controller;
import com.globex.shared.response.ApiResponse;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.*;
import com.globex.trip.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/trips/{tripId}/itinerary")
public class ItineraryController {
    private final ItineraryService svc;
    public ItineraryController(ItineraryService svc) { this.svc = svc; }
    @GetMapping
    public ResponseEntity<ApiResponse<ItineraryResponse>> getItinerary(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getItinerary(tripId, p.getUsername())));
    }
    @PostMapping("/days")
    public ResponseEntity<ApiResponse<ItineraryDayResponse>> createDay(@PathVariable String tripId, @Valid @RequestBody CreateItineraryDayRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(svc.createDay(tripId, req, p.getUsername()), "Day created"));
    }
    @PutMapping("/days/{dayId}")
    public ResponseEntity<ApiResponse<ItineraryDayResponse>> updateDay(@PathVariable String tripId, @PathVariable String dayId, @Valid @RequestBody UpdateItineraryDayRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.updateDay(tripId, dayId, req, p.getUsername()), "Day updated"));
    }
    @DeleteMapping("/days/{dayId}")
    public ResponseEntity<ApiResponse<Void>> deleteDay(@PathVariable String tripId, @PathVariable String dayId, @AuthenticationPrincipal UserDetails p) {
        svc.deleteDay(tripId, dayId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Day deleted"));
    }
    @PostMapping("/days/{dayId}/items")
    public ResponseEntity<ApiResponse<ItineraryItemResponse>> createItem(@PathVariable String tripId, @PathVariable String dayId, @Valid @RequestBody CreateItineraryItemRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(svc.createItem(tripId, dayId, req, p.getUsername()), "Item created"));
    }
    @PutMapping("/days/{dayId}/items/{itemId}")
    public ResponseEntity<ApiResponse<ItineraryItemResponse>> updateItem(@PathVariable String tripId, @PathVariable String dayId, @PathVariable String itemId, @Valid @RequestBody UpdateItineraryItemRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.updateItem(tripId, dayId, itemId, req, p.getUsername()), "Item updated"));
    }
    @DeleteMapping("/days/{dayId}/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable String tripId, @PathVariable String dayId, @PathVariable String itemId, @AuthenticationPrincipal UserDetails p) {
        svc.deleteItem(tripId, dayId, itemId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Item deleted"));
    }
    @PutMapping("/days/{dayId}/items/reorder")
    public ResponseEntity<ApiResponse<Void>> reorder(@PathVariable String tripId, @PathVariable String dayId, @RequestBody ReorderItemsRequest req, @AuthenticationPrincipal UserDetails p) {
        svc.reorderItems(tripId, dayId, req, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Items reordered"));
    }
}

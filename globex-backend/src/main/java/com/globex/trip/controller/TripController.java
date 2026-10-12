package com.globex.trip.controller;
import com.globex.shared.response.ApiResponse;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.*;
import com.globex.trip.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/trips")
public class TripController {
    private final TripService svc;
    public TripController(TripService svc) { this.svc = svc; }

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponse>> create(
            @Valid @RequestBody CreateTripRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(svc.createTrip(req, principal.getUsername()), "Trip created"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TripListResponse>> list(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getUserTrips(p.getUsername())));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> get(@PathVariable String tripId,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getTripById(tripId, p.getUsername())));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> update(@PathVariable String tripId,
            @Valid @RequestBody UpdateTripRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.updateTrip(tripId, req, p.getUsername()), "Trip updated"));
    }

    @PatchMapping("/{tripId}/status")
    public ResponseEntity<ApiResponse<TripResponse>> updateStatus(@PathVariable String tripId,
            @Valid @RequestBody UpdateTripStatusRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.updateStatus(tripId, req.status(), p.getUsername()), "Status updated"));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String tripId,
            @RequestParam(defaultValue = "archive") String mode,
            @AuthenticationPrincipal UserDetails p) {
        if ("hard".equalsIgnoreCase(mode)) svc.deleteTrip(tripId, p.getUsername());
        else svc.archiveTrip(tripId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Trip deleted"));
    }

    @GetMapping("/{tripId}/summary")
    public ResponseEntity<ApiResponse<TripSummaryResponse>> summary(@PathVariable String tripId,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getTripSummary(tripId, p.getUsername())));
    }
}

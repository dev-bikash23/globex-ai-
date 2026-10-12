package com.globex.trip.controller;
import com.globex.shared.response.ApiResponse;
import com.globex.trip.dto.request.AddTravelerRequest;
import com.globex.trip.dto.response.TravelerResponse;
import com.globex.trip.service.TripTravelerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/trips/{tripId}/travelers")
public class TripTravelerController {
    private final TripTravelerService svc;
    public TripTravelerController(TripTravelerService svc) { this.svc = svc; }
    @GetMapping
    public ResponseEntity<ApiResponse<List<TravelerResponse>>> list(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getTravelers(tripId, p.getUsername())));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<TravelerResponse>> add(@PathVariable String tripId,
            @Valid @RequestBody AddTravelerRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(svc.addTraveler(tripId, req, p.getUsername()), "Traveler added"));
    }
    @DeleteMapping("/{travelerId}")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable String tripId, @PathVariable String travelerId, @AuthenticationPrincipal UserDetails p) {
        svc.removeTraveler(tripId, travelerId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Traveler removed"));
    }
}

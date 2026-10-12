package com.globex.trip.controller;
import com.globex.shared.response.ApiResponse;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.*;
import com.globex.trip.service.TripOfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/trips/{tripId}")
public class TripOfferController {
    private final TripOfferService svc;
    public TripOfferController(TripOfferService svc) { this.svc = svc; }
    @GetMapping("/flights")
    public ResponseEntity<ApiResponse<List<TripFlightResponse>>> getFlights(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getFlights(tripId, p.getUsername())));
    }
    @PostMapping("/flights")
    public ResponseEntity<ApiResponse<TripFlightResponse>> addFlight(@PathVariable String tripId, @Valid @RequestBody AttachFlightRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(svc.attachFlight(tripId, req, p.getUsername()), "Flight attached"));
    }
    @DeleteMapping("/flights/{flightId}")
    public ResponseEntity<ApiResponse<Void>> removeFlight(@PathVariable String tripId, @PathVariable String flightId, @AuthenticationPrincipal UserDetails p) {
        svc.removeFlight(tripId, flightId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Flight removed"));
    }
    @GetMapping("/hotels")
    public ResponseEntity<ApiResponse<List<TripHotelResponse>>> getHotels(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getHotels(tripId, p.getUsername())));
    }
    @PostMapping("/hotels")
    public ResponseEntity<ApiResponse<TripHotelResponse>> addHotel(@PathVariable String tripId, @Valid @RequestBody AttachHotelRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(svc.attachHotel(tripId, req, p.getUsername()), "Hotel attached"));
    }
    @DeleteMapping("/hotels/{hotelId}")
    public ResponseEntity<ApiResponse<Void>> removeHotel(@PathVariable String tripId, @PathVariable String hotelId, @AuthenticationPrincipal UserDetails p) {
        svc.removeHotel(tripId, hotelId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Hotel removed"));
    }
    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<TripActivityResponse>>> getActivities(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(svc.getActivities(tripId, p.getUsername())));
    }
    @PostMapping("/activities")
    public ResponseEntity<ApiResponse<TripActivityResponse>> addActivity(@PathVariable String tripId, @Valid @RequestBody AttachActivityRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(svc.attachActivity(tripId, req, p.getUsername()), "Activity attached"));
    }
    @DeleteMapping("/activities/{activityId}")
    public ResponseEntity<ApiResponse<Void>> removeActivity(@PathVariable String tripId, @PathVariable String activityId, @AuthenticationPrincipal UserDetails p) {
        svc.removeActivity(tripId, activityId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Activity removed"));
    }
}

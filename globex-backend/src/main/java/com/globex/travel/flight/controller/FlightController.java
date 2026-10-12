package com.globex.travel.flight.controller;

import com.globex.shared.response.ApiResponse;
import com.globex.travel.flight.dto.FlightSearchRequest;
import com.globex.travel.flight.dto.FlightSearchResponse;
import com.globex.travel.flight.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for flight search.
 *
 * Endpoints (all public — no JWT required for search):
 *   POST /api/v1/flights/search
 *
 * Optional JWT: if provided, search is saved to user history.
 * Without JWT: search works but is not saved.
 */
@RestController
@RequestMapping("/api/v1/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    /**
     * Search for available flights.
     *
     * @param request    validated search parameters
     * @param userDetails optional — if authenticated, history is saved
     * @return FlightSearchResponse with sorted offers and filter metadata
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<FlightSearchResponse>> searchFlights(
            @Valid @RequestBody FlightSearchRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails != null ? userDetails.getUsername() : null;
        FlightSearchResponse response = flightService.searchFlights(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

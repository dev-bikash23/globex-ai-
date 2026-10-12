package com.globex.location.controller;

import com.globex.location.service.LocationService;
import com.globex.shared.response.ApiResponse;
import com.globex.travel.domain.LocationSuggestion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Location/airport autocomplete for flight search form.
 *
 * GET /api/v1/locations/search?q={query}&limit={limit}
 * Public endpoint — no authentication required.
 */
@RestController
@RequestMapping("/api/v1/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<LocationSuggestion>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {

        List<LocationSuggestion> results = locationService.search(q, limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}

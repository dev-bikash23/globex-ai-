package com.globex.places.controller;

import com.globex.integration.places.dto.PlaceResponse;
import com.globex.places.service.PlacesService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/destinations")
@Tag(name = "Places", description = "Attractions, landmarks, and venues")
public class PlacesController {

    private final PlacesService placesService;

    public PlacesController(PlacesService placesService) {
        this.placesService = placesService;
    }

    @GetMapping("/{id}/places")
    @Operation(summary = "Get points of interest and attractions near destination")
    public ResponseEntity<ApiResponse<List<PlaceResponse>>> getPlaces(
            @PathVariable String id,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "4000") int radius,
            @RequestParam(defaultValue = "20") int limit) {
        List<PlaceResponse> places = placesService.getPlacesForDestination(id, category, radius, limit);
        return ResponseEntity.ok(ApiResponse.success(places));
    }
}

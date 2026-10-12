package com.globex.destination.controller;

import com.globex.destination.dto.DestinationResponse;
import com.globex.destination.dto.DestinationSummary;
import com.globex.destination.service.DestinationService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/destinations")
@Tag(name = "Destinations", description = "Destination discovery and search API")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    @Operation(summary = "Get all destinations (paginated)")
    public ResponseEntity<ApiResponse<Page<DestinationResponse>>> getAllDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("name"));
        return ResponseEntity.ok(ApiResponse.success(destinationService.getAllDestinations(pageable)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured destinations for globe markers (cached)")
    public ResponseEntity<ApiResponse<List<DestinationSummary>>> getFeaturedDestinations() {
        return ResponseEntity.ok(ApiResponse.success(destinationService.getFeaturedDestinations()));
    }

    @GetMapping("/search")
    @Operation(summary = "Search destinations, cities, and countries by keyword")
    public ResponseEntity<ApiResponse<Page<DestinationSummary>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50));
        return ResponseEntity.ok(ApiResponse.success(
                destinationService.searchDestinations(q.trim(), pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get destination by ID")
    public ResponseEntity<ApiResponse<DestinationResponse>> getDestinationById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(destinationService.getDestinationById(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get destination by URL slug")
    public ResponseEntity<ApiResponse<DestinationResponse>> getDestinationBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(destinationService.getDestinationBySlug(slug)));
    }
}

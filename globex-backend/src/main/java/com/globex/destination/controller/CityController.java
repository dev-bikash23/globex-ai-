package com.globex.destination.controller;

import com.globex.destination.dto.CityResponse;
import com.globex.destination.dto.DestinationSummary;
import com.globex.destination.service.CityService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cities")
@Tag(name = "Cities", description = "City data API")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get city by ID")
    public ResponseEntity<ApiResponse<CityResponse>> getCityById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(cityService.getCityById(id)));
    }

    @GetMapping("/{id}/destinations")
    @Operation(summary = "Get destinations within a city")
    public ResponseEntity<ApiResponse<List<DestinationSummary>>> getDestinationsByCity(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(cityService.getDestinationsByCity(id)));
    }
}

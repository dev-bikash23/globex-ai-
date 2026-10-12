package com.globex.destination.controller;

import com.globex.destination.dto.CityResponse;
import com.globex.destination.dto.CountryResponse;
import com.globex.destination.service.CountryService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/countries")
@Tag(name = "Countries", description = "Country data API")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    @Operation(summary = "Get all countries (cached)")
    public ResponseEntity<ApiResponse<List<CountryResponse>>> getAllCountries() {
        return ResponseEntity.ok(ApiResponse.success(countryService.getAllCountries()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get country by ID")
    public ResponseEntity<ApiResponse<CountryResponse>> getCountryById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(countryService.getCountryById(id)));
    }

    @GetMapping("/{id}/cities")
    @Operation(summary = "Get cities within a country")
    public ResponseEntity<ApiResponse<List<CityResponse>>> getCitiesByCountry(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(countryService.getCitiesByCountry(id)));
    }
}

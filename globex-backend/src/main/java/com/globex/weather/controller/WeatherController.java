package com.globex.weather.controller;

import com.globex.integration.weather.dto.WeatherResponse;
import com.globex.shared.response.ApiResponse;
import com.globex.weather.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/destinations")
@Tag(name = "Weather", description = "Real-time weather and forecast")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/{id}/weather")
    @Operation(summary = "Get current weather and forecast for destination")
    public ResponseEntity<ApiResponse<WeatherResponse>> getWeather(@PathVariable String id) {
        WeatherResponse response = weatherService.getWeatherForDestination(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

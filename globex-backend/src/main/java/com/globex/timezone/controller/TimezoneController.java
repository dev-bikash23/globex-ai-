package com.globex.timezone.controller;

import com.globex.destination.domain.Destination;
import com.globex.destination.repository.DestinationRepository;
import com.globex.integration.timezone.TimezoneProvider;
import com.globex.shared.exception.ResourceNotFoundException;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/destinations")
@Tag(name = "Timezone", description = "Destination local time and timezone calculation")
public class TimezoneController {

    private final DestinationRepository destinationRepository;
    private final TimezoneProvider timezoneProvider;

    public TimezoneController(DestinationRepository destinationRepository, TimezoneProvider timezoneProvider) {
        this.destinationRepository = destinationRepository;
        this.timezoneProvider = timezoneProvider;
    }

    @GetMapping("/{id}/time")
    @Operation(summary = "Get current local time for destination")
    public ResponseEntity<ApiResponse<TimezoneProvider.LocalTimeInfo>> getLocalTime(@PathVariable String id) {
        Destination destination = destinationRepository.findByIdWithCityAndCountry(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        String tz = destination.getCity().getTimezone();
        if (tz == null || tz.isBlank()) {
            tz = destination.getCity().getCountry().getTimezone();
        }
        // Final fallback so we never throw on bad/missing timezone data
        if (tz == null || tz.isBlank()) {
            tz = "UTC";
        }

        TimezoneProvider.LocalTimeInfo timeInfo = timezoneProvider.getLocalTime(tz);
        return ResponseEntity.ok(ApiResponse.success(timeInfo));
    }
}

package com.globex.images.controller;

import com.globex.images.service.DestinationImageService;
import com.globex.integration.images.dto.DestinationImageResponse;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/destinations")
@Tag(name = "Images", description = "Destination photography and attribution")
public class DestinationImageController {

    private final DestinationImageService destinationImageService;

    public DestinationImageController(DestinationImageService destinationImageService) {
        this.destinationImageService = destinationImageService;
    }

    @GetMapping("/{id}/images")
    @Operation(summary = "Get destination photos with attribution")
    public ResponseEntity<ApiResponse<List<DestinationImageResponse>>> getImages(
            @PathVariable String id,
            @RequestParam(defaultValue = "6") int count) {
        List<DestinationImageResponse> images = destinationImageService.getImagesForDestination(id, count);
        return ResponseEntity.ok(ApiResponse.success(images));
    }
}

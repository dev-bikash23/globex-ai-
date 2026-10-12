package com.globex.favorite.controller;

import com.globex.favorite.dto.FavoriteResponse;
import com.globex.favorite.service.FavoriteService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users/me/favorites")
@Tag(name = "Favorites", description = "Save and manage favorite destinations")
@SecurityRequirement(name = "bearerAuth")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/destinations/{destinationId}")
    @Operation(summary = "Save a destination to favorites (requires authentication)")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @PathVariable String destinationId,
            @AuthenticationPrincipal UserDetails principal) {
        // principal.getUsername() returns email from JWT — userId is resolved server-side
        // Never accept userId from request body or path — always from JWT principal
        var result = favoriteService.addFavorite(principal.getUsername(), destinationId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(result, "Destination saved to favorites"));
    }

    @DeleteMapping("/destinations/{destinationId}")
    @Operation(summary = "Remove a destination from favorites (requires authentication)")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable String destinationId,
            @AuthenticationPrincipal UserDetails principal) {
        favoriteService.removeFavorite(principal.getUsername(), destinationId);
        return ResponseEntity.ok(ApiResponse.success("Destination removed from favorites"));
    }

    @GetMapping("/destinations")
    @Operation(summary = "Get current user's saved destinations (requires authentication)")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success(
                favoriteService.getMyFavorites(principal.getUsername())));
    }
}

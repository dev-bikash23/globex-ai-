package com.globex.user.controller;

import com.globex.auth.dto.UserProfileDto;
import com.globex.user.service.UserService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * User Profile Controller — authenticated user's own profile.
 *
 * GET  /api/v1/users/me  → current user's profile
 * PUT  /api/v1/users/me  → update display name
 *
 * Identity ALWAYS derived from the JWT — never from request body or URL params.
 * This prevents horizontal privilege escalation (User A accessing User B's data).
 */
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Profile", description = "Authenticated user profile management")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user's profile",
               description = "Returns profile for the authenticated user derived from JWT — never trusts client-supplied IDs")
    public ResponseEntity<ApiResponse<UserProfileDto>> getMyProfile(
            @AuthenticationPrincipal UserDetails principal) {

        UserProfileDto profile = userService.getMyProfile(principal);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved"));
    }

    @PutMapping("/me")
    @Operation(summary = "Update display name")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody Map<String, String> body) {

        String displayName = body.get("displayName");
        UserProfileDto updated = userService.updateDisplayName(principal, displayName);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated"));
    }
}

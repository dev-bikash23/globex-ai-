package com.globex.auth.controller;

import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Admin Controller — protected endpoints requiring ROLE_ADMIN.
 * Demonstrates role-based access control (RBAC).
 *
 * USER role → 403 Forbidden
 * No token  → 401 Unauthorized
 * ADMIN     → 200 OK
 */
@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Admin-only endpoints — requires ROLE_ADMIN")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin test endpoint",
               description = "Returns 200 for ADMIN, 403 for USER, 401 for unauthenticated")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminTest(Authentication authentication) {
        Map<String, Object> data = Map.of(
                "message", "Welcome to the GlobeX Admin Panel",
                "user", authentication.getName(),
                "authorities", authentication.getAuthorities().stream()
                        .map(Object::toString).toList()
        );
        return ResponseEntity.ok(ApiResponse.success(data, "Admin access granted"));
    }

    @GetMapping("/users/count")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get system stats (admin only)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> systemStats() {
        Map<String, Object> stats = Map.of(
                "status", "Phase 2 — Auth complete",
                "features", java.util.List.of(
                        "JWT Authentication", "Refresh Token Rotation",
                        "RBAC", "Account Locking", "Audit Logging",
                        "Email Verification", "Password Reset"
                )
        );
        return ResponseEntity.ok(ApiResponse.success(stats, "System stats retrieved"));
    }
}

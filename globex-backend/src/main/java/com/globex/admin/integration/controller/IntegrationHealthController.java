package com.globex.admin.integration.controller;

import com.globex.admin.integration.dto.ProviderHealthStatus;
import com.globex.admin.integration.service.IntegrationHealthService;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/integrations")
@Tag(name = "Admin - Integrations", description = "Diagnostics for external provider integrations")
@SecurityRequirement(name = "bearerAuth")
public class IntegrationHealthController {

    private final IntegrationHealthService integrationHealthService;

    public IntegrationHealthController(IntegrationHealthService integrationHealthService) {
        this.integrationHealthService = integrationHealthService;
    }

    @GetMapping("/health")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get health status and latencies for all external integration providers")
    public ResponseEntity<ApiResponse<List<ProviderHealthStatus>>> getHealth() {
        List<ProviderHealthStatus> statusList = integrationHealthService.checkAllProviders();
        return ResponseEntity.ok(ApiResponse.success(statusList));
    }
}

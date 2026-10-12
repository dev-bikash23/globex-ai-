package com.globex.admin.integration.dto;

public record ProviderHealthStatus(
        String serviceType,
        String providerName,
        String status, // AVAILABLE, DEGRADED, UNAVAILABLE
        long latencyMs,
        String lastChecked,
        String note
) {}

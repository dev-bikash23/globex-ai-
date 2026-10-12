package com.globex.shared.controller;

import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health Controller — verifies Spring Boot, PostgreSQL, and Redis are running.
 * Public endpoint — no auth required.
 */
@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Application health and connectivity verification")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final JdbcTemplate jdbcTemplate;
    private final RedisTemplate<String, String> stringRedisTemplate;

    public HealthController(JdbcTemplate jdbcTemplate,
                            RedisTemplate<String, String> stringRedisTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @GetMapping
    @Operation(summary = "Full health check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now().toString());
        health.put("application", "GlobeX AI");
        health.put("version", "1.0.0-SNAPSHOT");
        health.put("phase", "Phase 2 — Auth & Security");
        health.put("database", checkDatabase());
        health.put("redis", checkRedis());
        return ResponseEntity.ok(ApiResponse.success(health, "GlobeX AI is running"));
    }

    @GetMapping("/db")
    @Operation(summary = "Database health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dbHealth() {
        return ResponseEntity.ok(ApiResponse.success(checkDatabase(), "Database health check complete"));
    }

    @GetMapping("/redis")
    @Operation(summary = "Redis health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> redisHealth() {
        return ResponseEntity.ok(ApiResponse.success(checkRedis(), "Redis health check complete"));
    }

    private Map<String, Object> checkDatabase() {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
            result.put("status", "UP");
            result.put("message", "PostgreSQL connection successful");
            if (version != null) result.put("version", version.split(" ")[0] + " " + version.split(" ")[1]);
        } catch (Exception e) {
            log.error("Database health check failed: {}", e.getMessage());
            result.put("status", "DOWN");
            result.put("message", "PostgreSQL connection failed");
        }
        return result;
    }

    private Map<String, Object> checkRedis() {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            var conn = stringRedisTemplate.getConnectionFactory();
            if (conn != null) {
                String ping = conn.getConnection().ping();
                result.put("status", "PONG".equalsIgnoreCase(ping) || "UP".equals(ping) ? "UP" : "DEGRADED");
            } else {
                result.put("status", "DOWN");
            }
            result.put("message", "Redis connection successful");
        } catch (Exception e) {
            log.warn("Redis health check failed: {}", e.getMessage());
            result.put("status", "DOWN");
            result.put("message", "Redis not available — some features degraded");
        }
        return result;
    }
}

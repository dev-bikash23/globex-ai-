package com.globex.shared.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration test for the Health endpoint.
 *
 * <h2>Java Concept — @AutoConfigureMockMvc:</h2>
 * Creates MockMvc which simulates HTTP requests without starting a real server.
 * Faster than a real server, but tests the full Spring MVC pipeline including:
 * - Security filters
 * - Request mapping
 * - Response serialization
 *
 * <h2>Java Concept — MockMvc perform/expect pattern:</h2>
 * mockMvc.perform(get("/api/v1/health"))
 *     .andExpect(status().isOk())           // HTTP 200
 *     .andExpect(jsonPath("$.success").value(true))  // JSON body
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/globex_test",
    "spring.datasource.username=postgres",
    "spring.datasource.password=postgres",
    "spring.data.redis.port=6370",
    "globex.jwt.secret=TestSecretKeyForJWTThatIsAtLeast256BitsLongForHMACSHA256Algorithm"
})
@DisplayName("HealthController Integration Tests")
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/health should return 200 with success:true")
    void healthEndpointShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/health")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.application").value("GlobeX AI"))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.database").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    @DisplayName("GET /api/v1/health/db should return database health")
    void dbHealthEndpointShouldReturnDatabaseStatus() throws Exception {
        mockMvc.perform(get("/api/v1/health/db")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").exists());
    }

    @Test
    @DisplayName("Health endpoint should be publicly accessible (no auth required)")
    void healthEndpointShouldBePublic() throws Exception {
        // No Authorization header — should still return 200
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Response should include X-Request-ID header")
    void responseShouldIncludeRequestId() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Request-ID"));
    }
}

package com.globex;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

/**
 * Application Context Test — verifies the entire Spring context loads successfully.
 *
 * <h2>What this test proves:</h2>
 * - All @Component, @Service, @Repository, @Controller beans are found
 * - All @Configuration classes are valid
 * - All @ConfigurationProperties bind correctly
 * - All required beans (JwtService, SecurityConfig, etc.) are wired
 * - Database connection works (Flyway migrations run)
 *
 * <h2>Java Concept — @SpringBootTest:</h2>
 * Loads the FULL application context — all beans, configurations, and the embedded server.
 * This is the most comprehensive Spring test type but also the slowest.
 *
 * <h2>Java Concept — @ActiveProfiles("test"):</h2>
 * Loads application-test.yml instead of application-dev.yml.
 *
 * <h2>Redis in Tests:</h2>
 * Redis is not required for context loading tests. We override the Redis
 * configuration to use a test-safe connection that fails gracefully.
 */
@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    // Override Redis to a test port — connection failure is acceptable in unit tests
    "spring.data.redis.host=localhost",
    "spring.data.redis.port=6370",   // Non-existent port — Redis not required for context test
    // Use a local PostgreSQL (matches CI environment)
    "spring.datasource.url=jdbc:postgresql://localhost:5432/globex_test",
    "spring.datasource.username=postgres",
    "spring.datasource.password=postgres",
    // Use a simple test JWT secret
    "globex.jwt.secret=TestSecretKeyForJWTThatIsAtLeast256BitsLongForHMACSHA256Algorithm"
})
class GlobexApplicationTests {

    @Test
    void contextLoads() {
        // If this test passes, the entire Spring context loaded successfully.
        // No assertion needed — a failed context load throws an exception.
    }
}

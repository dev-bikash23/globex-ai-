package com.globex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * GlobeX AI — Main Application Entry Point
 *
 * <p>This is the root Spring Boot application class for GlobeX AI.
 * It bootstraps the entire modular monolith.
 *
 * <h2>Architecture Notes</h2>
 * <ul>
 *   <li>Modular Monolith: all modules (auth, user, destination, etc.)
 *       are packages within this single application</li>
 *   <li>@EnableJpaAuditing: automatically populates createdAt/updatedAt fields</li>
 *   <li>@EnableAsync: enables @Async methods for media processing, notifications</li>
 *   <li>@EnableScheduling: enables @Scheduled tasks for cache refresh, cleanup</li>
 *   <li>@ConfigurationPropertiesScan: auto-discovers all @ConfigurationProperties beans</li>
 * </ul>
 *
 * <h2>Phase 1 Features</h2>
 * <ul>
 *   <li>Spring Boot foundation</li>
 *   <li>PostgreSQL + Flyway migrations</li>
 *   <li>Redis connection</li>
 *   <li>Spring Security foundation</li>
 *   <li>Global exception handling</li>
 *   <li>OpenAPI documentation</li>
 *   <li>Actuator health endpoints</li>
 * </ul>
 */
@SpringBootApplication
@EnableJpaAuditing                // Auto-manage createdAt, updatedAt via @EntityListeners
@EnableAsync                      // Allow @Async on service methods (media processing, emails)
@EnableScheduling                 // Allow @Scheduled tasks (cache refresh, token cleanup)
@ConfigurationPropertiesScan      // Auto-discover all @ConfigurationProperties classes
public class GlobexApplication {

    public static void main(String[] args) {
        SpringApplication.run(GlobexApplication.class, args);
    }
}

package com.globex.shared.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Enables Spring's @Cacheable / @CacheEvict / @CachePut annotations.
 * The cache store is Redis, auto-configured by spring-boot-starter-data-redis.
 * TTL is set globally via spring.cache.redis.time-to-live in application.yml.
 *
 * Cache names used in Phase 3:
 *   "destinations" — featured list, paginated list, single by ID (1 hour TTL)
 *   "countries"    — full country list (24 hour TTL)
 *
 * Invalidation: currently manual (re-deploy). Phase 4 admin will add @CacheEvict
 * when destinations are updated. User-specific data (favorites) is NEVER cached here.
 */
@Configuration
@EnableCaching
public class CacheConfig {
    // Spring Boot auto-configures RedisCacheManager when:
    // 1. spring-boot-starter-data-redis is on classpath
    // 2. spring-boot-starter-cache is on classpath
    // 3. spring.cache.type=redis in application.yml
    // No manual bean configuration needed.
}

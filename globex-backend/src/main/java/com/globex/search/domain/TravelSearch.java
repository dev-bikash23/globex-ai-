package com.globex.search.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * JPA entity mapping to the travel_searches table.
 *
 * Stores what the user searched for — NOT the results.
 * External offers expire quickly and must NOT be stored long-term.
 * Only search parameters are persisted for search history display.
 *
 * Security: user_id comes from authenticated JWT, never from request body.
 * Users can only read their own search history (enforced in service layer).
 */
@Entity
@Table(name = "travel_searches", indexes = {
    @Index(name = "idx_travel_searches_user_id", columnList = "user_id"),
    @Index(name = "idx_travel_searches_created_at", columnList = "created_at")
})
public class TravelSearch {

    @Id
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    @org.hibernate.annotations.UuidGenerator
    private java.util.UUID id;

    @Column(name = "user_id")
    private String userId;                // null = anonymous search (not stored in history)

    @Column(name = "search_type", nullable = false, length = 20)
    private String searchType;            // FLIGHT, HOTEL, ACTIVITY

    @Column(name = "origin", length = 10)
    private String origin;               // IATA code (flights only)

    @Column(name = "destination", nullable = false, length = 200)
    private String destination;

    @Column(name = "search_params", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> searchParams;

    @Column(name = "result_count")
    private int resultCount;

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (this.createdAt == null) this.createdAt = Instant.now();
        if (this.searchParams == null) this.searchParams = Map.of();
    }

    // ── Getters & Setters (no Lombok — Java 24 incompatible) ─────────────────

    public java.util.UUID getId() { return id; }
    public void setId(java.util.UUID id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSearchType() { return searchType; }
    public void setSearchType(String searchType) { this.searchType = searchType; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Map<String, Object> getSearchParams() { return searchParams; }
    public void setSearchParams(Map<String, Object> searchParams) { this.searchParams = searchParams; }

    public int getResultCount() { return resultCount; }
    public void setResultCount(int resultCount) { this.resultCount = resultCount; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

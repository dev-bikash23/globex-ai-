package com.globex.trip.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid")
    private UUID id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "destination_id", length = 36)
    private String destinationId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TripStatus status = TripStatus.PLANNING;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "USD";

    @Column(name = "budget_limit", precision = 14, scale = 2)
    private BigDecimal budgetLimit;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() { updatedAt = Instant.now(); }

    public boolean canTransitionTo(TripStatus newStatus) {
        return switch (this.status) {
            case PLANNING     -> newStatus == TripStatus.CONFIRMED  || newStatus == TripStatus.CANCELLED || newStatus == TripStatus.ARCHIVED;
            case CONFIRMED    -> newStatus == TripStatus.IN_PROGRESS || newStatus == TripStatus.CANCELLED || newStatus == TripStatus.ARCHIVED;
            case IN_PROGRESS  -> newStatus == TripStatus.COMPLETED  || newStatus == TripStatus.CANCELLED || newStatus == TripStatus.ARCHIVED;
            case COMPLETED    -> newStatus == TripStatus.ARCHIVED;
            case CANCELLED    -> newStatus == TripStatus.ARCHIVED;
            case ARCHIVED     -> false;
        };
    }

    public int getDurationDays() {
        return (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
    }

    public UUID getId()                        { return id; }
    public void setId(UUID id)                { this.id = id; }
    public String getUserId()                  { return userId; }
    public void setUserId(String v)           { this.userId = v; }
    public String getDestinationId()           { return destinationId; }
    public void setDestinationId(String v)    { this.destinationId = v; }
    public String getTitle()                   { return title; }
    public void setTitle(String v)            { this.title = v; }
    public String getDescription()             { return description; }
    public void setDescription(String v)      { this.description = v; }
    public LocalDate getStartDate()            { return startDate; }
    public void setStartDate(LocalDate v)     { this.startDate = v; }
    public LocalDate getEndDate()              { return endDate; }
    public void setEndDate(LocalDate v)       { this.endDate = v; }
    public TripStatus getStatus()              { return status; }
    public void setStatus(TripStatus v)       { this.status = v; }
    public String getCurrency()                { return currency; }
    public void setCurrency(String v)         { this.currency = v; }
    public BigDecimal getBudgetLimit()         { return budgetLimit; }
    public void setBudgetLimit(BigDecimal v)  { this.budgetLimit = v; }
    public String getCoverImageUrl()           { return coverImageUrl; }
    public void setCoverImageUrl(String v)    { this.coverImageUrl = v; }
    public Instant getCreatedAt()              { return createdAt; }
    public Instant getUpdatedAt()              { return updatedAt; }
}

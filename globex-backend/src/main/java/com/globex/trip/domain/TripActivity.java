package com.globex.trip.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "trip_activities")
public class TripActivity {
    @Id @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid") private UUID id;
    @Column(name = "trip_id", nullable = false, columnDefinition = "uuid") private UUID tripId;
    @Column(name = "provider", length = 50) private String provider;
    @Column(name = "provider_offer_id", length = 255) private String providerOfferId;
    @Column(name = "activity_name", nullable = false, length = 200) private String activityName;
    @Column(name = "activity_date") private LocalDate activityDate;
    @Column(name = "start_time") private LocalTime startTime;
    @Column(name = "duration_minutes") private Integer durationMinutes;
    @Column(name = "price_amount", nullable = false, precision = 14, scale = 2) private BigDecimal priceAmount = BigDecimal.ZERO;
    @Column(name = "currency", nullable = false, length = 3) private String currency = "USD";
    @Column(name = "category", length = 50) private String category;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20) private ActivityStatus status = ActivityStatus.PLANNED;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @PrePersist public void prePersist() { if (createdAt == null) createdAt = Instant.now(); }
    public enum ActivityStatus { PLANNED, REMOVED, EXPIRED }
    public UUID getId()                          { return id; }
    public void setId(UUID id)                  { this.id = id; }
    public UUID getTripId()                      { return tripId; }
    public void setTripId(UUID v)               { this.tripId = v; }
    public String getProvider()                  { return provider; }
    public void setProvider(String v)            { this.provider = v; }
    public String getProviderOfferId()           { return providerOfferId; }
    public void setProviderOfferId(String v)     { this.providerOfferId = v; }
    public String getActivityName()              { return activityName; }
    public void setActivityName(String v)        { this.activityName = v; }
    public LocalDate getActivityDate()           { return activityDate; }
    public void setActivityDate(LocalDate v)     { this.activityDate = v; }
    public LocalTime getStartTime()              { return startTime; }
    public void setStartTime(LocalTime v)        { this.startTime = v; }
    public Integer getDurationMinutes()          { return durationMinutes; }
    public void setDurationMinutes(Integer v)    { this.durationMinutes = v; }
    public BigDecimal getPriceAmount()           { return priceAmount; }
    public void setPriceAmount(BigDecimal v)     { this.priceAmount = v; }
    public String getCurrency()                  { return currency; }
    public void setCurrency(String v)            { this.currency = v; }
    public String getCategory()                  { return category; }
    public void setCategory(String v)            { this.category = v; }
    public ActivityStatus getStatus()            { return status; }
    public void setStatus(ActivityStatus v)      { this.status = v; }
    public Instant getCreatedAt()                { return createdAt; }
}

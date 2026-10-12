package com.globex.trip.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "itinerary_items")
public class ItineraryItem {
    @Id @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid") private UUID id;
    @Column(name = "day_id", nullable = false, columnDefinition = "uuid") private UUID dayId;
    @Column(name = "title", nullable = false, length = 200) private String title;
    @Column(name = "description", columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false, length = 20) private ItemType itemType = ItemType.OTHER;
    @Column(name = "start_time") private LocalTime startTime;
    @Column(name = "end_time") private LocalTime endTime;
    @Column(name = "location_name", length = 200) private String locationName;
    @Column(name = "latitude") private Double latitude;
    @Column(name = "longitude") private Double longitude;
    @Column(name = "estimated_cost", nullable = false, precision = 14, scale = 2) private BigDecimal estimatedCost = BigDecimal.ZERO;
    @Column(name = "currency", nullable = false, length = 3) private String currency = "USD";
    @Column(name = "sort_order", nullable = false) private int sortOrder = 0;
    @Column(name = "notes", columnDefinition = "TEXT") private String notes;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    public enum ItemType { FLIGHT, HOTEL, ACTIVITY, MEAL, TRANSPORT, FREE_TIME, OTHER }
    @PrePersist public void prePersist() { if (createdAt == null) createdAt = Instant.now(); updatedAt = Instant.now(); }
    @PreUpdate  public void preUpdate()  { updatedAt = Instant.now(); }
    public UUID getId()                     { return id; }
    public void setId(UUID id)             { this.id = id; }
    public UUID getDayId()                  { return dayId; }
    public void setDayId(UUID v)           { this.dayId = v; }
    public String getTitle()                { return title; }
    public void setTitle(String v)         { this.title = v; }
    public String getDescription()          { return description; }
    public void setDescription(String v)   { this.description = v; }
    public ItemType getItemType()           { return itemType; }
    public void setItemType(ItemType v)    { this.itemType = v; }
    public LocalTime getStartTime()         { return startTime; }
    public void setStartTime(LocalTime v)  { this.startTime = v; }
    public LocalTime getEndTime()           { return endTime; }
    public void setEndTime(LocalTime v)    { this.endTime = v; }
    public String getLocationName()         { return locationName; }
    public void setLocationName(String v)  { this.locationName = v; }
    public Double getLatitude()             { return latitude; }
    public void setLatitude(Double v)      { this.latitude = v; }
    public Double getLongitude()            { return longitude; }
    public void setLongitude(Double v)     { this.longitude = v; }
    public BigDecimal getEstimatedCost()   { return estimatedCost; }
    public void setEstimatedCost(BigDecimal v){ this.estimatedCost = v; }
    public String getCurrency()            { return currency; }
    public void setCurrency(String v)      { this.currency = v; }
    public int getSortOrder()              { return sortOrder; }
    public void setSortOrder(int v)        { this.sortOrder = v; }
    public String getNotes()               { return notes; }
    public void setNotes(String v)         { this.notes = v; }
    public Instant getCreatedAt()          { return createdAt; }
    public Instant getUpdatedAt()          { return updatedAt; }
}

package com.globex.trip.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "itinerary_days", uniqueConstraints = @UniqueConstraint(name = "uq_itinerary_day_number", columnNames = {"trip_id","day_number"}))
public class ItineraryDay {
    @Id @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid") private UUID id;
    @Column(name = "trip_id", nullable = false, columnDefinition = "uuid") private UUID tripId;
    @Column(name = "day_number", nullable = false) private int dayNumber;
    @Column(name = "date", nullable = false) private LocalDate date;
    @Column(name = "title", length = 200) private String title;
    @Column(name = "notes", columnDefinition = "TEXT") private String notes;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    @PrePersist public void prePersist() { if (createdAt == null) createdAt = Instant.now(); updatedAt = Instant.now(); }
    @PreUpdate  public void preUpdate()  { updatedAt = Instant.now(); }
    public UUID getId()               { return id; }
    public void setId(UUID id)       { this.id = id; }
    public UUID getTripId()           { return tripId; }
    public void setTripId(UUID v)    { this.tripId = v; }
    public int getDayNumber()         { return dayNumber; }
    public void setDayNumber(int v)  { this.dayNumber = v; }
    public LocalDate getDate()        { return date; }
    public void setDate(LocalDate v) { this.date = v; }
    public String getTitle()          { return title; }
    public void setTitle(String v)   { this.title = v; }
    public String getNotes()          { return notes; }
    public void setNotes(String v)   { this.notes = v; }
    public Instant getCreatedAt()     { return createdAt; }
    public Instant getUpdatedAt()     { return updatedAt; }
}

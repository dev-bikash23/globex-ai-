package com.globex.trip.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trip_travelers")
public class TripTraveler {
    @Id @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid")
    private UUID id;
    @Column(name = "trip_id", nullable = false, columnDefinition = "uuid")
    private UUID tripId;
    @Column(name = "first_name", length = 100) private String firstName;
    @Column(name = "last_name", length = 100) private String lastName;
    @Enumerated(EnumType.STRING)
    @Column(name = "traveler_type", nullable = false, length = 10)
    private TravelerType travelerType = TravelerType.ADULT;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @PrePersist public void prePersist() { if (createdAt == null) createdAt = Instant.now(); }
    public enum TravelerType { ADULT, CHILD, INFANT }
    public UUID getId()                         { return id; }
    public void setId(UUID id)                 { this.id = id; }
    public UUID getTripId()                     { return tripId; }
    public void setTripId(UUID v)              { this.tripId = v; }
    public String getFirstName()               { return firstName; }
    public void setFirstName(String v)         { this.firstName = v; }
    public String getLastName()                { return lastName; }
    public void setLastName(String v)          { this.lastName = v; }
    public TravelerType getTravelerType()      { return travelerType; }
    public void setTravelerType(TravelerType v){ this.travelerType = v; }
    public Instant getCreatedAt()              { return createdAt; }
}

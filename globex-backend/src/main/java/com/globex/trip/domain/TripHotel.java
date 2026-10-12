package com.globex.trip.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "trip_hotels")
public class TripHotel {
    @Id @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid") private UUID id;
    @Column(name = "trip_id", nullable = false, columnDefinition = "uuid") private UUID tripId;
    @Column(name = "provider", nullable = false, length = 50) private String provider;
    @Column(name = "provider_offer_id", nullable = false, length = 255) private String providerOfferId;
    @Column(name = "hotel_name", nullable = false, length = 200) private String hotelName;
    @Column(name = "check_in", nullable = false) private LocalDate checkIn;
    @Column(name = "check_out", nullable = false) private LocalDate checkOut;
    @Column(name = "room_type", length = 100) private String roomType;
    @Column(name = "price_amount", nullable = false, precision = 14, scale = 2) private BigDecimal priceAmount;
    @Column(name = "currency", nullable = false, length = 3) private String currency;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20) private OfferStatus status = OfferStatus.SELECTED;
    @Column(name = "last_validated_at") private Instant lastValidatedAt;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @PrePersist public void prePersist() { if (createdAt == null) createdAt = Instant.now(); }
    public enum OfferStatus { SELECTED, EXPIRED, REMOVED }
    public UUID getId()                       { return id; }
    public void setId(UUID id)               { this.id = id; }
    public UUID getTripId()                   { return tripId; }
    public void setTripId(UUID v)            { this.tripId = v; }
    public String getProvider()              { return provider; }
    public void setProvider(String v)        { this.provider = v; }
    public String getProviderOfferId()       { return providerOfferId; }
    public void setProviderOfferId(String v) { this.providerOfferId = v; }
    public String getHotelName()             { return hotelName; }
    public void setHotelName(String v)       { this.hotelName = v; }
    public LocalDate getCheckIn()            { return checkIn; }
    public void setCheckIn(LocalDate v)      { this.checkIn = v; }
    public LocalDate getCheckOut()           { return checkOut; }
    public void setCheckOut(LocalDate v)     { this.checkOut = v; }
    public String getRoomType()              { return roomType; }
    public void setRoomType(String v)        { this.roomType = v; }
    public BigDecimal getPriceAmount()       { return priceAmount; }
    public void setPriceAmount(BigDecimal v) { this.priceAmount = v; }
    public String getCurrency()              { return currency; }
    public void setCurrency(String v)        { this.currency = v; }
    public OfferStatus getStatus()           { return status; }
    public void setStatus(OfferStatus v)     { this.status = v; }
    public Instant getLastValidatedAt()      { return lastValidatedAt; }
    public void setLastValidatedAt(Instant v){ this.lastValidatedAt = v; }
    public Instant getCreatedAt()            { return createdAt; }
}

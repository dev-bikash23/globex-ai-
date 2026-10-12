package com.globex.trip.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "trip_expenses")
public class TripExpense {
    @Id @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid") private UUID id;
    @Column(name = "trip_id", nullable = false, columnDefinition = "uuid") private UUID tripId;
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30) private ExpenseCategory category;
    @Column(name = "description", nullable = false, length = 300) private String description;
    @Column(name = "amount", nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(name = "currency", nullable = false, length = 3) private String currency;
    @Column(name = "expense_date") private LocalDate expenseDate;
    @Column(name = "notes", columnDefinition = "TEXT") private String notes;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    public enum ExpenseCategory { FLIGHT, HOTEL, ACTIVITY, FOOD, TRANSPORT, SHOPPING, MISCELLANEOUS }
    @PrePersist public void prePersist() { if (createdAt == null) createdAt = Instant.now(); updatedAt = Instant.now(); }
    @PreUpdate  public void preUpdate()  { updatedAt = Instant.now(); }
    public UUID getId()                        { return id; }
    public void setId(UUID id)                { this.id = id; }
    public UUID getTripId()                    { return tripId; }
    public void setTripId(UUID v)             { this.tripId = v; }
    public ExpenseCategory getCategory()       { return category; }
    public void setCategory(ExpenseCategory v){ this.category = v; }
    public String getDescription()             { return description; }
    public void setDescription(String v)      { this.description = v; }
    public BigDecimal getAmount()              { return amount; }
    public void setAmount(BigDecimal v)       { this.amount = v; }
    public String getCurrency()                { return currency; }
    public void setCurrency(String v)         { this.currency = v; }
    public LocalDate getExpenseDate()          { return expenseDate; }
    public void setExpenseDate(LocalDate v)   { this.expenseDate = v; }
    public String getNotes()                   { return notes; }
    public void setNotes(String v)            { this.notes = v; }
    public Instant getCreatedAt()              { return createdAt; }
    public Instant getUpdatedAt()              { return updatedAt; }
}

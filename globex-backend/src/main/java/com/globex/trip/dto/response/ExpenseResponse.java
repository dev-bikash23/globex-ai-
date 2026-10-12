package com.globex.trip.dto.response;
import java.math.BigDecimal;
import java.time.Instant;
public record ExpenseResponse(
    String id, String tripId, String category, String description,
    BigDecimal amount, String currency, String expenseDate, String notes,
    Instant createdAt, Instant updatedAt
) {}

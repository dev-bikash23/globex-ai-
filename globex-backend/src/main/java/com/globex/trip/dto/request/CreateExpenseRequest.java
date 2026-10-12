package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateExpenseRequest(
    @NotBlank String category,
    @NotBlank @Size(max=300) String description,
    @NotNull @DecimalMin("0") BigDecimal amount,
    @NotBlank @Size(min=3, max=3) String currency,
    String expenseDate,
    String notes
) {}

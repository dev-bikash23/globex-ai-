package com.globex.trip.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record SetBudgetLimitRequest(@DecimalMin("0") BigDecimal budgetLimit) {}

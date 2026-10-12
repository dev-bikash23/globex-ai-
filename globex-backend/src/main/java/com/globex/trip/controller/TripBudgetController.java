package com.globex.trip.controller;
import com.globex.shared.response.ApiResponse;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.*;
import com.globex.trip.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/trips/{tripId}")
public class TripBudgetController {
    private final TripBudgetService budgetSvc;
    private final TripExpenseService expenseSvc;
    private final TripService tripService;
    public TripBudgetController(TripBudgetService bs, TripExpenseService es, TripService ts) {
        this.budgetSvc = bs; this.expenseSvc = es; this.tripService = ts;
    }
    @GetMapping("/budget")
    public ResponseEntity<ApiResponse<BudgetSummaryResponse>> getBudget(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(budgetSvc.getBudgetSummary(tripId, p.getUsername())));
    }
    @PutMapping("/budget/limit")
    public ResponseEntity<ApiResponse<Void>> setLimit(@PathVariable String tripId, @Valid @RequestBody SetBudgetLimitRequest req, @AuthenticationPrincipal UserDetails p) {
        tripService.setBudgetLimit(tripId, req.budgetLimit(), p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Budget limit updated"));
    }
    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> listExpenses(@PathVariable String tripId, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(expenseSvc.getExpenses(tripId, p.getUsername())));
    }
    @PostMapping("/expenses")
    public ResponseEntity<ApiResponse<ExpenseResponse>> addExpense(@PathVariable String tripId, @Valid @RequestBody CreateExpenseRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(expenseSvc.addExpense(tripId, req, p.getUsername()), "Expense added"));
    }
    @PutMapping("/expenses/{expId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(@PathVariable String tripId, @PathVariable String expId, @Valid @RequestBody UpdateExpenseRequest req, @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.success(expenseSvc.updateExpense(tripId, expId, req, p.getUsername()), "Expense updated"));
    }
    @DeleteMapping("/expenses/{expId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable String tripId, @PathVariable String expId, @AuthenticationPrincipal UserDetails p) {
        expenseSvc.deleteExpense(tripId, expId, p.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Expense deleted"));
    }
}

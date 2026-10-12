package com.globex.trip.service;

import com.globex.shared.exception.ResourceNotFoundException;
import com.globex.trip.domain.TripExpense;
import com.globex.trip.dto.request.*;
import com.globex.trip.dto.response.ExpenseResponse;
import com.globex.trip.exception.TripOwnershipException;
import com.globex.trip.repository.TripExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TripExpenseService {

    private final TripExpenseRepository repo;
    private final TripService           tripService;

    public TripExpenseService(TripExpenseRepository repo, TripService tripService) {
        this.repo        = repo;
        this.tripService = tripService;
    }

    public List<ExpenseResponse> getExpenses(String tripId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        return repo.findByTripIdOrderByExpenseDateDescCreatedAtDesc(trip.getId())
                   .stream().map(TripMapper::toExpense).toList();
    }

    @Transactional
    public ExpenseResponse addExpense(String tripId, CreateExpenseRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripExpense e = new TripExpense();
        e.setTripId(trip.getId());
        try { e.setCategory(TripExpense.ExpenseCategory.valueOf(req.category().toUpperCase())); }
        catch (Exception ex) { e.setCategory(TripExpense.ExpenseCategory.MISCELLANEOUS); }
        e.setDescription(req.description());
        e.setAmount(req.amount());
        e.setCurrency(req.currency().toUpperCase());
        if (req.expenseDate() != null && !req.expenseDate().isBlank())
            e.setExpenseDate(LocalDate.parse(req.expenseDate()));
        e.setNotes(req.notes());
        return TripMapper.toExpense(repo.save(e));
    }

    @Transactional
    public ExpenseResponse updateExpense(String tripId, String expId,
                                          UpdateExpenseRequest req, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripExpense e = repo.findById(UUID.fromString(expId))
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!e.getTripId().equals(trip.getId()))
            throw new TripOwnershipException("Expense not in trip");
        try { e.setCategory(TripExpense.ExpenseCategory.valueOf(req.category().toUpperCase())); }
        catch (Exception ex) { e.setCategory(TripExpense.ExpenseCategory.MISCELLANEOUS); }
        e.setDescription(req.description());
        e.setAmount(req.amount());
        e.setCurrency(req.currency().toUpperCase());
        if (req.expenseDate() != null && !req.expenseDate().isBlank())
            e.setExpenseDate(LocalDate.parse(req.expenseDate()));
        e.setNotes(req.notes());
        return TripMapper.toExpense(repo.save(e));
    }

    @Transactional
    public void deleteExpense(String tripId, String expId, String userId) {
        var trip = tripService.findAndVerifyOwner(tripId, userId);
        TripExpense e = repo.findById(UUID.fromString(expId))
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!e.getTripId().equals(trip.getId()))
            throw new TripOwnershipException("Expense not in trip");
        repo.delete(e);
    }
}
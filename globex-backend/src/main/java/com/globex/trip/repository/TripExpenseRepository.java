package com.globex.trip.repository;
import com.globex.trip.domain.TripExpense;
import com.globex.trip.domain.TripExpense.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
public interface TripExpenseRepository extends JpaRepository<TripExpense, UUID> {
    List<TripExpense> findByTripIdOrderByExpenseDateDescCreatedAtDesc(UUID tripId);
    @Query("SELECT COALESCE(SUM(e.amount),0) FROM TripExpense e WHERE e.tripId = :tripId")
    BigDecimal sumAmountByTripId(@Param("tripId") UUID tripId);
    @Query("SELECT e.category, COALESCE(SUM(e.amount),0) FROM TripExpense e WHERE e.tripId = :tripId GROUP BY e.category")
    List<Object[]> sumByCategory(@Param("tripId") UUID tripId);
}

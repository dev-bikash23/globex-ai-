package com.globex.trip.repository;
import com.globex.trip.domain.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, UUID> {
    List<ItineraryDay> findByTripIdOrderByDayNumber(UUID tripId);
    boolean existsByTripIdAndDayNumber(UUID tripId, int dayNumber);
    Optional<ItineraryDay> findByTripIdAndDate(UUID tripId, LocalDate date);
}

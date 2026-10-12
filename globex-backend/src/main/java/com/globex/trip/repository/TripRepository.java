package com.globex.trip.repository;
import com.globex.trip.domain.Trip;
import com.globex.trip.domain.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {
    List<Trip> findByUserIdOrderByStartDateDesc(String userId);
    List<Trip> findByUserIdAndStatusOrderByStartDateDesc(String userId, TripStatus status);
    @Query("SELECT t FROM Trip t WHERE t.userId = :userId AND t.endDate >= :today AND t.status NOT IN ('CANCELLED','ARCHIVED') ORDER BY t.startDate ASC")
    List<Trip> findUpcoming(@Param("userId") String userId, @Param("today") LocalDate today);
    List<Trip> findByUserIdAndStatusNotOrderByStartDateDesc(String userId, TripStatus status);
}

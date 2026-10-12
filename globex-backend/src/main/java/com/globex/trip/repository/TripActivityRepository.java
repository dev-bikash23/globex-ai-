package com.globex.trip.repository;
import com.globex.trip.domain.TripActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface TripActivityRepository extends JpaRepository<TripActivity, UUID> {
    List<TripActivity> findByTripId(UUID tripId);
}

package com.globex.trip.repository;
import com.globex.trip.domain.TripTraveler;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface TripTravelerRepository extends JpaRepository<TripTraveler, UUID> {
    List<TripTraveler> findByTripId(UUID tripId);
    void deleteByTripId(UUID tripId);
}

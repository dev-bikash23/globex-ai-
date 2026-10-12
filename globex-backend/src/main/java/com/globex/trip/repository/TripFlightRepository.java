package com.globex.trip.repository;
import com.globex.trip.domain.TripFlight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface TripFlightRepository extends JpaRepository<TripFlight, UUID> {
    List<TripFlight> findByTripId(UUID tripId);
    boolean existsByTripIdAndProviderOfferId(UUID tripId, String providerOfferId);
}

package com.globex.trip.repository;
import com.globex.trip.domain.TripHotel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface TripHotelRepository extends JpaRepository<TripHotel, UUID> {
    List<TripHotel> findByTripId(UUID tripId);
    boolean existsByTripIdAndProviderOfferId(UUID tripId, String providerOfferId);
}

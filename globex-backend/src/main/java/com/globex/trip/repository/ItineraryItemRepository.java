package com.globex.trip.repository;
import com.globex.trip.domain.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, UUID> {
    List<ItineraryItem> findByDayIdOrderBySortOrder(UUID dayId);
    void deleteByDayId(UUID dayId);
}

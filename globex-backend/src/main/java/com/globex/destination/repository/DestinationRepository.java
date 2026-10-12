package com.globex.destination.repository;

import com.globex.destination.domain.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, String> {

    List<Destination> findByFeaturedTrue();

    Optional<Destination> findBySlug(String slug);

    List<Destination> findByCityId(String cityId);

    /**
     * Eager-fetch destination with city and country — used by Phase 4 controllers
     * (timezone, weather, places, images) that need city.timezone / country data
     * outside a JPA session to avoid LazyInitializationException.
     */
    @Query("SELECT d FROM Destination d " +
           "JOIN FETCH d.city c " +
           "JOIN FETCH c.country co " +
           "WHERE d.id = :id")
    Optional<Destination> findByIdWithCityAndCountry(@Param("id") String id);

    /**
     * Case-insensitive search across destination name, city name, and country name.
     * Uses JPQL with LOWER() for portability — in Phase 4 this can be upgraded to
     * full-text search using the GIN index created in V3 migration.
     */
    @Query("SELECT d FROM Destination d " +
           "JOIN FETCH d.city c " +
           "JOIN FETCH c.country co " +
           "WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "   OR LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "   OR LOWER(co.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Destination> search(@Param("q") String query, Pageable pageable);
}

package com.globex.destination.repository;

import com.globex.destination.domain.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, String> {
    List<City> findByCountryId(String countryId);
    List<City> findByNameContainingIgnoreCase(String name);
}

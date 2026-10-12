package com.globex.destination.repository;

import com.globex.destination.domain.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, String> {
    Optional<Country> findByCode(String code);
    List<Country> findByContinent(String continent);
    List<Country> findByNameContainingIgnoreCase(String name);
}

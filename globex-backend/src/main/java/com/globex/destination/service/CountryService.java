package com.globex.destination.service;

import com.globex.destination.dto.CityResponse;
import com.globex.destination.dto.CountryResponse;
import com.globex.destination.repository.CityRepository;
import com.globex.destination.repository.CountryRepository;
import com.globex.shared.exception.ResourceNotFoundException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CountryService {

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;

    public CountryService(CountryRepository countryRepository, CityRepository cityRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
    }

    @Cacheable(value = "countries", key = "'all'")
    public List<CountryResponse> getAllCountries() {
        return countryRepository.findAll().stream()
                .map(CountryResponse::from)
                .toList();
    }

    public CountryResponse getCountryById(String id) {
        return countryRepository.findById(id)
                .map(CountryResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Country not found: " + id));
    }

    public List<CityResponse> getCitiesByCountry(String countryId) {
        // Verify country exists first
        if (!countryRepository.existsById(countryId)) {
            throw new ResourceNotFoundException("Country not found: " + countryId);
        }
        return cityRepository.findByCountryId(countryId).stream()
                .map(CityResponse::from)
                .toList();
    }
}

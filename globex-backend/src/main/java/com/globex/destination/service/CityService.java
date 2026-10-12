package com.globex.destination.service;

import com.globex.destination.dto.CityResponse;
import com.globex.destination.dto.DestinationSummary;
import com.globex.destination.repository.CityRepository;
import com.globex.destination.repository.DestinationRepository;
import com.globex.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CityService {

    private final CityRepository cityRepository;
    private final DestinationRepository destinationRepository;

    public CityService(CityRepository cityRepository, DestinationRepository destinationRepository) {
        this.cityRepository = cityRepository;
        this.destinationRepository = destinationRepository;
    }

    public CityResponse getCityById(String id) {
        return cityRepository.findById(id)
                .map(CityResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("City not found: " + id));
    }

    public List<DestinationSummary> getDestinationsByCity(String cityId) {
        if (!cityRepository.existsById(cityId)) {
            throw new ResourceNotFoundException("City not found: " + cityId);
        }
        return destinationRepository.findByCityId(cityId).stream()
                .map(DestinationSummary::from)
                .toList();
    }
}

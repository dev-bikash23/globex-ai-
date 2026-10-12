package com.globex.destination.provider;

import com.globex.destination.repository.DestinationRepository;
import org.springframework.stereotype.Component;

/**
 * Phase 3 implementation of DestinationDataProvider.
 * Data is sourced from Flyway V3 migration seed (DEV) or future import pipeline.
 * The service layer reads from PostgreSQL via DestinationService — this class
 * only signals data availability and provides a provider identity.
 *
 * To swap providers in Phase 4: implement DestinationDataProvider and register
 * as @Primary or use @ConditionalOnProperty to choose at startup.
 */
@Component
public class DatabaseDestinationDataProvider implements DestinationDataProvider {

    private final DestinationRepository destinationRepository;

    public DatabaseDestinationDataProvider(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    public String getProviderName() {
        return "database-seed";
    }

    @Override
    public boolean isAvailable() {
        try {
            destinationRepository.count();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

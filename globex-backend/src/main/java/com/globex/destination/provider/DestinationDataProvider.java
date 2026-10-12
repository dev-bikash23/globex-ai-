package com.globex.destination.provider;

/**
 * Abstraction boundary for destination data sources.
 *
 * Architecture:
 *   Controller → DestinationService → PostgreSQL (data always served from DB)
 *   DestinationDataProvider populates / syncs the DB from an external source.
 *
 * Phase 3: DatabaseDestinationDataProvider — reads Flyway-seeded dev data.
 * Phase 4+: ExternalDestinationDataProvider — syncs from REST Countries API,
 *            GeoNames, or other geographic datasets.
 *
 * The service layer is completely provider-agnostic.
 */
public interface DestinationDataProvider {

    /** Descriptive name for this provider (e.g., "database-seed", "rest-countries") */
    String getProviderName();

    /** Returns true if the provider's data source is reachable */
    boolean isAvailable();
}

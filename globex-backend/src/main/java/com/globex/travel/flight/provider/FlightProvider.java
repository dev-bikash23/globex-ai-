package com.globex.travel.flight.provider;

import com.globex.travel.domain.FlightOffer;
import com.globex.travel.flight.dto.FlightSearchRequest;

import java.util.List;

/**
 * Provider-agnostic interface for flight search.
 *
 * Architecture:
 *   FlightService
 *        ↓
 *   FlightProvider
 *        ↓
 *   DuffelFlightProvider  (or AmadeusFlightProvider, SabreFlightProvider, etc.)
 *
 * Every new provider must:
 *  1. Implement this interface
 *  2. Normalize its raw response to List<FlightOffer>
 *  3. Be registered as a Spring @Component with @Qualifier
 *
 * FlightService does NOT know which provider is active — it only calls this interface.
 * Provider selection is done via configuration, not hard-coding.
 */
public interface FlightProvider {

    /**
     * Search for available flight offers.
     *
     * @param request validated search parameters
     * @return normalized list of flight offers (may be empty, never null)
     * @throws com.globex.shared.exception.ProviderUnavailableException if provider fails
     */
    List<FlightOffer> searchFlights(FlightSearchRequest request);

    /** Human-readable provider name for logging and response metadata. */
    String providerName();

    /** Whether this provider returns test/sandbox data (not live GDS). */
    boolean isTestMode();
}

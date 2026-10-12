package com.globex.travel.hotel.provider;

import com.globex.travel.domain.HotelOffer;
import com.globex.travel.hotel.dto.HotelSearchRequest;

import java.util.List;

/**
 * Provider-agnostic interface for hotel search.
 *
 * Architecture:
 *   HotelService
 *        ↓
 *   HotelProvider
 *        ↓
 *   MockHotelProvider (demo) / DuffelStaysProvider / BookingProvider / etc.
 */
public interface HotelProvider {

    /**
     * Search for available hotel offers.
     *
     * @param request validated search parameters
     * @return normalized list of hotel offers (may be empty, never null)
     */
    List<HotelOffer> searchHotels(HotelSearchRequest request);

    /** Human-readable provider name. */
    String providerName();

    /** True if this returns demo/sample data rather than live inventory. */
    boolean isTestMode();
}

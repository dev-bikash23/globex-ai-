package com.globex.travel.flight.service;

import com.globex.search.domain.TravelSearch;
import com.globex.search.repository.TravelSearchRepository;
import com.globex.travel.domain.FlightOffer;
import com.globex.travel.flight.dto.FlightSearchRequest;
import com.globex.travel.flight.dto.FlightSearchResponse;
import com.globex.travel.flight.provider.FlightProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Orchestrates flight search:
 *  1. Call FlightProvider to get raw normalized offers
 *  2. Apply server-side sorting and filtering
 *  3. Build FlightSearchResponse with filter metadata
 *  4. Save search history for authenticated users
 *
 * FlightService does NOT know about Duffel, Amadeus, or any specific provider.
 * It only communicates through the FlightProvider interface.
 */
@Service
public class FlightService {

    private static final Logger log = LoggerFactory.getLogger(FlightService.class);

    private static final String TEST_DATA_NOTICE =
        "These flight results are from Duffel's test sandbox (Duffel Airways) and do NOT " +
        "represent real airline schedules, fares, or live inventory.";

    private final FlightProvider flightProvider;
    private final TravelSearchRepository searchRepository;

    public FlightService(FlightProvider flightProvider, TravelSearchRepository searchRepository) {
        this.flightProvider = flightProvider;
        this.searchRepository = searchRepository;
    }

    /**
     * Search for flights and return a sorted, filtered response.
     *
     * @param request  validated search parameters
     * @param userId   authenticated user ID, or null for anonymous
     */
    public FlightSearchResponse searchFlights(FlightSearchRequest request, String userId) {
        log.info("[FlightService] Search: {}->{} {} adults, cabin={}, sort={}",
            request.origin(), request.destination(), request.adults(),
            request.cabinClass(), request.sortBy());

        // 1. Call provider
        List<FlightOffer> offers = flightProvider.searchFlights(request);

        // 2. Apply filters
        if (request.maxPrice() != null) {
            offers = offers.stream()
                .filter(o -> o.totalPrice().amount().doubleValue() <= request.maxPrice())
                .collect(Collectors.toList());
        }

        // 3. Sort results
        offers = sortOffers(offers, request.normalizedSortBy());

        // 4. Build filter metadata from the raw (un-filtered by price) offers
        FlightSearchResponse.FlightSearchFilters filters = buildFilters(offers, request.normalizedCurrency());

        // 5. Save search history for authenticated users (fire-and-forget)
        String searchId = UUID.randomUUID().toString();
        if (userId != null) {
            saveSearchHistory(searchId, userId, request, offers.size());
        }

        // 6. Build response
        boolean isTest = flightProvider.isTestMode();
        return new FlightSearchResponse(
            searchId,
            flightProvider.providerName(),
            isTest,
            isTest ? TEST_DATA_NOTICE : null,
            offers.size(),
            request.normalizedSortBy(),
            offers,
            Instant.now(),
            filters
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────────────────────

    private List<FlightOffer> sortOffers(List<FlightOffer> offers, String sortBy) {
        if (offers.isEmpty()) return offers;

        return switch (sortBy) {
            case "FASTEST" -> offers.stream()
                .sorted(Comparator.comparingInt(FlightOffer::totalDurationMinutes))
                .collect(Collectors.toList());

            case "EARLIEST" -> offers.stream()
                .sorted(Comparator.comparing(o -> {
                    if (o.outboundSegments() == null || o.outboundSegments().isEmpty()) return "";
                    String dep = o.outboundSegments().get(0).departureTime();
                    return dep != null ? dep : "";
                }))
                .collect(Collectors.toList());

            case "BEST" -> {
                double minPrice = offers.stream().mapToDouble(o -> o.totalPrice().amount().doubleValue()).min().orElse(0);
                double maxPrice = offers.stream().mapToDouble(o -> o.totalPrice().amount().doubleValue()).max().orElse(1);
                int minDur = offers.stream().mapToInt(FlightOffer::totalDurationMinutes).min().orElse(0);
                int maxDur = offers.stream().mapToInt(FlightOffer::totalDurationMinutes).max().orElse(1);
                final double fMinPrice = minPrice, fMaxPrice = maxPrice;
                final int fMinDur = minDur, fMaxDur = maxDur;
                yield offers.stream()
                    .sorted(Comparator.comparingDouble(o -> o.bestScore(fMinPrice, fMaxPrice, fMinDur, fMaxDur)))
                    .collect(Collectors.toList());
            }

            default -> // CHEAPEST
                offers.stream()
                    .sorted(Comparator.comparingDouble(o -> o.totalPrice().amount().doubleValue()))
                    .collect(Collectors.toList());
        };
    }

    private FlightSearchResponse.FlightSearchFilters buildFilters(List<FlightOffer> offers, String currency) {
        if (offers.isEmpty()) {
            return new FlightSearchResponse.FlightSearchFilters(
                0, 0, currency, 0, 0,
                Collections.emptyList(), Collections.emptyList(), Collections.emptyList()
            );
        }

        double minPrice = offers.stream().mapToDouble(o -> o.totalPrice().amount().doubleValue()).min().orElse(0);
        double maxPrice = offers.stream().mapToDouble(o -> o.totalPrice().amount().doubleValue()).max().orElse(0);
        int minDur = offers.stream().mapToInt(FlightOffer::totalDurationMinutes).min().orElse(0);
        int maxDur = offers.stream().mapToInt(FlightOffer::totalDurationMinutes).max().orElse(0);

        List<String> airlines = offers.stream()
            .map(FlightOffer::airline)
            .filter(Objects::nonNull)
            .distinct().sorted().collect(Collectors.toList());

        List<Integer> stopCounts = offers.stream()
            .mapToInt(FlightOffer::stops)
            .distinct().sorted().boxed().collect(Collectors.toList());

        List<String> cabinClasses = offers.stream()
            .map(FlightOffer::cabinClass)
            .filter(Objects::nonNull)
            .distinct().sorted().collect(Collectors.toList());

        // Use actual offer currency (Duffel returns in GBP by default)
        String priceCurrency = offers.get(0).totalPrice().currency();

        return new FlightSearchResponse.FlightSearchFilters(
            minPrice, maxPrice, priceCurrency, minDur, maxDur,
            airlines, stopCounts, cabinClasses
        );
    }

    private void saveSearchHistory(String searchId, String userId,
                                   FlightSearchRequest request, int resultCount) {
        try {
            TravelSearch search = new TravelSearch();
            search.setUserId(userId);
            search.setSearchType("FLIGHT");
            search.setOrigin(request.origin().toUpperCase());
            search.setDestination(request.destination().toUpperCase());
            search.setResultCount(resultCount);
            search.setProvider(flightProvider.providerName());
            search.setSearchParams(buildFlightParams(request));
            searchRepository.save(search);
        } catch (Exception e) {
            log.warn("[FlightService] Failed to save search history: {}", e.getMessage());
            // Non-critical — don't fail the search response
        }
    }

    private Map<String, Object> buildFlightParams(FlightSearchRequest request) {
        Map<String, Object> params = new LinkedHashMap<>();
        params.put("origin", request.origin());
        params.put("destination", request.destination());
        params.put("departureDate", request.departureDate().toString());
        if (request.returnDate() != null) params.put("returnDate", request.returnDate().toString());
        params.put("adults", request.adults());
        if (request.children() > 0) params.put("children", request.children());
        if (request.infants() > 0) params.put("infants", request.infants());
        params.put("cabinClass", request.cabinClass());
        params.put("currency", request.normalizedCurrency());
        params.put("roundTrip", request.isRoundTrip());
        return params;
    }
}

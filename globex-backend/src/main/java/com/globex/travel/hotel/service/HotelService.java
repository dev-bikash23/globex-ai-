package com.globex.travel.hotel.service;

import com.globex.search.domain.TravelSearch;
import com.globex.search.repository.TravelSearchRepository;
import com.globex.travel.domain.HotelOffer;
import com.globex.travel.hotel.dto.HotelSearchRequest;
import com.globex.travel.hotel.dto.HotelSearchResponse;
import com.globex.travel.hotel.provider.HotelProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private static final Logger log = LoggerFactory.getLogger(HotelService.class);

    private static final String DEMO_NOTICE =
        "DEMO DATA — Hotel availability, prices, and details shown are for demonstration purposes only " +
        "and do not represent real inventory. Real hotel booking is not available in this version.";

    private final HotelProvider hotelProvider;
    private final TravelSearchRepository searchRepository;

    public HotelService(HotelProvider hotelProvider, TravelSearchRepository searchRepository) {
        this.hotelProvider = hotelProvider;
        this.searchRepository = searchRepository;
    }

    public HotelSearchResponse searchHotels(HotelSearchRequest request, String userId) {
        log.info("[HotelService] Search: {} {}->{}, {} adults, {} rooms",
            request.destination(), request.checkIn(), request.checkOut(),
            request.adults(), request.rooms());

        List<HotelOffer> hotels = hotelProvider.searchHotels(request);

        // Sort
        hotels = sortHotels(hotels, request.normalizedSortBy());

        // Filter metadata
        HotelSearchResponse.HotelSearchFilters filters = buildFilters(hotels, request.normalizedCurrency());

        String searchId = UUID.randomUUID().toString();
        if (userId != null) {
            saveSearchHistory(searchId, userId, request, hotels.size());
        }

        boolean isTest = hotelProvider.isTestMode();
        return new HotelSearchResponse(
            searchId,
            hotelProvider.providerName(),
            isTest,
            isTest ? DEMO_NOTICE : null,
            hotels.size(),
            request.normalizedSortBy(),
            hotels,
            Instant.now(),
            filters
        );
    }

    private List<HotelOffer> sortHotels(List<HotelOffer> hotels, String sortBy) {
        return switch (sortBy) {
            case "PRICE_ASC" -> hotels.stream()
                .sorted(Comparator.comparingDouble(h -> h.pricePerNight().amount().doubleValue()))
                .collect(Collectors.toList());
            case "PRICE_DESC" -> hotels.stream()
                .sorted(Comparator.comparingDouble((HotelOffer h) -> h.pricePerNight().amount().doubleValue()).reversed())
                .collect(Collectors.toList());
            case "RATING" -> hotels.stream()
                .sorted(Comparator.comparingDouble((HotelOffer h) ->
                    h.guestRating() != null ? h.guestRating() : 0.0).reversed())
                .collect(Collectors.toList());
            default -> // RECOMMENDED — stars desc then rating desc
                hotels.stream()
                    .sorted(Comparator.comparingInt(HotelOffer::stars).reversed()
                        .thenComparingDouble(h -> h.guestRating() != null ? -h.guestRating() : 0))
                    .collect(Collectors.toList());
        };
    }

    private HotelSearchResponse.HotelSearchFilters buildFilters(List<HotelOffer> hotels, String currency) {
        if (hotels.isEmpty()) {
            return new HotelSearchResponse.HotelSearchFilters(0,0,currency,0,5,
                Collections.emptyList(), false, false);
        }
        double minPrice = hotels.stream()
            .mapToDouble(h -> h.pricePerNight().amount().doubleValue()).min().orElse(0);
        double maxPrice = hotels.stream()
            .mapToDouble(h -> h.pricePerNight().amount().doubleValue()).max().orElse(0);
        int minStars = hotels.stream().mapToInt(HotelOffer::stars).min().orElse(0);
        int maxStars = hotels.stream().mapToInt(HotelOffer::stars).max().orElse(5);

        List<String> amenities = hotels.stream()
            .flatMap(h -> h.amenities().stream())
            .distinct().sorted().collect(Collectors.toList());
        boolean hasBreakfast = hotels.stream().anyMatch(HotelOffer::breakfastIncluded);
        boolean hasFreeCancellation = hotels.stream().anyMatch(HotelOffer::freeCancellation);

        String priceCurrency = hotels.get(0).pricePerNight().currency();
        return new HotelSearchResponse.HotelSearchFilters(
            minPrice, maxPrice, priceCurrency, minStars, maxStars,
            amenities, hasBreakfast, hasFreeCancellation
        );
    }

    private void saveSearchHistory(String searchId, String userId,
                                   HotelSearchRequest request, int resultCount) {
        try {
            TravelSearch search = new TravelSearch();
            search.setUserId(userId);
            search.setSearchType("HOTEL");
            search.setDestination(request.destination());
            search.setResultCount(resultCount);
            search.setProvider(hotelProvider.providerName());
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("destination", request.destination());
            params.put("checkIn", request.checkIn().toString());
            params.put("checkOut", request.checkOut().toString());
            params.put("adults", request.adults());
            params.put("rooms", request.rooms());
            params.put("nights", request.nights());
            search.setSearchParams(params);
            searchRepository.save(search);
        } catch (Exception e) {
            log.warn("[HotelService] Failed to save search history: {}", e.getMessage());
        }
    }
}

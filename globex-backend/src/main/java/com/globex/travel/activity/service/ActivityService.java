package com.globex.travel.activity.service;

import com.globex.search.domain.TravelSearch;
import com.globex.search.repository.TravelSearchRepository;
import com.globex.travel.domain.ActivityOffer;
import com.globex.travel.activity.dto.ActivitySearchRequest;
import com.globex.travel.activity.dto.ActivitySearchResponse;
import com.globex.travel.activity.provider.ActivityProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private static final String DEMO_NOTICE =
        "DEMO DATA — Activities shown are for demonstration purposes only and do not represent " +
        "real tour availability or pricing. Real booking is not available in this version.";

    private final ActivityProvider activityProvider;
    private final TravelSearchRepository searchRepository;

    public ActivityService(ActivityProvider activityProvider, TravelSearchRepository searchRepository) {
        this.activityProvider = activityProvider;
        this.searchRepository = searchRepository;
    }

    public ActivitySearchResponse searchActivities(ActivitySearchRequest request, String userId) {
        log.info("[ActivityService] Search: {}, category={}", request.destination(), request.category());

        List<ActivityOffer> activities = activityProvider.searchActivities(request);

        activities = sortActivities(activities, request.normalizedSortBy());

        String searchId = UUID.randomUUID().toString();
        if (userId != null) {
            saveSearchHistory(searchId, userId, request, activities.size());
        }

        boolean isTest = activityProvider.isTestMode();
        return new ActivitySearchResponse(
            searchId, activityProvider.providerName(),
            isTest, isTest ? DEMO_NOTICE : null,
            activities.size(), request.normalizedSortBy(),
            activities, Instant.now()
        );
    }

    private List<ActivityOffer> sortActivities(List<ActivityOffer> activities, String sortBy) {
        return switch (sortBy) {
            case "PRICE_ASC" -> activities.stream()
                .sorted(Comparator.comparingDouble(a -> a.pricePerPerson().amount().doubleValue()))
                .collect(Collectors.toList());
            case "DURATION" -> activities.stream()
                .sorted(Comparator.comparingInt(ActivityOffer::durationMinutes))
                .collect(Collectors.toList());
            default -> // RATING
                activities.stream()
                    .sorted(Comparator.comparingDouble(
                        (ActivityOffer a) -> a.rating() != null ? a.rating() : 0.0).reversed())
                    .collect(Collectors.toList());
        };
    }

    private void saveSearchHistory(String searchId, String userId,
                                   ActivitySearchRequest request, int resultCount) {
        try {
            TravelSearch search = new TravelSearch();
            search.setUserId(userId);
            search.setSearchType("ACTIVITY");
            search.setDestination(request.destination());
            search.setResultCount(resultCount);
            search.setProvider(activityProvider.providerName());
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("destination", request.destination());
            params.put("category", request.category());
            params.put("participants", request.participants());
            params.put("lat", request.latitude());
            params.put("lng", request.longitude());
            search.setSearchParams(params);
            searchRepository.save(search);
        } catch (Exception e) {
            log.warn("[ActivityService] Failed to save search history: {}", e.getMessage());
        }
    }
}

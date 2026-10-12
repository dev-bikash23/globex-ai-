package com.globex.search.controller;

import com.globex.search.domain.TravelSearch;
import com.globex.search.repository.TravelSearchRepository;
import com.globex.shared.response.ApiResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Search history management for authenticated users.
 *
 * GET    /api/v1/users/me/search-history   — get recent searches (auth required)
 * DELETE /api/v1/users/me/search-history   — clear all search history (auth required)
 *
 * Security: userId is extracted from JWT, NEVER from request body.
 * Users can only access their own search history.
 */
@RestController
@RequestMapping("/api/v1/users/me/search-history")
public class SearchHistoryController {

    private final TravelSearchRepository searchRepository;

    public SearchHistoryController(TravelSearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TravelSearch>>> getSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "20") int limit) {

        String userId = userDetails.getUsername();
        List<TravelSearch> history = searchRepository
            .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, Math.min(limit, 100)));

        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> clearSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        long countBefore = searchRepository.countByUserId(userId);
        searchRepository.deleteAllByUserId(userId);

        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "deleted", countBefore,
            "message", "Search history cleared successfully"
        )));
    }
}

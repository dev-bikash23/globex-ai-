package com.globex.travel.activity.controller;

import com.globex.shared.response.ApiResponse;
import com.globex.travel.activity.dto.ActivitySearchRequest;
import com.globex.travel.activity.dto.ActivitySearchResponse;
import com.globex.travel.activity.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    /**
     * POST /api/v1/activities/search
     * Public endpoint. JWT optional for history.
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<ActivitySearchResponse>> searchActivities(
            @Valid @RequestBody ActivitySearchRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails != null ? userDetails.getUsername() : null;
        ActivitySearchResponse response = activityService.searchActivities(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

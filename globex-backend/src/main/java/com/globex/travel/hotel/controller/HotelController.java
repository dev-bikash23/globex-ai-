package com.globex.travel.hotel.controller;

import com.globex.shared.response.ApiResponse;
import com.globex.travel.hotel.dto.HotelSearchRequest;
import com.globex.travel.hotel.dto.HotelSearchResponse;
import com.globex.travel.hotel.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    /**
     * POST /api/v1/hotels/search
     * Public endpoint — no JWT required. JWT optional for history.
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<HotelSearchResponse>> searchHotels(
            @Valid @RequestBody HotelSearchRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails != null ? userDetails.getUsername() : null;
        HotelSearchResponse response = hotelService.searchHotels(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

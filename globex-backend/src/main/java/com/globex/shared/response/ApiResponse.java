package com.globex.shared.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.UUID;

/**
 * Standard API response wrapper for ALL GlobeX endpoints.
 * Every endpoint returns this — never raw entities or DTOs directly.
 *
 * Success: { "success": true, "data": {...}, "message": "OK", "timestamp": "...", "requestId": "..." }
 * Error:   { "success": false, "error": {"code": "...", "message": "..."}, "timestamp": "..." }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final T data;
    private final String message;
    private final ApiError error;
    private final Instant timestamp;
    private final String requestId;

    private ApiResponse(boolean success, T data, String message, ApiError error) {
        this.success   = success;
        this.data      = data;
        this.message   = message;
        this.error     = error;
        this.timestamp = Instant.now();
        this.requestId = UUID.randomUUID().toString();
    }

    // ── Static factory methods ────────────────────────────────────────────────

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "OK", null);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, null, message, null);
    }

    public static <T> ApiResponse<T> error(ApiError error) {
        return new ApiResponse<>(false, null, null, error);
    }

    // ── Getters ───────────────────────────────────────────────────────────────
    public boolean isSuccess()      { return success; }
    public T getData()              { return data; }
    public String getMessage()      { return message; }
    public ApiError getError()      { return error; }
    public Instant getTimestamp()   { return timestamp; }
    public String getRequestId()    { return requestId; }
}

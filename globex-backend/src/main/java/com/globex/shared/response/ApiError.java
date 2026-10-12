package com.globex.shared.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/** Error detail embedded inside a failed ApiResponse */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private final String code;
    private final String message;
    private final List<String> details;

    private ApiError(String code, String message, List<String> details) {
        this.code = code;
        this.message = message;
        this.details = details;
    }

    public String getCode()          { return code; }
    public String getMessage()       { return message; }
    public List<String> getDetails() { return details; }

    public static ApiError of(String code, String message) {
        return new ApiError(code, message, null);
    }

    public static ApiError of(String code, String message, List<String> details) {
        return new ApiError(code, message, details);
    }

    // ── Standard error codes ──────────────────────────────────────────────────
    public static final String VALIDATION_FAILED        = "VALIDATION_FAILED";
    public static final String NOT_FOUND                = "NOT_FOUND";
    public static final String UNAUTHORIZED             = "UNAUTHORIZED";
    public static final String FORBIDDEN                = "FORBIDDEN";
    public static final String CONFLICT                 = "CONFLICT";
    public static final String INTERNAL_ERROR           = "INTERNAL_SERVER_ERROR";
    public static final String RATE_LIMIT_EXCEEDED      = "RATE_LIMIT_EXCEEDED";
    public static final String EXTERNAL_API_ERROR       = "EXTERNAL_API_UNAVAILABLE";

    // Auth-specific codes
    public static final String AUTH_INVALID_CREDENTIALS  = "AUTH_INVALID_CREDENTIALS";
    public static final String AUTH_EMAIL_NOT_VERIFIED   = "AUTH_EMAIL_NOT_VERIFIED";
    public static final String AUTH_ACCOUNT_LOCKED       = "AUTH_ACCOUNT_LOCKED";
    public static final String AUTH_TOKEN_EXPIRED        = "AUTH_TOKEN_EXPIRED";
    public static final String AUTH_TOKEN_INVALID        = "AUTH_TOKEN_INVALID";
    public static final String AUTH_EMAIL_ALREADY_EXISTS = "AUTH_EMAIL_ALREADY_EXISTS";
}

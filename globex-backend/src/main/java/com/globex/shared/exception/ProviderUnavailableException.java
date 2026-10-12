package com.globex.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when an external travel provider (Duffel, Amadeus, etc.) is unavailable
 * or returns an unrecoverable error. Triggers HTTP 503 Service Unavailable.
 *
 * Never expose internal provider error codes to the user.
 * Log the technical details; return a friendly message via GlobalExceptionHandler.
 */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class ProviderUnavailableException extends RuntimeException {

    private final String provider;
    private final int statusCode;

    public ProviderUnavailableException(String provider, String message) {
        super(message);
        this.provider = provider;
        this.statusCode = 503;
    }

    public ProviderUnavailableException(String provider, int statusCode, String message) {
        super(message);
        this.provider = provider;
        this.statusCode = statusCode;
    }

    public ProviderUnavailableException(String provider, String message, Throwable cause) {
        super(message, cause);
        this.provider = provider;
        this.statusCode = 503;
    }

    public String getProvider() { return provider; }
    public int getStatusCode() { return statusCode; }
}

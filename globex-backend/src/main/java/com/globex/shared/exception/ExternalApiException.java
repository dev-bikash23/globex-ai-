package com.globex.shared.exception;

/** Thrown when an external API provider fails → HTTP 503 */
public class ExternalApiException extends RuntimeException {

    private final String provider;

    public ExternalApiException(String provider, String message) {
        super(message);
        this.provider = provider;
    }

    public ExternalApiException(String provider, String message, Throwable cause) {
        super(message, cause);
        this.provider = provider;
    }

    public String getProvider() { return provider; }
}

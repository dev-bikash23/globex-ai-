package com.globex.shared.exception;

/**
 * Thrown when a user exceeds the allowed rate limit for an operation.
 * GlobalExceptionHandler converts this to HTTP 429.
 *
 * Examples:
 * - More than 5 login attempts in 15 minutes
 * - Too many AI plan requests per hour
 */
public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException(String message) {
        super(message);
    }

    public static RateLimitExceededException loginThrottled() {
        return new RateLimitExceededException(
                "Too many login attempts. Please wait 15 minutes before trying again.");
    }
}

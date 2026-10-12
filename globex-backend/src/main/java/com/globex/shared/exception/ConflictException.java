package com.globex.shared.exception;

import com.globex.shared.response.ApiError;

/** Thrown on business rule conflicts (duplicate email, etc.) → HTTP 409 */
public class ConflictException extends RuntimeException {

    private final String errorCode;

    public ConflictException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }

    public static ConflictException emailExists() {
        return new ConflictException(ApiError.AUTH_EMAIL_ALREADY_EXISTS,
                "An account with this email address already exists");
    }
}

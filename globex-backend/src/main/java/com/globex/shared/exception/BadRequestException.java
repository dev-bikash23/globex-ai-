package com.globex.shared.exception;

/** Thrown for invalid business operations → HTTP 400 */
public class BadRequestException extends RuntimeException {

    private final String errorCode;

    public BadRequestException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }
}

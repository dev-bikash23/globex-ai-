package com.globex.trip.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTripStatusTransitionException extends RuntimeException {
    public InvalidTripStatusTransitionException(String from, String to) {
        super("Cannot transition trip status from " + from + " to " + to);
    }
}

package com.globex.shared.exception;

import com.globex.shared.response.ApiError;
import com.globex.shared.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Global Exception Handler â€” converts all exceptions to consistent ApiResponse errors.
 * Every controller exception passes through here â€” centralised error handling.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found: {} â€” path: {}", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ApiError.of(ApiError.NOT_FOUND, ex.getMessage())));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<?>> handleConflict(
            ConflictException ex, HttpServletRequest request) {
        log.warn("Conflict: {} â€” path: {}", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ApiError.of(ex.getErrorCode(), ex.getMessage())));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(
            BadRequestException ex, HttpServletRequest request) {
        log.warn("Bad request: {} â€” path: {}", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ex.getErrorCode(), ex.getMessage())));
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiResponse<?>> handleRateLimit(
            RateLimitExceededException ex, HttpServletRequest request) {
        log.warn("Rate limit exceeded for path: {}", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(ApiError.of(ApiError.RATE_LIMIT_EXCEEDED, ex.getMessage())));
    }

    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ApiResponse<?>> handleExternalApi(
            ExternalApiException ex, HttpServletRequest request) {
        log.warn("External API failure [{}]: {} â€” path: {}",
                ex.getProvider(), ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(ApiError.of(ApiError.EXTERNAL_API_ERROR,
                        "Service temporarily unavailable. Please try again later.")));
    }

    @ExceptionHandler(ProviderUnavailableException.class)
    public ResponseEntity<ApiResponse<?>> handleProviderUnavailable(
            ProviderUnavailableException ex, HttpServletRequest request) {
        log.warn("Travel provider [{}] unavailable: {} â€” path: {}",
                ex.getProvider(), ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(ApiError.of("PROVIDER_UNAVAILABLE", ex.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .sorted().collect(Collectors.toList());
        log.debug("Validation failed: {} â€” path: {}", details, request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ApiError.VALIDATION_FAILED,
                        "Request validation failed", details)));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<?>> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest request) {
        List<String> details = ex.getConstraintViolations().stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage())
                .sorted().collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ApiError.VALIDATION_FAILED,
                        "Request validation failed", details)));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<?>> handleMalformedJson(HttpServletRequest request) {
        log.warn("Malformed request body at path: {}", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ApiError.VALIDATION_FAILED,
                        "Request body is malformed or missing")));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<?>> handleMissingParam(
            MissingServletRequestParameterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ApiError.VALIDATION_FAILED,
                        "Missing required parameter: " + ex.getParameterName())));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<?>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ApiError.VALIDATION_FAILED,
                        "Invalid value for parameter: " + ex.getName())));
    }

    @ExceptionHandler({AuthenticationException.class, BadCredentialsException.class})
    public ResponseEntity<ApiResponse<?>> handleAuthentication(HttpServletRequest request) {
        log.warn("Authentication failed at path: {}", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ApiError.of(ApiError.UNAUTHORIZED, "Authentication required")));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(HttpServletRequest request) {
        log.warn("Access denied to path: {}", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(ApiError.of(ApiError.FORBIDDEN,
                        "You do not have permission to perform this action")));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNoHandler(HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ApiError.of(ApiError.NOT_FOUND,
                        "Endpoint not found: " + request.getMethod() + " " + request.getRequestURI())));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<?>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ApiResponse.error(ApiError.of("METHOD_NOT_ALLOWED",
                        "HTTP method " + ex.getMethod() + " is not supported for this endpoint")));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<?>> handleBindException(BindException ex) {
        List<String> details = ex.getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ApiError.of(ApiError.VALIDATION_FAILED,
                        "Request binding failed", details)));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleUnexpected(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error at path: {} â€” {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ApiError.of(ApiError.INTERNAL_ERROR,
                        "An unexpected error occurred. Please try again later.")));
    }

    // ── Phase 6: Trip ownership ──────────────────────────────────────────────
    @ExceptionHandler(com.globex.trip.exception.TripOwnershipException.class)
    public ResponseEntity<ApiResponse<Void>> handleTripOwnership(
            com.globex.trip.exception.TripOwnershipException ex,
            HttpServletRequest request) {
        log.warn("Trip ownership violation at {}: {}", request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error(ApiError.of("TRIP_ACCESS_DENIED", "You do not have access to this trip")));
    }

    @ExceptionHandler(com.globex.trip.exception.InvalidTripStatusTransitionException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidTripStatus(
            com.globex.trip.exception.InvalidTripStatusTransitionException ex,
            HttpServletRequest request) {
        log.warn("Invalid trip status transition at {}: {}", request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ApiError.of("INVALID_TRIP_STATUS_TRANSITION", ex.getMessage())));
    }
}


package com.globex.trip.domain;

public enum TripStatus {
    /** User is actively planning — no confirmation yet */
    PLANNING,
    /** User has marked it as confirmed (manually) */
    CONFIRMED,
    /** Trip is currently happening (start_date <= today <= end_date) */
    IN_PROGRESS,
    /** Trip ended */
    COMPLETED,
    /** Trip was cancelled by the user */
    CANCELLED,
    /** Soft-deleted — hidden from default views */
    ARCHIVED
}

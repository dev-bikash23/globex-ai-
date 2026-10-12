package com.globex.travel.domain;

/**
 * A single flight leg (one segment of a slice).
 * In Duffel API: a slice can have multiple segments (e.g. with a stop).
 */
public record FlightSegment(
    String departureAirport,          // IATA code (e.g. "LHR")
    String departureAirportName,      // Full name (e.g. "London Heathrow Airport")
    String departureCity,             // City name
    String arrivalAirport,            // IATA code (e.g. "JFK")
    String arrivalAirportName,        // Full name
    String arrivalCity,               // City name
    String departureTime,             // ISO 8601 local time from provider
    String arrivalTime,               // ISO 8601 local time from provider
    int durationMinutes,
    String airline,                   // Operating carrier name
    String airlineCode,               // 2-letter IATA airline code
    String flightNumber,              // e.g. "ZZ1234"
    String aircraft                   // Aircraft type/name if available
) {}

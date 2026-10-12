package com.globex.travel.domain;

/**
 * Location/airport suggestion for autocomplete.
 * Used by GET /api/v1/locations/search?q=
 */
public record LocationSuggestion(
    String iataCode,          // e.g. "DEL", "BOM", "LHR"
    String name,              // e.g. "Indira Gandhi International Airport"
    String cityName,          // e.g. "Delhi"
    String countryCode,       // e.g. "IN"
    String countryName,       // e.g. "India"
    String type               // "AIRPORT" or "CITY"
) {}

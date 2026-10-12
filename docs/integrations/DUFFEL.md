# Duffel Flight Integration

## Overview
GlobeX AI uses the [Duffel API](https://duffel.com/docs/api) for real-time flight search.
In the current configuration the app uses **Duffel sandbox/test environment**.

> All flight results from a test token carry `isTestData=true`. The UI displays a 'Sandbox' badge on every result.

## Architecture

FlightController -> FlightService -> DuffelFlightProvider -> DuffelClient

Key files:
- DuffelClient.java         — Low-level HTTP wrapper (Duffel API v2)
- DuffelFlightProvider.java — Translates Duffel JSON to FlightOffer domain objects
- FlightProvider.java       — Interface (swap providers without touching service)
- FlightService.java        — Sorting, filtering, search history persistence
- FlightController.java     — POST /api/v1/flights/search REST endpoint

## Configuration (application-dev.yml)
globex:
  duffel:
    token: duffel_test_xxxx
    base-url: https://api.duffel.com
    timeout-seconds: 45

## Endpoint: POST /api/v1/flights/search
Public (auth optional — if authenticated, search stored in history).

Request: { origin, destination, departureDate, returnDate, adults, children, infants, cabinClass, currency, sortBy }
Sort options: CHEAPEST | FASTEST | BEST | EARLIEST
Cabin classes: ECONOMY | PREMIUM_ECONOMY | BUSINESS | FIRST

## Duffel 2-Step Flow
1. POST /air/offer_requests  -> offerRequestId
2. GET  /air/offers?offer_request_id={id}&max_connections=2 -> up to 50 offers

## Upgrading to Production
1. Replace duffel_test_ token with live token from https://app.duffel.com
2. Set env var GLOBEX_DUFFEL_TOKEN in production
3. isTestData is auto-set based on token prefix (duffel_test_ = true)
4. Implement booking: POST /air/orders (Phase 6 scope)

## Error Handling
- API timeout     -> ProviderUnavailableException -> HTTP 503
- Invalid airport -> HTTP 400
- All errors logged at WARN via GlobalExceptionHandler

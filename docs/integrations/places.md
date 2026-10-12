# Places & Attractions Integration (Overpass API / OpenStreetMap)

## Overview
GlobeX AI integrates nearby points of interest, tourist attractions, museums, parks, and historic sites using the **Overpass API** (OpenStreetMap data engine).

## Technical Specs
- **Provider**: Overpass (`OverpassPlacesProvider`)
- **Data Source**: OpenStreetMap (ODbL License)
- **API Key**: Not required
- **Cache TTL**: 24 hours (`places` cache)

## Resiliency Architecture
- **Multi-Mirror Failover**: Requests rotate through 3 independent public Overpass instances (`overpass-api.de`, `overpass.kumi.systems`, `maps.mail.ru`).
- **Strict Per-Mirror Timeout**: Uses `java.net.http.HttpClient` with an 8-second hard timeout per mirror to fail fast on overloaded mirrors.
- **Robust JSON Parsing**: `@JsonIgnoreProperties(ignoreUnknown = true)` configured to safely handle variable metadata tags (`osm3s`, `generator`, etc.).
- **Graceful Fallback**: Returns an empty list (`[]`) rather than crashing or throwing errors when all external OSM servers time out.

## Endpoints Implemented
- `GET /api/v1/destinations/{id}/places?category={CAT}&radius={R}&limit={L}` (Public endpoint)
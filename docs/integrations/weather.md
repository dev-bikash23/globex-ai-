# Weather Integration (Open-Meteo API)

## Overview
GlobeX AI integrates real-time weather and hourly/daily forecasts for travel destinations using the **Open-Meteo API**.

## Technical Specs
- **Provider**: Open-Meteo (`OpenMeteoWeatherProvider`)
- **License**: CC BY 4.0 (Free non-commercial & commercial use)
- **API Key**: Not required
- **Base URL**: `https://api.open-meteo.com/v1`
- **Cache TTL**:
  - Current Weather: 10 minutes (`weather` cache)
  - Forecast: 30 minutes

## Endpoints Implemented
- `GET /api/v1/destinations/{id}/weather` (Public endpoint)

## Error Handling & Resiliency
- Fallback mock data returned gracefully if Open-Meteo API is unreachable or times out (5s connect / 10s read).
- WMO Weather Interpretation Codes mapped to human-readable condition descriptions and icons.
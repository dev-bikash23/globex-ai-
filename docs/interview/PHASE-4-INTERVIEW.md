# GlobeX AI — Phase 4 Interview Preparation Guide (20 Questions & Answers)

This guide covers 20 technical interview questions and answers explaining the architecture, design choices, resiliency patterns, and external data integration layer implemented in Phase 4 of GlobeX AI.

---

### Q1: What was the primary goal of Phase 4 in GlobeX AI?
**Answer:** The goal was to convert the destination explorer from using static/mock local data into a real-time external travel data platform by integrating live APIs for weather, exchange rates, timezone/local time, tourist attractions, and Unsplash photographs.

### Q2: How is the external integration layer decoupled from core business logic?
**Answer:** We implemented the Strategy Pattern using Java interfaces (`WeatherProvider`, `CurrencyProvider`, `PlacesProvider`, `ImageProvider`). Domain services interact solely with these interfaces, allowing external providers (e.g. Open-Meteo, Frankfurter, Unsplash) to be swapped or mocked without touching business logic or controllers.

### Q3: Why is Lombok banned in this project?
**Answer:** The project runs on modern Java (Java 24 LTS target). Lombok is incompatible with Java 24 internal compiler changes (`TypeTag`). Instead, we use native Java `record` types for DTOs and explicit getters/setters/constructors for JPA entities.

### Q4: How are HTTP client timeouts handled for external providers?
**Answer:** We configure a centralized `RestClient.Builder` bean with `SimpleClientHttpRequestFactory` setting explicit connect timeouts (5s) and read timeouts (8s–15s). For multi-mirror services like Overpass, we use `java.net.http.HttpClient` with hard per-request deadlines to prevent external latency from stalling application threads.

### Q5: How do you handle non-EUR base currency conversions in Frankfurter API?
**Answer:** Frankfurter API only supports EUR as base for direct lookups. When a non-EUR base (e.g., INR to USD) is requested, `FrankfurterCurrencyProvider` fetches `EUR -> INR` and `EUR -> USD` in a single request and computes the cross-rate dynamically (`Rate = EUR->USD / EUR->INR`).

### Q6: How is database caching used to reduce external API hits and costs?
**Answer:** Spring Cache (`@Cacheable`) is configured across integration service methods with distinct TTLs: 10 mins for current weather, 30 mins for weather forecast, 6 hours for currency exchange rates and Unsplash images, and 24 hours for places.

### Q7: What fallback mechanism exists if the Unsplash API fails or rate limits?
**Answer:** `DestinationImageService` injects both `@Qualifier("unsplashImageProvider")` and `@Qualifier("mockImageProvider")`. If Unsplash returns an error, timeout, or missing API key, the service catches the exception and falls back to `MockImageProvider` seamlessly.

### Q8: How did you resolve Hibernate LazyInitializationException in Phase 4 endpoints?
**Answer:** In `TimezoneController`, accessing `destination.getCity().getTimezone()` outside a transactional session threw `LazyInitializationException`. We added a `findByIdWithCityAndCountry` query using `JOIN FETCH d.city c JOIN FETCH c.country co` in `DestinationRepository` to eager-load relationships.

### Q9: How are external API schemas validated and safely deserialized?
**Answer:** DTO records mapped to external JSON responses are annotated with `@JsonIgnoreProperties(ignoreUnknown = true)`. This prevents deserialization failures when third-party APIs introduce new metadata fields (such as `osm3s` in Overpass API responses).

### Q10: How does the places integration handle OpenStreetMap (Overpass) server overloads?
**Answer:** `OverpassClient` implements multi-mirror failover across 3 public instances (`overpass-api.de`, `overpass.kumi.systems`, `maps.mail.ru`) with strict 8-second timeouts per mirror. If all fail, it gracefully returns an empty list rather than throwing a 500 server error.

### Q11: How is local time computed dynamically without calling an external time API?
**Answer:** `JavaTimezoneProvider` uses Java''s native `java.time.ZonedDateTime` and `java.time.ZoneId`. Given a timezone ID stored in the database (e.g., `Asia/Tokyo`), it calculates the current time, UTC offset, and formatting natively in sub-millisecond time.

### Q12: How are database schema changes managed for Phase 4?
**Answer:** We used Flyway versioned SQL migrations (`V5__phase4_schema.sql`). It created the `destination_images` table for caching image metadata and `integration_health_logs` table for tracking provider uptime.

### Q13: What public endpoints were exposed for Phase 4?
**Answer:**
- `GET /api/v1/destinations/{id}/weather`
- `GET /api/v1/destinations/{id}/places`
- `GET /api/v1/destinations/{id}/images`
- `GET /api/v1/destinations/{id}/time`
- `GET /api/v1/currency/rates`
- `GET /api/v1/currency/currencies`

### Q14: How is admin provider health monitored?
**Answer:** `IntegrationHealthService` and `IntegrationHealthController` expose `GET /api/v1/admin/integrations/health` (secured with `@PreAuthorize("hasRole('ADMIN')")`), pinging each provider and recording latency, status, and error logs in `integration_health_logs`.

### Q15: How does the frontend display weather conditions?
**Answer:** `WeatherIcon.tsx` maps WMO weather interpretation codes (0–99) to corresponding visual SVG icons / emojis and human-readable text (e.g. Code 0 -> Clear Sky, Code 61 -> Rain).

### Q16: How is attribution preserved for OpenStreetMap and Unsplash data?
**Answer:** `ExternalSourceBadge.tsx` and UI components display mandatory legal attributions (e.g., "Data by OpenStreetMap under ODbL", "Photos by Unsplash with photographer credit links").

### Q17: How is currency converter user input handled in React 19?
**Answer:** `CurrencyConverter.tsx` uses custom React custom hook `useCurrency`, caching currency options, providing swap buttons, and formatting amounts with `Intl.NumberFormat`.

### Q18: What styling framework and icons are used in Phase 4 frontend?
**Answer:** React 19 + TypeScript + Vite + Tailwind CSS, with custom CSS keyframe animations for skeleton loaders (`LoadingSkeleton.tsx`) and smooth gallery modal lightboxes (`DestinationGallery.tsx`).

### Q19: How do you verify API compatibility across all Phase 4 services?
**Answer:** We write automated smoke test scripts using PowerShell `Invoke-RestMethod` and curl to validate HTTP status codes, JSON payload structure, error payloads, and edge cases (e.g., non-existent IDs).

### Q20: What security rules govern Phase 4 endpoints?
**Answer:** In `SecurityConfig.java`, public travel discovery endpoints (`/api/v1/currency/**`, `/api/v1/destinations/**`) are permitted without authentication (`PUBLIC_ENDPOINTS`), while administration endpoints (`/api/v1/admin/**`) require valid JWT bearer tokens with `ROLE_ADMIN`.
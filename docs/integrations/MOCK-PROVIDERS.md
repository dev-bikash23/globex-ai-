# Mock Providers — Hotel & Activity Demo Data

## Purpose
Hotels and Activities do not yet have a live API integration.
MockHotelProvider and MockActivityProvider supply curated demo data so the
full UI can be developed and demonstrated without API keys or costs.

## Key Rules (enforced in code)
- isTestData = TRUE on every mock offer
- dataNotice shown in UI: "Hotels/Activities powered by demonstration data. 
  Real-time inventory is not available yet."
- Category label 'DEMO DATA' in console logs distinguishes from real data
- Demo data is NOT stored in search history for unauthenticated users

## MockHotelProvider
File: globex-backend/src/main/java/com/globex/integration/mock/MockHotelProvider.java
- 30+ hotels across 10 major cities
- Cities: London, Paris, Tokyo, New York, Dubai, Mumbai, Sydney, Rome, Rio, Santorini
- Star ratings: 3-5 stars
- Amenities: WIFI, POOL, SPA, GYM, RESTAURANT, BAR, etc.
- Realistic pricing: USD 80-800/night depending on property

Filtering supported:
- minStars / maxStars
- maxPrice

Sorting supported:
- RECOMMENDED (default), PRICE_ASC, PRICE_DESC, RATING

## MockActivityProvider
File: globex-backend/src/main/java/com/globex/integration/mock/MockActivityProvider.java
- 40+ activities across same 10 cities
- Categories: SIGHTSEEING, TOURS, FOOD, ADVENTURE, MUSEUMS, NATURE, CULTURAL, WELLNESS
- Realistic ratings: 3.8-4.9 stars
- Inclusions/exclusions per activity
- Cancellation policies: Free cancellation | Non-refundable

Filtering supported:
- category (passed in request body)

Sorting supported:
- RATING, PRICE_ASC, PRICE_DESC, RECOMMENDED

## Replacing with Real Providers
1. Implement HotelProvider interface (e.g. ExpediaHotelProvider)
2. Annotate with @Primary and @ConditionalOnProperty
3. No service-layer changes required

# Destination Images Integration (Unsplash API & Mock Provider)

## Overview
GlobeX AI integrates high-resolution destination photographs using the **Unsplash REST API**, complete with legal attribution and photographer credits.

## Technical Specs
- **Providers**:
  - `UnsplashImageProvider` (Primary, `@Component("unsplashImageProvider")`)
  - `MockImageProvider` (Fallback, `@Component("mockImageProvider")`)
- **API Key**: Required (`UNSPLASH_ACCESS_KEY`)
- **Base URL**: `https://api.unsplash.com`
- **Cache TTL**: 6 hours (`destination_images` cache)

## Resiliency Architecture
- **Provider Chain / Fallback**: `DestinationImageService` attempts to fetch from Unsplash first. If rate-limited, missing credentials, or unreachable, it seamlessly falls back to `MockImageProvider` to ensure the UI always renders images.
- **Image Caching Table**: `destination_images` table in PostgreSQL caches fetched image URLs, photographer names, user profiles, and Unsplash IDs.

## Endpoints Implemented
- `GET /api/v1/destinations/{id}/images?count={N}` (Public endpoint)
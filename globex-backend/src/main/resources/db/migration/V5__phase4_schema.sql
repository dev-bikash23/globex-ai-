-- =============================================================================
-- V5: Phase 4 — External Data Integration & Image Cache Schema
-- GlobeX AI
-- =============================================================================

-- Destination images table (for caching external image references & attribution)
CREATE TABLE IF NOT EXISTS destination_images (
    id                VARCHAR(36)  PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    destination_id    VARCHAR(36)  NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    provider          VARCHAR(50)  NOT NULL,
    image_url         TEXT         NOT NULL,
    thumbnail_url     TEXT,
    photographer      VARCHAR(150),
    photographer_url  TEXT,
    attribution_html  TEXT,
    fetched_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destination_images_destination_id ON destination_images(destination_id);
CREATE INDEX IF NOT EXISTS idx_destination_images_provider ON destination_images(provider);

-- Integration health log table (for admin tracking of provider latency & uptime)
CREATE TABLE IF NOT EXISTS integration_health_logs (
    id             VARCHAR(36)  PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    provider_name  VARCHAR(50)  NOT NULL,
    service_type   VARCHAR(50)  NOT NULL,
    status         VARCHAR(20)  NOT NULL, -- AVAILABLE, DEGRADED, UNAVAILABLE
    latency_ms     BIGINT,
    error_message  TEXT,
    checked_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_logs_provider_checked ON integration_health_logs(provider_name, checked_at DESC);

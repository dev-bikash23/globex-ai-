-- =============================================================================
-- V6: Phase 5 Schema — Travel Search History
-- =============================================================================
-- Stores user travel search history (flight/hotel/activity searches).
-- External offers are NOT stored here - they expire and are fetched fresh.
-- Only the search parameters are persisted for history/UX purposes.
-- =============================================================================

CREATE TABLE travel_searches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    search_type     VARCHAR(20) NOT NULL,           -- FLIGHT, HOTEL, ACTIVITY
    origin          VARCHAR(10),                    -- IATA code (flights only)
    destination     VARCHAR(200) NOT NULL,          -- city name or IATA code
    search_params   JSONB NOT NULL DEFAULT '{}',    -- full search parameters
    result_count    INTEGER DEFAULT 0,
    provider        VARCHAR(50),                    -- e.g. duffel, mock
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_travel_searches_user_id ON travel_searches(user_id);
CREATE INDEX idx_travel_searches_created_at ON travel_searches(created_at DESC);
CREATE INDEX idx_travel_searches_type ON travel_searches(search_type);

COMMENT ON TABLE travel_searches IS 'User travel search history - search params only, no offer data';
COMMENT ON COLUMN travel_searches.search_type IS 'FLIGHT, HOTEL, or ACTIVITY';
COMMENT ON COLUMN travel_searches.search_params IS 'Full search criteria as JSON for history display';

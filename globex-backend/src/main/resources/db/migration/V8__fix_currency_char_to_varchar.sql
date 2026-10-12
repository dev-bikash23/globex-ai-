-- =============================================================================
-- V8: Fix CHAR(3) -> VARCHAR(3) for currency columns in Phase 6 tables
-- Reason: Hibernate schema-validation maps String fields to VARCHAR, not CHAR.
-- PostgreSQL CHAR(3) = bpchar; VARCHAR(3) = varchar -- these are different types.
-- =============================================================================

ALTER TABLE trips            ALTER COLUMN currency TYPE VARCHAR(3);
ALTER TABLE trip_flights     ALTER COLUMN currency TYPE VARCHAR(3);
ALTER TABLE trip_hotels      ALTER COLUMN currency TYPE VARCHAR(3);
ALTER TABLE trip_activities  ALTER COLUMN currency TYPE VARCHAR(3);
ALTER TABLE itinerary_items  ALTER COLUMN currency TYPE VARCHAR(3);
ALTER TABLE trip_expenses    ALTER COLUMN currency TYPE VARCHAR(3);
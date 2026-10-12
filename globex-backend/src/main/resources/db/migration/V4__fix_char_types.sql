-- =============================================================================
-- V4: Fix column types for Hibernate compatibility
-- PostgreSQL CHAR(n) (bpchar) is not recognized by Hibernate as VARCHAR(n).
-- Converting to VARCHAR to avoid schema validation failures.
-- =============================================================================

ALTER TABLE countries ALTER COLUMN code         TYPE VARCHAR(2)  USING code::VARCHAR;
ALTER TABLE countries ALTER COLUMN currency_code TYPE VARCHAR(3)  USING currency_code::VARCHAR;

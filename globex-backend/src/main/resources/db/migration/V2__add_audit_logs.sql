-- V2: Phase 2 supplemental — no schema changes needed.
-- audit_logs was already created in V1__init_identity.sql.
-- This migration adds Phase 2 documentation only.

-- Confirm Phase 2 auth tables exist (sanity check)
DO $$
BEGIN
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users'),
        'users table must exist';
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'refresh_tokens'),
        'refresh_tokens table must exist';
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs'),
        'audit_logs table must exist';
    RAISE NOTICE 'V2 Phase 2 schema verification passed.';
END $$;

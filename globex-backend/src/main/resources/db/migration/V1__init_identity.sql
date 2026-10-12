-- =============================================================================
-- V1 — Identity & Access Schema
-- GlobeX AI — Phase 1
-- =============================================================================
-- This migration creates the complete identity domain:
-- users, roles, user_roles, refresh_tokens, user_sessions, audit_logs
--
-- Convention:
--   - All tables use snake_case names
--   - UUIDs as primary keys for users (prevents enumeration attacks)
--   - BIGSERIAL for lookup tables (roles, permissions)
--   - All timestamps stored as TIMESTAMPTZ (UTC)
--   - Soft delete pattern: status column instead of physical DELETE
-- =============================================================================

-- Extension: uuid-ossp for UUID generation
-- (Available in standard PostgreSQL — no PostGIS needed for Phase 1)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ROLES
-- =============================================================================
CREATE TABLE roles (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(50)     NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'Application roles for role-based access control';
COMMENT ON COLUMN roles.name IS 'Role identifier: USER, ADMIN, TRAVEL_PARTNER';

-- Seed default roles
INSERT INTO roles (name, description) VALUES
    ('USER',           'Standard traveller account'),
    ('ADMIN',          'Platform administrator with full access'),
    ('TRAVEL_PARTNER', 'Extended booking and partner API access');

-- =============================================================================
-- USERS
-- =============================================================================
CREATE TABLE users (
    id                                  VARCHAR(36)     PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email                               VARCHAR(255)    NOT NULL UNIQUE,
    password_hash                       VARCHAR(255)    NOT NULL,
    first_name                          VARCHAR(100)    NOT NULL,
    last_name                           VARCHAR(100)    NOT NULL,
    display_name                        VARCHAR(150),
    avatar_url                          TEXT,

    -- Account lifecycle
    status                              VARCHAR(30)     NOT NULL DEFAULT 'PENDING_VERIFICATION'
                                        CHECK (status IN ('PENDING_VERIFICATION','ACTIVE','SUSPENDED','DELETED')),

    -- Email verification
    email_verified                      BOOLEAN         NOT NULL DEFAULT FALSE,
    email_verification_token            VARCHAR(512),
    email_verification_token_expires_at TIMESTAMPTZ,

    -- Password reset
    password_reset_token                VARCHAR(512),
    password_reset_token_expires_at     TIMESTAMPTZ,

    -- Security tracking
    failed_login_attempts               INTEGER         NOT NULL DEFAULT 0,
    locked_until                        TIMESTAMPTZ,
    last_login_at                       TIMESTAMPTZ,

    -- Audit fields (managed by Spring Data JPA @EntityListeners)
    created_at                          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_by                          VARCHAR(36),
    updated_by                          VARCHAR(36)
);

COMMENT ON TABLE users IS 'Core user accounts for GlobeX AI';
COMMENT ON COLUMN users.id IS 'UUID string — prevents sequential enumeration attacks';
COMMENT ON COLUMN users.password_hash IS 'BCrypt hash (cost factor 12) — NEVER store plaintext';
COMMENT ON COLUMN users.status IS 'Account lifecycle: PENDING_VERIFICATION -> ACTIVE -> SUSPENDED/DELETED';

-- Indexes for common queries
CREATE INDEX idx_users_email           ON users(email);
CREATE INDEX idx_users_status          ON users(status);
CREATE INDEX idx_users_created_at      ON users(created_at DESC);
CREATE INDEX idx_users_verification_token ON users(email_verification_token)
    WHERE email_verification_token IS NOT NULL;

-- =============================================================================
-- USER_ROLES (join table)
-- =============================================================================
CREATE TABLE user_roles (
    user_id VARCHAR(36)  NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    role_id BIGINT       NOT NULL REFERENCES roles(id)  ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

COMMENT ON TABLE user_roles IS 'Many-to-many mapping between users and roles';

-- =============================================================================
-- REFRESH_TOKENS
-- =============================================================================
CREATE TABLE refresh_tokens (
    id          VARCHAR(36)     PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    token_hash  VARCHAR(255)    NOT NULL UNIQUE,
    user_id     VARCHAR(36)     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at  TIMESTAMPTZ     NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    revoked     BOOLEAN         NOT NULL DEFAULT FALSE,
    device_info VARCHAR(500),
    ip_address  VARCHAR(45)
);

COMMENT ON TABLE refresh_tokens IS 'Persisted refresh tokens for secure session management with rotation support';
COMMENT ON COLUMN refresh_tokens.token_hash IS 'SHA-256 hash of the actual token — do not store raw token';
COMMENT ON COLUMN refresh_tokens.revoked IS 'True when user logged out or token was rotated';

CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at)
    WHERE revoked = FALSE;

-- =============================================================================
-- USER_SESSIONS
-- =============================================================================
CREATE TABLE user_sessions (
    id              VARCHAR(36)     PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id         VARCHAR(36)     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_id VARCHAR(36)    REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    device_name     VARCHAR(255),
    device_type     VARCHAR(50),
    browser         VARCHAR(100),
    os              VARCHAR(100),
    ip_address      VARCHAR(45),
    last_active_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    terminated_at   TIMESTAMPTZ
);

COMMENT ON TABLE user_sessions IS 'Active login sessions per device — allows session management UI';

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- =============================================================================
-- USER_PREFERENCES
-- =============================================================================
CREATE TABLE user_preferences (
    id                  VARCHAR(36)     PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id             VARCHAR(36)     NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_language  VARCHAR(10)     NOT NULL DEFAULT 'en',
    preferred_currency  VARCHAR(3)      NOT NULL DEFAULT 'USD',
    timezone            VARCHAR(50)     NOT NULL DEFAULT 'UTC',
    theme               VARCHAR(10)     NOT NULL DEFAULT 'dark'
                        CHECK (theme IN ('dark','light','system')),
    notifications_email BOOLEAN         NOT NULL DEFAULT TRUE,
    notifications_push  BOOLEAN         NOT NULL DEFAULT TRUE,
    location_sharing    BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_preferences IS 'Per-user preference settings';

-- =============================================================================
-- AUDIT_LOGS
-- =============================================================================
CREATE TABLE audit_logs (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         VARCHAR(36)     REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100)    NOT NULL,
    entity_type     VARCHAR(100),
    entity_id       VARCHAR(36),
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(500),
    request_id      VARCHAR(36),
    old_value       TEXT,
    new_value       TEXT,
    success         BOOLEAN         NOT NULL DEFAULT TRUE,
    failure_reason  VARCHAR(500),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail for security-sensitive operations';
COMMENT ON COLUMN audit_logs.action IS 'Example: USER_LOGIN, USER_REGISTER, PASSWORD_RESET, TRIP_CREATE';

CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action     ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity     ON audit_logs(entity_type, entity_id)
    WHERE entity_type IS NOT NULL;

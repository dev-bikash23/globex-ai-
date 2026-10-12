package com.globex.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Audit log — immutable record of every security-relevant event.
 * Maps to the audit_logs table created in V1 migration.
 * NEVER stores passwords, tokens, or any sensitive secret.
 */
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id", length = 36)
    private String entityId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "request_id", length = 36)
    private String requestId;

    @Column(name = "success")
    private boolean success = true;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AuditLog() {}

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = Instant.now();
    }

    // ── Convenience enum for type-safe action names ───────────────────────
    public enum AuditEventType {
        USER_REGISTERED, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT,
        TOKEN_REFRESH, TOKEN_REVOKED,
        PASSWORD_RESET_REQUESTED, PASSWORD_CHANGED,
        EMAIL_VERIFICATION_SENT, EMAIL_VERIFIED,
        ACCOUNT_LOCKED, ACCOUNT_UNLOCKED,
        SESSION_REVOKED, ALL_SESSIONS_REVOKED,
        PROFILE_UPDATED, ADMIN_ACTION
    }

    // Getters & Setters
    public Long getId()                     { return id; }
    public String getUserId()               { return userId; }
    public void setUserId(String v)         { this.userId = v; }
    public String getAction()               { return action; }
    public void setAction(String v)         { this.action = v; }
    public String getEntityType()           { return entityType; }
    public void setEntityType(String v)     { this.entityType = v; }
    public String getEntityId()             { return entityId; }
    public void setEntityId(String v)       { this.entityId = v; }
    public String getIpAddress()            { return ipAddress; }
    public void setIpAddress(String v)      { this.ipAddress = v; }
    public String getUserAgent()            { return userAgent; }
    public void setUserAgent(String v)      { this.userAgent = v; }
    public String getRequestId()            { return requestId; }
    public void setRequestId(String v)      { this.requestId = v; }
    public boolean isSuccess()              { return success; }
    public void setSuccess(boolean v)       { this.success = v; }
    public String getFailureReason()        { return failureReason; }
    public void setFailureReason(String v)  { this.failureReason = v; }
    public Instant getCreatedAt()           { return createdAt; }
}

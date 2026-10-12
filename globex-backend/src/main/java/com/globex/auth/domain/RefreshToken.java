package com.globex.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Persisted refresh token for revocable session management.
 * Stored as a hash — the raw token is never saved to the database.
 * Supports rotation: each use invalidates the old token and creates a new one.
 */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "revoked")
    private boolean revoked = false;

    @Column(name = "device_info", length = 500)
    private String deviceInfo;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    public RefreshToken() {}

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = Instant.now();
    }

    public boolean isExpired() { return Instant.now().isAfter(this.expiresAt); }
    public boolean isValid()   { return !revoked && !isExpired(); }

    // Getters & Setters
    public String getId()                   { return id; }
    public void setId(String id)            { this.id = id; }
    public String getTokenHash()            { return tokenHash; }
    public void setTokenHash(String v)      { this.tokenHash = v; }
    public User getUser()                   { return user; }
    public void setUser(User user)          { this.user = user; }
    public Instant getExpiresAt()           { return expiresAt; }
    public void setExpiresAt(Instant v)     { this.expiresAt = v; }
    public Instant getCreatedAt()           { return createdAt; }
    public void setCreatedAt(Instant v)     { this.createdAt = v; }
    public boolean isRevoked()              { return revoked; }
    public void setRevoked(boolean v)       { this.revoked = v; }
    public String getDeviceInfo()           { return deviceInfo; }
    public void setDeviceInfo(String v)     { this.deviceInfo = v; }
    public String getIpAddress()            { return ipAddress; }
    public void setIpAddress(String v)      { this.ipAddress = v; }
}

package com.globex.auth.domain;

import com.globex.shared.audit.AuditableEntity;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * Core User entity — authentication identity for GlobeX AI.
 *
 * Design:
 * - UUID string PK prevents sequential enumeration attacks
 * - BCrypt passwordHash — plaintext NEVER stored
 * - Status enum controls account lifecycle
 * - Roles: EAGER loaded (needed on every authenticated request)
 */
@Entity
@Table(
    name = "users",
    uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email")
)
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "display_name", length = 150)
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private UserStatus status = UserStatus.PENDING_VERIFICATION;

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @Column(name = "email_verification_token", length = 512)
    private String emailVerificationToken;

    @Column(name = "email_verification_token_expires_at")
    private Instant emailVerificationTokenExpiresAt;

    @Column(name = "password_reset_token", length = 512)
    private String passwordResetToken;

    @Column(name = "password_reset_token_expires_at")
    private Instant passwordResetTokenExpiresAt;

    @Column(name = "failed_login_attempts")
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // ── Constructors ──────────────────────────────────────────────────────────
    public User() {}

    // ── Business methods ──────────────────────────────────────────────────────
    public boolean isActive()   { return UserStatus.ACTIVE.equals(this.status); }
    public boolean isLocked()   { return this.lockedUntil != null && Instant.now().isBefore(this.lockedUntil); }
    public String getFullName() { return firstName + " " + lastName; }

    public void incrementFailedAttempts() { this.failedLoginAttempts++; }
    public void resetFailedAttempts()     { this.failedLoginAttempts = 0; this.lockedUntil = null; }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public String getId()                       { return id; }
    public void setId(String id)                { this.id = id; }

    public String getEmail()                    { return email; }
    public void setEmail(String email)          { this.email = email; }

    public String getPasswordHash()             { return passwordHash; }
    public void setPasswordHash(String h)       { this.passwordHash = h; }

    public String getFirstName()                { return firstName; }
    public void setFirstName(String v)          { this.firstName = v; }

    public String getLastName()                 { return lastName; }
    public void setLastName(String v)           { this.lastName = v; }

    public String getDisplayName()              { return displayName; }
    public void setDisplayName(String v)        { this.displayName = v; }

    public String getAvatarUrl()                { return avatarUrl; }
    public void setAvatarUrl(String v)          { this.avatarUrl = v; }

    public UserStatus getStatus()               { return status; }
    public void setStatus(UserStatus v)         { this.status = v; }

    public boolean isEmailVerified()            { return emailVerified; }
    public void setEmailVerified(boolean v)     { this.emailVerified = v; }

    public String getEmailVerificationToken()           { return emailVerificationToken; }
    public void setEmailVerificationToken(String v)     { this.emailVerificationToken = v; }

    public Instant getEmailVerificationTokenExpiresAt()         { return emailVerificationTokenExpiresAt; }
    public void setEmailVerificationTokenExpiresAt(Instant v)   { this.emailVerificationTokenExpiresAt = v; }

    public String getPasswordResetToken()               { return passwordResetToken; }
    public void setPasswordResetToken(String v)         { this.passwordResetToken = v; }

    public Instant getPasswordResetTokenExpiresAt()             { return passwordResetTokenExpiresAt; }
    public void setPasswordResetTokenExpiresAt(Instant v)       { this.passwordResetTokenExpiresAt = v; }

    public int getFailedLoginAttempts()                 { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int v)           { this.failedLoginAttempts = v; }

    public Instant getLockedUntil()                     { return lockedUntil; }
    public void setLockedUntil(Instant v)               { this.lockedUntil = v; }

    public Instant getLastLoginAt()                     { return lastLoginAt; }
    public void setLastLoginAt(Instant v)               { this.lastLoginAt = v; }

    public Set<Role> getRoles()                         { return roles; }
    public void setRoles(Set<Role> roles)               { this.roles = roles; }

    /** Account lifecycle status */
    public enum UserStatus {
        PENDING_VERIFICATION, ACTIVE, SUSPENDED, DELETED
    }
}

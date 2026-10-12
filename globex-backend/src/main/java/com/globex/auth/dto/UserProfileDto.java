package com.globex.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

/**
 * Safe user profile DTO — never includes passwordHash or tokens.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String role;
    private boolean emailVerified;
    private String status;
    private Instant createdAt;
    private Instant lastLoginAt;

    public String getId()               { return id; }
    public void setId(String v)         { this.id = v; }
    public String getFirstName()        { return firstName; }
    public void setFirstName(String v)  { this.firstName = v; }
    public String getLastName()         { return lastName; }
    public void setLastName(String v)   { this.lastName = v; }
    public String getEmail()            { return email; }
    public void setEmail(String v)      { this.email = v; }
    public String getDisplayName()      { return displayName; }
    public void setDisplayName(String v){ this.displayName = v; }
    public String getAvatarUrl()        { return avatarUrl; }
    public void setAvatarUrl(String v)  { this.avatarUrl = v; }
    public String getRole()             { return role; }
    public void setRole(String v)       { this.role = v; }
    public boolean isEmailVerified()            { return emailVerified; }
    public void setEmailVerified(boolean v)     { this.emailVerified = v; }
    public String getStatus()           { return status; }
    public void setStatus(String v)     { this.status = v; }
    public Instant getCreatedAt()       { return createdAt; }
    public void setCreatedAt(Instant v) { this.createdAt = v; }
    public Instant getLastLoginAt()     { return lastLoginAt; }
    public void setLastLoginAt(Instant v){ this.lastLoginAt = v; }
}

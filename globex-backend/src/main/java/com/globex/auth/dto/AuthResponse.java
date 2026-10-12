package com.globex.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Authentication response returned after successful login or token refresh.
 * Contains access token, refresh token, and safe user info.
 * NEVER includes passwordHash or internal security information.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Authentication response with JWT tokens and user info")
public class AuthResponse {

    @Schema(description = "Short-lived JWT access token (15 min)", example = "eyJhbGci...")
    private String accessToken;

    @Schema(description = "Long-lived refresh token (30 days)")
    private String refreshToken;

    @Schema(description = "Access token type", example = "Bearer")
    private String tokenType = "Bearer";

    @Schema(description = "Access token expiry in seconds", example = "900")
    private long expiresIn;

    @Schema(description = "Authenticated user information")
    private UserInfo user;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, long expiresIn, UserInfo user) {
        this.accessToken  = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn    = expiresIn;
        this.user         = user;
    }

    public String getAccessToken()              { return accessToken; }
    public void setAccessToken(String v)        { this.accessToken = v; }
    public String getRefreshToken()             { return refreshToken; }
    public void setRefreshToken(String v)       { this.refreshToken = v; }
    public String getTokenType()                { return tokenType; }
    public void setTokenType(String v)          { this.tokenType = v; }
    public long getExpiresIn()                  { return expiresIn; }
    public void setExpiresIn(long v)            { this.expiresIn = v; }
    public UserInfo getUser()                   { return user; }
    public void setUser(UserInfo v)             { this.user = v; }

    /**
     * Safe user info included in auth responses — no sensitive fields.
     */
    @Schema(description = "User information (no sensitive data)")
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private boolean emailVerified;

        public UserInfo() {}

        public UserInfo(String id, String firstName, String lastName,
                        String email, String role, boolean emailVerified) {
            this.id            = id;
            this.firstName     = firstName;
            this.lastName      = lastName;
            this.email         = email;
            this.role          = role;
            this.emailVerified = emailVerified;
        }

        public String getId()               {
            return id;
        }
        public void setId(String id)        { this.id = id; }
        public String getFirstName()        { return firstName; }
        public void setFirstName(String v)  { this.firstName = v; }
        public String getLastName()         { return lastName; }
        public void setLastName(String v)   { this.lastName = v; }
        public String getEmail()            { return email; }
        public void setEmail(String v)      { this.email = v; }
        public String getRole()             { return role; }
        public void setRole(String v)       { this.role = v; }
        public boolean isEmailVerified()            { return emailVerified; }
        public void setEmailVerified(boolean v)     { this.emailVerified = v; }
    }
}

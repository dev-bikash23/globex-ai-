package com.globex.auth.service;

import com.globex.auth.domain.AuditLog.AuditEventType;
import com.globex.auth.domain.RefreshToken;
import com.globex.auth.domain.Role;
import com.globex.auth.domain.User;
import com.globex.auth.domain.User.UserStatus;
import com.globex.auth.dto.*;
import com.globex.auth.repository.RefreshTokenRepository;
import com.globex.auth.repository.RoleRepository;
import com.globex.auth.repository.UserRepository;
import com.globex.shared.config.GlobexProperties;
import com.globex.shared.exception.BadRequestException;
import com.globex.shared.exception.ConflictException;
import com.globex.shared.exception.ResourceNotFoundException;
import com.globex.shared.response.ApiError;
import com.globex.shared.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Set;

/**
 * Core authentication service — register, login, refresh, logout, password reset.
 *
 * <h2>Security Design:</h2>
 * - Passwords: BCrypt (cost 12) — never stored as plaintext
 * - Access tokens: JWT, 15 min, stateless validation
 * - Refresh tokens: stored as SHA-256 hash — raw token never in DB
 * - Rotation: each refresh issues new token pair, old token revoked
 * - Reuse detection: revoked token reuse triggers full session invalidation
 * - Rate limiting: failed logins tracked in Redis, account locked after threshold
 */
@Service
@Transactional
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;
    private final AuditLogService auditLogService;
    private final GlobexProperties props;
    private final RedisTemplate<String, String> redisTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       EmailService emailService,
                       AuditLogService auditLogService,
                       GlobexProperties props,
                       RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;
        this.auditLogService = auditLogService;
        this.props = props;
        this.redisTemplate = redisTemplate;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // REGISTRATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Register a new user account.
     * Flow: validate → check duplicate email → hash password → assign USER role
     *       → save → send verification email → return safe user info
     */
    public AuthResponse.UserInfo register(RegisterRequest req, HttpServletRequest request) {
        // 1. Check duplicate email (case-insensitive)
        String normalizedEmail = req.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw ConflictException.emailExists();
        }

        // 2. Assign USER role (create if first boot)
        Role userRole = roleRepository.findByName(Role.USER)
                .orElseGet(() -> roleRepository.save(new Role(Role.USER, "Standard user role")));

        // 3. Build user entity — BCrypt hash, NEVER plaintext
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFirstName(req.getFirstName().trim());
        user.setLastName(req.getLastName().trim());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Set.of(userRole));
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setEmailVerified(false);

        // 4. Generate email verification token
        String verificationToken = generateSecureToken();
        user.setEmailVerificationToken(hashToken(verificationToken));
        user.setEmailVerificationTokenExpiresAt(
                Instant.now().plus(Duration.ofHours(props.getEmail().getVerificationExpiryHours())));

        User saved = userRepository.save(user);

        // 5. Send verification email (async — doesn't block response)
        emailService.sendVerificationEmail(saved.getEmail(), saved.getFirstName(), verificationToken);

        // 6. Audit log
        auditLogService.log(AuditEventType.USER_REGISTERED, saved.getId(),
                "New user registered: " + saved.getEmail(), request);

        log.info("New user registered: {}", saved.getId());

        return buildUserInfo(saved);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LOGIN
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Authenticate user and issue token pair.
     * Flow: validate credentials → check account status → generate tokens → audit
     */
    public AuthResponse login(LoginRequest req, HttpServletRequest request) {
        String email = req.getEmail().toLowerCase().trim();

        // 1. Load user early (before Spring Security) to track failed attempts
        User user = userRepository.findByEmail(email)
                .orElse(null);

        // 2. Check account lock BEFORE authentication attempt
        if (user != null && user.isLocked()) {
            auditLogService.log(AuditEventType.LOGIN_FAILED, user.getId(),
                    "Login attempt on locked account", request);
            throw new BadRequestException(ApiError.AUTH_ACCOUNT_LOCKED,
                    "Account is temporarily locked due to multiple failed login attempts. " +
                    "Please try again in " + LOCK_DURATION_MINUTES + " minutes.");
        }

        // 3. Spring Security authentication (validates password + account status)
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, req.getPassword()));
        } catch (BadCredentialsException e) {
            handleFailedLogin(user, request);
            throw new BadRequestException(ApiError.AUTH_INVALID_CREDENTIALS,
                    "Invalid email or password");
        } catch (DisabledException e) {
            auditLogService.log(AuditEventType.LOGIN_FAILED, user != null ? user.getId() : null,
                    "Login attempt on unverified account", request);
            throw new BadRequestException(ApiError.AUTH_EMAIL_NOT_VERIFIED,
                    "Please verify your email before logging in. Check your inbox.");
        } catch (LockedException e) {
            throw new BadRequestException(ApiError.AUTH_ACCOUNT_LOCKED,
                    "Account is temporarily locked. Please try again later.");
        }

        // 4. Reload user to get fresh state
        user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        // 5. Reset failed login counter on success
        user.resetFailedAttempts();
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        // 6. Generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String accessToken = jwtService.generateAccessToken(userDetails);
        String rawRefreshToken = createRefreshToken(user, request);

        auditLogService.log(AuditEventType.LOGIN_SUCCESS, user.getId(),
                "User logged in successfully", request);

        log.info("User authenticated: {}", user.getId());

        return buildAuthResponse(accessToken, rawRefreshToken, user);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // REFRESH TOKEN ROTATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Rotate refresh token — invalidate old, issue new token pair.
     * Reuse detection: if a revoked token is presented, all sessions are revoked.
     */
    public AuthResponse refresh(String rawRefreshToken, HttpServletRequest request) {
        String tokenHash = hashToken(rawRefreshToken);

        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException(ApiError.AUTH_TOKEN_INVALID,
                        "Invalid refresh token"));

        // Reuse detection — revoked token being presented again
        if (stored.isRevoked()) {
            log.warn("SECURITY: Revoked refresh token reused for user: {}. Revoking all sessions.",
                    stored.getUser().getId());
            refreshTokenRepository.revokeAllByUserId(stored.getUser().getId());
            auditLogService.log(AuditEventType.ALL_SESSIONS_REVOKED, stored.getUser().getId(),
                    "All sessions revoked — refresh token reuse detected", request);
            throw new BadRequestException(ApiError.AUTH_TOKEN_INVALID,
                    "Security alert: suspicious token usage detected. Please log in again.");
        }

        if (stored.isExpired()) {
            stored.setRevoked(true);
            refreshTokenRepository.save(stored);
            throw new BadRequestException(ApiError.AUTH_TOKEN_EXPIRED,
                    "Refresh token has expired. Please log in again.");
        }

        // Rotate: revoke old, issue new pair
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        User user = stored.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = jwtService.generateAccessToken(userDetails);
        String newRawRefreshToken = createRefreshToken(user, request);

        auditLogService.log(AuditEventType.TOKEN_REFRESH, user.getId(),
                "Token pair rotated", request);

        return buildAuthResponse(newAccessToken, newRawRefreshToken, user);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LOGOUT
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Logout — revoke the refresh token and blocklist the access token in Redis.
     */
    public void logout(String rawRefreshToken, String accessToken, HttpServletRequest request) {
        // Revoke refresh token
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            String hash = hashToken(rawRefreshToken);
            refreshTokenRepository.findByTokenHash(hash).ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
                auditLogService.log(AuditEventType.LOGOUT, rt.getUser().getId(),
                        "User logged out", request);
            });
        }

        // Blocklist the access token in Redis until its natural expiry
        if (accessToken != null && !accessToken.isBlank()) {
            try {
                String jti = jwtService.extractJti(accessToken);
                java.util.Date expiry = jwtService.extractExpiration(accessToken);
                long ttlSeconds = Duration.between(Instant.now(),
                        expiry.toInstant()).getSeconds();
                if (ttlSeconds > 0) {
                    String blockedKey = props.getRedis().getTokenBlocklistPrefix() + jti;
                    redisTemplate.opsForValue().set(blockedKey, "revoked",
                            Duration.ofSeconds(ttlSeconds));
                }
            } catch (Exception e) {
                log.debug("Could not blocklist access token (may be expired): {}", e.getMessage());
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // EMAIL VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════

    @Transactional
    public void verifyEmail(String token) {
        String tokenHash = hashToken(token);
        User user = userRepository.findByEmailVerificationToken(tokenHash)
                .orElseThrow(() -> new BadRequestException(ApiError.AUTH_TOKEN_INVALID,
                        "Invalid or expired verification token"));

        if (user.getEmailVerificationTokenExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException(ApiError.AUTH_TOKEN_EXPIRED,
                    "Verification token has expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiresAt(null);
        userRepository.save(user);

        auditLogService.log(AuditEventType.EMAIL_VERIFIED, user.getId(),
                "Email verified: " + user.getEmail());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PASSWORD RESET
    // ═══════════════════════════════════════════════════════════════════════

    @Transactional
    public void forgotPassword(String email, HttpServletRequest request) {
        // Never reveal whether email exists — always return success
        userRepository.findByEmail(email.toLowerCase().trim()).ifPresent(user -> {
            String token = generateSecureToken();
            user.setPasswordResetToken(hashToken(token));
            user.setPasswordResetTokenExpiresAt(
                    Instant.now().plus(Duration.ofHours(props.getEmail().getPasswordResetExpiryHours())));
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), token);
            auditLogService.log(AuditEventType.PASSWORD_RESET_REQUESTED, user.getId(),
                    "Password reset requested", request);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req, HttpServletRequest request) {
        String tokenHash = hashToken(req.getToken());
        User user = userRepository.findByPasswordResetToken(tokenHash)
                .orElseThrow(() -> new BadRequestException(ApiError.AUTH_TOKEN_INVALID,
                        "Invalid or expired password reset token"));

        if (user.getPasswordResetTokenExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException(ApiError.AUTH_TOKEN_EXPIRED,
                    "Reset token has expired. Please request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.resetFailedAttempts();
        userRepository.save(user);

        // Revoke all existing sessions after password change for security
        refreshTokenRepository.revokeAllByUserId(user.getId());

        emailService.sendPasswordChangedNotification(user.getEmail(), user.getFirstName());
        auditLogService.log(AuditEventType.PASSWORD_CHANGED, user.getId(),
                "Password reset completed", request);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    private String createRefreshToken(User user, HttpServletRequest request) {
        String rawToken = generateSecureToken();

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(hashToken(rawToken));
        rt.setExpiresAt(Instant.now().plus(
                Duration.ofDays(props.getJwt().getRefreshTokenExpiryDays())));
        if (request != null) {
            rt.setIpAddress(getClientIp(request));
            rt.setDeviceInfo(truncate(request.getHeader("User-Agent"), 500));
        }
        refreshTokenRepository.save(rt);
        return rawToken;
    }

    private void handleFailedLogin(User user, HttpServletRequest request) {
        if (user == null) return;
        user.incrementFailedAttempts();
        if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
            user.setLockedUntil(Instant.now().plus(Duration.ofMinutes(LOCK_DURATION_MINUTES)));
            auditLogService.log(AuditEventType.ACCOUNT_LOCKED, user.getId(),
                    "Account locked after " + MAX_FAILED_ATTEMPTS + " failed attempts", request);
            log.warn("Account locked: {} (too many failed attempts)", user.getEmail());
        }
        userRepository.save(user);
        auditLogService.log(AuditEventType.LOGIN_FAILED, user.getId(),
                "Failed login attempt " + user.getFailedLoginAttempts(), request);
    }

    /** Cryptographically secure random token — 32 bytes = 256 bits of entropy */
    private String generateSecureToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    /** SHA-256 hash of a token — stored in DB, never the raw token */
    private String hashToken(String rawToken) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    private String truncate(String value, int maxLen) {
        if (value == null) return null;
        return value.length() <= maxLen ? value : value.substring(0, maxLen);
    }

    private AuthResponse buildAuthResponse(String accessToken, String rawRefreshToken, User user) {
        long expiresIn = props.getJwt().getAccessTokenExpiryMinutes() * 60L;
        return new AuthResponse(accessToken, rawRefreshToken, expiresIn, buildUserInfo(user));
    }

    private AuthResponse.UserInfo buildUserInfo(User user) {
        String role = user.getRoles().stream()
                .map(Role::getName).findFirst().orElse(Role.USER);
        return new AuthResponse.UserInfo(
                user.getId(), user.getFirstName(), user.getLastName(),
                user.getEmail(), role, user.isEmailVerified());
    }
}

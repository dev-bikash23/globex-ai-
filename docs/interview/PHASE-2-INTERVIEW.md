# Phase 2 Interview Q&A — Authentication & Security

## 1. What is Spring Security?

Spring Security is a powerful authentication and authorization framework for Java applications. It integrates into the Spring request pipeline as a chain of `Filter` objects. Every HTTP request passes through the `SecurityFilterChain` before reaching any controller. It handles login, logout, session management, CSRF, CORS, and role-based authorization — all configurable in Java without XML.

---

## 2. Authentication vs Authorization?

| | Authentication | Authorization |
|---|---|---|
| Question | Who are you? | Are you allowed to do this? |
| Example | JWT valid, user is `bikas@globex.com` | Is `bikas@globex.com` an ADMIN? |
| Spring class | `AuthenticationManager` | `AccessDecisionManager` / `@PreAuthorize` |

GlobeX: `JwtAuthenticationFilter` handles authentication. `@PreAuthorize("hasRole('ADMIN')")` handles authorization.

---

## 3. Why JWT?

- **Stateless** — no session table needed, scales horizontally
- **Self-contained** — the token carries claims (userId, role, expiry)
- **Standard** — RFC 7519, supported by all major languages and libraries
- **Verifiable** — HMAC-SHA256 signature prevents tampering without the secret

---

## 4. Access Token vs Refresh Token?

| | Access Token | Refresh Token |
|---|---|---|
| Lifetime | 15 minutes | 30 days |
| Used for | API authorization header | Getting new access tokens |
| Storage | In-memory only | localStorage / DB hash |
| Revocable | Via Redis blocklist | Yes — in PostgreSQL |

Short access token lifetime limits the damage if intercepted — worst case 15 min exposure.

---

## 5. Why Short-Lived Access Tokens?

JWTs are **stateless** — once issued, you can't invalidate them without extra infrastructure. A 15-minute lifetime means:
- A stolen token expires quickly
- The Redis blocklist only needs to hold tokens for max 15 min
- Security is balanced with UX (transparent refresh keeps users logged in)

---

## 6. Why Refresh Token Rotation?

If a refresh token is stolen, rotation limits the attack window. When the attacker uses the stolen token:
- The old (legitimate) token is already revoked (rotation happened)
- **Reuse detection** triggers → all sessions revoked
- User must re-authenticate

Without rotation, a stolen refresh token grants access for 30 days silently.

---

## 7. Why Hash Passwords?

Plaintext passwords in the database mean a single breach exposes every user's password — and they likely reuse passwords elsewhere. BCrypt hash means:
- Attacker gets hashes, not passwords
- Each hash is unique (BCrypt uses per-password salt)
- Brute-force is expensive (cost factor 12 = ~250ms per attempt)

---

## 8. BCrypt vs Argon2?

| | BCrypt | Argon2 |
|---|---|---|
| Year | 1999 | 2015 (PHC winner) |
| Memory hardness | No | Yes (harder to GPU crack) |
| Java support | Spring Security built-in | Requires extra dependency |
| Used in GlobeX | ✅ Yes | Could upgrade |

BCrypt is battle-tested and Spring Boot supports it natively. Argon2 is technically superior — a valid upgrade path for Phase 3+.

---

## 9. What is a SecurityFilterChain?

It's the ordered chain of `Filter` objects Spring Security applies to every request. In GlobeX:

```
Request
  → CorrelationIdFilter        (adds X-Request-ID)
  → JwtAuthenticationFilter    (validates JWT, sets SecurityContext)
  → SecurityFilterChain        (checks authorization rules)
  → DispatcherServlet          (routes to controller)
```

Configured in `SecurityConfig.securityFilterChain()`.

---

## 10. What is the JWT Filter?

`JwtAuthenticationFilter` extends `OncePerRequestFilter`. On every request:
1. Extract `Bearer <token>` from `Authorization` header
2. Validate JWT signature using the secret
3. Check Redis blocklist (logout/revoked tokens)
4. Load user from DB via `GlobexUserDetailsService`
5. Set `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`

If any step fails, the request continues unauthenticated (Spring Security then enforces authorization rules).

---

## 11. What is CORS?

Cross-Origin Resource Sharing. Browsers block JavaScript from calling APIs on a different origin (domain/port). Spring's `CorsConfiguration` tells the browser which origins are allowed.

GlobeX: `http://localhost:5173` (React) → `http://localhost:8080` (Spring Boot). Without CORS config, the browser would block every API call.

---

## 12. What is CSRF?

Cross-Site Request Forgery — a malicious site tricks a logged-in user's browser into making unintended requests. Relevant when authentication is based on **cookies** (browser sends them automatically).

GlobeX uses `Authorization: Bearer <token>` headers — browsers **never** auto-send custom headers cross-origin. So CSRF is not a threat → `csrf().disable()` is safe and documented.

---

## 13. What is RBAC?

Role-Based Access Control. Users are assigned roles (USER, ADMIN), and resources check the role rather than the specific user. Easier to manage than per-user permissions.

GlobeX: `@PreAuthorize("hasRole('ADMIN')")` on admin endpoints. Spring Security reads roles from the JWT's `authorities` claim automatically.

---

## 14. 401 vs 403?

| Code | Meaning | GlobeX trigger |
|---|---|---|
| `401 Unauthorized` | Not authenticated — no valid token | Missing/expired/invalid JWT |
| `403 Forbidden` | Authenticated but not authorized | USER trying to access `/api/v1/admin/**` |

Spring Security throws `AuthenticationException` → 401, `AccessDeniedException` → 403.

---

## 15. Why Redis for Rate Limiting?

- Redis is **in-memory** — microsecond latency for counter increment
- Supports **atomic** operations (`INCR`) — no race conditions under load
- **TTL** built-in — counters auto-expire (no cleanup job needed)
- **Distributed** — works across multiple backend instances (unlike in-memory Java maps)

Alternative: Bucket4j (token bucket algorithm) + Redis for production-grade rate limiting.

---

## 16. How Do You Prevent User A Accessing User B's Data?

**Never trust client-supplied IDs.** In GlobeX:

```java
// ❌ WRONG — trusts client
@GetMapping("/profile/{userId}")
public Profile getProfile(@PathVariable String userId) { ... }

// ✅ CORRECT — derives identity from JWT
@GetMapping("/me")
public Profile getProfile(@AuthenticationPrincipal UserDetails principal) {
    return userService.getMyProfile(principal); // uses principal.getUsername()
}
```

The backend always derives the user identity from the validated JWT, not from the request.

---

## 17. What Happens if a Refresh Token is Stolen?

1. Attacker uses stolen refresh token → gets new access token
2. **Rotation**: old refresh token revoked, new one issued to attacker
3. **Real user** tries to refresh with their now-revoked token
4. **Reuse detection** triggers → `revokeAllByUserId()` called
5. All sessions invalidated → user must re-authenticate
6. Audit log records `ALL_SESSIONS_REVOKED` with IP address

---

## 18. How Does Logout Work with JWT?

JWT is stateless — you can't "delete" a token. GlobeX uses two mechanisms:

1. **Refresh token** → revoked in PostgreSQL (`revoked = true`)
2. **Access token JTI** → stored in Redis with TTL = remaining lifetime

On next request, `JwtAuthenticationFilter` checks Redis blocklist → rejects the token.

---

## 19. Where Should Secrets Be Stored?

| Environment | Storage |
|---|---|
| Local dev | `.env` file (git-ignored) |
| CI/CD | GitHub Actions Secrets / GitLab CI Variables |
| Production | AWS Secrets Manager / HashiCorp Vault / GCP Secret Manager |

**Never**: committed to git, hardcoded in source, logged, or passed via URL parameters.

---

## 20. How Would You Secure GlobeX Live Location Later?

Live location is sensitive — requires multiple layers:

1. **Authentication**: JWT required on every WebSocket connection (validated on upgrade)
2. **Authorization**: Users can only push/read their own location or explicitly shared trips
3. **Transport**: WSS (WebSocket Secure = TLS) only in production
4. **Storage**: Location data encrypted at rest; purged after trip ends
5. **Rate limiting**: Location updates throttled (e.g., max 1/sec per user)
6. **Consent**: Opt-in only; clear UI indicator when tracking is active
7. **Trusted contacts**: Explicit sharing model — user grants specific contacts view access
8. **Audit**: All location access logged for privacy compliance

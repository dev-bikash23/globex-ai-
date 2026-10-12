# GlobeX AI Security Architecture

## Authentication Model

GlobeX uses **stateless JWT authentication** with **refresh token rotation**.

### Why Stateless JWT?
- The backend doesn't need to query a session table on every request
- Scales horizontally — any server can validate the token using the shared secret
- Industry standard for React ↔ Spring Boot SPAs

### Token Architecture

| Token | Lifetime | Storage | Validation |
|---|---|---|---|
| Access Token | 15 min | In-memory (React) | Signature + expiry |
| Refresh Token | 30 days | localStorage (React) / DB hash | DB lookup + expiry |

Access tokens are **never stored in localStorage** — only kept in memory to reduce XSS risk.

---

## Password Security

**Algorithm**: BCrypt with cost factor 12  
**Why BCrypt?** Adaptive — cost factor can increase as hardware improves.  
**Hash time**: ~250ms per hash — brute-force resistant.  
**Never stored**: plaintext, hint, or reversible form.

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one digit
- At least one special character (`@$!%*?&_-#`)

---

## Refresh Token Rotation

Every token refresh issues a **new token pair** and revokes the old refresh token.

```
Old refresh token
       ↓
Validate (not revoked, not expired)
       ↓
Revoke old token in DB
       ↓
Issue new access token + new refresh token
       ↓
Return new pair
```

### Reuse Detection
If a **revoked** refresh token is presented:
1. All sessions for that user are immediately revoked
2. User must re-authenticate
3. Security event logged in audit_logs

---

## Role-Based Access Control (RBAC)

| Role | Access |
|---|---|
| `USER` | Own profile, trips, bookings, memories |
| `ADMIN` | All USER access + admin panel + user management |

Roles are stored in the `roles` table and assigned via `user_roles`.  
Authorization uses Spring Security `@PreAuthorize("hasRole('ADMIN')")`.

---

## CORS Configuration

- **Development**: `http://localhost:5173`
- **Production**: Set via `CORS_ALLOWED_ORIGINS` environment variable
- `allowedOrigins("*")` is **never used** for authenticated requests

---

## CSRF Decision

**CSRF disabled** for the API because:
- All state-changing requests require a `Bearer` token in `Authorization` header
- Simple cross-origin forms cannot set custom headers (browser CORS policy)
- Bearer token approach is CSRF-safe by design

If we ever move to HttpOnly cookie refresh tokens, CSRF protection would be re-enabled.

---

## Account Locking

- Failed login attempts tracked in the `users.failed_login_attempts` column
- After **5 consecutive failures**: account locked for **30 minutes**
- `locked_until` timestamp used — not a permanent ban
- Counter resets on successful login

---

## Audit Logging

All security events recorded in `audit_logs` (immutable, append-only):

- `USER_REGISTERED`, `LOGIN_SUCCESS`, `LOGIN_FAILED`
- `LOGOUT`, `TOKEN_REFRESH`, `TOKEN_REVOKED`
- `PASSWORD_RESET_REQUESTED`, `PASSWORD_CHANGED`
- `EMAIL_VERIFIED`, `ACCOUNT_LOCKED`, `ALL_SESSIONS_REVOKED`

**Never logged**: passwords, tokens, secrets.

---

## Secret Management

| Secret | Source | Never In Code |
|---|---|---|
| `JWT_SECRET` | Environment variable | ✅ |
| `DB_PASSWORD` | Environment variable | ✅ |
| `REDIS_PASSWORD` | Environment variable | ✅ |

In production: use **AWS Secrets Manager**, **HashiCorp Vault**, or **GCP Secret Manager**.

---

## Security Headers

Configured via Spring Security:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Local vs Production Differences

| Feature | Local (dev) | Production |
|---|---|---|
| Email | Console logging | SMTP/SendGrid |
| HTTPS | HTTP (localhost) | HTTPS required |
| JWT secret | Any long string | Vault-managed rotation |
| CORS | localhost:5173 | Domain whitelist |
| Actuator | Full exposure | Restricted endpoints |

# 🌍 GlobeX AI

> **"Explore the World. Understand the Culture. Plan Better. Travel Safely. Preserve the Memories."**

A production-quality **Java Full Stack + AI** travel platform built for portfolio and interview readiness.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21 LTS, Spring Boot 3.3.4, Maven |
| **Database** | PostgreSQL 18, Flyway migrations, Spring Data JPA |
| **Cache / Sessions** | Redis (token blocklist, rate limiting) |
| **Security** | Spring Security, JWT (JJWT 0.12), BCrypt |
| **API Docs** | SpringDoc OpenAPI 3 / Swagger UI |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4 |
| **Build** | Maven 3.9, npm 10 |

---

## 🚀 Quick Start

### Prerequisites
- Java 21+ (tested on Java 24)
- PostgreSQL 18 running on `localhost:5432`
- Redis running on `localhost:6379`
- Node.js 22+

### 1. Database Setup

```sql
-- Run in psql as superuser
CREATE DATABASE globex_dev;
CREATE USER globex WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE globex_dev TO globex;
```

### 2. Backend

```bash
cd globex-backend
cp .env.example .env
# Edit .env — set DB_PASSWORD, JWT_SECRET etc.

# Start Spring Boot (profile: dev)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev -DskipTests
```

Backend starts at: **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui/index.html**  
Health check: **http://localhost:8080/api/v1/health**

### 3. Frontend

```bash
cd globex-frontend
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 📁 Project Structure

```
GLOBAL X AI/
├── globex-backend/                  # Spring Boot API
│   ├── src/main/java/com/globex/
│   │   ├── GlobexApplication.java
│   │   ├── auth/                    # Auth module
│   │   │   ├── controller/          # AuthController, AdminController
│   │   │   ├── domain/              # User, Role, RefreshToken, AuditLog
│   │   │   ├── dto/                 # Request/response DTOs
│   │   │   ├── repository/          # JPA repositories
│   │   │   └── service/             # AuthService, EmailService, AuditLogService
│   │   ├── user/                    # User module
│   │   │   ├── controller/          # UserController
│   │   │   └── service/             # UserService
│   │   └── shared/                  # Cross-cutting concerns
│   │       ├── config/              # Security, CORS, Redis, OpenAPI, Async
│   │       ├── audit/               # JPA auditing (createdAt, updatedBy)
│   │       ├── exception/           # Global exception handler + custom exceptions
│   │       ├── response/            # ApiResponse<T> wrapper
│   │       ├── security/            # JwtService, JwtAuthFilter, UserDetailsService
│   │       └── util/                # CorrelationIdFilter
│   └── src/main/resources/
│       ├── application.yml          # Main config
│       ├── application-dev.yml      # Dev overrides
│       └── db/migration/            # Flyway SQL migrations
├── globex-frontend/                 # React + TypeScript + Vite
│   └── src/
│       ├── auth/                    # AuthProvider, authService, types, ProtectedRoute
│       └── pages/                   # Login, Register, ForgotPassword, Reset, Dashboard
└── docs/
    ├── SECURITY.md                  # Security architecture
    └── interview/
        └── PHASE-2-INTERVIEW.md     # 20 interview Q&As
```

---

## 🔐 Auth Endpoints (Phase 2)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Create account |
| `POST` | `/api/v1/auth/login` | Public | Get token pair |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate tokens |
| `POST` | `/api/v1/auth/logout` | Public | Revoke + blocklist |
| `POST` | `/api/v1/auth/verify-email` | Public | Verify email token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request reset link |
| `POST` | `/api/v1/auth/reset-password` | Public | Set new password |
| `GET` | `/api/v1/users/me` | 🔒 USER | Get own profile |
| `PUT` | `/api/v1/users/me` | 🔒 USER | Update profile |
| `GET` | `/api/v1/admin/test` | 🔒 ADMIN | RBAC test |
| `GET` | `/api/v1/health` | Public | Full health check |

---

## 🔒 Security Features

- ✅ **JWT Access Tokens** — 15 min, stateless, HMAC-SHA256 signed
- ✅ **Refresh Token Rotation** — single-use, 30-day, stored as SHA-256 hash
- ✅ **Reuse Detection** — stolen token triggers full session revocation
- ✅ **BCrypt** — cost factor 12, ~250ms per hash
- ✅ **Redis Blocklist** — revoked access tokens blocked until natural expiry
- ✅ **Account Locking** — 5 failed attempts → 30 min lock
- ✅ **Audit Logs** — all security events recorded asynchronously
- ✅ **Email Verification** — token hashed in DB, expires in 24h
- ✅ **Password Reset** — single-use expiring tokens
- ✅ **RBAC** — USER / ADMIN roles enforced via `@PreAuthorize`
- ✅ **CORS** — locked to frontend origin
- ✅ **Security Headers** — X-Frame-Options, X-Content-Type-Options

---

## 📋 Development Phases

| Phase | Feature | Status |
|---|---|---|
| **1** | Project foundation, structure, DB, Redis, OpenAPI | ✅ Complete |
| **2** | Authentication, JWT, RBAC, Security, Frontend Auth UI | ✅ Complete |
| **3** | Interactive 3D Earth, Destination Discovery, Maps | 🔜 Next |
| **4** | Flights, Hotels, Activities (real APIs) | 📅 Planned |
| **5** | AI Travel Planning, Recommendations (Spring AI) | 📅 Planned |
| **6** | Live Weather, Real-time Location Tracking | 📅 Planned |
| **7** | Safety, SOS, Emergency Contacts | 📅 Planned |
| **8** | Voice/Language Translation, AR Features | 📅 Planned |
| **9** | Travel Memories, Photos, AI Journaling | 📅 Planned |
| **10** | Admin Panel, Analytics, Notifications | 📅 Planned |

---

## 🎓 Interview Prep

- [Phase 2 — Authentication & Security Q&A (20 questions)](docs/interview/PHASE-2-INTERVIEW.md)
- [Security Architecture](docs/SECURITY.md)
- [Project Architecture](ARCHITECTURE.md) *(in artifacts)*

---

## 📜 License

Built for portfolio, learning, and interview purposes.

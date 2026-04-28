# HR Enterprise Platform — Jersey Technical Design

**Version:** 1.0  
**Date:** 2026-04-17  
**Status:** Current runtime design

---

## 1. Purpose

This document captures the active backend architecture for the HR training application.

The current target stack is:

- Jersey/JAX-RS for HTTP resources
- Maven multi-module build
- PostgreSQL for local database work
- explicit JDBC repositories against `AIHR_*` tables
- environment-provided Java, Maven, and database-client tooling

This document is now a current-state design reference, not a migration proposal.

---

## 2. Architecture Summary

### 2.1 Active Runtime

The backend runs as an embedded Grizzly service with Jersey registration.

Primary entry points:

- `backend/hrapp-service/src/main/java/com/company/hr/HrMain.java`
- `backend/hrapp-service/src/main/java/com/company/hr/HrApplicationConfig.java`

### 2.2 Active Backend Structure

```text
backend/
├── pom.xml
├── hrapp-common/
│   ├── pom.xml
│   └── src/main/java/com/company/hr/common/
└── hrapp-service/
    ├── pom.xml
    └── src/
        ├── main/
        │   ├── java/com/company/hr/
        │   │   ├── HrMain.java
        │   │   ├── HrApplicationConfig.java
        │   │   ├── config/
        │   │   ├── dto/
        │   │   ├── exception/
        │   │   ├── filter/
        │   │   ├── mapper/
        │   │   ├── repository/
        │   │   ├── resource/
        │   │   ├── security/
        │   │   └── service/
        │   └── resources/
        └── test/
```

### 2.3 Design Intent

The application favors explicit, inspectable code over container magic so learners can trace:

- resource registration
- request filtering and auth checks
- database access
- error mapping
- environment-driven database runtime configuration

---

## 3. API Contract

### 3.1 Base Path

Preserve:

- `/app/hr/api/v1`

### 3.2 Contract Preservation Rules

The frontend-backed API contract is the source of truth.

Keep these behaviors stable unless the frontend changes with them:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- employee detail includes embedded `jobHistory`
- employee list includes `managerId`
- workflow requests accept body-based `idempotencyKey`
- audit-log pagination shape remains compatible with the current frontend

### 3.3 Implemented Resource Surface

The active runtime exposes resources for:

- auth
- employees
- departments
- jobs
- locations
- countries
- dashboard summary
- audit logs
- notifications
- user preferences

---

## 4. Persistence and Data Access

### 4.1 Database Target

- PostgreSQL is the active local database path
- runtime access remains limited to `AIHR_*` tables
- current local validation database is `hrdb` on `localhost`

### 4.2 Repository Style

Data access uses explicit JDBC repositories.

Responsibilities handled directly in repository code include:

- pagination
- filtering
- sorting
- joins
- manager-scope filtering
- write transactions for employee workflows

### 4.3 Training Data

Active local PostgreSQL scripts:

- `database/hrschema.sql`
- `database/hrdemo.sql`

Lab-only seeded data:

- `aihr_pay_grades`

Do not add runtime repository/resource/service scope for `aihr_pay_grades` in the current phase.

---

## 5. Security Design

### 5.1 Authentication

The backend uses JWT-based authentication with distinct access and refresh token handling.

Core runtime areas:

- `security/`
- `filter/`
- auth resource and auth service

### 5.2 Authorization

Authorization is enforced through explicit request filtering and role checks in the Jersey runtime.

Current hardening rules include:

- protected routes reject missing bearer tokens with `401`
- refresh endpoints reject access tokens
- audit-log access is limited to `ADMIN` and `HR_SPECIALIST`
- sensitive fields must not be logged

### 5.3 Logging Rules

Use `HrLogHelper`.

Prefer focused workflow-boundary logging for:

- auth events
- employee write flows
- startup
- validation failures
- operational errors

Avoid method-by-method entry/exit noise.

---

## 6. Build and Runtime Strategy

### 6.1 Build Tool

- Maven

### 6.2 Runtime Style

- embedded Grizzly server
- Jersey application registration
- environment-driven database configuration with PostgreSQL

### 6.3 Tooling Constraint

The project should remain runnable on prepared machines, but the repository no longer bundles Java, Maven, SQLcl, `psql`, or a Maven cache under `runtime/`.

Prefer:

- explicit environment prerequisites for Java, Maven, and the required database client tooling
- optional pre-populated local Maven caches when offline execution matters
- direct `psql` execution for the active local PostgreSQL workflow

---

## 7. Verification Baseline

Validated on 2026-04-17:

- backend clean test runs
- frontend production build
- frontend unit tests
- live API smoke
- live browser verification
- refreshed PostgreSQL schema/data reload on `localhost`

Known environment caveat:

- Firefox is the preferred Playwright browser by repo rule, but this host currently requires Chromium fallback because the local Firefox runtime is not healthy.

---

## 8. Operational Notes

- For learner work, start from the current lab chapter and `lab-materials/student-workspace-guide.md`.
- Keep non-tracking docs aligned to the current Jersey runtime and PostgreSQL migration direction.

# HR Enterprise Platform — Current Requirements

**Version:** 2.0  
**Date:** 2026-04-18  
**Status:** Current-state requirements aligned to the live application

---

## 1. Purpose

This document describes the current functional and technical requirements for the live HR Enterprise Platform in this repository.

It replaces older plan-era assumptions with the runtime that actually exists today:

- React + TypeScript + Vite frontend
- Jersey/JAX-RS backend on Java 21
- embedded Grizzly runtime
- PostgreSQL for local runtime work
- explicit JDBC repositories against `AIHR_*` tables
- JWT-based authentication and RBAC
- MLS/NLS support across backend and frontend

This document is a current-state reference, not a future-state proposal.

---

## 2. Product Scope

The application manages a software-company workforce demo and supports the following user-facing areas:

- login and session management
- dashboard and summary analytics
- employee directory
- employee detail with embedded job history
- hire, promote, transfer, and terminate workflows
- departments, jobs, locations, countries, and org chart
- notifications
- user preferences
- audit log review

The system is intended to operate as a training-grade enterprise web application with realistic runtime behavior and end-to-end verification, not just a static demo.

---

## 3. Architecture Requirements

### 3.1 Runtime shape

The application must remain a decoupled three-tier system:

- **Client layer:** React SPA
- **API layer:** Jersey/JAX-RS REST services running on embedded Grizzly
- **Data layer:** PostgreSQL accessed through explicit JDBC repositories

### 3.2 Backend layering

The backend must preserve the current explicit layering:

- **resource layer** for HTTP request/response handling
- **service layer** for workflow logic, validation orchestration, and contract shaping
- **repository layer** for JDBC data access
- **filter/security layer** for JWT auth, locale resolution, and cross-cutting request behavior
- **exception/config layer** for consistent runtime behavior

The codebase should continue to favor explicit, inspectable logic over heavy framework magic so the runtime is understandable to maintainers and learners.

### 3.3 API contract stability

Preserve the current frontend-used contract unless frontend and backend are changed together.

The following behaviors are specifically contract-sensitive:

- backend base path remains `/app/hr/api/v1`
- employee detail responses keep embedded `jobHistory`
- employee list responses keep `managerId`
- workflow requests continue accepting body-based `idempotencyKey`
- auth, notifications, preferences, dashboard, and audit-log response shapes remain compatible with the current frontend

---

## 4. Technology Baseline

| Layer | Current Requirement |
|---|---|
| Backend runtime | Java 21 |
| Backend framework | Jersey/JAX-RS 3.x |
| HTTP container | Embedded Grizzly |
| Dependency/build system | Maven multi-module |
| Backend modules | `hrapp-common`, `hrapp-service` |
| Data access | Explicit JDBC repositories |
| Database | PostgreSQL |
| Database driver | PostgreSQL JDBC |
| Auth/token handling | JWT via `jjwt` |
| Password hashing | `jbcrypt` |
| Validation | `jakarta.validation` |
| Frontend | React 19 + TypeScript |
| Frontend build/dev server | Vite |
| Frontend routing | React Router |
| Client-side server state | TanStack Query |
| API client | Axios via `HrApiClient` |
| Forms | React Hook Form |
| Charts | Recharts |
| UI localization | i18next + react-i18next |
| Browser E2E validation | Playwright |
| Frontend test runner | Vitest |
| Backend test stack | JUnit 5, Mockito, Jersey test framework |
| Styling | Tailwind CSS plus app design tokens/components |

The docs must not claim current use of Cypress, Swagger UI, or repo-bundled runtime/tooling unless those are actually reintroduced.

---

## 5. Functional Requirements

### 5.1 Authentication and session behavior

The application must provide:

- username/password login
- JWT access tokens for protected API access
- refresh-token flow separate from access tokens
- logout behavior that clears active client auth state
- rejection of missing or invalid bearer tokens on protected routes

The backend must reject refresh attempts that use an access token in place of a refresh token.

### 5.2 Authorization and roles

The runtime must preserve RBAC-based behavior for the active roles used by the application:

- `ADMIN`
- `HR_SPECIALIST`
- `MANAGER`
- `EMPLOYEE`

Examples of enforced behavior include:

- audit-log access limited to `ADMIN` and `HR_SPECIALIST`
- manager-scoped data visibility where applicable
- salary visibility rules on employee detail and related flows

### 5.3 Employee lifecycle

The system must support:

- hiring a new employee
- promoting an employee
- transferring an employee
- terminating an employee
- viewing employee detail and job history
- browsing and filtering employee lists

Lifecycle actions must write consistent data, maintain job-history continuity where required, and remain compatible with the frontend workflow screens.

### 5.4 Organization and reference data

The application must support read/write or read-only runtime behavior, as currently implemented, for:

- departments
- jobs
- locations
- countries
- org chart
- dashboard summary data

### 5.5 Notifications, settings, and audit trail

The application must support:

- notification listing
- mark-read and mark-all-read behavior
- user preference retrieval and update
- audit-log retrieval with current access restrictions

### 5.6 Localization and formatting

The live app must preserve the current MLS/NLS foundation:

- backend locale resolution through request and user preference handling
- frontend translations through i18next bundles
- supported active locales:
  - `en-US`
  - `es-MX`
  - `fr-FR`
  - `hi-IN`
- fallback locale remains `en-US`
- localized handling for UI labels, error messages, and selected catalog/demo content

Authenticated saved preferences may override request language for the active user session.

---

## 6. Data and Schema Requirements

### 6.1 Active schema path

The active local PostgreSQL schema/demo workflow is:

- `database/hrschema.sql`
- `database/hrdemo.sql`

These are the primary runtime schema artifacts for local validation.

### 6.2 Runtime table scope

Runtime backend code must continue using `AIHR_*` tables only.

### 6.3 Core domain coverage

The current runtime data model includes the HR baseline plus application-supporting tables for:

- employees
- jobs
- departments
- locations
- countries
- job history
- users and roles
- user preferences
- audit logs
- notifications
- translations

### 6.4 Current exclusions

- `aihr_pay_grades` remains lab-only/reference-seeded data and must not gain runtime repository/resource/service scope in the current phase.
- legacy Oracle/reference SQL files may remain for reference, but they are not the active local runtime path.

---

## 7. Security and Operational Requirements

### 7.1 Logging

Backend logging must:

- use `HrLogHelper`
- avoid passwords, tokens, salary values, phone numbers, and sensitive PII
- favor workflow-boundary and operational logging over noisy method-level entry/exit logging

### 7.2 Tooling and runtime assumptions

The repository must not assume bundled runtime tooling under `runtime/`.

Use environment-provided tools instead:

- Java 21
- Maven
- PostgreSQL client tooling such as `psql`

Backend build/run/test commands on this host must explicitly use JDK 21 and must not rely on the shell default Java if it points elsewhere.

### 7.3 Browser verification on this host

For this machine, Chromium/Chrome is the practical browser-verification baseline unless the user explicitly asks to retry Firefox.

### 7.4 Runtime isolation

For this training workspace, the default verified local ports are:

- frontend `5182`
- backend `18082`

Repo-local cleanup and shutdown logic must only target processes and artifacts that belong to this workspace.

---

## 8. Quality and Verification Requirements

Changes should continue to be verified using the live project toolchain:

- backend Maven test runs
- frontend production build
- frontend Vitest suite
- live API smoke checks
- Playwright-based browser verification
- PostgreSQL schema/demo reload when data reset is needed

Documentation must track the live baseline rather than earlier migration assumptions.

For day-to-day implementation guidance, use:

- the current lab chapter
- `lab-materials/student-workspace-guide.md`
- `lab-materials/docs/technical-design-jersey-rewrite.md`

---

## 9. Non-Goals for the Current Phase

The following are not current requirements unless the user explicitly asks for them:

- reintroducing Spring Boot, JPA, or repository abstractions from the older runtime
- reintroducing MySQL assumptions
- publishing Swagger UI/OpenAPI docs as part of the active runtime
- repo-bundled offline Java, Maven, browser, or database tooling under `runtime/`
- expanding runtime scope to lab-only tables such as `aihr_pay_grades`

---

## 10. Document Intent

This file captures the current functional baseline for this training repo and should stay aligned with the live learner-facing implementation.

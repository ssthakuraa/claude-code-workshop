# Test Migration Plan

## Current state
- The active backend runtime is Jersey/JAX-RS.
- The targeted backend test suite is Jersey-focused and currently passes through `mvn clean test`.
- Auth/resource/foundation coverage exists without requiring any legacy framework runtime.
- Remaining work in this file is cleanup and coverage expansion, not first-pass migration.

## Migration strategy
1. **Keep tests runtime-aligned**: Prefer Jersey/resource-focused tests and pure-unit tests that do not assume a container-managed framework runtime.
2. **Expand high-value endpoint coverage**: Add targeted tests where cleanup or defect fixes change behavior.
3. **Keep PostgreSQL-backed verification explicit**: Use live smoke checks and page-sweep verification for the active local runtime.
4. **Remove stale migration commentary**: Keep this file synchronized with the current runtime instead of describing pre-rewrite plans.

### Recent additions
- Added `HrHealthResourceIT` under `src/test/java/com/company/hr/test`. It boots `HrApplicationConfig` with a runtime config fixture and hits `/app/hr/api/v1/health` to validate that the Jersey bootstrap, filters, and `HrApiResponse` envelope work together before other resources are ready. This test can serve as the template for future endpoint coverage.
- Added `HrApplicationConfigTest` to verify that the configured base path, Jersey registration, and CORS headers align with the runtime config values rendered through `HrApplicationConfig`.
- Added `HrReadOnlyResourceTest` to validate the Jersey read-only resource slice for `/jobs`, `/departments`, and `/dashboard/summary` without requiring a live database connection.
- Added `HrAuthServiceTest` to cover Jersey-era login and refresh token issuance without legacy runtime wiring.
- Added `HrAuthResourceTest` to validate `/auth/login` and `/auth/refresh` envelope/error behavior with the Jersey exception mapper.
- Added `HrAuthResourceTest` plus `StubHrAuthRepository` to validate `/auth/login`, `/auth/refresh`, validation errors, and unauthorized envelopes without a live database dependency.
- Added `HrEmployeeResourceTest` to validate paged `/employees` responses, embedded job history on `/employees/{id}`, the preserved `managerId` list contract, and Jersey-side hire/terminate resource behavior.

## Next steps
- Add targeted tests for cleanup-driven behavior changes.
- Extend resource-level coverage where code review uncovers risk.
- Keep live PostgreSQL-backed verification scripts aligned with the frontend's real login and page assumptions.

## Current verification status
- Current targeted backend suite passes:
  - `JerseyFoundationTest`
  - `HrApplicationConfigTest`
  - `HrReadOnlyResourceTest`
  - `HrAuthServiceTest`
  - `HrAuthResourceTest`
  - `HrEmployeeResourceTest`
- Live PostgreSQL-backed smoke checks passed on 2026-04-17 for:
  - `GET /app/hr/api/v1/health`
  - `GET /app/hr/api/v1/jobs`
  - `GET /app/hr/api/v1/departments`
  - `GET /app/hr/api/v1/dashboard/summary`
  - `POST /app/hr/api/v1/auth/login`
  - `POST /app/hr/api/v1/auth/refresh`
  - `POST /app/hr/api/v1/auth/logout`
  - `GET /app/hr/api/v1/employees?page=0&size=2&sort=lastName`
  - `GET /app/hr/api/v1/employees/100`
  - `POST /app/hr/api/v1/employees`
  - `POST /app/hr/api/v1/employees/terminate`
- The local PostgreSQL demo dataset currently accepts the documented demo password `password123` for the active verification user set.
- One live verification employee was created and immediately terminated during Jersey command-path validation; the terminated response now returns the preserved employee detail envelope instead of falling through to a deleted-row `404`.
- On 2026-04-11, `mvn clean test` passed successfully for the current backend reactor after refreshing the local Maven cache.

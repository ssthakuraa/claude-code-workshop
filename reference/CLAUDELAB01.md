# CLAUDE.md — HR Enterprise Platform

## Project
Spring Boot 3.2 + React 19 monorepo. Java 21, Maven multi-module.
API base: /app/hr/api/v1/

## Naming
- All Java classes prefixed `Hr` (HrEmployee, HrRegionService)
- Entities map to DB tables (HrRegion → regions)

## Database
- database/schema.sql is READ ONLY — never edit
- Use @SQLRestriction("deleted_at IS NULL") NOT @Where (deprecated)
- Schema changes via Flyway migrations only (db/migration/)

## Logging
- Every service method: HrLogHelper entry/exit logging
- Never log PII (email, phone, salary) — use MASKED

## API
- ALL endpoints return HrApiResponse<T> — never raw objects
- Paginated lists return HrPagedResponse<T>

## Security
- All service methods need @PreAuthorize
- RBAC: ROLE_ADMIN, ROLE_HR_SPECIALIST, ROLE_MANAGER, ROLE_EMPLOYEE

## Build
- Backend: cd backend && mvn clean install
- Frontend: cd frontend && npm install && npm run dev

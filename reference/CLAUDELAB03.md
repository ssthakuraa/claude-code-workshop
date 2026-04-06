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

## Employee Lifecycle Rules
- Every hire/promote/transfer/terminate MUST write a job_history record
- Hire endpoint requires idempotency key (X-Idempotency-Key header, checked in service layer)
- Email uniqueness must be validated before creating an employee
- Salary must be validated against the job's min/max range before saving
- createUserForEmployee() must create an hr_users entry with ROLE_EMPLOYEE on hire
- @Transactional wraps ALL writes (employee + user + job_history + idempotency key)

## Verification Chain
- After building a feature: run component-reviewer agent, fix findings, run tests
- For frontend: also verify with Playwright MCP (screenshot + element check)

## Skills & Commands
- Entity scaffolding: use /scaffold-entity skill for new entities
- Test runner: /run-tests (add "frontend" arg to include lint)

## Build
- Backend: cd backend && mvn clean install
- Frontend: cd frontend && npm install && npm run dev

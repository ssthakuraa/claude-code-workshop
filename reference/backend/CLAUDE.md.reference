# backend/CLAUDE.md — Java/Spring Rules

Applies when working in the `backend/` directory. Loaded in addition to root CLAUDE.md.

---

## Naming

- All Java classes use the `Hr` prefix — e.g., `HrEmployee`, `HrRegionService`, `HrJobRepository`
- Entities map directly to DB table names — `HrRegion` → `regions`, `HrDepartment` → `departments`
- DTOs end in `Dto` — `HrEmployeeDto`
- Request objects end in `Request` — `HrHireRequest`

## Database

- Use `@SQLRestriction("deleted_at IS NULL")` for soft-delete — NOT `@Where` (deprecated in Hibernate 6.2)
- `database/schema.sql` is READ ONLY — never edit it
- Schema changes go through Flyway migrations only (`db/migration/`)

## Logging

- Every service method MUST log entry and exit using `HrLogHelper`
- Never log PII (email, phone, salary) — use `MASKED` placeholder
- Pattern: `log.debug("HrEmployeeService.findById entry — id={}", id)`

## API Response

- ALL controller endpoints must return `HrApiResponse<T>` — never return raw objects or DTOs directly
- Paginated lists return `HrPagedResponse<T>`

## Security

- All service methods need `@PreAuthorize`
- RBAC roles: `ROLE_ADMIN`, `ROLE_HR_SPECIALIST`, `ROLE_MANAGER`, `ROLE_EMPLOYEE`

## Build

```bash
cd backend
mvn clean install
mvn spring-boot:run -pl hrapp-service -Dspring-boot.run.profiles=dev
```

# CLAUDE.md — HR Enterprise Platform

This file governs Claude Code behavior for this project. Always read this before starting any task.

---

## Project Overview

**HR Enterprise Platform** — Spring Boot + React monorepo.

- **Backend:** Java 21, Spring Boot 3.2, Maven multi-module (`hrapp-common` + `hrapp-service`)
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (Oracle Redwood tokens)
- **Database:** MySQL 8.0, Flyway migrations
- **API Base Path:** `/app/hr/api/v1/`

---

## Project Structure

```
hr/
├── backend/
│   ├── pom.xml                  # Parent POM
│   ├── hrapp-common/            # Shared utilities (no Spring Boot dep)
│   └── hrapp-service/           # Main Spring Boot app
├── frontend/                    # React app (Vite)
├── database/
│   ├── schema.sql               # Reference DDL
│   └── demo.sql                 # Seed data reference
├── docs/
│   ├── requirement.md
│   └── technical-design.md
└── CLAUDE.md
```

---

## Naming Conventions

- All Java classes use the `Hr` prefix (e.g., `HrEmployee`, `HrApiResponse`)
- All entities map directly to DB table names

## Database Rules

- `database/schema.sql` is READ ONLY — never edit it
- Use `@SQLRestriction("deleted_at IS NULL")` for soft-delete filtering — NOT `@Where` (deprecated in Hibernate 6.2)
- Schema changes go through Flyway migrations only (`db/migration/`)

## Logging Pattern

- Every service method MUST log entry and exit using `HrLogHelper`
- Never log PII (email, phone, salary) — use `MASKED` placeholder

## API Response

- ALL controller endpoints must return `HrApiResponse<T>` — never return raw objects or DTOs directly
- Paginated lists return `HrPagedResponse<T>`

## Security

- All service methods need `@PreAuthorize`
- RBAC roles: `ROLE_ADMIN`, `ROLE_HR_SPECIALIST`, `ROLE_MANAGER`, `ROLE_EMPLOYEE`

## Employee Lifecycle Rules
- Every hire/promote/transfer/terminate MUST write a job_history record
- Hire endpoint requires idempotency key (checked in service layer)
- Email uniqueness must be validated before creating an employee
- Salary must be validated against the job's min/max range before saving
- createUserForEmployee() must create an hr_users entry with ROLE_EMPLOYEE on hire
- findById masks salary/PII based on HrSecurityUtil.canViewSalary()/canViewPii()
- hireEmployee() must check MANAGER and DEPARTMENT existence before assigning them
- @Transactional wraps ALL writes (employee + user + job_history + idempotency)

## Skills & Commands
- Entity scaffolding: use `/scaffold-entity` skill for new entities
- Test runner: `/run-tests` (add "frontend" arg to include lint)

## Session Discipline
- `/clear` between unrelated tasks — don't let Task A's context pollute Task B
- Delegate large file reads to subagents — keep main context for implementation
- If context > 70%, use `/compact` or start a fresh session
- Check `/status` periodically — context is your most precious resource

## Frontend

- Use TanStack Query (`useQuery`/`useMutation`) for all API calls
- Use `HrApiClient` for HTTP requests
- Use React Hook Form with Zod validation

## MCP — MySQL
- Configured in `.mcp.json` with read-only user (`hr_readonly`)
- Use for: data verification after operations, integrity checks, reporting
- Never use for mutations — read-only access only
- Full verification loop: Playwright (UI) + API (curl) + MySQL (data)

## MCP — Playwright
- Configured in `.mcp.json` for headless browser automation
- Use for: UI verification, screenshots, form interaction testing
- Combine with MySQL MCP for end-to-end data verification

## Build & Run

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run -pl hrapp-service -Dspring-boot.run.profiles=dev

# Frontend
cd frontend
npm install
npm run dev
```

---

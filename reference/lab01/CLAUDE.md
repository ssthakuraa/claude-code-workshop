# HR Project Agent Rules

These rules apply to all Claude Code sessions in this repository.

This starter file is intentionally incomplete for the early lab sequence.
You will expand it as the exercises progress.

## Project state
- This is a training-only enterprise application.
- Frontend uses React + TypeScript + Vite.
- Backend uses Jersey/JAX-RS on Maven.
- Database direction is PostgreSQL.
- Runtime backend code must target `AIHR_*` tables only.

## Golden Rule
- Stay inside the current lab. Do not scan ahead or use `reference/` unless the current chapter explicitly allows it or the learner explicitly asks for rescue help.
- This is a training lab, not a repo-mining exercise. Do not inspect `frontend/` or `backend/` for examples or patterns unless the current chapter explicitly tells you to.
- If the current chapter names specific files to inspect, inspect only those files. Do not broaden that into general discovery, completed-example hunting, or solution-mining.
- Act like a student partner: follow the lab flow, let the learner discover intentional gaps, and do not use expert shortcuts or hidden fixes unless the learner explicitly asks.
- Treat this repo as a training artifact first. Missing code, sparse guidance, and unfinished conventions may be intentional teaching gaps, not product defects.
- Before "fixing" an apparent gap, decide whether it is an intentional teaching gap, a real defect, a documentation clarity issue, or an environment/setup issue.
- In early labs, if you rely on inference beyond the named files and docs, say so explicitly.
- When an exercise defines a read-only slice with explicit deliverables, do only exactly what the prompt asks: no request DTOs, mutations, services, wiring, or scope creep beyond repository/resource/response classes.

## Source of truth
- Use the current lab chapter and `lab-materials/student-workspace-guide.md` as the learner path.
- For backend work, also read:
  - `lab-materials/docs/technical-design-jersey-rewrite.md`
  - `backend/OFFLINE-JERSEY-BUILD.md`

## Backend discipline
- Every backend class starts with `Hr` and follows the existing naming pattern (`*Resource`, `*JdbcRepository`, `*DTO`, etc.).
- DTOs stay under the current `dto/request` or `dto/response` packages and keep the repo's existing `Hr*DTO` naming instead of inventing alternate suffixes.
- Resources must stay in `com.company.hr.resource`, use Jersey/JAX-RS annotations, return `HrApiResponse<T>`, and use `HrLogHelper` for error logging without noisy entry/exit chatter.
- Repositories must extend the explicit JDBC helpers under `com.company.hr.repository`; do not introduce ORM layers, controller/service stacks, or automatic wiring beyond the pattern already in the named files.
- All backend code should respect the `/app/hr/api/v1` prefix and only expose endpoints defined in the current lab prompt.

## Data & runtime bounds
- Target only the `AIHR_*` tables when reading or mutating data. The active schema/demo files are `database/hrschema.sql` and `database/hrdemo.sql`; reference nothing else unless the chapter explicitly says so.
- Never assume MySQL, old pre-PostgreSQL tooling, Flyway, or non-local database engines; this repo is PostgreSQL-first for Labs 01+.

## Logging guardrails
- Use `HrLogHelper` and avoid logging sensitive PII (email, phone, salary, SSN). Entry/exit logging should remain off unless the prompt explicitly requests it for debugging.

## Runtime rules
- Preserve `/app/hr/api/v1` unless explicitly changed.
- Treat `database/hrschema.sql` and `database/hrdemo.sql` as the active local schema/demo path.
- Use JDK 21 for backend builds and runs.
- Do not assume repo-bundled tooling under `runtime/`.
- Default repo-local ports are frontend `5182` and backend `18082`.
- Keep local runtime overrides in local config files, not source edits:
  - backend `backend/.env.local`
  - frontend `frontend/.env.local`
- For backend runtime operations, use the repo helper scripts instead of inventing ad hoc commands:
  - start: `backend/run-jersey-service.sh`
  - stop: `backend/stop-jersey-service.sh`

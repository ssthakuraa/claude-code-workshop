# Build Note: Employee Service Implementation

**Date:** 2026-03-30
**Module:** Backend — HrEmployeeService (implementation phase)
**Maps to Lab:** Lab 4: Context Management

---

## What We Built

Full implementation of `HrEmployeeService` based on the design from Build Note #06:
- `findAll()`: paginated, filterable by search/status/departmentId, returns `HrPagedResponse<HrEmployeeSummaryDTO>`
- `findById()`: returns `HrEmployeeDetailDTO` with PII/salary masking
- `hireEmployee()`: creates employee + initial job_history, idempotency key check
- `terminateEmployee()`, `promoteEmployee()`, `transferEmployee()`: each updates employee + writes job_history
- DTOs: `HrEmployeeSummaryDTO`, `HrEmployeeDetailDTO`, `HrEmployeeCreateRequest`, `HrEmployeeUpdateRequest`, `HrTerminateRequest`, `HrPromoteRequest`, `HrTransferRequest`

## Technique Used

**Context management** — service split into two prompts: (1) DTOs + findAll/findById, (2) lifecycle actions. Kept each prompt under ~200 lines of generated code to prevent context drift.

## The Prompt That Worked

**Prompt 1 — Read methods:**
```
Implement HrEmployeeService read methods based on the design in CLAUDE.md.
Start with:
1. HrEmployeeSummaryDTO: id, fullName, jobTitle, department, status, employmentType, country, avatar
2. HrEmployeeDetailDTO: all summary fields + email (masked if !canViewPii), phone (masked),
   salary (masked if !canViewSalary), hireDate, managerId, managerName, directReports[]
3. findAll(Pageable, search, departmentId, status): use Specification pattern for filters
4. findById(Integer id): throw HrNotFoundException if not found
```

**Prompt 2 — Lifecycle actions:**
```
Add lifecycle methods to HrEmployeeService:
- hireEmployee(HrEmployeeCreateRequest): check idempotency key in X-Idempotency-Key header,
  save employee, write job_history (action=HIRE, effectiveDate=hireDate)
- terminateEmployee(HrTerminateRequest): set status=TERMINATED, write job_history
- promoteEmployee(HrPromoteRequest): update jobId+salary, write job_history
- transferEmployee(HrTransferRequest): update departmentId+locationId+managerId, write job_history
Each method uses HrLogHelper entry/exit. Never log salary or email directly.
```

## What Failed First

- **Symptom:** `findAll()` Specification filter for `search` caused N+1 queries — one query per employee to resolve department name.
- **Root cause:** HQL `LIKE` search joined `department` lazily. Each row triggered a lazy load.
- **Fix:** Added `@EntityGraph(attributePaths = {"department", "job", "manager"})` to the repository method used by findAll, forcing a single JOIN FETCH.

- **Symptom:** Context drift on Prompt 2 — Claude forgot the `HrLogHelper` pattern and used `log.info()` directly.
- **Root cause:** Prompt 1 output was long (~180 lines). By Prompt 2, the logging pattern had scrolled out of the active window.
- **Fix:** Added `// REMINDER: use LOGGER.info("Entering methodName(...)") — see HrLogHelper pattern in CLAUDE.md` at the top of Prompt 2. Immediately fixed.

## CLAUDE.md / Skill Update Made

```markdown
## Performance Rules
- Employee findAll: always use @EntityGraph for department/job/manager — prevents N+1
- Never use log.info() directly — always use HrLogHelper (LOGGER.info)
```
**Why:** N+1 is the most common JPA performance bug. The logging rule reinforces the mandatory pattern.

## Key Teaching Points

1. Split large service implementations into 2-3 prompts — read methods first, write methods second.
2. Context reminders at the top of each prompt prevent style drift on long implementations.
3. `@EntityGraph` is the correct fix for N+1 in Spring Data — not `FetchType.EAGER` (which is always-on).

## Lab Exercise Derivation

- **Setup:** HrEmployeeService stub with method signatures. HrEmployeeRepository exists.
- **Task:** Implement findAll() with search filter. Deliberately omit @EntityGraph. Run a query with 20+ employees and observe N+1 in logs. Add @EntityGraph and compare.
- **Expected discovery:** N+1 is invisible without logging — `show-sql: true` in application.yml is essential during development.
- **Success criteria:** GET /employees with search param returns correct results; SQL log shows single JOIN query not N+1 selects.

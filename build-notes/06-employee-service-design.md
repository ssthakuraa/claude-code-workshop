# Build Note: Employee Service Design

**Date:** 2026-03-30
**Module:** Backend — HrEmployeeService (design phase)
**Maps to Lab:** Lab 3: Plan Mode

---

## What We Built

Design (not implementation) of `HrEmployeeService` covering:
- `findAll()` — paginated, filterable by status/department/search
- `findById()` — returns `HrEmployeeDetailDTO` (PII/salary masked based on role)
- `hireEmployee()` — creates employee + job_history record, idempotency key
- `terminateEmployee()`, `promoteEmployee()`, `transferEmployee()` — lifecycle actions
- Each action writes to `job_history` (audit trail)

## Technique Used

**Plan Mode** — designed the full service interface and data flow before writing a single line of implementation. This uncovered the idempotency and job_history requirements before they became bugs.

## The Prompt That Worked

```
/plan
Design HrEmployeeService for the HR platform. Include:
1. Method signatures for findAll (paginated, filterable), findById, hireEmployee,
   terminateEmployee, promoteEmployee, transferEmployee
2. What DTOs each method returns (HrEmployeeSummaryDTO vs HrEmployeeDetailDTO)
3. How PII masking and salary masking work (role-based)
4. Idempotency strategy for hireEmployee (POST is not idempotent by default)
5. How job_history is populated for each lifecycle action
Show the data flow, not the implementation.
```

## What Failed First

- **Symptom:** First implementation attempt (without Plan Mode) created `hireEmployee()` that returned the new employee but didn't write a `job_history` entry.
- **Root cause:** The prompt said "create an employee" — Claude only did that. The audit trail requirement was in `requirement.md` but not in the prompt.
- **Fix:** Plan Mode output surfaced the job_history requirement as step 3 of the data flow. Re-prompted with explicit job_history write as a constraint.

## CLAUDE.md / Skill Update Made

```markdown
## Employee Lifecycle Rules
- Every hire/promote/transfer/terminate MUST write a job_history record
- Hire endpoint requires X-Idempotency-Key header (checked in service layer)
- findById masks salary/PII if HrSecurityUtil.canViewSalary()/canViewPii() returns false
```
**Why:** These are cross-cutting business rules that Claude skips without explicit instruction.

## Key Teaching Points

1. Plan Mode is essential for complex services — it surfaces implicit requirements before implementation.
2. "Create X" prompts produce only X. Audit trails, idempotency, and masking need explicit mention.
3. The plan output should feed directly into CLAUDE.md as rules — not just be discarded.

## Lab Exercise Derivation

- **Setup:** HrEmployeeService interface stub, empty implementation.
- **Task:** Use Plan Mode to design the full service, then implement `hireEmployee()` based on the plan.
- **Expected discovery:** Without Plan Mode, students skip job_history. With it, they naturally include it.
- **Success criteria:** POST /employees creates a job_history row; GET /employees/{id} masks salary for ROLE_EMPLOYEE.

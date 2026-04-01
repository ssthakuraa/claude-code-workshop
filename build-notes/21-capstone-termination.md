# Build Note: Capstone — Termination Flow

**Date:** 2026-03-30
**Module:** Full-stack feature — Employee termination end-to-end
**Maps to Lab:** Lab 15: Capstone

---

## What This Lab Covers

The capstone ties together every technique from the workshop into one realistic, multi-step feature. Participants build the **employee termination flow** from scratch — backend service, frontend wizard, MCP verification, and quality gates — using Claude Code with no hand-holding.

This is a **practitioner exercise**, not a demonstration. The lab spec gives the business requirements; participants choose which Claude Code techniques to apply and in what order.

---

## Business Requirements

**Terminate an employee:**

1. Manager or HR Specialist initiates via the Terminate button on Employee 360 View
2. Wizard collects: termination type (voluntary/involuntary/retirement), effective date, reason (free text), severance weeks (0–26)
3. On submit: employee status → TERMINATED, `terminated_at` set, `job_history` closed (end_date = effective date)
4. Final paycheck calculation stored: `severance_amount = (annual_salary / 52) * severance_weeks`
5. User account deactivated (not deleted): `users.active = false`
6. Audit log entry written
7. Notification sent to: the employee's manager, HR admin
8. UI: confirmation screen with summary; Employee Directory immediately removes the terminated employee (soft delete filter)

---

## Suggested Technique Sequence (Capstone Guide)

Participants are encouraged to discover their own sequence. This is one that works:

```
Step 1 — Plan Mode
"Plan the full termination feature: backend changes, frontend wizard,
DB migration if needed, and verification approach."
→ Reveals: need a new Flyway migration for severance_amount column,
  job_history needs end_date populated, notifications are fire-and-forget

Step 2 — Backend (one prompt)
"Implement HrEmployeeService.terminate() per the plan.
Follow CLAUDE.md patterns. Return HrApiResponse<HrTerminationResultDTO>."

Step 3 — Frontend (one prompt)
"Build TerminatePage.tsx as a 3-step wizard:
Step 1: type + effective date. Step 2: reason + severance. Step 3: confirmation.
On submit: POST to /app/hr/api/v1/employees/{id}/terminate."

Step 4 — Verify (full MCP loop)
"Use Playwright MCP to submit the termination wizard for employee ID 5.
Then use MySQL MCP to verify:
- employees: status = TERMINATED, terminated_at set
- job_history: end_date = effective date
- users: active = false
Report pass/fail."

Step 5 — Quality gate
"Run tsc --noEmit. Fix any errors."
```

---

## What Participants Typically Discover

**Common gap #1:** `TerminatePage.tsx` already existed as a stub (built in the frontend pages commit). Participants who read the file first avoid re-building it from scratch. Those who don't create a duplicate.
→ **Lesson:** Always read before building. `git ls-files | grep -i terminat` finds it in seconds.

**Common gap #2:** The soft delete filter (`@SQLRestriction("deleted_at IS NULL")`) means terminated employees disappear from `findAll()` immediately after `terminated_at` is set. This is correct behavior — but participants are surprised when the Employee Directory empties the row before they verify via MCP.
→ **Lesson:** The filter works as designed. MCP verification must happen before the UI refreshes, or query the `employees` table directly with `WHERE employee_id = ?` (bypasses soft delete filter at the DB level).

**Common gap #3:** `severance_amount` column doesn't exist in the initial schema. Participants who run Plan Mode first catch this and add a Flyway migration. Those who skip Plan Mode get a `Column 'severance_amount' doesn't exist` runtime error.
→ **Lesson:** Plan Mode surfaces schema dependencies that code review misses.

**Common gap #4:** Notification sending (to manager and HR admin) requires knowing the manager's email. `HrEmployee.managerId` is an FK to `employees`. Participants who don't read the entity carefully try to call `employee.getManagerEmail()` which doesn't exist.
→ **Lesson:** Read the entity before assuming what fields are available.

---

## The Full Capstone Prompt (Given to Participants)

```
Build the employee termination feature end-to-end.

Requirements:
- POST /app/hr/api/v1/employees/{id}/terminate
  Body: { terminationType, effectiveDate, reason, severanceWeeks }
- Business rules:
  * Only ROLE_HR_SPECIALIST or ROLE_ADMIN can terminate
  * Cannot terminate an already-TERMINATED employee (return 409)
  * severance_amount = (annual_salary / 52) * severanceWeeks
  * Cascade: status=TERMINATED, terminated_at=effectiveDate,
    job_history.end_date=effectiveDate, users.active=false
  * Write audit log entry
- Frontend: TerminatePage.tsx wizard (check if stub exists first)
- Verification: use full MCP loop after submit
- Quality gate: tsc --noEmit must pass

Apply Claude Code techniques as you see fit.
Use Plan Mode, parallel agents, hooks, or MCP — your choice.
Start by reading the existing codebase, then plan, then build.
```

---

## CLAUDE.md / Skill Update Made

No new rules — the capstone validates that all existing rules are internalized. If a participant needs to look up the logging pattern, response envelope, or RBAC annotation during the capstone, that's a signal that those rules need reinforcement in CLAUDE.md.

---

## Key Teaching Points

1. **Read before build** — existing stubs, entity fields, and schema gaps only appear if you look. The capstone is designed to reward participants who read first.
2. **Plan Mode pays off on complex features** — the termination flow has 7 side effects. Plan Mode finds the Flyway gap and notification design before a line of code is written.
3. **MCP loop is the acceptance test** — no manual testing required. Playwright submits; MySQL verifies. Pass/fail is unambiguous.
4. **The workshop techniques compound** — CLAUDE.md (conventions) + Plan Mode (design) + parallel agents (speed) + MCP (verification) + hooks (quality) working together produces a complete, correct feature in one session.

---

## Lab Exercise Derivation

- **Setup:** HR app with TerminatePage stub, no `HrEmployeeService.terminate()` method, no severance_amount column.
- **Task:** Build the full termination flow using any combination of workshop techniques. Time the session.
- **Evaluation rubric:**
  - Backend compiles and all existing tests still pass: ✅
  - tsc --noEmit passes: ✅
  - Playwright MCP submits wizard successfully: ✅
  - MySQL MCP shows all 4 side effects (employee, job_history, users, audit_log): ✅
  - 409 returned for double-terminate: ✅
- **Success criteria:** All 5 rubric items pass. Bonus: achieved in under 30 minutes using parallel agents.

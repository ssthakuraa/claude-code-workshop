# Build Note: Full MCP Verification Loop

**Date:** 2026-03-30
**Module:** MCP — Playwright + MySQL combined verification workflow
**Maps to Lab:** Module 12B: Full MCP Loop

---

## What This Lab Covers

Using all three MCP servers together in one end-to-end workflow:

1. **Playwright MCP** — drive the UI (fill form, click submit)
2. **API layer** — the app processes the action
3. **MySQL MCP** — verify the DB state matches what the UI reported

This closes the full verification loop: **UI action → API → DB state → UI confirmation**.

Without this pattern, you can only verify one layer at a time. The combined loop catches bugs that each tool misses individually — for example, a UI that shows "success" but the DB write silently failed, or a DB that has the right data but the UI displays it wrong.

---

## The Scenario

**Hire a new employee using the Hire Wizard UI, then verify all three side effects:**

1. Employee row created in `employees` table (status = PROBATION or ACTIVE)
2. Job history record written to `job_history` table
3. User account created in `users` table
4. UI shows the new employee in the Employee Directory

---

## The Prompt That Worked

```
The frontend dev server is running at http://localhost:5173.
Use Playwright MCP and MySQL MCP together to verify the full hire workflow:

STEP 1 — UI: Navigate to http://localhost:5173/hr/employees/hire
Fill the wizard:
  - First name: Test, Last name: Verify, Email: test.verify@example.com
  - Department: Engineering, Job: Software Engineer, Start date: today
  - Salary: 85000
Click Submit and take a screenshot of the confirmation.

STEP 2 — DB: Use MySQL MCP to run these queries:
  SELECT employee_id, first_name, last_name, status FROM employees
  WHERE email = 'test.verify@example.com';

  SELECT * FROM job_history WHERE employee_id = {id from above};

  SELECT username, role FROM users WHERE employee_id = {id from above};

STEP 3 — UI: Navigate to http://localhost:5173/hr/employees
Search for "Test Verify" — verify the employee appears in the directory.

Report: pass/fail for each step, and any discrepancy between UI and DB state.
```

---

## What Failed First

- **Symptom:** Playwright couldn't find the "Submit" button on the hire wizard — click failed with "element not found".
- **Root cause:** The wizard uses a multi-step form. The final submit button only appears on step 3. Claude tried to click it on step 1.
- **Fix:** Added explicit step-by-step instructions: "Click Next, wait for step 2 to load, click Next again, then click Submit." Playwright MCP is stateful within a session — it waits for each action before proceeding.

- **Symptom:** MySQL MCP query returned 0 rows immediately after Playwright submitted the form.
- **Root cause:** Race condition — the API is async; MySQL MCP queried before the transaction committed.
- **Fix:** Added "Wait 2 seconds after submit before querying the DB." In the prompt, this means separating the Playwright steps from the MySQL steps with an explicit wait instruction.

- **Symptom:** Claude issued all MCP calls sequentially — Playwright first, then MySQL. Took 45 seconds.
- **Root cause:** Default behavior is sequential tool use.
- **Fix:** Restructured the prompt so Playwright handles UI steps, then MySQL handles all three SELECT queries in parallel (Claude can call multiple MCP tools in one turn). Reduced to ~20 seconds.

---

## CLAUDE.md / Skill Update Made

Created skill `/verify-hire`:
```
Start the dev server if not running (npm run dev, run_in_background).
Use Playwright MCP to submit the hire wizard with: $EMPLOYEE_DATA
Wait 2 seconds. Then use MySQL MCP to verify:
1. SELECT from employees WHERE email = $EMAIL
2. SELECT from job_history WHERE employee_id = {id}
3. SELECT from users WHERE employee_id = {id}
4. Navigate to /hr/employees and verify the employee appears.
Report pass/fail for each check.
```

---

## Key Teaching Points

1. **The loop catches what unit tests miss** — UI integration + DB state together is the only way to verify the full stack end-to-end without writing test code.
2. **Order matters** — always Playwright action first, wait, then MySQL verification. Reversing this causes race conditions.
3. **Claude can parallelize MCP calls** — multiple MySQL SELECT queries in one turn run concurrently. Prompt structure affects performance.
4. **Playwright is a driver, MySQL is a verifier** — never write to the DB via MySQL MCP. If DB state is wrong, fix it via the API.

---

## Lab Exercise Derivation

- **Setup:** Frontend running at localhost:5173. Backend running. MySQL DB seeded. Both MCP servers configured.
- **Task:** Use the full loop to hire a test employee. Deliberately introduce a bug: comment out the `job_history` insert in `HrEmployeeService.hire()`. Re-run the loop.
- **Expected discovery:** Playwright reports "hire succeeded" (UI shows success). MySQL MCP shows employee row exists but `job_history` is empty — the bug is visible only at the DB layer.
- **Success criteria:** Claude correctly reports "Employee created ✅ | Job history missing ❌ | User account created ✅".

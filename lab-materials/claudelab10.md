# Lab 10: Data Verification — Runtime Data Checks

**Duration:** 75 minutes

> Recommended Day 2 order: **Lab 09 → Lab 08 → Lab 07 → Lab 10 → Lab 11 → optional Lab 12**.
> This file is the fourth stop in that sequence, after browser verification and
> the earlier implementation loops are already in place.

## Learning Objective

You will use Claude Code with the repo's current PostgreSQL workflow to verify that
backend operations write correct data. Combined with browser verification, this
creates a full verification loop: browser → API → database.

## The Key Concept

The point of this lab is simple: Claude Code should be able to inspect real database
state in a read-oriented way so you can verify that the UI, API, and stored
data all agree.

Database verification lets Claude Code:

- verify that an API operation wrote correct data
- investigate bugs by checking actual database state
- generate reports from live data
- validate data integrity across tables

**Security:** Verification access should remain read-oriented. The learner
should use the current PostgreSQL connection metadata and `psql`, not ad hoc
mutation scripts or legacy SQLcl helpers. Verification should never become an
excuse for direct production-style writes.

**The full verification loop:** browser sees UI state, API calls see the live
response, and `psql` sees actual stored data. Compare all three: any mismatch
= bug.

---

## Setup

Ask Claude Code to do the repo reads and runtime checks in this section unless you
need to inspect a value yourself.

```text
This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use hidden completed examples or old conversion notes.

Read `dbdetails.md` and summarize the current non-secret database connection
metadata for this learner workspace.
Then confirm whether the backend and frontend are already running on the lab
ports:
- backend `18082`
- frontend `5182`
```

Keep the database verification path strict for this lab:

- use `psql` with the values from `dbdetails.md` for read-oriented database work
- keep the learner path on direct `psql` verification plus the live API write flow
- do not assume repo-bundled SQL tooling under `runtime/`
- do not download or install alternate SQL tools during the lab
- if `18082` or `5182` are already in use when you verify the app state, treat stale repo-owned backend/frontend processes as the first suspect and restart them cleanly on the reserved ports
- for backend cleanup, use `cd backend && ./stop-jersey-service.sh`
- keep any local port overrides in `backend/.env.local` and `frontend/.env.local`

---

## Exercise 1: Prepare The Database Verification Workflow (15 min)

### Goal

Prepare a repeatable database verification workflow using the repo's active
PostgreSQL path.

### Instructions

1. Ask Claude Code to explain the current database verification path:
   ```text
   This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use hidden completed examples or old conversion notes.

   Read `dbdetails.md`, `backend/OFFLINE-JERSEY-BUILD.md`, and `CLAUDE.md`.
   Explain the intended database verification workflow for this repo.
   Then give me the safest repeatable way to run read-only verification queries
   against the HR dataset in this learner workspace.
   ```

2. **Smoke test:**
   ```text
   Run read-only verification queries and tell me:
   - how many rows exist in AIHR_EMPLOYEES
   - how many rows exist in AIHR_DEPARTMENTS
   - how many rows exist in AIHR_JOBS
   ```

### What You Should See

Claude Code helps run read-oriented `psql` queries and returns the results directly
in the conversation.

---

## Exercise 2: Data Exploration (15 min)

### Goal

Use database verification queries to understand the data landscape before
verification.

### Instructions

1. **Explore the schema:**
   ```text
   Show me the main AIHR tables with their row counts.
   Then show the columns and types for the AIHR employees table.
   ```

2. **Run business queries:**
   ```text
   Show me:
   1. Employee count by department
   2. Average salary by job title
   3. Employees hired in the last 30 days
   4. The management hierarchy for the top 3 levels
   ```

3. **Check data integrity:**
   ```text
   Are there any data integrity issues?
   - Employees without a job assignment?
   - Departments without a manager?
   - Job history records without matching employees?
   - Orphaned records in any table?
   ```

### What You Should See

Claude Code runs precise SQL queries and reports findings. This is how you would
investigate a real data issue: Claude Code as a SQL copilot, not as a guesser.

---

## Exercise 3: Operation Verification (30 min)

### Goal

Verify that a backend operation writes correct data across the relevant tables.

### Instructions

1. **Before the operation — capture baseline:**
   ```text
   Query the database and tell me:
   1. current AIHR_EMPLOYEES row count
   2. current AIHR_USERS row count
   3. current AIHR_JOB_HISTORY row count
   Save these numbers so we can compare after the hire.
   ```

2. **Obtain a real access token through the live API.** You may run this
   yourself or ask Claude Code to prepare and execute it:
   ```bash
   curl -sS -X POST http://127.0.0.1:18082/app/hr/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "steven.king",
       "password": "password123"
     }'
   ```

   Save the returned access token. Do not paste a refresh token into later
   commands by accident.

3. **Perform a hire operation via the API:**
   ```bash
   RUN_TAG="sv001"  # Example only. Replace with your own short unique tag.
   HIRE_EMAIL="lab.testhire.${RUN_TAG}@example.com"
   HIRE_LAST_NAME="TestHire${RUN_TAG}"
   ACCESS_TOKEN="YOUR_REAL_ACCESS_TOKEN_HERE"

   curl -sS -X POST http://127.0.0.1:18082/app/hr/api/v1/employees \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer ${ACCESS_TOKEN}" \
     -d "{
       \"idempotencyKey\": \"lab10-${RUN_TAG}\",
       \"firstName\": \"Lab\",
       \"lastName\": \"${HIRE_LAST_NAME}\",
       \"email\": \"${HIRE_EMAIL}\",
       \"jobId\": \"IT_PROG\",
       \"salary\": 80000,
       \"hireDate\": \"2026-03-31\",
       \"departmentId\": 60,
       \"initialPassword\": \"password123\",
       \"username\": \"lab.${RUN_TAG}\"
     }"
   ```

   Use a unique `RUN_TAG` every time you rerun this lab. That keeps the
   `idempotencyKey`, last name, email, and username unique in a shared
   training database.

   Preferred write path for this lab:

   - use the documented API hire request above
   - if auth is complex, ask Claude Code to help you obtain or apply the real token and then run the same API hire request
   - if you need the app login flow, use it only to help complete the API write step
   - do not substitute a generic UI helper or unrelated end-to-end script for this API write step

4. **After the operation — verify the current runtime behavior:**
   ```text
   Use the exact values from the hire request I just ran.
   HIRE_EMAIL = <paste exact value>

   Now verify the hire operation wrote correctly:
   1. is there a new row in AIHR_EMPLOYEES with that HIRE_EMAIL?
   2. is there a matching AIHR_USERS record?
   3. does the employee count match baseline + 1?
   4. is the salary stored correctly (80000)?
   5. is the job_id `IT_PROG`?
   Show me the actual data for each check.
   ```

5. **Check related-table behavior as an observation, not an assumption:**
   ```text
   Check whether AIHR_JOB_HISTORY changed for this hire.
   If there is no new row, record that as the current runtime behavior rather
   than as a lab failure.
   ```

6. **Cross-reference with the UI:**
   ```text
   Use the exact last name from the hire request I just ran.
   HIRE_LAST_NAME = <paste exact value>

   Navigate to the employee directory in the browser.
   Search for that HIRE_LAST_NAME. Does the UI show the same data
   that's in the database? Compare the salary, job title,
   and department between the UI and the database query.
   ```

   In this chapter, browser tooling verifies the result after the write. It
   does not replace the API write step from Exercise 3.

   If the direct employee detail page matches the database but the employee
   directory search does not show the new hire, record that as a runtime
   discrepancy to investigate. Do not rewrite the database conclusion to make
   the UI result fit.

### What You Should See

The full loop:

- **database confirms** the hire wrote the expected runtime rows
- **browser confirms** the new employee appears in the UI
- **any mismatch** between DB and UI is a bug to investigate
- **related-table observation matters** even when it is not a success gate,
  because it tells you whether the current implementation is narrower than you
  expected

---

## Exercise 4: Final Reflection (15 min)

1. Add to CLAUDE.md:
   ```markdown
   ## Data Verification
   - Use the repo's active PostgreSQL workflow for read-oriented verification
   - Use it for data verification after operations, integrity checks, and reporting
   - Never use verification access for ad hoc mutations
   - Full verification loop: browser + API + database data checks
   ```

2. **The verification-loop concept:**
   ```text
   Run a full verification loop for the hire operation we just did:
   1. Browser: navigate to the employee detail page and capture evidence
   2. Database queries: inspect the AIHR_EMPLOYEES record, the AIHR_USERS row,
      and any AIHR_JOB_HISTORY rows for that employee
   3. Compare: does the UI match the database?
   Report any discrepancies.
   ```

3. **MCP ecosystem awareness** (optional extension):

   Other MCP servers available for enterprise use:

   | MCP Server | What It Connects | Enterprise Use Case |
   |-----------|-----------------|-------------------|
   | Figma | Design files | Extract tokens, compare UI to designs |
   | Slack | Team communication | Read bug reports, post status updates |
   | Sentry | Error monitoring | Pull stack traces during debugging |
   | Jira / Linear | Issue tracking | Fetch ticket context for implementations |
   | BigQuery | Analytics warehouse | Query metrics during performance work |
   | SQL / DB runtime | Database-backed systems | Read-oriented verification and integrity checks |

   The pattern is always the same: when an MCP server is part of your workflow,
   add it through the repo's current config surface, restart Claude Code from the repo
   root if needed, and then confirm the new tools are available.

---

## Success Criteria

- [ ] A repeatable database verification workflow is documented and usable
- [ ] Claude Code can run the required read-oriented PostgreSQL verification queries
- [ ] Hire operation verified across the tables the current runtime actually writes for this flow (`AIHR_EMPLOYEES` and `AIHR_USERS`)
- [ ] `AIHR_JOB_HISTORY` behavior was checked and recorded as an observation
- [ ] UI data matches database data
- [ ] CLAUDE.md updated with database-verification patterns and the verification loop

---

## Key Takeaways

1. **Read-oriented database access for safety** — verification should never mutate data directly
2. **The full verification loop** — browser + API + database = complete confidence
3. **Cross-table verification catches expectation gaps** — sometimes the runtime writes fewer related rows than you assumed, and the lab should reflect that reality
4. **Use the repo's real runtime tooling** — verify against actual stored data, not assumptions
5. **The pattern transfers** — database checks here, analytics or observability data sources tomorrow

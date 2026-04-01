# Build Note: MySQL MCP Setup & Data Verification

**Date:** 2026-03-30
**Module:** MCP — MySQL read-only database access
**Maps to Lab:** Lab 9: Database MCP

---

## What We Built

MySQL MCP server configured in `.mcp.json` using `@benborla29/mcp-server-mysql` — allows Claude to:
- Query the `hr_db` database directly (SELECT only)
- Verify that API operations produced correct DB state
- Cross-check mock data against real schema
- Debug data issues without writing raw SQL manually

Read-only user `hr_readonly` created via `database/create-readonly-user.sql` (SELECT only on `hr_db.*`). Write operations (`INSERT`, `UPDATE`, `DELETE`) explicitly disabled in MCP env config.

## Setup

1. Create readonly user (run once as root):
```bash
mysql -u root -p hr_db < database/create-readonly-user.sql
```

2. Added to `.mcp.json`:
```json
"mysql": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@benborla29/mcp-server-mysql"],
  "env": {
    "MYSQL_HOST": "127.0.0.1",
    "MYSQL_PORT": "3306",
    "MYSQL_USER": "hr_readonly",
    "MYSQL_PASS": "readonly_pass",
    "MYSQL_DB": "hr_db",
    "ALLOW_INSERT_OPERATION": "false",
    "ALLOW_UPDATE_OPERATION": "false",
    "ALLOW_DELETE_OPERATION": "false"
  }
}
```

## Technique Used

MCP server registration + data verification workflow:
1. Run an API operation (e.g., hire employee)
2. Use MySQL MCP to query the DB and verify the result
3. Compare API response to DB state — catch any serialization mismatches

## The Prompt That Worked

```
Use the MySQL MCP to verify the database state after hiring a new employee:
1. SELECT * FROM employees ORDER BY employee_id DESC LIMIT 1 — show the newest employee
2. SELECT * FROM job_history WHERE employee_id = {id} — verify hire record was written
3. SELECT * FROM users WHERE employee_id = {id} — verify user account was created
4. Confirm: employee status is PROBATION (if probationEndDate set) or ACTIVE
Report any discrepancies with the API response.
```

## What Failed First

- **Symptom:** MCP server started but returned "Access denied for user 'hr_readonly'@'localhost'".
- **Root cause:** MySQL user created with `'hr_readonly'@'%'` (any host) but MCP connects via `127.0.0.1`, which MySQL treats differently from `localhost`.
- **Fix:** Changed `create-readonly-user.sql` to use `'hr_readonly'@'localhost'` and `'hr_readonly'@'127.0.0.1'` — grants for both.

- **Symptom:** Claude attempted an UPDATE via MySQL MCP and was blocked by `ALLOW_UPDATE_OPERATION: false`.
- **Root cause:** Claude inferred that fixing a data issue required an UPDATE.
- **Fix:** This is working as designed — the MCP is intentionally read-only. Instructed Claude to use the API endpoints for any writes, never direct DB writes.

## CLAUDE.md / Skill Update Made

```markdown
## MCP — MySQL
- MySQL MCP is READ-ONLY — never attempt INSERT/UPDATE/DELETE via MCP
- All data writes go through the API, never direct DB
- Readonly user: hr_readonly@localhost with SELECT on hr_db.*
- Run database/create-readonly-user.sql once before using MySQL MCP
```
**Why:** Read-only enforcement is a safety guardrail. Bypassing it via MCP would circumvent audit logging and validation.

## Key Teaching Points

1. MySQL MCP should always be read-only — writes bypass business logic, validation, and audit trail.
2. `localhost` vs `127.0.0.1` are distinct MySQL grant targets — grant both.
3. MySQL MCP + Playwright MCP together close the verification loop: UI state + DB state both verified.

## Lab Exercise Derivation

- **Setup:** DB running, readonly user created, MCP configured.
- **Task:** POST to hire endpoint, then use MySQL MCP to verify all 3 side effects (employee, job_history, user). Check that status matches business rules.
- **Expected discovery:** MySQL MCP shows the DB state independently from what the API returned — tests the full stack, not just the response.
- **Success criteria:** SELECT queries return correct employee, job_history, and user records after hire API call.

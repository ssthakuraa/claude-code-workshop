# Lab 10: MCP Servers — MySQL & Data Verification

**Duration:** 75 minutes
**Day:** 3 — Integration
**Checkpoint Branch:** `checkpoint/day3-start`
**Builds On:** Lab 9 (Playwright MCP)
**Produces:** MySQL MCP configured, data verification workflow demonstrated

---

## Learning Objective

You will connect Claude Code to your MySQL database via MCP, then use it to verify that backend operations write correct data. Combined with Playwright MCP from Lab 9, this creates a **full verification loop**: browser → API → database.

---

## The Key Concept

**MySQL MCP** gives Claude direct SQL query access (read-only) to your database. This lets Claude:
- Verify that an API operation wrote correct data
- Investigate bugs by checking actual database state
- Generate reports from live data
- Validate data integrity across tables

**Security:** The MCP uses a read-only database user. Claude can SELECT but cannot INSERT, UPDATE, or DELETE. This is intentional — verification should never mutate data.

**The Full Verification Loop:**
```
Playwright (Browser) → sees UI state
    ↓
API (curl/fetch) → sees API response
    ↓
MySQL MCP (Database) → sees actual stored data
    ↓
Compare all three → any mismatch = bug
```

---

## Setup

```bash
git checkout checkpoint/day3-start

# Verify MySQL is running
mysql -h 127.0.0.1 -u root -proot123 -e "SELECT COUNT(*) FROM hr_db.employees;"

# Create the read-only user (if not done in pre-workshop)
mysql -h 127.0.0.1 -u root -proot123 < database/create-readonly-user.sql

# Verify read-only user works
mysql -h 127.0.0.1 -u hr_readonly -preadonly_pass hr_db -e "SELECT 1;"

# Ensure backend + frontend are running from Lab 9
```

---

## Exercise 1: Configure MySQL MCP (15 min)

### Goal
Add the MySQL MCP server to the project configuration.

### Instructions

1. Ask Claude to add the MySQL MCP:
   ```
   Add a MySQL MCP server to .mcp.json alongside the existing Playwright config.
   Use the read-only user:
   - Host: 127.0.0.1
   - Port: 3306
   - User: hr_readonly
   - Password: readonly_pass
   - Database: hr_db
   ```

2. **Restart Claude Code session** to load the new MCP server.

3. **Smoke test:**
   ```
   Query the database: how many employees are in the employees table?
   How many departments? How many jobs?
   ```

### What You Should See

Claude runs SQL queries and returns results directly in the conversation. No need to open a separate MySQL client.

---

## Exercise 2: Data Exploration (15 min)

### Goal
Use MySQL MCP to understand the data landscape before verification.

### Instructions

1. **Explore the schema:**
   ```
   Show me all tables in hr_db with their row counts.
   Then show the columns and types for the employees table.
   ```

2. **Run business queries:**
   ```
   Show me:
   1. Employee count by department
   2. Average salary by job title
   3. Employees hired in the last 30 days
   4. The management hierarchy (who reports to whom) for the top 3 levels
   ```

3. **Check data integrity:**
   ```
   Are there any data integrity issues?
   - Employees without a job assignment?
   - Departments without a manager?
   - Job history records without matching employees?
   - Orphaned records in any table?
   ```

### What You Should See

Claude runs precise SQL queries and reports findings. This is how you'd investigate a production data issue — Claude as your SQL co-pilot.

---

## Exercise 3: Operation Verification (30 min)

### Goal
Verify that a backend operation writes correct data across all relevant tables.

### Instructions

1. **Before the operation — capture baseline:**
   ```
   Query the database and tell me:
   1. Current employee count
   2. Current job_history record count
   3. Current hr_users record count
   Save these numbers — we'll compare after the hire.
   ```

2. **Get an auth token first:**
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:8080/app/hr/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"steven.king","password":"password123"}' \
     | jq -r '.data.token')
   echo "$TOKEN"   # Should print a JWT, not null or empty
   ```
   Note: `steven.king` is the admin user seeded in `database/demo.sql`. All demo users share the password `password123`.

3. **Perform a hire operation via the API:**
   ```bash
   curl -X POST http://localhost:8080/app/hr/api/v1/employees \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -H "X-Idempotency-Key: lab10-test-001" \
     -d '{
       "firstName": "Lab",
       "lastName": "TestHire",
       "email": "lab.testhire@example.com",
       "jobId": "IT_PROG",
       "salary": 8000,
       "hireDate": "2026-03-31",
       "departmentId": 60,
       "initialPassword": "password123"
     }'
   ```

3. **After the operation — verify all tables:**
   ```
   Now verify the hire operation wrote correctly:
   1. Is there a new row in employees with email 'lab.testhire@example.com'?
   2. Is there a matching job_history record with the correct start date?
   3. Is there a matching hr_users record?
   4. Does the employee count match baseline + 1?
   5. Is the salary stored correctly (8000)?
   6. Is the job_id 'IT_PROG'?
   Show me the actual data for each check.
   ```

4. **Cross-reference with UI (combine with Playwright MCP):**
   ```
   Navigate to the employee directory in the browser.
   Search for "Lab TestHire". Does the UI show the same data
   that's in the database? Compare the salary, job title,
   and department between the UI and the database query.
   ```

### What You Should See

The full loop:
- **Database confirms** the hire wrote to 3 tables correctly
- **Browser confirms** the new employee appears in the UI
- **Any mismatch** between DB and UI = a bug to investigate

---

## Exercise 4: The Self-Improvement Coda (15 min)

1. Add to CLAUDE.md:
   ```markdown
   ## MCP — MySQL
   - Configured in .mcp.json with read-only user (hr_readonly)
   - Use for: data verification after operations, integrity checks, reporting
   - Never use for mutations — read-only access only
   - Full verification loop: Playwright (UI) + API (curl) + MySQL (data)
   ```

2. **The Verification Loop concept:**
   ```
   Run a full verification loop for the hire operation we just did:
   1. Playwright: navigate to employee detail page, screenshot
   2. MySQL: query the employee record and job_history
   3. Compare: does the UI match the database?
   Report any discrepancies.
   ```

3. **MCP Ecosystem Awareness** (combine with instructor lecture):

   Other MCP servers available for enterprise use:

   | MCP Server | What It Connects | Enterprise Use Case |
   |-----------|-----------------|-------------------|
   | Figma | Design files | Extract tokens, compare UI to designs |
   | Slack | Team communication | Read bug reports, post status updates |
   | Sentry | Error monitoring | Pull stack traces during debugging |
   | Jira / Linear | Issue tracking | Fetch ticket context for implementations |
   | BigQuery | Analytics warehouse | Query metrics during performance work |
   | PostgreSQL | Postgres databases | Same as MySQL MCP, different DB |

   The pattern is always the same: add to `.mcp.json`, restart session, Claude has new tools.

---

## Success Criteria

- [ ] MySQL MCP configured in `.mcp.json` with read-only user
- [ ] Claude can query tables and return results
- [ ] Hire operation verified across 3 tables (employees, job_history, hr_users)
- [ ] UI data matches database data (cross-verified with Playwright)
- [ ] CLAUDE.md updated with MySQL MCP patterns and verification loop

---

## Key Takeaways

1. **Read-only MCP for safety** — verification should never mutate data
2. **The full verification loop** — Browser + API + Database = complete confidence
3. **Cross-table verification catches bugs** — an API might return 200 but miss writing job_history
4. **MCP config is team-shared** — `.mcp.json` in git, same as Playwright
5. **The pattern transfers** — MySQL today, PostgreSQL/BigQuery/Sentry tomorrow. Same `.mcp.json` pattern.

---

<details>
<summary><strong>Escape Hatch</strong> — .mcp.json with both servers</summary>

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp", "--headless"],
      "env": {}
    },
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
  }
}
```

If MySQL MCP fails:
```bash
# Check MySQL is running
mysql -h 127.0.0.1 -u hr_readonly -preadonly_pass hr_db -e "SELECT 1;"

# Check read-only user has SELECT permissions
mysql -h 127.0.0.1 -u root -proot123 -e "SHOW GRANTS FOR 'hr_readonly'@'localhost';"

# Restart Claude Code session after .mcp.json changes
```
</details>

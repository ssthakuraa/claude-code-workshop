# Student Prompt Guide — All 12 Labs

For each lab: (1) the exact prompts to type into Claude, (2) what to check afterward, (3) what to add to CLAUDE.md.

---

## Lab 1: CLAUDE.md — Your Enterprise Constitution

**Goal:** Build CLAUDE.md from scratch by observing failures, then verify.

### Exercise 1 — Observe the Failure
```
Scaffold the PayGrade entity for the HR app.
Create: JPA entity mapping to the "pay_grades" table,
repository, DTO, request object, service with CRUD operations,
and REST controller at /app/hr/api/v1/pay-grades.
All endpoints should return a standard response envelope.
```

**Check list:** Does the code use `@Where` (bad) or `@SQLRestriction` (good)? Does the service have `HrLogHelper` entry/exit? Are endpoints returning `HrApiResponse<T>` or raw objects? Does the class name start with `Hr`? Write down every mistake.

### Exercise 2 — Write the Rules

Update CLAUDE.md with rules for every mistake found. Key sections to add:

- **Naming Conventions** — `Hr` prefix, entity-to-table mapping
- **Database Rules** — `@SQLRestriction` not `@Where`, `schema.sql` is READ ONLY, Flyway only
- **Logging Pattern** — `HrLogHelper` entry/exit, no PII in logs
- **API Response** — `HrApiResponse<T>` everywhere, `HrPagedResponse<T>` for pagination
- **Security** — `@PreAuthorize` on all service methods, RBAC roles

```
Update CLAUDE.md with these rules: [paste your rules].
Keep it concise — every line should prevent a specific mistake.
```

### Exercise 3 — Verify
Start a **fresh session** (`/clear`), then repeat the exact same PayGrade scaffold prompt from Exercise 1. Check every mistake from Exercise 1 is now fixed. If not, add another rule and repeat.

### Exercise 4 — Subdirectory CLAUDE.md Hierarchy

```
Create backend/CLAUDE.md. Extract from the root CLAUDE.md:
- @SQLRestriction rule (not @Where)
- HrLogHelper entry/exit logging pattern
- @PreAuthorize security rule
- Hr naming prefix rule
- HrApiResponse / HrPagedResponse API response rules
Keep the root CLAUDE.md lean — leave only project overview, build commands,
and cross-cutting rules (employee lifecycle, idempotency, RBAC roles).
```

```
Create frontend/CLAUDE.md with:
- Use TanStack Query (useQuery/useMutation) for all API calls
- Use HrApiClient for HTTP requests — never raw fetch/axios
- Tailwind CSS with Vertex Tech Modern design tokens only
- React Hook Form + Zod for all forms
- Component naming: Hr prefix (e.g., HrEmployeeCard, HrDepartmentTree)
```

**CLAUDE.md addition:** Add a `## CLAUDE.md Hierarchy` section documenting root → backend/ → frontend/ merge order.

### Exercise 5 — Self-Improvement Coda

```
Read CLAUDE.md and identify any rules that are:
1. Too vague to be actionable
2. Redundant with what you'd do by default
3. Missing — based on common Spring Boot + React mistakes
Suggest improvements.
```

---

## Lab 2: Plan Mode — Think Before You Build

**Goal:** Design `hireEmployee()` in Plan Mode, iterate, then implement.

### Exercise 1 — The Bad Path
```
Implement hireEmployee() in HrEmployeeService.
```
Note what's missing: idempotency? email uniqueness? salary validation? job_history record? user account creation?

### Exercise 2 — The Good Path
Type `Shift+Tab` twice (or `/plan`) to enter Plan Mode:

```
/plan
Design the hireEmployee() method for HrEmployeeService.
It should handle: idempotency key check, email uniqueness,
salary validation against pay grade, job_history record creation,
user account creation, and proper transaction management.
Reference the existing HrRegionService pattern for logging.
```

Review the plan. Iterate until all 7 steps are covered. Then exit Plan Mode:

```
Implement hireEmployee() exactly as designed in the plan above.
```

Verify: `cd backend && mvn compile`

### Exercise 3 — Compare and Encode

```
Compare the hireEmployee() implementation from our first attempt (no plan)
with the new planned version. Is there anything in the current hireEmployee() implementation
that was missed in the unplanned version? Add any missing lifecycle rules to CLAUDE.md.
```

**CLAUDE.md addition:** Add `## Employee Lifecycle Rules`:
- Every hire/promote/terminate MUST write a `job_history` record
- Hire requires idempotency key
- `createUserForEmployee()` creates `hr_users` entry with ROLE_EMPLOYEE
- `@Transactional` wraps ALL writes
- `findById` masks salary/PII based on security checks

---

## Lab 3: Skills & Commands — Reusable Knowledge Packs

**Goal:** Create a `/scaffold-entity` skill and `/run-tests` command.

### Exercise 1 — The Manual Way (feel the pain)
```
Scaffold the Country entity for the HR app.
Create: JPA entity, repository, DTO, request, service with CRUD,
and REST controller at /app/hr/api/v1/countries.
Follow the CLAUDE.md conventions.
```

### Exercise 2 — Create the Skill

```
Create a skill at .claude/skills/scaffold-entity/SKILL.md that encodes
the 7-layer entity scaffolding pattern. Study HrRegion and HrRegionService
as the reference. The skill should:
1. Accept an entity name (e.g., "Country", "Location")
2. Produce: Entity, Repository, DTO, Request, Mapper, Service, Controller
3. Follow all CLAUDE.md conventions (Hr prefix, @SQLRestriction, HrLogHelper,
   HrApiResponse, @PreAuthorize, etc.)
4. Be user-invocable as /scaffold-entity
```

### Exercise 3 — Use the Skill
```
/scaffold-entity
Entity: Location
Table: locations
Fields: city, country_id (FK to countries)
```

Verify: `cd backend && mvn compile`

Wire frontend to real API:
```
Create a useNotifications() hook in src/api/notifications.ts
that fetches from /app/hr/api/v1/notifications.
Wire the frontend NotificationCard to use real data
instead of the mock array.
```

### Exercise 4 — Create Slash Command

```
Create a slash command at .claude/commands/run-tests.md that:
1. Runs backend tests: mvn test -f backend/pom.xml
2. When called with "frontend" argument, also runs: npm run lint in frontend/
3. Reports test results (pass/fail with counts)
4. Reports lint results
```

**CLAUDE.md additions:**
- Entity scaffolding: use `/scaffold-entity` skill for new entities
- Test runner: `/run-tests` (add "frontend" arg to include lint)

---

## Lab 4: Context Management — The #1 Performance Lever

**Goal:** Learn `/clear`, `/compact`, and session discipline.

### Exercise 1 — Review with Fresh Context

```
Review the HrNotification entity, HrNotificationController,
and HrNotificationService. Check for correct conventions:
Hr prefix, @SQLRestriction, HrApiResponse return type,
HrLogHelper logging, @PreAuthorize annotations.
```

### Exercise 2 — Clean Session for New Entity

After studying, start a fresh session:

```
I need to scaffold HrDepartment in a clean session. Design the
session plan: what files to create, what order, what to verify.
List the 7 files, their package paths, and key properties.
```

### Exercise 3 — Using `/compact`

Continue from Exercise 2's session. Check `/status` to note context %. Then:

```
/compact
Preserve: the HrJob entity we scaffolded (entity fields, service methods,
controller endpoints), and any caching configuration we added.
Discard: the conversation history about planning and decisions.
```

Verify context % dropped. Then ask:
```
What caching configuration did we add to HrJob?
```
Claude should still know the answer.

**CLAUDE.md additions:**
```markdown
## Context Management
- Start each task in a fresh session (/clear before new feature)
- If context > 70%, /compact or start fresh session
- Use /clear between tasks, /compact mid-task to continue
```

---

## Lab 5: Hooks — Deterministic Quality Gates

**Goal:** Create 3 hooks that enforce enterprise standards as structural barriers.

### Exercise 1 — Read-Only File Guard

```
Add a PreToolUse hook in .claude/settings.json that blocks any
Edit or Write to database/schema.sql. The hook should:
- Print a clear error message explaining WHY it's blocked
- Suggest the correct approach (create a Flyway migration instead)
- Exit with code 1 (hard block)
Use jq to parse the tool input JSON from stdin.
```

**Test it:**
```
Add a new column "middle_name" to the employees table in the database schema.
```

### Exercise 2 — Naming Convention Guard

```
Add a PostToolUse hook that checks any new .java file written to
hrapp-service/src/main/java/. If the class name doesn't start with "Hr",
the hook should print a NAMING VIOLATION error and exit 1.
Extract the filename from the tool input JSON using jq.
```

**Test it:**
```
Create a utility class called EmployeeValidator.java in the service package
that validates employee email formats.
```

### Exercise 3 — PII Leak Detector

```
Add a PostToolUse hook that scans any Service.java file change for
LOGGER statements containing sensitive words: email, phone, salary,
password, ssn. If found, print "PII LEAK DETECTED" with the offending
line and exit 1. Read the new content from the tool input JSON,
not from the file on disk.
```

**Test it:**
```
In HrRegionService, add a debug log line that shows the full
employee email when processing a region assignment.
```

### Exercise 4 — Review All Hooks

```
Read .claude/settings.json and explain each hook —
what it does, when it fires, and what it prevents.
```

**CLAUDE.md additions:**
```markdown
## Active Hooks
- PreToolUse: database/schema.sql is read-only (use Flyway migrations)
- PostToolUse: Java classes must start with Hr (naming convention)
- PostToolUse: No PII (email, phone, salary, password, ssn) in LOGGER statements
```

---

## Lab 6: Subagents — Isolated Specialist Workers

**Goal:** Create a component-reviewer subagent and observe fresh-context review quality.

### Exercise 1 — Self-Review (Weak Version)

```
Create src/components/hr/HrEmployeeCard.tsx — a card component that displays:
- Employee avatar (initials fallback), name, job title
- Department and location
- Employment status badge (using HrStatusBadge)
- Hire date
- Click handler for navigation to detail page
Follow the patterns from existing components in src/components/hr/.
```

Then in the SAME session:
```
Review the HrEmployeeCard component you just created.
Check for: accessibility issues, missing error states,
performance concerns, and consistency with our existing components.
```
**Count issues: _____**

### Exercise 2 — Create the Reviewer Subagent

```
Create .claude/agents/component-reviewer.md — a subagent that reviews
React components. It should check:
- Accessibility (aria labels, keyboard navigation, color contrast)
- Error states and loading states
- Prop validation and type safety
- Consistency with existing component patterns
- Performance (unnecessary re-renders, missing memoization)
- Missing edge cases (empty data, long strings, null values)
Give it a critical persona: "You are a senior frontend engineer
performing a thorough code review. Be specific and actionable."
It should be read-only (Read, Glob, Grep only — no edits).
```

### Exercise 3 — Fresh-Context Review

```
Use the component-reviewer agent to review
src/components/hr/HrEmployeeCard.tsx.
Focus on accessibility, error states, and edge cases.
```

**Count issues: _____** — Compare to self-review count!

Apply fixes:
```
Fix these issues in HrEmployeeCard (from the reviewer):
[paste the reviewer's findings]
```

**CLAUDE.md additions:**
```markdown
## Code Review Pattern
- Never self-review in the same session — use /agents/component-reviewer
- Reviewer agent in .claude/agents/ — read-only, fresh context
- You build in the main session; reviewer critiques from separate context
```

---

## Lab 7: Parallel Sessions & Git Worktrees

**Goal:** Build 2 features in parallel across separate worktrees using `/build-page` skill.

### Exercise 1 — Study Existing Page

Read `frontend/src/pages/employees/EmployeeDirectoryPage.tsx`. Study: TanStack Query usage, error/loading states, search/filter, pagination, component composition.

### Exercise 1.5 — Build the Skill

```
Create .claude/skills/build-page/SKILL.md — a skill that encodes the
enterprise page pattern from EmployeeDirectoryPage.tsx. It should:
1. Study the existing page pattern (TanStack Query, states, pagination)
2. Create page component with proper structure
3. Create route and navigation
4. All API calls via HrApiClient + TanStack Query
5. Be user-invocable as /build-page
```

### Exercise 2 — Create Worktrees

```bash
git worktree add ../hr-worktree-a -b feature/department-page
git worktree add ../hr-worktree-b -b feature/jobs-page
```

Open 2 terminal sessions — one in each worktree:
- Terminal A: `cd ../hr-worktree-a && claude`
- Terminal B: `cd ../hr-worktree-b && claude`

### Exercise 3 — Parallel Feature Build

In Terminal A:
```
/build-page
Create a Department management page following the EmployeeDirectoryPage pattern.
Backend: scaffold Department entity (already done in previous labs).
Frontend: list, search, create/edit departments with proper states.
```

In Terminal B:
```
/build-page
Create a Job management page following the EmployeeDirectoryPage pattern.
Backend: scaffold Job entity (already done in previous labs).
Frontend: list, search, create/edit jobs with proper states.
```

### Exercise 4 — Merge Results

Verify builds:
```bash
cd ../hr-worktree-a && cd frontend && npm run build
cd ../hr-worktree-b && cd frontend && npm run build
```

Clean up:
```bash
git worktree remove ../hr-worktree-a
git worktree remove ../hr-worktree-b
```

**CLAUDE.md additions:**
- Use `/build-page` skill for new enterprise pages (study EmployeeDirectoryPage pattern)
- Parallel feature work via git worktrees — not branches

---

## Lab 8: Verification Loops — The Quality Multiplier

**Goal:** Test-driven backend feature + visual frontend verification.

### Exercise 1 — Test-Driven Backend Feature

```
Write a JUnit 5 unit test for HrEmployeeService.promoteEmployee().
The test should verify:
1. Job exists and new salary is within new pay grade range
2. Employee status changes to PROMOTED
3. Job history record is written
4. Original job/department/salary are preserved in history
```

Run tests:
```
/run-tests
```

```
Implement promoteEmployee() in HrEmployeeService so that all tests pass.
Follow the patterns from hireEmployee() — idempotency check, salary validation,
job_history entry, and proper error handling.
```

Verify:
```
/run-tests
```

### Exercise 2 — Visual Verification

Build a frontend component, then verify visually against a spec. If Playwright MCP is available (see Lab 9), use it. Otherwise manually verify:

- Component renders with sample data
- Loading and error states visible
- UI matches the design spec

### Exercise 3 — Combining Strategies

```
For the next feature, follow this workflow:
1. Write test/spec first
2. Implement to pass
3. Visually verify and iterate
4. Run E2E test to verify full stack
```

**CLAUDE.md additions:**
```markdown
## Verification
- Backend: test-driven — write tests first, implement to pass
- Frontend: visual — implement, compare to spec, iterate
- Never mark a task done without verification
```

---

## Lab 9: MCP Servers — Playwright & Browser Verification

**Goal:** Connect Claude to a real browser via Playwright MCP. Navigate running HR app, take screenshots, verify UI.

### Exercise 1 — Study Playwright MCP Setup

Check `.mcp.json` for Playwright configuration. Verify Playwright tools are available (`browser_navigate`, `browser_snapshot`, etc.).

Smoke test: Navigate to the running app and take a screenshot.

### Exercise 2 — Dashboard Verification

Use Playwright to:
1. Navigate to the dashboard page
2. Take a screenshot
3. Verify KPI cards render correctly
4. Cross-reference data against the database
5. Check for console errors

**If issues found, fix and re-verify** — the loop: screenshot → find issue → fix code → screenshot → verify.

### Exercise 3 — Form Verification

Navigate to a form page (e.g., create employee), verify form fields render, check validation behavior.

**CLAUDE.md additions:**
```markdown
## MCP / Browser Verification
- Playwright MCP: navigate → screenshot → verify UI matches spec
- Verification loop: screenshot → find issue → fix → re-verify
```

---

## Lab 10: MCP Servers — MySQL & Data Verification

**Goal:** Connect Claude to MySQL via MCP. Verify backend operations write correct data.

### Exercise 1 — Study MySQL MCP Setup

Check `.mcp.json` for MySQL configuration. Verify MySQL MCP tools are available. Test query:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'hr_db' ORDER BY table_name;
```

### Exercise 2 — Data Exploration

```
Show me the table structure for hr_employees. What columns exist,
and what are their types and constraints? Show sample rows.
```

### Exercise 3 — Operation Verification

```
Now verify the hire operation wrote correctly:
1. Query hr_employees for the newly hired employee
2. Query hr_users for the created user account
3. Query hr_job_history for the job history record
4. Verify salary, status, and department match expectations
```

**CLAUDE.md additions:**
```markdown
## MCP / Database Verification
- MySQL MCP: query DB after API operations to verify data integrity
- Cross-check: API response → DB state → UI rendering
```

---

## Lab 11: CI/CD, Permissions & Enterprise Governance

**Goal:** Study Makefile + Jenkinsfile, add governance stage, configure permissions profile.

### Exercise 1 — Study the Makefile

```
Read the Makefile and explain the composite targets:
build, test, lint, package, verify.
What runs in what order? What are the dependencies?
```

### Exercise 2 — Study the Jenkins Pipeline

```
Read the Jenkinsfile and map each stage:
Checkout → Build → Test → Lint → Package → Deploy.
Which stages are branch-gated? What triggers each?
```

### Exercise 3 — Add Governance Stage

```
Add a Governance stage to the Jenkinsfile that:
1. Runs the same naming convention check (grep for classes without Hr prefix)
2. Runs the PII scan on service classes
3. Fails the pipeline if either check fails
This mirrors our hooks from Lab 5 as a CI safety net.
```

### Exercise 4 — Permissions Profile

Review `.claude/settings.json` `allowedTools` array. Ensure build/test/lint are pre-allowed, git push and destructive operations require approval.

**CLAUDE.md additions:**
```markdown
## CI/CD
- Makefile defines pipeline stages (platform-agnostic) — make build, make test, make package
- Jenkinsfile orchestrates with branch-gated Package stage (main, release/*)
- Governance stage mirrors hooks: Hr naming + PII in logs

## Permissions
- Build/test/lint commands pre-allowed (no prompting)
- Git push, file deletion, sudo require approval
- DROP TABLE / DELETE FROM blocked by PreToolUse hook
```

---

## Lab 12: Capstone — End-to-End Feature Build

**Goal:** Swap dashboard chart components using the full workflow: plan → implement → verify → review.

### The Task

In `frontend/src/pages/dashboard/DashboardPage.tsx`, swap the chart components between two cards and adapt their data formats.

### Part 1: Plan (20 min)

```
/plan
Read DashboardPage.tsx and identify exactly what changes are needed
to swap the chart components between cards.
Document: which components to move, what data transformation is needed,
what imports to add/remove, and the step-by-step implementation plan.
```

Review the plan. Iterate. Then exit Plan Mode and implement:

```
/compact
```
(Free context before build phase)

### Part 2: Implement & Verify

```
Implement the dashboard chart swap exactly as planned.
Update imports, move components, adapt data formats.
```

Verify hooks fire (from Lab 5):
```
Run npm run lint in the frontend directory.
```

Visual verification (Playwright from Lab 9):
- Navigate to dashboard
- Screenshot — verify charts render correctly

Data verification (MySQL MCP from Lab 10):
```
Query the database to verify the headcount numbers that should appear
in the department distribution chart:
SELECT department, COUNT(*) as headcount FROM hr_employees
WHERE deleted_at IS NULL GROUP BY department ORDER BY headcount DESC;
```

Reviewer (subagent from Lab 6):
```
Use the component-reviewer agent to review the changed DashboardPage.tsx.
```

### Part 3: Self-Improvement Coda

Add any new rules discovered during the capstone to CLAUDE.md.

---

## Quick Reference — All Slash Commands and Skills

| Command | Lab | What it does |
|---------|-----|-------------|
| `/plan` | 2 | Enter Plan Mode — research + plan, no code |
| `/compact` | 4 | Compress conversation history, preserve key context |
| `/clear` | 4 | Full session reset |
| `/scaffold-entity` | 3 | Scaffold 7-layer HR entity (Entity → Controller) |
| `/build-page` | 7 | Create enterprise page component (pattern from EmployeeDirectoryPage) |
| `/run-tests` | 3 | Run backend tests (+ frontend lint with "frontend" arg) |
| `/agents/component-reviewer` | 6 | Review React component with fresh context |

## Quick Reference — CLAUDE.md Hierarchy

| File | Scope | Contains |
|------|-------|----------|
| `CLAUDE.md` (root) | Entire project | Overview, build commands, cross-cutting rules, verification, CI/CD, permissions |
| `backend/CLAUDE.md` | backend/ | Java/Spring rules: @SQLRestriction, HrLogHelper, HrApiResponse, @PreAuthorize, Hr naming |
| `frontend/CLAUDE.md` | frontend/ | React rules: TanStack Query, HrApiClient, Zod forms, Vertex Tech tokens |

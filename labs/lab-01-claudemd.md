# Lab 1: CLAUDE.md — Your Enterprise Constitution

**Duration:** 60 minutes
**Day:** 1 — Foundation
**Builds On:** Mindset Shift lecture
**Produces:** A working CLAUDE.md that prevents convention violations

---

## Learning Objective

You will experience how Claude Code behaves **without** project conventions, observe it make predictable mistakes, and then fix those mistakes by writing CLAUDE.md rules. By the end, you'll understand why CLAUDE.md is the single most important file in any Claude Code project.

---

## The Key Concept

CLAUDE.md is a markdown file in the project root that Claude reads automatically at the start of every session. It acts as a permanent instruction manual — your team's conventions, standards, and hard-won lessons.

**What makes it powerful:**
- Loaded every session — Claude never "forgets" what's in it
- Checked into git — the whole team shares and contributes
- Compounding — every correction you add prevents future mistakes
- Concise — keep it under ~200 lines. Every line must earn its place.

**What to include vs exclude:**

| Include | Exclude |
|---------|---------|
| Build/test/lint commands | Things Claude figures out by reading code |
| Conventions that differ from defaults | Standard language conventions |
| Architectural decisions specific to your project | Long tutorials or API docs |
| Common gotchas and anti-patterns | Information that changes frequently |
| Environment quirks | File-by-file codebase descriptions |

---

## Setup

This lab teaches you to build CLAUDE.md from scratch by observing failures. The repo already contains a complete CLAUDE.md — for Exercise 1, temporarily rename it so Claude has no guidance and you can observe what goes wrong.

```bash
# Temporarily move the complete CLAUDE.md aside
mv CLAUDE.md CLAUDE.md.complete

# Create a minimal starting file — just enough for project orientation
cat > CLAUDE.md << 'EOF'
# CLAUDE.md — HR Enterprise Platform

## Project Overview
Spring Boot 3.2 + React 19 monorepo. Java 21, Maven multi-module.
API base path: /app/hr/api/v1/
EOF

# Verify
ls CLAUDE.md            # Should exist — minimal only
ls database/schema.sql  # Reference DDL — READ ONLY
ls backend/             # Maven project structure
```

You now have a minimal CLAUDE.md with no convention rules. Claude will make predictable mistakes — that's the point.

> **After this lab:** Run `mv CLAUDE.md.complete CLAUDE.md` to restore the full version if you want to compare your work with the reference.

---

## Exercise 1: Observe the Failure (15 min)

### Goal
Ask Claude to scaffold a backend entity **without** the missing CLAUDE.md rules. Observe what goes wrong.

### Instructions

1. Open a Claude Code session in the project root:
   ```bash
   claude
   ```

2. Ask Claude to scaffold the `Region` entity:
   ```
   Scaffold the Region entity for the HR app.
   Create: JPA entity mapping to the "regions" table,
   repository, DTO, request object, service with CRUD operations,
   and REST controller at /app/hr/api/v1/regions.
   All endpoints should return a standard response envelope.
   ```

3. **Observe the output carefully.** Look for these common mistakes:
   - [ ] Does the entity use `@Where` (deprecated) or `@SQLRestriction`?
   - [ ] Does the service have entry/exit logging on every method?
   - [ ] Does the controller return `HrApiResponse<T>` or raw objects?
   - [ ] Does the class name start with `Hr`?
   - [ ] Does the entity use the correct naming strategy for columns?

4. **Write down every mistake you find.** You'll fix them in Exercise 2.

### What You Should See

Claude will likely make 2–4 of these mistakes because it has no project-specific guidance. Common ones:
- Uses `@Where` instead of `@SQLRestriction` (deprecated in Hibernate 6.2)
- Returns raw entity or DTO instead of wrapping in `HrApiResponse<T>`
- Missing or inconsistent `HrLogHelper` logging pattern
- Column naming mismatch with schema

> **This is the teaching moment.** Claude is capable but ignorant of YOUR conventions. Without CLAUDE.md, every session is a blank slate.

---

## Exercise 2: Write the Rules (20 min)

### Goal
Update CLAUDE.md with rules that prevent every mistake you observed in Exercise 1.

### Instructions

1. Open the existing CLAUDE.md:
   ```
   Read CLAUDE.md and tell me what conventions are missing
   based on what went wrong in the Region scaffolding.
   ```

2. For **each mistake** from Exercise 1, write a rule. Use this format:
   ```markdown
   ## [Category]
   - [Specific, actionable rule]
   ```

3. Key rules your CLAUDE.md should include (if not already present):

   **Naming:**
   ```markdown
   ## Naming Conventions
   - All Java classes prefixed with `Hr` — e.g., HrEmployee, HrRegionService
   - Entities map directly to DB tables — HrRegion → `regions` table
   ```

   **Database:**
   ```markdown
   ## Database Rules
   - Use @SQLRestriction("deleted_at IS NULL") — NOT @Where (deprecated Hibernate 6.2)
   - database/schema.sql is READ ONLY — never edit it
   - Schema changes go through Flyway migrations only
   ```

   **Logging:**
   ```markdown
   ## Logging Pattern
   - Every service method MUST log entry and exit using HrLogHelper
   - Never log PII (email, phone, salary) — use MASKED placeholder
   ```

   **API Response:**
   ```markdown
   ## API Response
   - ALL endpoints return HrApiResponse<T> — never return raw objects
   ```

4. Ask Claude to update the file:
   ```
   Update CLAUDE.md with these rules: [paste your rules].
   Keep it concise — every line should prevent a specific mistake.
   ```

---

## Exercise 3: Verify the Rules Work (15 min)

### Goal
Redo the same scaffolding task and confirm Claude now follows your rules.

### Instructions

1. **Start a fresh session** — this is critical. CLAUDE.md is read at session start.
   ```
   /clear
   ```

2. Ask Claude the **exact same prompt** as Exercise 1:
   ```
   Scaffold the Region entity for the HR app.
   Create: JPA entity mapping to the "regions" table,
   repository, DTO, request object, service with CRUD operations,
   and REST controller at /app/hr/api/v1/regions.
   All endpoints should return a standard response envelope.
   ```

3. **Check each mistake from Exercise 1:**
   - [ ] `@SQLRestriction` used (not `@Where`)?
   - [ ] `HrLogHelper` entry/exit on every service method?
   - [ ] `HrApiResponse<T>` on all controller endpoints?
   - [ ] Class names start with `Hr`?
   - [ ] Naming strategy matches schema?

4. If any mistakes remain, add another rule to CLAUDE.md and repeat.

### What You Should See

Claude should now produce convention-compliant code on the **first try** — no corrections needed. The CLAUDE.md rules prevented every mistake from Exercise 1.

---

## Exercise 4: Subdirectory CLAUDE.md Hierarchy (15 min)

### Goal
Split the root CLAUDE.md into three focused files using Claude Code's directory-level hierarchy. This is essential in monorepos where Java rules shouldn't clutter the frontend context and vice versa.

### The Concept

Claude Code automatically merges CLAUDE.md files from the project root down to the directory where Claude is running:

```
CLAUDE.md              ← always loaded (project-wide rules)
backend/CLAUDE.md      ← loaded when working in backend/
frontend/CLAUDE.md     ← loaded when working in frontend/
```

This means you can scope rules to where they apply — Java rules stay in `backend/CLAUDE.md`, React rules in `frontend/CLAUDE.md`, and only cross-cutting concerns (auth, idempotency, RBAC) live in the root.

### Instructions

1. Ask Claude to create `backend/CLAUDE.md` with Java/Spring-specific rules extracted from the root:
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

2. Ask Claude to create `frontend/CLAUDE.md` with React-specific rules:
   ```
   Create frontend/CLAUDE.md with:
   - Use TanStack Query (useQuery/useMutation) for all API calls
   - Use HrApiClient for HTTP requests — never raw fetch/axios
   - Tailwind CSS with Oracle Redwood design tokens only
   - React Hook Form + Zod for all forms
   - Component naming: Hr prefix (e.g., HrEmployeeCard, HrDepartmentTree)
   ```

3. **Verify the hierarchy works.** Start Claude from the `backend/` directory:
   ```bash
   cd backend
   claude
   ```
   Then ask:
   ```
   What CLAUDE.md rules are active right now?
   ```
   You should see it mention rules from **both** the root CLAUDE.md and `backend/CLAUDE.md`. The frontend rules should NOT appear.

4. Start Claude from the `frontend/` directory and do the same check:
   ```bash
   cd frontend
   claude
   ```
   You should see root + frontend rules — backend rules absent.

### What You Should See

Running from `backend/` gives Claude the complete Java context without React noise. Running from `frontend/` gives the React context without Spring specifics. The root file now contains only what both sides need — keeping every file under ~100 lines.

> **Key insight:** Subdirectory CLAUDE.md files compound on top of the root — they don't replace it. Claude always sees the full chain from root to working directory.

---

## Exercise 5: The Self-Improvement Coda (10 min)

### Goal
Practice the compounding loop that you'll use at the end of every lab.

### Instructions

1. Review your CLAUDE.md. Ask yourself:
   - Is every rule specific and actionable? (Not vague like "write clean code")
   - Is any rule something Claude already does correctly without being told? (Delete it)
   - Is any rule too long? (Shorten it — Claude reads better with terse rules)

2. Ask Claude to critique its own CLAUDE.md:
   ```
   Read CLAUDE.md and identify any rules that are:
   1. Too vague to be actionable
   2. Redundant with what you'd do by default
   3. Missing — based on common Spring Boot + React mistakes
   Suggest improvements.
   ```

3. Apply Claude's suggestions if they're good. Reject if they're not.

> **This is the compounding loop:** mistake → rule → verify → refine. By the end of this workshop, your CLAUDE.md will be a living document that makes Claude dramatically better at your specific project.

---

## Success Criteria

- [ ] CLAUDE.md contains at least 5 project-specific rules
- [ ] Exercise 1 produces 2+ convention violations
- [ ] Exercise 3 produces 0 convention violations (same prompt, rules in place)
- [ ] `backend/CLAUDE.md` and `frontend/CLAUDE.md` exist with scoped rules
- [ ] You can explain the difference between CLAUDE.md (always loaded) and Skills (on-demand)
- [ ] You can describe the merge order: root → subdirectory

---

## Key Takeaways

1. **CLAUDE.md is production infrastructure** — iterate on it like prompts, not like documentation
2. **Every correction should become a rule** — if you corrected Claude, encode it so it never repeats
3. **Concise > comprehensive** — ~100 lines per file max. Claude ignores bloated files.
4. **Team-shared via git** — the whole team contributes. Review CLAUDE.md changes like code.
5. **Hierarchy = scope** — put rules where they apply. Backend rules in `backend/CLAUDE.md`. Frontend rules in `frontend/CLAUDE.md`. Only cross-cutting concerns in root.

---

<details>
<summary><strong>Escape Hatch</strong> — Click if stuck for more than 5 minutes</summary>

Here's a working CLAUDE.md for this project:

```markdown
# CLAUDE.md — HR Enterprise Platform

## Project
Spring Boot 3.2 + React 19 monorepo. Java 21, Maven multi-module.
API base: /app/hr/api/v1/

## Naming
- All Java classes prefixed `Hr` (HrEmployee, HrRegionService)
- Entities map to DB tables (HrRegion → regions)

## Database
- database/schema.sql is READ ONLY — never edit
- Use @SQLRestriction("deleted_at IS NULL") NOT @Where (deprecated)
- Schema changes via Flyway migrations only (db/migration/)

## Logging
- Every service method: HrLogHelper entry/exit logging
- Never log PII (email, phone, salary) — use MASKED

## API
- ALL endpoints return HrApiResponse<T> — never raw objects
- Paginated lists return HrPagedResponse<T>

## Security
- All service methods need @PreAuthorize
- RBAC: ROLE_ADMIN, ROLE_HR_SPECIALIST, ROLE_MANAGER, ROLE_EMPLOYEE

## Build
- Backend: cd backend && mvn clean install
- Frontend: cd frontend && npm install && npm run dev
```
</details>

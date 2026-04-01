# Training: Mastering Claude Code for Enterprise Development

## Building an HR Platform from Scratch — A Hands-On Workshop

**Audience:** Developers, Tech Leads, Architects working in enterprise codebases
**Duration:** 4-day workshop (3-5 modules per day) + pre-workshop setup (Module 0)
**Lab Project:** Enterprise HR Management System (Spring Boot + React, Oracle Redwood Design System)

---

# PRE-WORKSHOP: Environment Setup & Verification (Module 0)

---

## Module 0: Environment Setup — Getting Your Machine Ready (Self-Paced, ~90 min)

> **When:** Students complete this BEFORE Day 1. Instructor sends setup guide 1 week prior.
> Alternatively, dedicate the first 90 min of Day 1 if students couldn't prepare ahead.

### 0.1 — Tech Stack Installation

**Java Backend:**
```bash
# Java 21+ (LTS) — required for Spring Boot 3.2
java --version          # Must show 21+
# Install via SDKMAN (recommended):
curl -s "https://get.sdkman.io" | bash
sdk install java 21.0.5-tem

# Maven 3.9+
mvn --version           # Must show 3.9+
sdk install maven 3.9.9
```

**Node.js & Frontend:**
```bash
# Node.js 20+ (LTS) — required for React build tools, MCP servers, Playwright
node --version          # Must show 20+
npm --version           # Must show 10+
# Install via nvm (recommended):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 20

# Verify npx works (used by Playwright MCP and MySQL MCP)
npx --version
```

**Database:**
```bash
# MySQL 8.0+ — local install or Docker
mysql --version         # Must show 8.0+

# Option A: Native install (varies by OS)
# Option B: Docker (recommended for consistency)
docker run --name hr-mysql -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=hr_db -p 3306:3306 -d mysql:8.0

# Verify connection
mysql -h 127.0.0.1 -u root -proot123 -e "SELECT VERSION();"
```

**Git:**
```bash
git --version           # Any recent version
git config user.name    # Must be set
git config user.email   # Must be set
```

### 0.2 — Claude Code Installation & API Key

```bash
# Install Claude Code CLI (latest)
npm install -g @anthropic-ai/claude-code

# Verify
claude --version

# Configure API key (get from console.anthropic.com)
export ANTHROPIC_API_KEY=sk-ant-...

# Add to your shell profile so it persists:
echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.bashrc   # or ~/.zshrc
source ~/.bashrc

# Quick smoke test
claude -p "Say hello"
```

**Troubleshooting API key:**
- If you get "401 Unauthorized" → key is wrong or expired, regenerate at console.anthropic.com
- If you get "429 Rate Limit" → your plan may have usage limits, check billing
- If `claude` command not found → ensure `npm bin -g` is in your PATH

### 0.3 — Terminal & IDE Setup

```bash
# Recommended terminals (must support 24-bit color + Unicode):
# macOS: Ghostty, iTerm2, Warp
# Linux: Ghostty, Kitty, Alacritty
# Windows: Windows Terminal (NOT cmd.exe or PowerShell ISE)

# Enable shift+enter for multiline prompts:
claude
/terminal-setup

# Recommended IDE extensions:
# VS Code: Claude Code extension (optional but nice for side-by-side)
# IntelliJ: Terminal integration works directly
```

### 0.4 — HR Project Setup

```bash
# Clone the lab repository
git clone <repo-url> && cd hr-app

# Load the database schema
mysql -h 127.0.0.1 -u root -proot123 hr_db < database/schema.sql

# Load demo/seed data (for Day 3 MCP labs)
mysql -h 127.0.0.1 -u root -proot123 hr_db < database/seed-data.sql

# Create read-only MySQL user (needed for Lab 9: Database MCP)
mysql -h 127.0.0.1 -u root -proot123 -e "
  CREATE USER IF NOT EXISTS 'hr_readonly'@'%' IDENTIFIED BY 'readonly_pass';
  GRANT SELECT ON hr_db.* TO 'hr_readonly'@'%';
  FLUSH PRIVILEGES;
"

# Install Playwright browsers (needed for Lab 8: Playwright MCP)
npx playwright install

# Verify backend builds (if starter code exists)
mvn clean install -pl hrapp-service -DskipTests

# Verify frontend builds (if starter code exists)
cd frontend && npm install && npm run build && cd ..
```

### 0.5 — Pre-Built App Checkpoints (Branch Tags)

The lab repository provides **checkpoint branches** so students can start any day's labs even if they didn't complete the previous day:

```bash
# Day 1 start: bare project with requirements + schema only
git checkout day1-start

# Day 2 start: CLAUDE.md, skills, basic entities built
git checkout day2-start

# Day 3 start: full backend + frontend running (needed for MCP labs!)
git checkout day3-start        # ← CRITICAL: MCP labs need a running app

# Day 4 start: MCP servers configured, hire wizard working
git checkout day4-start

# View all checkpoints
git tag -l "day*"
```

> **Instructor note:** The `day3-start` checkpoint is especially important. Labs 8-10 (Playwright, MySQL, Figma MCP) require a running app with UI and seeded data. Students who fell behind on Day 1-2 MUST check out this branch to participate in Day 3.

### 0.6 — Optional Setup (Enhances Labs But Not Required)

```bash
# Figma account with access to HR design file (Lab 10)
# → If unavailable, the ASCII spec in docs/figma-ui-spec.md works as fallback

# GitHub CLI (Lab 14: CI/CD)
gh --version              # Install: https://cli.github.com/
gh auth login

# Docker Compose for full local stack
docker compose up -d      # Starts MySQL, Redis, backend, frontend
```

### 0.7 — Verification Script

Run this script to verify everything is ready:

```bash
#!/bin/bash
echo "=== Claude Code Workshop Setup Verification ==="
echo ""

check() { command -v $1 &>/dev/null && echo "✓ $1: $($1 --version 2>&1 | head -1)" || echo "✗ $1: NOT FOUND"; }

check java
check mvn
check node
check npm
check npx
check git
check mysql
check claude

echo ""
echo "--- API Key ---"
[ -n "$ANTHROPIC_API_KEY" ] && echo "✓ ANTHROPIC_API_KEY is set" || echo "✗ ANTHROPIC_API_KEY not set"

echo ""
echo "--- Database ---"
mysql -h 127.0.0.1 -u root -proot123 -e "SELECT 'hr_db connected' AS status;" 2>/dev/null && echo "✓ MySQL connection OK" || echo "✗ MySQL connection failed"

echo ""
echo "--- Playwright ---"
npx playwright --version 2>/dev/null && echo "✓ Playwright installed" || echo "✗ Playwright not installed (run: npx playwright install)"

echo ""
echo "All ✓? You're ready for Day 1!"
```

Save as `scripts/verify-setup.sh`, run with `bash scripts/verify-setup.sh`.

### Common Setup Issues & Fixes

| Issue | Symptom | Fix |
|---|---|---|
| Java version too old | `java --version` shows 17 or lower | Install Java 21 via SDKMAN: `sdk install java 21.0.5-tem` |
| Node.js too old | `node --version` shows <20 | `nvm install 20 && nvm use 20` |
| MySQL won't start | "Can't connect to MySQL server" | Check if port 3306 is free: `lsof -i :3306`. Use Docker if native install fails. |
| Claude "command not found" | npm installed it but shell doesn't find it | Run `npm bin -g` and add that path to your PATH |
| API key "401" error | Claude commands fail with auth error | Regenerate key at console.anthropic.com, re-export |
| Playwright browsers missing | "browserType.launch: Executable doesn't exist" | Run `npx playwright install` (downloads ~500MB of browsers) |
| `npx` hangs or fails | MCP servers won't start | Clear npm cache: `npm cache clean --force`, ensure Node 20+ |
| Permission denied on scripts | `bash: Permission denied` | `chmod +x scripts/verify-setup.sh` |
| Docker MySQL port conflict | "Bind for 0.0.0.0:3306 failed: port is already allocated" | Stop local MySQL: `sudo systemctl stop mysql` or use a different port: `-p 3307:3306` |

---

# DAY 1: Foundations — Teaching Claude Your Enterprise

---

## Module 1: The Knowledge Gap Problem (45 min lecture + 15 min discussion)

### Slide 1.1 — The Enterprise Reality
- LLMs know Java, Spring Boot, React — but they don't know YOUR company
- They don't know your `Hr` prefix naming convention
- They don't know `HrLogHelper` must wrap every public method
- They don't know your API path must be `/app/hr/api/v1/`
- They don't know salary fields must be masked in logs

### Slide 1.2 — The 6-Layer Knowledge Bridge
```
Layer 1: CLAUDE.md          → Always-on context (coding standards, build commands)
Layer 2: Skills             → On-demand domain knowledge (internal libraries, patterns)
Layer 3: Custom Subagents   → Specialized reviewers (security, architecture)
Layer 4: Hooks              → Deterministic enforcement (lint, format, block)
Layer 5: MCP Integrations   → External knowledge (issue trackers, monitoring)
Layer 6: Custom Commands    → Repeatable workflows (PR, deploy, review)
```

### Slide 1.3 — Why This Matters: The Cost of Not Teaching
- Without standards: Claude generates `EmployeeController` instead of `HrEmployeeController`
- Without patterns: Claude exposes JPA entities directly in API responses
- Without rules: Claude logs salary values in plaintext
- Without verification: Claude skips the `HrLogHelper` entry/exit pattern
- **Each correction costs context tokens and developer attention**

### Slide 1.4 — The Compounding Engineering Principle (Boris Cherny)
- Every mistake Claude makes → update CLAUDE.md so it never repeats
- CLAUDE.md is checked into git → whole team benefits
- Over weeks/months: Claude becomes an expert in YOUR codebase
- "Claude is effective at writing rules for itself"

---

## Module 2: CLAUDE.md — Your Enterprise Constitution (30 min lecture + 60 min lab)

### Slide 2.1 — CLAUDE.md Anatomy
```
Root CLAUDE.md        → Team-wide standards (Hr prefix, logging, API paths)
  └── backend/CLAUDE.md   → Java/Spring specific (layers, transactions, DTOs)
  └── frontend/CLAUDE.md  → React/TypeScript specific (RDS components, hooks)
  └── database/CLAUDE.md  → Schema conventions (utf8mb4, soft deletes, audit)
```

### Slide 2.2 — The 200-Line Rule
- Frontier LLMs follow ~150-200 instructions with reasonable consistency
- Beyond that: rules get lost, Claude ignores your actual instructions
- For each line ask: "Would removing this cause Claude to make mistakes?"
- If Claude already does it correctly without the instruction → delete it

### Slide 2.3 — Pointers Over Copies
```markdown
# BAD — code snippet that will go stale
The HrLogHelper pattern:
  LOGGER.info("Entering methodName(id={}, salary=MASKED)", id);

# GOOD — pointer to the authoritative source
See @src/main/java/com/company/hr/util/HrLogHelper.java for logging patterns.
Follow the same entry/exit pattern used in @src/.../service/HrEmployeeService.java
```

### Slide 2.4 — What Goes In vs What Stays Out

| Include | Exclude |
|---|---|
| `Hr` prefix naming convention | Standard Java conventions |
| `HrLogHelper` entry/exit requirement | How Spring Boot works |
| `/app/hr/api/v1/` path requirement | REST basics |
| Never log salary, email, phone | Generic security advice |
| MapStruct for all DTO mapping | How MapStruct works |
| `@Transactional` on service layer only | What transactions are |
| Soft delete via `deleted_at` column | SQL basics |
| Oracle Redwood design tokens | How CSS works |

### Slide 2.5 — Emphasis and Enforcement
- Use "IMPORTANT" or "YOU MUST" for critical rules
- Example: `"IMPORTANT: NEVER expose JPA entities in API responses. Always use DTOs mapped via MapStruct."`
- If Claude still violates: the file is too long and the rule is getting lost
- If Claude asks questions answered in CLAUDE.md: the phrasing is ambiguous

---

### LAB 1: Crafting the HR App CLAUDE.md (60 min)

**Objective:** Create a production-grade CLAUDE.md for the HR application that teaches Claude your enterprise standards.

**Pre-requisites:** Read `requirement.md` and `schema.sql`

**Step 1 — Bootstrap with /init** (5 min)
```
cd /path/to/hr-project
claude
/init
```
Review the auto-generated CLAUDE.md. Note what it got right and what's missing.

**Step 2 — Add Enterprise Naming Standards** (10 min)
Add rules derived from the requirements doc:
- All Java classes must use `Hr` prefix
- Package structure: `com.company.hr.{config,controller,service,repository,model,dto,mapper,exception,util}`
- API path format: `/app/hr/api/v1/{entity}`
- Frontend component naming: `Hr` prefix for all custom components

**Step 3 — Add Architecture Rules** (10 min)
Encode the layered architecture constraints:
- Controller → Service → Repository (no skipping layers)
- `@Transactional` on service methods only
- Never expose JPA entities in responses — use MapStruct DTOs
- Audit logging via `@EntityListener`

**Step 4 — Add Security & Privacy Rules** (10 min)
```markdown
# Security — CRITICAL
- NEVER log salary, email, or phoneNumber values. Use "MASKED" or log record ID only.
- All sensitive endpoints must have @PreAuthorize annotations
- Salary fields must be null in DTOs when caller is ROLE_EMPLOYEE viewing another employee
- Use HrSecurityUtil for all role/permission checks
```

**Step 5 — Add Build & Test Commands** (5 min)
```markdown
# Commands
- Build backend: mvn clean install -pl hrapp-service
- Run tests: mvn test -pl hrapp-service
- Run single test: mvn test -pl hrapp-service -Dtest=HrEmployeeServiceTest
- Frontend dev: cd frontend && npm run dev
- Frontend test: cd frontend && npx vitest run
- Lint: cd frontend && npm run lint
```

**Step 6 — Add Frontend Standards** (10 min)
```markdown
# Frontend
- Design System: Oracle Redwood (RDS 24C) — see @docs/figma-ui-spec.md
- Use Tailwind CSS with RDS design tokens
- State management: TanStack Query for server state, React Context for auth
- API client: Use HrApiClient wrapper (Axios with JWT interceptors)
- Forms: React Hook Form with validation
- Charts: Recharts
- All components must handle Loading, Empty, Error, and Success states
```

**Step 7 — Test Your CLAUDE.md** (10 min)
Start a new Claude Code session and ask:
```
Create the HrRegionController with full CRUD endpoints following our standards.
```
Evaluate:
- Did it use the `Hr` prefix?
- Did it follow the layered architecture?
- Did it use DTOs and MapStruct?
- Did it add `HrLogHelper` entry/exit logging?
- Did it put `@Transactional` on the service, not the controller?

**Deliverable:** A CLAUDE.md file under 200 lines that encodes your enterprise standards.

---

## Module 3: Skills — Teaching Claude Your Internal Libraries (30 min lecture + 60 min lab)

### Slide 3.1 — CLAUDE.md vs Skills: When to Use Which
| CLAUDE.md | Skills |
|---|---|
| Loaded every session | Loaded on demand |
| ~200 lines max | No size limit |
| Coding standards, build commands | Library docs, domain knowledge |
| Broad rules | Deep, specific knowledge |
| Costs context every time | Costs context only when relevant |

### Slide 3.2 — The 9 Enterprise Skill Types
1. **Library & API reference** → HrLogHelper docs, HrSecurityUtil API, HrApiClient usage
2. **Product verification** → How to test the HR app end-to-end
3. **Data & analysis** → Employee IDs, department codes, job grade ranges
4. **Business automation** → Hire-to-retire workflow
5. **Scaffolding & templates** → New entity boilerplate (controller + service + repo + dto + mapper)
6. **Code quality & review** → Enterprise review checklist
7. **CI/CD & deployment** → Maven build pipeline, Docker compose
8. **Incident runbooks** → Common errors and their fixes
9. **Infrastructure ops** → Database migration procedures

### Slide 3.3 — Skill Authoring Best Practices
- **Gotchas section** = highest-signal content
- **Progressive disclosure**: SKILL.md hub with spoke files
- Write descriptions **for the model** (trigger phrases), not humans
- Include **helper scripts** for composition vs reconstruction
- Don't railroad — give info, let Claude adapt

### Slide 3.4 — Skills Hierarchy for Enterprise Governance
```
enterprise (highest priority)   → org-wide: security rules, logging standards
  └── personal                  → your preferences: editor settings, review style
        └── project (lowest)    → project-specific: HR app patterns
```

---

### LAB 2: Building Skills for HR App Internal Libraries (60 min)

**Objective:** Create skills that teach Claude about the HR app's custom utilities and patterns.

**Step 1 — Create the Skills Directory** (2 min)
```bash
mkdir -p .claude/skills/hr-entity-scaffold
mkdir -p .claude/skills/hr-logging
mkdir -p .claude/skills/hr-security
mkdir -p .claude/skills/hr-api-patterns
```

**Step 2 — Build the Entity Scaffolding Skill** (15 min)
Create `.claude/skills/hr-entity-scaffold/SKILL.md`:
```markdown
---
name: hr-entity-scaffold
description: Scaffold a new HR entity with controller, service, repository, DTO, and mapper following enterprise conventions
disable-model-invocation: true
---
Create the full stack for the HR entity: $ARGUMENTS

Follow this checklist:
1. Entity class in model/ with Hr prefix, JPA annotations, audit fields
2. Repository interface extending JpaRepository + JpaSpecificationExecutor
3. Summary DTO (for list views) and Detail DTO (for single views)
4. Create and Update request DTOs with Bean Validation annotations
5. MapStruct mapper interface
6. Service class with @Transactional, HrLogHelper entry/exit on all methods
7. Controller with /app/hr/api/v1/{entity} path, @Valid on inputs, @PreAuthorize on mutations
8. Standard response envelope wrapping all responses
9. Pagination support on list endpoint (page, size, sort params)

Reference patterns:
- See @src/main/java/com/company/hr/service/HrRegionService.java for service pattern
- See @src/main/java/com/company/hr/controller/HrRegionController.java for controller pattern
- See @src/main/java/com/company/hr/mapper/HrRegionMapper.java for mapper pattern

## Gotchas
- NEVER expose entities directly in API responses
- @Transactional goes on service methods only, NEVER on controllers
- Use @Transactional(readOnly = true) for all read operations
- NEVER log salary, email, or phone values
- Soft-delete entities need deleted_at filtering in all queries
- All list endpoints must cap page size at 100
```

**Step 3 — Build the Logging Skill** (10 min)
Create `.claude/skills/hr-logging/SKILL.md`:
```markdown
---
name: hr-logging
description: HrLogHelper usage patterns, log privacy rules, and entry/exit logging standards
---
# HrLogHelper Standard

Every public method in Service and Controller layers MUST log entry and exit.

## Pattern
private static final HrLogHelper LOGGER = new HrLogHelper(ClassName.class);

public ReturnType methodName(params) {
    LOGGER.info("Entering methodName(id={})", id);
    // ... logic ...
    LOGGER.info("Exiting methodName for id: {}", id);
    return result;
}

## Privacy Rules — CRITICAL
NEVER log these fields: salary, commission_pct, email, phone_number, password
Always use "MASKED" placeholder or log only the record ID.

## Gotchas
- Don't forget exit logging in early-return branches
- Exception paths: use LOGGER.error() with the exception, but still mask PII
- Batch operations: log count, not individual records
```

**Step 4 — Build the Security Skill** (15 min)
Create `.claude/skills/hr-security/SKILL.md`:
```markdown
---
name: hr-security
description: RBAC enforcement, salary masking, HrSecurityUtil usage, and @PreAuthorize patterns for the HR application
---
# HR Security Patterns

## Role Hierarchy
| Role | Authority | Scope |
|---|---|---|
| Admin | ROLE_ADMIN | Global |
| HR Specialist | ROLE_HR_SPECIALIST | Global |
| Manager | ROLE_MANAGER | Direct/indirect reports only |
| Employee | ROLE_EMPLOYEE | Own profile + public directory |

## @PreAuthorize Patterns
- Admin only: @PreAuthorize("hasRole('ADMIN')")
- HR actions: @PreAuthorize("hasAnyRole('ADMIN', 'HR_SPECIALIST')")
- Manager team: @PreAuthorize("hasAnyRole('ADMIN', 'HR_SPECIALIST', 'MANAGER')")
- Self or admin: @PreAuthorize("hasRole('ADMIN') or #id == principal.employeeId")

## Salary Masking
When caller is ROLE_EMPLOYEE viewing another employee:
- Set salary = null in DTO
- Set commission_pct = null in DTO
Use HrSecurityUtil.canViewSalary(targetEmployeeId) before populating.

## Gotchas
- EVERY mutation endpoint needs @PreAuthorize — no exceptions
- Manager endpoints must filter to direct/indirect reports in the query, not post-filter
- Never trust frontend role checks alone — always enforce server-side
```

**Step 5 — Build the API Patterns Skill** (10 min)
Create `.claude/skills/hr-api-patterns/SKILL.md` covering:
- Standard response envelope structure
- Error response format with errorCode
- Pagination request/response format
- Idempotency-Key header for mutations
- Versioned paths `/app/hr/api/v1/`

**Step 6 — Test Skills** (8 min)
```
/hr-entity-scaffold departments
```
Verify it follows all conventions without you having to remind it.

**Deliverable:** 4 skills in `.claude/skills/` that encode internal library knowledge.

---

## Module 4: Plan Mode & the Explore-Plan-Implement Cycle (30 min lecture + 60 min lab)

### Slide 4.1 — Why Jumping to Code Fails in Enterprise
- Enterprise has layers: Entity → DTO → Mapper → Service → Controller
- Enterprise has cross-cutting: logging, security, audit, i18n
- Missing one concern = rework that pollutes context
- Planning first catches gaps BEFORE they consume tokens

### Slide 4.2 — Boris Cherny's Plan Mode Pattern
1. Enter Plan Mode (`Shift+Tab` twice)
2. **Pour energy into the plan** — iterate until solid
3. Use a separate Claude instance to review the plan as "staff engineer"
4. Switch to auto-accept mode
5. Claude executes the entire implementation in one shot
6. If things go sideways: **stop and re-plan**, don't push forward

### Slide 4.3 — The Interview Technique for Complex Features
```
I want to build the Employee Hire Wizard for our HR app.
Interview me in detail using the AskUserQuestion tool.
Ask about technical implementation, edge cases, security concerns,
and integration with existing patterns.
Keep interviewing until we've covered everything,
then write a complete spec to SPEC.md.
```

### Slide 4.4 — When to Skip Planning
- Typo fixes, adding a log line, renaming a variable
- If you can describe the diff in one sentence → just do it
- Planning overhead isn't worth it for trivial changes

---

### LAB 3: Plan Mode Deep Dive — Designing the Employee Service (60 min)

**Objective:** Use Plan Mode to design the `HrEmployeeService` — the most complex service in the HR app — before writing a single line of code.

**Step 1 — Enter Plan Mode and Explore** (10 min)
```
[Plan Mode]
Read the requirements doc at @docs/requirement.md sections 6, 8, 9, 10.
Also read @database/schema.sql to understand the employees table structure.
Summarize: what are ALL the operations HrEmployeeService needs to support?
```

**Step 2 — Ask Claude to Create an Implementation Plan** (15 min)
```
[Plan Mode]
Create a detailed implementation plan for HrEmployeeService covering:
1. All CRUD operations
2. Hire wizard (multi-step, creates employee + user account + role assignment)
3. Promotion (updates job, salary, creates job_history entry)
4. Transfer (updates department/location/manager, creates job_history)
5. Termination (sets status, populates deleted_at, creates job_history)
6. Salary adjustment with validation against job grade min/max
7. Manager scope filtering for ROLE_MANAGER
8. Salary masking for ROLE_EMPLOYEE

For each operation, specify:
- Method signature
- @Transactional configuration
- @PreAuthorize rule
- HrLogHelper usage
- Audit implications
- DTOs needed
```

**Step 3 — Review and Challenge the Plan** (10 min)
Open a SECOND Claude session (or use `/btw`):
```
Review this implementation plan as a staff engineer.
Look for: missing edge cases, security gaps, transaction boundary issues,
and violations of our CLAUDE.md standards.
[paste plan]
```

**Step 4 — Refine the Plan** (10 min)
Incorporate review feedback. Common things to catch:
- What happens if you promote someone to a job where their salary is below min_salary?
- What happens if you terminate the last manager in a department?
- Is the hire wizard atomic? (user account creation + employee creation in one transaction)
- Are audit logs in `REQUIRES_NEW` propagation?

**Step 5 — Execute the Plan** (15 min)
```
[Normal Mode — Auto-accept]
Implement the HrEmployeeService following the plan above.
Write the service, all DTOs, the MapStruct mapper, and tests.
Run the tests after implementation.
```

**Deliverable:** A complete HrEmployeeService implementation plan + initial code, built through disciplined planning.

---

# DAY 2: Scaling — Parallel Work, Quality Gates & Automation

---

## Module 5: Context Management — The #1 Performance Lever (30 min lecture + 30 min lab)

### Slide 5.1 — Context is Your Fundamental Constraint
- Every file read, every command output, every message = tokens consumed
- Performance degrades as context fills
- Long sessions with irrelevant context = more mistakes
- **Managing context is managing quality**

### Slide 5.2 — The 5 Context Killers in Enterprise Development
1. **Kitchen sink session** — mixing backend and frontend work in one conversation
2. **Exploration sprawl** — "investigate the auth system" without scope → reads 50 files
3. **Correction accumulation** — 5 failed attempts polluting context
4. **Stale conversation** — old decisions no longer relevant to current task
5. **Verbose tool output** — full stack traces, large SQL results

### Slide 5.3 — Context Management Toolkit
| Command | When to Use |
|---|---|
| `/clear` | Between unrelated tasks (backend → frontend switch) |
| `/compact Focus on X` | Mid-session, preserve only what matters |
| `/btw` | Quick question without polluting context |
| `/rewind` | Undo and try a different approach |
| Subagents | Delegate investigation to separate context |

### Slide 5.4 — The Subagent Pattern for Enterprise Codebases
```
Use subagents to investigate:
1. How HrSecurityUtil enforces role-based data filtering
2. What DTOs exist for the Employee entity
3. How HrLogHelper is used in existing services

Report back findings. Don't read files in the main context.
```
Result: 3 parallel investigations, main context stays clean for implementation.

### Slide 5.5 — Session Discipline
- One session per bounded task: "Implement HrDepartmentService"
- `/clear` before switching concerns
- After 2 failed corrections → `/clear` + better prompt
- Name sessions: `claude --name "hr-employee-service"`
- Resume later: `claude --resume`

---

### LAB 4: Context-Efficient Development (30 min)

**Objective:** Practice context management while building the HR Department module.

**Step 1 — Scoped Investigation via Subagents** (10 min)
```
Use subagents to investigate:
1. How departments relate to employees, locations, and parent departments in the schema
2. What endpoints the requirements doc specifies for departments
3. What the department hierarchy UI looks like in the figma spec

Write findings to a file: docs/notes/department-investigation.md
```

**Step 2 — Clean Implementation Session** (15 min)
```
/clear
Based on @docs/notes/department-investigation.md, implement:
1. HrDepartment entity with parent hierarchy support
2. HrDepartmentService with CRUD + tree operations
3. HrDepartmentController following our API standards
Run tests after.
```

**Step 3 — Measure the Difference** (5 min)
- Check the status line: how much context was used?
- Compare: what if you'd done the investigation in the main context?
- Key insight: subagents kept ~60% of context free for implementation

**Deliverable:** Department module built with clean context management.

---

## Module 6: Parallel Sessions & Git Worktrees (30 min lecture + 60 min lab)

### Slide 6.1 — Boris Cherny's "Single Biggest Productivity Unlock"
- 3-5 git worktrees, each with its own Claude session
- No code conflicts between sessions
- Each session has full, clean context for its task
- Shell aliases for one-keystroke switching

### Slide 6.2 — Worktree Setup
```bash
# Create worktrees
git worktree add ../hr-backend-entities  feature/backend-entities
git worktree add ../hr-backend-security  feature/backend-security
git worktree add ../hr-frontend-components feature/frontend-components

# Shell aliases
alias za='cd ../hr-backend-entities && claude --name entities'
alias zb='cd ../hr-backend-security && claude --name security'
alias zc='cd ../hr-frontend-components && claude --name components'
```

### Slide 6.3 — Task Decomposition for Parallel Work
```
HR App Build — Parallel Tracks:

Worktree A: Backend Entities & Services
  → Regions, Countries, Locations, Jobs (simple CRUD)

Worktree B: Backend Security & Auth
  → HrSecurityConfig, JWT filter, HrSecurityUtil, login endpoint

Worktree C: Frontend Foundation
  → Design tokens, RDS components, HrApiClient, routing shell

Worktree D: Database & Migrations
  → Flyway scripts, seed data, schema extensions
```

### Slide 6.4 — Writer/Reviewer Pattern
| Session A (Writer) | Session B (Reviewer) |
|---|---|
| Implements HrEmployeeService | |
| | Reviews: "Check for missing @PreAuthorize, HrLogHelper violations, exposed entities" |
| Addresses feedback | |

Fresh context = unbiased review (Claude won't defend code it just wrote)

---

### LAB 5: Parallel Development Sprint (60 min)

**Objective:** Build 3 backend modules simultaneously using parallel sessions.

**Setup — Create Worktrees** (5 min)
```bash
git worktree add ../hr-track-a feature/track-a-entities
git worktree add ../hr-track-b feature/track-b-auth
git worktree add ../hr-track-c feature/track-c-utils
```

**Track A — Simple CRUD Entities (20 min)**
```
/hr-entity-scaffold regions
```
Then: countries, locations, jobs. Use the scaffolding skill from Lab 2.

**Track B — Security Foundation (20 min)**
```
[Plan Mode]
Read @docs/requirement.md sections 7.1-7.6.
Plan the implementation of:
1. HrSecurityConfig (Spring Security filter chain)
2. JWT authentication filter
3. HrSecurityUtil
4. Login endpoint with JWT issuance
5. Security headers configuration
```
Then implement.

**Track C — Core Utilities (20 min)**
```
Implement these utility classes following the patterns in our requirements:
1. HrLogHelper — standardized logging with PII masking
2. HrMessageProvider — i18n message resolution from ResourceBundle
3. HrFormatter — date/currency/number formatting per user preferences
4. HrGlobalExceptionHandler — @ControllerAdvice with error code mapping
```

**Cross-Review (10 min)**
In a fresh session, review Track A's output:
```
Review the Region, Country, Location, and Job implementations.
Check for: missing @PreAuthorize, HrLogHelper violations,
exposed entities, missing pagination caps, soft-delete filtering.
```

**Deliverable:** 3 parallel tracks of work, cross-reviewed.

---

## Module 7: Hooks, Verification & Quality Gates (30 min lecture + 60 min lab)

### Slide 7.1 — Advisory vs Deterministic
| CLAUDE.md (Advisory) | Hooks (Deterministic) |
|---|---|
| "Please run tests" | Tests run automatically after every edit |
| "Use eslint" | eslint runs after every file write |
| "Don't edit migrations" | Writes to migrations/ are blocked |
| Claude may forget | Hooks never forget |

### Slide 7.2 — Hook Types for Enterprise
- **PostToolUse(Edit/Write)** → auto-format, auto-lint after every edit
- **PostCompact** → re-inject critical rules after context compression
- **PreCommit** → run full test suite before allowing commit
- **Custom guardrails** → block edits to `schema.sql` directly (use Flyway)

### Slide 7.3 — Verification is the #1 Quality Lever
"Give Claude a way to verify its work... 2-3x the quality of final result" — Boris Cherny

| Type | Example |
|---|---|
| Unit tests | `mvn test -Dtest=HrEmployeeServiceTest` |
| Integration tests | Spring Boot Test with real DB |
| Linting | `npm run lint` for frontend |
| Type checking | `npx tsc --noEmit` for frontend |
| API contract | Swagger validation |
| Security scan | `@PreAuthorize` coverage check |

### Slide 7.4 — The Verification Prompt Pattern
```
Implement HrJobService with full CRUD.
After implementation:
1. Write unit tests covering happy path and edge cases
2. Run the tests and fix any failures
3. Verify HrLogHelper is used on every public method
4. Verify no JPA entities are exposed in responses
5. Verify @PreAuthorize is on every mutation endpoint
```

---

### LAB 6: Setting Up Quality Gates (60 min)

**Objective:** Configure hooks and verification patterns for the HR app.

**Step 1 — Create Auto-Format Hook** (10 min)
```
Write a hook that runs our Java formatter after every file edit
in the src/main/java directory.
```

**Step 2 — Create Migration Guard Hook** (10 min)
```
Write a hook that blocks direct edits to database/schema.sql.
Display message: "Use Flyway migration scripts instead of editing schema.sql directly."
```

**Step 3 — Create PostCompact Hook** (10 min)
```
Write a PostCompact hook that re-injects these critical rules:
- All classes use Hr prefix
- Never log salary/email/phone
- @Transactional on service layer only
- Never expose JPA entities in API responses
```

**Step 4 — Build Verification into Workflow** (15 min)
Create `.claude/commands/verify-backend.md`:
```markdown
Run the following verification checks:

1. Run `mvn test` and report results
2. Grep for any public service method missing HrLogHelper entry/exit logging
3. Grep for any controller returning an Entity class instead of a DTO
4. Grep for any @Transactional on a Controller class
5. Grep for any logged salary, email, or phone values
6. List any endpoint missing @PreAuthorize

Report: PASS/FAIL for each check with file:line references for failures.
```

**Step 5 — Build Code Review Subagent** (15 min)
Create `.claude/agents/hr-code-reviewer.md`:
```markdown
---
name: hr-code-reviewer
description: Reviews HR app code for enterprise standard compliance
tools: Read, Grep, Glob, Bash
---
You are a senior engineer reviewing code for the HR Enterprise Platform.

Check for:
1. Hr prefix on all classes
2. HrLogHelper entry/exit on all public service/controller methods
3. No JPA entities in API responses (must use DTOs)
4. @Transactional on service methods only
5. @PreAuthorize on all mutation endpoints
6. Salary/email/phone never logged
7. Soft-delete filtering (deleted_at IS NULL) in all queries
8. Pagination with max size cap of 100
9. Standard response envelope on all endpoints
10. Bean Validation (@Valid, @NotNull, etc.) on request DTOs

For each violation, provide file:line and the fix.
```

**Deliverable:** Hooks + verification command + code review subagent configured.

---

## Module 8: Enterprise Workflow Automation (30 min lecture + 60 min lab)

### Slide 8.1 — Custom Commands for Repeatable Workflows
```
.claude/commands/
  ├── hr-entity-scaffold.md   → "/hr-entity-scaffold employees"
  ├── verify-backend.md       → "/verify-backend"
  ├── commit-push-pr.md       → "/commit-push-pr"
  ├── fix-issue.md            → "/fix-issue 1234"
  └── migration.md            → "/migration add-contract-end-date"
```

### Slide 8.2 — Fan-Out for Large Migrations
```bash
# Example: Add HrLogHelper to all services that are missing it
for file in $(grep -rL "HrLogHelper" src/main/java/com/company/hr/service/); do
  claude -p "Add HrLogHelper entry/exit logging to all public methods in $file. Follow our logging standards." \
    --allowedTools "Edit"
done
```

### Slide 8.3 — Agent Teams for Complex Features
```
The Hire Employee feature needs:
- Agent 1 (worktree): HrEmployeeService.hireEmployee() + job_history + audit
- Agent 2 (worktree): HrUserService.createUserAccount() + role assignment
- Agent 3 (worktree): React HireWizard component (4 steps)
- Agent 4 (worktree): Integration tests for the full hire flow

Coordinate via shared task list. Each agent works in isolation.
```

### Slide 8.4 — CI/CD Integration
```bash
# In CI pipeline
claude -p "Review this PR for security issues. Check @PreAuthorize coverage, \
  PII logging, SQL injection risks, and exposed entities." \
  --output-format json

# Auto-generate release notes
claude -p "Generate release notes from commits since last tag" \
  --output-format json
```

---

### LAB 7: Building the Hire Wizard End-to-End (60 min)

**Objective:** Use all techniques learned to build the most complex feature — Employee Hire Wizard.

**Pre-requisites:** Labs 1-6 completed (CLAUDE.md, Skills, Hooks, Verification command, Code review agent). If not all available, check out `day2-start` branch which includes pre-built versions.

**Step 1 — Plan with Interview** (10 min)
```
I want to build the Employee Hire Wizard. Interview me about:
- What happens when hire is submitted (backend flow)
- How user account + role assignment integrates
- What validation rules apply (salary within job grade)
- Error handling (duplicate email, invalid department)
- Idempotency (prevent double-hire)
```

**Step 2 — Parallel Implementation** (30 min)

Track A — Backend:
```
Implement the hire flow:
1. HrEmployeeService.hireEmployee() — creates employee, user, role in one transaction
2. Creates job_history entry for initial assignment
3. Sends notification to HR admin
4. Validates salary against job grade min/max
5. Supports Idempotency-Key header
```

Track B — Frontend:
```
Build the HireWizard React component following @docs/figma-ui-spec.md section 3.5:
1. Step 1: Personal Details (React Hook Form)
2. Step 2: Job Information (job dropdown with grade preview)
3. Step 3: Compensation (salary input with min/max validation bar)
4. Step 4: Review & Confirm
Use HrApiClient, RDS design tokens, handle all states (loading, error, success).
```

**Step 3 — Cross-Review** (10 min)
```
Use the hr-code-reviewer agent to review the hire wizard implementation.
```

**Step 4 — Verify** (10 min)
```
/verify-backend
```
Plus run the test suite and fix any failures.

**Deliverable:** Complete Hire Wizard (backend + frontend), built using all enterprise patterns.

---

## Module 8B: Taking Notes — Building Your Lab Exercise Knowledge Base (15 min)

### Slide 8B.1 — The Meta-Skill: Learning While Building
As you build the HR app using Claude Code:
- **Every mistake Claude makes** → note it → update CLAUDE.md → becomes a training example
- **Every skill you create** → document why → becomes a lab reference
- **Every prompt that works well** → save it → becomes a command template
- **Every prompt that fails** → note why → becomes a "common pitfalls" slide

### Slide 8B.2 — Notes Template for Lab Development
```markdown
## Build Note: [Feature Name]
Date: YYYY-MM-DD

### What we built
[Brief description]

### Technique used
[Which Claude Code technique: Plan Mode, Skill, Hook, Subagent, etc.]

### What worked
[Prompts, patterns, configurations that produced good results]

### What failed first
[Initial approach that didn't work and why]

### CLAUDE.md update made
[Rule added after the mistake]

### Lab exercise derived
[How this experience maps to a training exercise]
```

---

# DAY 3: Integration — MCP Servers, End-to-End Verification & Production Readiness

> **Important:** Day 3 labs require a running HR app (backend + frontend) with seeded data.
> Students who didn't complete Day 1-2 must run `git checkout day3-start` to get a working app.
> Instructor should verify all students have the app running before starting Lab 8.

---

## Module 9: MCP Servers — Connecting Claude to Your Ecosystem (45 min lecture + 15 min discussion)

### Slide 9.1 — Why MCP Changes Everything
- Without MCP: you copy-paste database results, screenshots, design specs into prompts
- With MCP: Claude queries the database, drives the browser, reads Figma — directly
- MCP = Model Context Protocol — open standard for AI-tool integrations
- Claude Code can connect to hundreds of MCP servers

### Slide 9.2 — The HR App MCP Stack
```
┌─────────────────────────────────────────────────┐
│                  Claude Code                     │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Playwright│  │  MySQL   │  │  Figma   │      │
│  │   MCP    │  │   MCP    │  │   MCP    │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │              │              │            │
└───────┼──────────────┼──────────────┼────────────┘
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │ Browser │   │ MySQL   │   │  Figma  │
   │Chromium │   │  hr_db  │   │ Designs │
   │Firefox  │   │(readonly│   │  & RDS  │
   │WebKit   │   │  user)  │   │ Tokens  │
   └─────────┘   └─────────┘   └─────────┘
```

### Slide 9.3 — MCP Transport Options
| Transport | When to Use | Example |
|---|---|---|
| **HTTP** (recommended) | Cloud-hosted services | Figma, Notion, GitHub |
| **SSE** (deprecated) | Legacy servers | Older integrations |
| **stdio** | Local processes | Playwright, MySQL, custom scripts |

```bash
# HTTP (remote)
claude mcp add figma --transport http https://mcp.figma.com/mcp

# stdio (local)
claude mcp add playwright -- npx @playwright/mcp@latest
```

### Slide 9.4 — MCP Scopes: Personal vs Team vs Enterprise
| Scope | Flag | Stored In | Use Case |
|---|---|---|---|
| `local` | `--scope local` (default) | `.claude/settings.local.json` | Your personal servers |
| `project` | `--scope project` | `.mcp.json` (git-tracked) | Team-shared servers |
| `user` | `--scope user` | `~/.claude/settings.json` | Your servers across all projects |

**Key insight:** Check `.mcp.json` into git so every team member gets the same MCP setup automatically.

### Slide 9.5 — Security Rules for MCP
- **Database MCP: ALWAYS use a read-only user** — writes go through your application API
- **Never commit secrets** in `.mcp.json` — use `${ENV_VAR}` references
- **Review MCP server sources** before adding — supply chain risk
- **Limit MCP tool permissions** — use `/permissions` to control what MCP tools can do
- **Third-party warning:** Anthropic has not verified all MCP servers — trust but verify

---

## Module 10: Playwright MCP — Browser-Driven Verification (30 min lecture + 60 min lab)

### Slide 10.1 — How Playwright MCP Works
- Microsoft's official `@playwright/mcp` package
- Uses browser's **accessibility tree** (not screenshots) for interactions
- Faster and more **token-efficient** than screenshot-based approaches
- Supports Chromium, Firefox, WebKit
- Claude navigates, clicks, fills forms, verifies — in plain English

### Slide 10.2 — Setup
```bash
# Install browsers
npx playwright install

# Add to Claude Code
claude mcp add playwright -- npx @playwright/mcp@latest

# Verify
claude mcp list
/mcp
```

### Slide 10.3 — Playwright MCP for Enterprise Verification
| Verification Type | Example Prompt |
|---|---|
| **Functional flow** | "Log in, navigate to Hire Wizard, complete all 4 steps, verify success" |
| **RBAC UI guards** | "Log in as Employee, verify Hire button is NOT visible" |
| **Responsive layout** | "Set viewport to 768px, verify sidebar collapses to icons" |
| **Cross-browser** | "Test login flow on Chromium and Firefox" |
| **Accessibility** | "Check all form fields have labels, all buttons have aria-labels" |
| **Design match** | "Compare dashboard layout against Figma spec section 3.2" |

### Slide 10.4 — Playwright MCP vs Playwright CLI (2026)
| Feature | MCP (streaming) | CLI (snapshots) |
|---|---|---|
| Token usage | Full accessibility tree per interaction | ~4x fewer tokens (YAML snapshots) |
| Real-time | Yes — Claude drives browser live | Snapshots saved to disk |
| Best for | Interactive exploration, debugging | Batch testing, CI/CD |
| Setup | MCP server | Separate CLI tool |

**Recommendation:** Use MCP during development (interactive). Use CLI in CI pipelines (token-efficient).

---

### LAB 8: Setting Up Playwright MCP & Verifying the HR Dashboard (60 min)

**Objective:** Connect Playwright MCP and have Claude verify the HR app's UI against the Figma spec.

**Pre-requisites:** HR app frontend running on `localhost:3000`, database seeded with demo data.

**Step 1 — Install & Connect Playwright MCP** (10 min)
```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install

# Add MCP server
claude mcp add playwright -- npx @playwright/mcp@latest

# Verify connection
/mcp
```

Ask Claude: `"List the tools available from the Playwright MCP server."`

**Step 2 — Verify Login Flow** (10 min)
```
Use Playwright to test the login flow:
1. Open http://localhost:3000/login
2. Enter username "admin" and password "Admin@123"
3. Click Sign In
4. Verify we land on the Dashboard page
5. Verify the welcome message shows the user's name
6. Verify the sidebar navigation is visible
```

**Step 3 — Verify Dashboard Against Figma Spec** (15 min)
```
Navigate to the Dashboard. Verify against @docs/figma-ui-spec.md section 3.2:

1. KPI Scoreboard: 5 cards in a row (Total Headcount, New Hires, Attrition Rate,
   Open Probations, Contracts Expiring). Each card has a number and a trend indicator.
2. Charts Row: 3 columns — Donut chart (Headcount by Country),
   Bar chart (Headcount by Department), Quick Actions panel.
3. Bottom Row: 2 columns — Attrition Trend line chart, Recent Activity feed.
4. Filter bar exists with Date Range, Country, Department dropdowns.

For each element: report PASS (exists and correct) or FAIL (missing or wrong).
Take a screenshot at each step.
```

**Step 4 — Test RBAC UI Guards** (15 min)
```
Test role-based UI visibility:

TEST 1 — Admin user:
- Log in as admin
- Verify: Dashboard, Employee Directory, Hire button, Admin menu, Audit Logs all visible
- Verify: Salary column shows actual values in Employee Directory

TEST 2 — Employee user:
- Log out, log in as employee
- Verify: Dashboard shows personal view only
- Verify: Hire button NOT visible
- Verify: Admin menu NOT visible
- Verify: Salary column shows "—" for other employees

Report PASS/FAIL for each check.
```

**Step 5 — Test Responsive Layout** (10 min)
```
Test responsive breakpoints:

1. Desktop (1440px): Full sidebar (240px), 3-column chart layout
2. Tablet (768px): Sidebar collapses to icon-only (64px)
3. Mobile (375px): Sidebar hidden, hamburger menu appears

For each breakpoint: take a screenshot and report layout matches spec.
```

**Deliverable:** Playwright MCP connected, 4 verification suites passing.

---

## Module 11: Database MCP — Data Verification & Schema Validation (20 min lecture + 40 min lab)

### Slide 11.1 — Why Database MCP?
- Claude can verify data operations after API calls
- Validate schema matches JPA entities
- Run integrity checks without leaving Claude Code
- Catch bugs that unit tests miss (wrong FK, orphaned records, constraint violations)

### Slide 11.2 — Setup with Read-Only Access
```bash
# Create a read-only MySQL user (run in MySQL)
CREATE USER 'hr_readonly'@'localhost' IDENTIFIED BY 'readonly_pass';
GRANT SELECT ON hr_db.* TO 'hr_readonly'@'localhost';
FLUSH PRIVILEGES;

# Add MySQL MCP server
claude mcp add mysql --transport stdio \
  --env MYSQL_HOST=localhost \
  --env MYSQL_PORT=3306 \
  --env MYSQL_USER=hr_readonly \
  --env MYSQL_PASSWORD=readonly_pass \
  --env MYSQL_DATABASE=hr_db \
  -- npx -y @benborla/mcp-server-mysql
```

### Slide 11.3 — The Read-Only Principle
- **MCP = read-only verification layer**
- All writes go through your Spring Boot API (with validation, audit logging, transactions)
- MCP verifies the RESULT of writes, doesn't perform them
- This prevents: bypassing business rules, missing audit logs, skipping validation

### Slide 11.4 — Verification Patterns
| Pattern | Prompt |
|---|---|
| **Post-operation check** | "I just hired employee Rajesh. Query the DB to verify all tables were updated correctly." |
| **Schema validation** | "Compare our JPA entities against the actual MySQL schema. Flag mismatches." |
| **Integrity audit** | "Find any employees with salary outside their job grade range." |
| **Soft-delete check** | "Verify terminated employees don't appear in active queries." |
| **Audit trail check** | "Show the last 5 audit log entries and verify they have old_value and new_value JSON." |

---

### LAB 9: Database Verification for HR Operations (40 min)

**Objective:** Connect MySQL MCP and verify data integrity after HR operations.

**Pre-requisites:** MySQL running with HR schema and demo data loaded.

**Step 1 — Setup MySQL MCP** (10 min)
```bash
# Create read-only user
mysql -u root -p -e "
  CREATE USER IF NOT EXISTS 'hr_readonly'@'localhost' IDENTIFIED BY 'readonly_pass';
  GRANT SELECT ON hr_db.* TO 'hr_readonly'@'localhost';
  FLUSH PRIVILEGES;
"

# Add MCP server
claude mcp add hr-database --transport stdio \
  --env MYSQL_HOST=localhost \
  --env MYSQL_PORT=3306 \
  --env MYSQL_USER=hr_readonly \
  --env MYSQL_PASSWORD=readonly_pass \
  --env MYSQL_DATABASE=hr_db \
  -- npx -y @benborla/mcp-server-mysql

# Verify
/mcp
```

Test: `"Show me all tables in the hr_db database."`

**Step 2 — Schema Validation** (10 min)
```
Compare the database schema against our requirements:

1. Check that the employees table has these extension columns:
   employment_status (ENUM), employment_type (ENUM),
   contract_end_date (DATE), deleted_at (TIMESTAMP)

2. Check that departments table has:
   parent_department_id (INT, nullable), deleted_at (TIMESTAMP)

3. Verify all tables use InnoDB engine and utf8mb4 character set

4. Verify hr_audit_logs has: table_name, record_id, action,
   old_value (JSON), new_value (JSON), changed_by, changed_at

Report PASS/FAIL for each check.
```

**Step 3 — Data Integrity Checks** (10 min)
```
Run these integrity checks on the HR database:

1. Orphan check: Any employees referencing non-existent departments?
2. Salary band check: Any employees with salary < job.min_salary or > job.max_salary?
3. Manager check: Any departments with manager_id pointing to a non-existent employee?
4. Soft-delete consistency: Any records with deleted_at set but employment_status != 'TERMINATED'?
5. User consistency: Any hr_users with is_active=true but linked employee is TERMINATED?

For each violation found, show the record details.
```

**Step 4 — Post-Operation Verification** (10 min)
```
I'm going to call the hire API. After I do, verify the results.

[Call the hire API via curl or Playwright]

Now check the database:
1. New record in employees table — show all columns
2. Matching record in hr_users — show username and is_active
3. Role assignment in hr_user_roles — show the role name
4. Initial job_history entry — show job_id, department_id, start_date
5. Audit log entry — show the INSERT record with new_value JSON
```

**Deliverable:** MySQL MCP connected, schema validated, integrity checks passing.

---

## Module 12: Figma MCP — Design-Driven Development (20 min lecture + 40 min lab)

### Slide 12.1 — The Design-to-Code Pipeline
```
Figma Design → Figma MCP → Claude Code → React Component → Playwright Verify
     ▲                                                            │
     └────────────── Code-to-Canvas (push back) ──────────────────┘
```

### Slide 12.2 — Setup
```bash
# Remote server (recommended — no desktop app needed)
claude mcp add figma --transport http https://mcp.figma.com/mcp

# Authenticate
/mcp
# Follow OAuth prompt for Figma
```

### Slide 12.3 — What Claude Reads from Figma
- Layer structure (component hierarchy)
- Auto Layout settings (flex direction, gap, padding)
- Design tokens (colors, typography, spacing, shadows)
- Component variants and states
- Responsive constraints

### Slide 12.4 — The Full Loop: Figma → Code → Verify → Figma
1. **Read**: Claude reads component design from Figma
2. **Build**: Claude generates React + Tailwind code matching the design
3. **Verify**: Playwright MCP opens the running app and checks the result
4. **Fix**: Claude adjusts code until it matches
5. **Push back** (optional): Claude pushes the rendered UI back to Figma for designer review

---

### LAB 10: Building HR Components from Figma Designs (40 min)

**Objective:** Use Figma MCP to read designs and build pixel-accurate components.

**Pre-requisites:** Figma MCP connected and authenticated. HR app Figma file accessible.

> **Note:** If Figma MCP is not available (no Figma account/file), use the ASCII Figma spec in `@docs/figma-ui-spec.md` as the design reference. The lab works either way — MCP just makes it more precise.

**Step 1 — Extract Design Tokens** (10 min)
```
Read the design system foundation from our Figma file (or @docs/figma-ui-spec.md section 1).
Extract all Oracle Redwood (RDS 24C) design tokens:
- Color palette (Blue-60, Neutral-5, Neutral-30, etc.)
- Typography scale (sizes, weights, line heights)
- Spacing grid (8px base)
- Shadow levels (Level 1, Level 2)
- Border radius values

Generate a tailwind.config.js that maps these tokens.
```

**Step 2 — Build KPI Scoreboard Card** (10 min)
```
Read the KPI Scoreboard card design from Figma (section 3.2, Row 1).
Build the HrKpiCard React component:
- Title (12px, uppercase, neutral-30)
- Value (32px, bold, neutral-90)
- Trend indicator (arrow up/down, green/red, with delta text)
- White background, Level 1 shadow, 16px border-radius
- Match dimensions, padding, and spacing exactly from Figma.

Use our RDS Tailwind tokens from Step 1.
```

**Step 3 — Build Employee Directory Table** (10 min)
```
Read the Employee Directory design from Figma (section 3.3).
Build the HrEmployeeDirectory page component:
- Search bar with placeholder "Name, ID, Job Title..."
- Filter dropdowns: Status, Department, Country, Type
- Action buttons: Export CSV, + Hire
- Data table with columns: checkbox, Avatar+Name, Department, Job, Status
- Status badges: green=ACTIVE, yellow=PROBATION, blue=ON_LEAVE, red=TERMINATED
- Pagination: "Showing 1-20 of 212 active employees" with page controls

Use HrApiClient to fetch from /app/hr/api/v1/employees (paginated).
```

**Step 4 — Verify with Playwright** (10 min)
```
Use Playwright to verify the components we just built:
1. Navigate to http://localhost:3000/dashboard
2. Verify 5 KPI cards render in a row with correct spacing
3. Verify each card has a title, value, and trend indicator
4. Navigate to /employees
5. Verify the search bar, filter dropdowns, and data table render
6. Verify status badges show correct colors
7. Verify pagination shows correct count

Report PASS/FAIL for each check.
```

**Deliverable:** Design tokens extracted, 2 components built from Figma, verified via Playwright.

---

## Module 12B: Putting It All Together — The MCP Verification Loop (30 min lecture)

### Slide 12B.1 — The Enterprise Verification Stack
```
Developer writes prompt
        │
        ▼
   Claude Code implements
        │
        ├──→ Playwright MCP: Drives browser, checks UI
        │
        ├──→ MySQL MCP: Verifies data operations
        │
        ├──→ Figma MCP: Compares against design spec
        │
        └──→ Hooks: Auto-lint, auto-format, auto-test
              │
              ▼
        All green? → Commit & PR
```

### Slide 12B.2 — The Full Feature Verification Prompt
```
I just implemented the Employee Hire Wizard. Verify everything:

1. [Playwright] Open the app, complete the hire wizard for a test employee.
   Verify all 4 steps work, success toast appears, redirect to employee profile.

2. [MySQL] Query the database. Verify:
   - New employee record with correct status, type, department, job
   - New hr_users record with username and active status
   - New hr_user_roles record with correct role
   - New job_history entry
   - New hr_audit_logs INSERT entry

3. [Playwright] Navigate to Employee Directory.
   Verify the new employee appears in the list.

4. [Playwright] Navigate to the new employee's 360 View.
   Verify Profile tab shows correct data.

5. [Figma] Compare the 360 View layout against Figma section 3.4.
   Report any spacing, color, or typography differences.

Report: PASS/FAIL for each check with details.
```

### Slide 12B.3 — The Compound Effect
| Without MCP | With MCP |
|---|---|
| Developer manually checks browser | Playwright MCP verifies automatically |
| Developer runs SQL queries manually | MySQL MCP validates data integrity |
| Developer eyeballs Figma comparison | Figma MCP provides pixel-accurate comparison |
| Verification is ad-hoc and inconsistent | Verification is repeatable and comprehensive |
| Each verification costs developer time | Claude does it all in one prompt |

### Slide 12B.4 — Team .mcp.json for the HR Project
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "hr-database": {
      "command": "npx",
      "args": ["-y", "@benborla/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "${HR_DB_HOST:-localhost}",
        "MYSQL_PORT": "${HR_DB_PORT:-3306}",
        "MYSQL_USER": "${HR_DB_READONLY_USER}",
        "MYSQL_PASSWORD": "${HR_DB_READONLY_PASS}",
        "MYSQL_DATABASE": "hr_db"
      }
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```
Check this into git. Every team member gets the same verification stack.

---

# DAY 4: Advanced — Subagents, Memory, Debugging, CI/CD & Production Workflows

---

## Module 13: Custom Subagents Deep Dive — Your AI Team (30 min lecture + 60 min lab)

### Slide 13.1 — Subagents vs Skills vs Hooks: The Right Tool

| Mechanism | Nature | Context | Best For |
|---|---|---|---|
| **CLAUDE.md** | Advisory, always loaded | Shares main context | Coding standards, build commands |
| **Skills** | Advisory, on-demand | Shares main context | Domain knowledge, workflows |
| **Hooks** | Deterministic, triggered | No context | Lint, format, block, inject |
| **Subagents** | Autonomous, isolated | **Separate context** | Investigation, review, parallel work |
| **Agent Teams** | Coordinated multi-agent | Each has own context | Large features, team simulation |

### Slide 13.2 — Why Subagents Matter for Enterprise
- **Context protection**: investigation reads 50 files → only summary returns to main context
- **Specialization**: security reviewer sees code differently than a performance reviewer
- **Parallelism**: 3 subagents investigate simultaneously, report back findings
- **Unbiased review**: fresh context means no defense of code it just wrote
- **Reusability**: define once in `.claude/agents/`, use across sessions

### Slide 13.3 — Anatomy of a Custom Subagent

```markdown
# .claude/agents/hr-security-reviewer.md
---
name: hr-security-reviewer
description: Reviews HR app code for OWASP Top 10 and RBAC compliance
tools: Read, Grep, Glob, Bash
model: opus
isolation: worktree
---

You are a senior security engineer reviewing the HR Enterprise Platform.

## Your Review Checklist
1. Every mutation endpoint has @PreAuthorize
2. Manager endpoints filter to direct/indirect reports in the QUERY (not post-filter)
3. Salary masking applied for ROLE_EMPLOYEE viewing others
4. No PII (salary, email, phone) in log statements
5. No SQL string concatenation in @Query annotations
6. No dangerouslySetInnerHTML in React components
7. JWT token validation on every protected endpoint
8. CORS configuration is restrictive (not wildcard)
9. Security headers present (CSP, HSTS, X-Frame-Options)
10. Password hashing uses Argon2id (not bcrypt or SHA)

## Output Format
For each finding: severity (CRITICAL/HIGH/MEDIUM/LOW), file:line, description, fix.
```

### Slide 13.4 — Subagent Patterns for Enterprise

| Pattern | Agents | Use Case |
|---|---|---|
| **Investigator** | 1-3 research agents | Explore codebase, report findings to main context |
| **Writer/Reviewer** | 1 writer + 1 reviewer | Implement then review in fresh context |
| **Specialist Team** | 3-5 specialist agents | Security + performance + architecture review |
| **Migration Army** | N parallel agents | Each migrates one file/module in isolation |
| **Test Generator** | 1 agent per module | Generate tests independently, merge results |

### Slide 13.5 — Agent Teams: Coordinated Multi-Agent Workflows

```
Team Lead (orchestrator)
   ├── Agent A: Backend implementation (worktree A)
   ├── Agent B: Frontend implementation (worktree B)
   ├── Agent C: Test suite (worktree C)
   └── Agent D: Documentation (worktree D)

Shared: task list, messaging, coordination
Each: isolated context, isolated code, own tools
```

- Agents communicate via shared task lists and messages
- Team lead coordinates work and resolves conflicts
- Each agent works in its own worktree — no merge conflicts during work
- Results merged after completion

### Slide 13.6 — Worktree Isolation for Subagents
```markdown
# In agent definition:
isolation: worktree
```
- Agent gets its own copy of the repo
- Can make changes without affecting your working directory
- Changes reviewed before merging
- Perfect for: experiments, migrations, risky refactors

---

### LAB 11: Building an Enterprise Agent Team for the HR App (60 min)

**Objective:** Create a suite of specialized subagents and orchestrate them to build and review a feature.

**Step 1 — Create the Agent Directory** (5 min)
```bash
mkdir -p .claude/agents
```

**Step 2 — Build the Security Reviewer Agent** (10 min)
Create `.claude/agents/hr-security-reviewer.md` (as shown in Slide 13.3).

**Step 3 — Build the Performance Reviewer Agent** (10 min)
```markdown
# .claude/agents/hr-performance-reviewer.md
---
name: hr-performance-reviewer
description: Reviews HR app code for N+1 queries, missing indexes, memory leaks, and caching opportunities
tools: Read, Grep, Glob, Bash
model: opus
---

You are a senior performance engineer reviewing the HR Enterprise Platform.

## Review Checklist
1. N+1 query detection: entity relationships without @BatchSize or JOIN FETCH
2. Missing database indexes on frequently queried columns (employee_status, department_id, deleted_at)
3. Unbounded queries: any list endpoint missing pagination or size cap
4. Missing @Transactional(readOnly = true) on read operations
5. Large object loading: entities with LOB/TEXT fields loaded in list queries
6. Missing Caffeine cache on frequently accessed metadata (jobs, departments, regions)
7. Frontend: unnecessary re-renders, missing React.memo, missing useMemo/useCallback
8. Frontend: TanStack Query without staleTime (causes redundant API calls)
9. API response payload size: returning more fields than the consumer needs
10. Missing database connection pool tuning (HikariCP settings)

## Output Format
For each finding: impact (HIGH/MEDIUM/LOW), file:line, description, fix, estimated improvement.
```

**Step 4 — Build the Architecture Compliance Agent** (10 min)
```markdown
# .claude/agents/hr-architecture-reviewer.md
---
name: hr-architecture-reviewer
description: Verifies HR app follows layered architecture, naming conventions, and enterprise patterns
tools: Read, Grep, Glob, Bash
---

You are the chief architect reviewing the HR Enterprise Platform.

## Review Checklist
1. All classes use Hr prefix
2. Strict layer separation: Controller → Service → Repository (no skipping)
3. No business logic in Controllers or Repositories
4. All DTOs mapped via MapStruct (no manual mapping)
5. @Transactional only on Service layer
6. Standard response envelope on all endpoints
7. API paths follow /app/hr/api/v1/{entity} pattern
8. Exception hierarchy used correctly (HrNotFoundException → 404, etc.)
9. HrLogHelper entry/exit on all public methods
10. Package structure matches: com.company.hr.{config,controller,service,...}

## Output Format
For each violation: category, file:line, what's wrong, correct pattern with example.
```

**Step 5 — Orchestrate the Team** (15 min)
```
I just completed the HrEmployeeService and HrEmployeeController.
Dispatch these agents in parallel:

1. Use hr-security-reviewer to check for security issues
2. Use hr-performance-reviewer to check for performance issues
3. Use hr-architecture-reviewer to check for architecture violations

Collect all findings and present a unified report grouped by severity.
Then fix all CRITICAL and HIGH findings.
```

**Step 6 — Build a Composite Review Command** (10 min)
Create `.claude/commands/full-review.md`:
```markdown
Run a comprehensive review of recent changes using our agent team:

1. Dispatch hr-security-reviewer — check for OWASP/RBAC issues
2. Dispatch hr-performance-reviewer — check for N+1, missing caches, unbounded queries
3. Dispatch hr-architecture-reviewer — check for pattern compliance

Collect all findings. Present:
- CRITICAL findings (fix immediately)
- HIGH findings (fix before merge)
- MEDIUM findings (fix in follow-up)
- LOW findings (nice to have)

Then auto-fix all CRITICAL and HIGH findings.
Run /verify-backend after fixes to confirm nothing broke.
```

Now you can run `/full-review` on any PR.

**Deliverable:** 3 specialized agents + 1 orchestration command, tested on real code.

---

## Module 14: Memory, Sessions & Persistent Context (30 min lecture + 30 min lab)

### Slide 14.1 — The Persistence Hierarchy

```
Conversation (ephemeral)
    │ lost when session ends
    ▼
Context (compactable)
    │ compressed when window fills
    ▼
CLAUDE.md (persistent, always loaded)
    │ checked into git, team-shared
    ▼
Skills (persistent, on-demand)
    │ loaded when relevant
    ▼
Memory (persistent, cross-session)
    │ personal learnings, preferences, project notes
    ▼
Checkpoints (persistent, rewindable)
    │ every action creates a checkpoint
```

### Slide 14.2 — Memory System
Claude Code has a file-based memory system for retaining information across sessions:

| Memory Type | What to Store | Example |
|---|---|---|
| **User** | Your role, preferences, expertise | "Senior Java developer, new to React frontend" |
| **Feedback** | Corrections and validated approaches | "Don't mock the database in integration tests" |
| **Project** | Ongoing work, deadlines, decisions | "Merge freeze after March 5 for mobile release" |
| **Reference** | External resource pointers | "Bug tracker is Linear project INGEST" |

```
Ask Claude: "Remember that I prefer verbose error messages in development
but terse messages in production."
```
Claude saves this to memory and applies it in future sessions.

### Slide 14.3 — Session Management for Long-Running Projects

```bash
# Name your sessions
claude --name "hr-employee-service"
claude --name "hr-frontend-dashboard"

# Resume where you left off
claude --continue          # Most recent session
claude --resume            # Pick from recent sessions

# Visual distinction for parallel sessions
/color                     # Color-code terminal tabs
/statusline                # Show context usage, branch, cost
```

### Slide 14.4 — Checkpoints & Rewind

Every action Claude takes creates a checkpoint. You can:
- **`Esc + Esc`** or **`/rewind`** → open rewind menu
- Restore conversation only, code only, or both
- **Summarize from here** → condense old messages, keep recent context clean
- Checkpoints persist across sessions — close terminal, rewind later

**Enterprise pattern**: Try risky refactors fearlessly. If it doesn't work, rewind.
```
Try refactoring HrEmployeeService to use the Specification pattern
for dynamic queries instead of multiple @Query methods.
```
If it goes badly → `/rewind` → try a different approach. Zero risk.

### Slide 14.5 — `/compact` with Custom Instructions

```
/compact Focus on the HrEmployeeService implementation.
Preserve: all method signatures, DTOs created, test results.
Discard: exploration of other services, git history discussion.
```

Add to CLAUDE.md for automatic behavior:
```markdown
When compacting, always preserve:
- Full list of modified files
- All test commands and results
- Current implementation plan
- Any CLAUDE.md updates discussed
```

---

### LAB 12: Session Mastery (30 min)

**Objective:** Practice memory, checkpoints, and session management.

**Step 1 — Configure Memory** (5 min)
```
Remember that in this HR project:
- I prefer integration tests over mocks for database operations
- I want verbose HrLogHelper messages in dev, minimal in production
- When generating DTOs, always include a builder pattern
- I'm experienced in Spring Boot but new to React/Tailwind
```
Verify: start a NEW session, ask Claude to create a DTO. Does it use builder pattern?

**Step 2 — Practice Rewind** (10 min)
```
Refactor HrRegionService to use the Specification API for dynamic filtering.
```
Wait for Claude to complete. Then:
- `/rewind` → choose the checkpoint before the refactor
- Restore code only (keep conversation for context)
- Try a different approach: add query methods instead

**Step 3 — Practice Compact** (10 min)
In a session that's been running a while:
```
/compact Focus on the Employee entity changes.
Preserve all method signatures and test results.
Discard the earlier discussion about Region and Country services.
```
Verify: ask Claude about Employee service details → it should remember.
Ask about Region service → it should say it needs to re-read.

**Step 4 — Named Session Workflow** (5 min)
```bash
# Start named session
claude --name "hr-compensation-module"

# Work on compensation...

# Close terminal. Later:
claude --resume
# Select "hr-compensation-module" from list
# Continue exactly where you left off
```

**Deliverable:** Memory configured, rewind practiced, compact mastered.

---

## Module 15: Debugging, Error Recovery & Prompt Engineering (30 min lecture + 30 min lab)

### Slide 15.1 — When Things Go Wrong: The Recovery Playbook

| Symptom | Diagnosis | Fix |
|---|---|---|
| Claude ignores CLAUDE.md rules | File too long (>200 lines) | Prune, use emphasis on critical rules |
| Claude keeps making same mistake | Rule phrasing is ambiguous | Reword, add example, add hook |
| Claude generates wrong pattern | No reference example in codebase | Point to existing file with `@` |
| Quality degrades mid-session | Context window filling up | `/clear` or `/compact` |
| Claude produces incomplete code | Task too large for one pass | Break into smaller tasks, use plan mode |
| Claude hallucinates an API | No verification step | Add test command, use MCP to verify |
| Subagent returns shallow results | Prompt too vague | Add specific checklist to agent definition |
| Hook blocks legitimate action | Guard too aggressive | Refine hook conditions |

### Slide 15.2 — The 2-Strike Rule
> After 2 failed corrections on the same issue → STOP.
> `/clear` and write a better prompt incorporating what you learned.

A long session with accumulated corrections almost always performs worse than a fresh session with a better prompt.

### Slide 15.3 — Prompt Engineering Patterns for Enterprise

**Pattern 1: Reference-Based ("Follow this example")**
```
Look at how HrRegionService is implemented.
Follow the exact same patterns for HrCountryService:
- Same HrLogHelper usage
- Same DTO structure
- Same @PreAuthorize patterns
- Same response envelope
- Same pagination approach
```

**Pattern 2: Constraint-Based ("Don't do X, do Y instead")**
```
Implement HrJobService.
CONSTRAINTS:
- Use MapStruct, NOT manual DTO mapping
- Use Specification API, NOT multiple @Query methods
- Use @Transactional(readOnly=true), NOT plain @Transactional for reads
- Use HrLogHelper, NOT SLF4J directly
- Salary must be MASKED in all log output
```

**Pattern 3: Checklist-Based ("Verify each of these")**
```
After implementing, verify:
[ ] All classes use Hr prefix
[ ] HrLogHelper entry/exit on all public methods
[ ] @PreAuthorize on all mutation endpoints
[ ] No entities in API responses
[ ] Pagination capped at 100
[ ] Soft-delete filtering on all queries
[ ] Tests written and passing
```

**Pattern 4: Adversarial ("Break this")**
```
You just implemented HrEmployeeService.hireEmployee().
Now try to break it:
- What happens with a duplicate email?
- What happens with salary outside job grade?
- What happens if department doesn't exist?
- What happens with concurrent double-submit?
- What happens if user creation succeeds but role assignment fails?
Write failing tests for each edge case, then fix the code.
```

**Pattern 5: Scope Escalation ("Start small, expand")**
```
# Prompt 1
Implement basic CRUD for HrJob entity following our patterns.

# Prompt 2 (after verifying CRUD works)
Now add salary grade validation: when updating an employee's job,
verify their salary falls within the new job's min/max range.

# Prompt 3 (after verifying validation)
Now add the salary adjustment wizard: job change + salary change
+ job_history entry + audit log, all in one transaction.
```

### Slide 15.4 — The `@` File Reference Power Tool

```
# Instead of describing patterns in words:
"Follow the same service pattern we use"

# Point directly to the source of truth:
"Follow the same pattern as @src/main/java/com/company/hr/service/HrRegionService.java"

# Multiple references:
"Read @docs/requirement.md section 10.1 for the business rules.
Read @database/schema.sql for the table structure.
Follow the patterns in @src/.../service/HrRegionService.java."
```

Claude reads the referenced files before responding — dramatically more accurate than verbal descriptions.

### Slide 15.5 — Effort Levels & Model Selection

```
/model                    # See current model and effort level

Effort levels:
  Low    → Fast, simple tasks (rename, typo fix, add log line)
  Medium → Default, balanced (standard CRUD, component building)
  High   → Complex tasks (multi-file refactor, architecture decisions)
  Max    → Unlimited reasoning (security review, edge case analysis)
```

**When to change effort:**
- Scaffolding boilerplate → Low effort (speed matters, pattern is clear)
- Complex business logic (hire wizard) → High effort
- Security review → Max effort (you want exhaustive analysis)

---

### LAB 13: Debugging & Prompt Engineering Practice (30 min)

**Objective:** Practice recovery patterns and prompt engineering techniques.

**Step 1 — Intentional Failure & Recovery** (10 min)
Give Claude a deliberately vague prompt:
```
Add employee management features to the app.
```
Observe: Claude will likely do something too broad or miss patterns.
Then practice recovery:
```
/clear
Implement HrEmployeeService.updateSalary():
- Takes employeeId and newSalary
- Validates salary within job grade min/max (throw HrBusinessRuleViolationException if outside)
- Creates job_history entry with reason code "SALARY_ADJUSTMENT"
- Logs with HrLogHelper (salary MASKED)
- @PreAuthorize for ADMIN and HR_SPECIALIST only
- @Transactional
- Write tests covering: happy path, salary too low, salary too high, unauthorized role
```
Compare the two outputs.

**Step 2 — Adversarial Testing** (10 min)
```
Review the HrEmployeeService.hireEmployee() implementation.
Try to break it with these scenarios:
1. Hire with an email that already exists
2. Hire with salary $0
3. Hire with a department that has been soft-deleted
4. Hire the same person twice (same Idempotency-Key)
5. Hire into a job where min_salary > the offered salary

Write a test for each scenario. Fix any bugs found.
```

**Step 3 — Reference-Based Prompt Mastery** (10 min)
```
I need to implement HrNotificationService.
Follow these exact patterns:
- Service structure: @src/.../service/HrEmployeeService.java
- Controller structure: @src/.../controller/HrEmployeeController.java
- DTOs: @src/.../dto/HrEmployeeSummaryDTO.java for the list view pattern
- Mapper: @src/.../mapper/HrEmployeeMapper.java

The notification entity has: id, userId, type, title, message, isRead,
referenceTable, referenceId, createdAt.

Endpoints: list (paginated, filter by read status), mark as read,
mark all as read.
```

**Deliverable:** Recovery patterns practiced, adversarial tests written, reference-based prompts mastered.

---

## Module 16: CI/CD Integration & Non-Interactive Pipelines (30 min lecture + 30 min lab)

### Slide 16.1 — Claude Code in CI/CD

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   PR Created │────▶│ Claude Code  │────▶│ PR Comment   │
│   (GitHub)   │     │ claude -p    │     │ with findings│
└─────────────┘     │ --output json│     └──────────────┘
                    └──────────────┘

Use cases:
- Automated PR review (security, architecture, patterns)
- Auto-generate release notes from commits
- Lint CLAUDE.md for staleness
- Verify @PreAuthorize coverage on new endpoints
- Generate API documentation from code changes
```

### Slide 16.2 — Non-Interactive Mode

```bash
# Basic: run and get text output
claude -p "Explain what HrEmployeeService does"

# JSON output for script parsing
claude -p "List all API endpoints missing @PreAuthorize" --output-format json

# Streaming JSON for real-time processing
claude -p "Analyze the security of our auth module" --output-format stream-json

# Restrict tools for safety
claude -p "Fix lint errors in src/" --allowedTools "Edit,Bash(npm run lint)"

# Auto mode for uninterrupted execution
claude --permission-mode auto -p "fix all failing tests"
```

### Slide 16.3 — Scheduled Agents (`/schedule`)

```bash
# Run daily at 9 AM: check for expiring contracts
/schedule "Every day at 9am, query the HR database via MCP for contracts
expiring in the next 30 days. If any found, create a GitHub issue
with the list and assign to the HR team."

# Run weekly: dependency vulnerability scan
/schedule "Every Monday at 8am, run npm audit and mvn dependency-check.
If any HIGH/CRITICAL CVEs found, create a PR with fixes or post
to Slack #security-alerts."
```

Scheduled agents run on Anthropic's cloud — they execute even when your laptop is closed.

### Slide 16.4 — `/loop` for Recurring Local Tasks

```bash
# Monitor CI every 5 minutes
/loop 5m "Check if the CI build passed. If failed, analyze the error
and suggest a fix."

# Watch for database migration drift
/loop 30m "Compare the Flyway migration scripts against the running
database schema. Report any drift."
```

`/loop` runs locally for up to 3 days on an interval.

### Slide 16.5 — Fan-Out Patterns for Enterprise Migrations

```bash
# Step 1: Generate task list
claude -p "List all Java service files that are missing
HrLogHelper entry/exit logging" --output-format json > missing-logging.json

# Step 2: Fix each file in parallel
cat missing-logging.json | jq -r '.files[]' | while read file; do
  claude -p "Add HrLogHelper entry/exit logging to all public methods
  in $file. Follow @src/.../service/HrRegionService.java pattern.
  Mask salary/email/phone in log statements." \
    --allowedTools "Edit" &
done
wait

# Step 3: Verify all fixes
claude -p "Grep all service files for public methods missing
HrLogHelper. Report any remaining gaps." --output-format json
```

---

### LAB 14: CI/CD Pipeline Integration (30 min)

**Objective:** Build automated review and verification into the HR app pipeline.

**Step 1 — Automated PR Security Review** (10 min)
Create a script `scripts/ci-security-review.sh`:
```bash
#!/bin/bash
# Run by CI on every PR
REVIEW=$(claude -p "Review the diff in this PR for security issues:
- Missing @PreAuthorize on new endpoints
- PII in log statements (salary, email, phone)
- SQL injection risks (@Query with string concatenation)
- XSS risks (dangerouslySetInnerHTML)
- Exposed JPA entities in API responses
- Missing input validation (@Valid)

Output format: JSON array of findings with severity, file, line, description." \
  --output-format json)

echo "$REVIEW"

# Fail CI if any CRITICAL findings
CRITICAL=$(echo "$REVIEW" | jq '[.findings[] | select(.severity == "CRITICAL")] | length')
if [ "$CRITICAL" -gt 0 ]; then
  echo "CRITICAL security issues found. Blocking PR."
  exit 1
fi
```

**Step 2 — Auto-Generate Release Notes** (10 min)
```bash
claude -p "Generate release notes from commits since the last git tag.
Group by: Features, Bug Fixes, Security, Performance.
Include PR numbers and authors.
Format as markdown suitable for a GitHub release." \
  --output-format json
```

**Step 3 — Scheduled Contract Expiry Check** (10 min)
```
/schedule "Every weekday at 9am:
1. Query the HR database for employees with contract_end_date
   within the next 30 days and employment_status = 'ACTIVE'
2. For each, check if a notification already exists in hr_notifications
3. If no notification exists, create one via the API
4. Post a summary to Slack #hr-alerts with the count and names"
```

**Deliverable:** CI security review script, release notes generator, scheduled monitoring.

---

## Module 17: Plugins & the Extensibility Ecosystem (20 min lecture + 10 min demo)

### Slide 17.1 — What Plugins Bundle

A single plugin can provide:
- **Skills** (domain knowledge)
- **Hooks** (deterministic automation)
- **Subagents** (specialized reviewers)
- **MCP servers** (external integrations)

All in one installable package.

```bash
/plugin                    # Browse the marketplace
/plugin install <name>     # Install a plugin
```

### Slide 17.2 — High-Value Plugins for Enterprise Java/React

| Plugin | What It Does |
|---|---|
| **Code Intelligence (Java)** | Precise symbol navigation, auto-error detection after edits via LSP |
| **Code Intelligence (TypeScript)** | Same for React/TypeScript frontend |
| **Code Reviewer** | Structured review pass with auto-fix before presenting code to you |
| **Docker Compose** | Manage local dev environment (MySQL, Redis, etc.) |
| **OpenAPI/Swagger** | Generate and validate API documentation from code |
| **Git Conventional Commits** | Enforce commit message standards |

### Slide 17.3 — Code Intelligence Plugin — The LSP Advantage

Without code intelligence:
- Claude reads files to understand types
- May miss type errors until compile time
- Can't navigate to symbol definitions precisely

With code intelligence (LSP):
- Claude knows all types, interfaces, and method signatures instantly
- Detects errors immediately after every edit
- Navigate to definitions, find references, rename symbols accurately
- **For enterprise codebases with many modules: dramatically fewer errors**

```bash
# Install for Java
/plugin install code-intelligence-java

# Install for TypeScript
/plugin install code-intelligence-typescript
```

### Slide 17.4 — Building a Company Plugin

```
.claude/plugins/hr-enterprise/
├── plugin.json           # Plugin metadata
├── skills/
│   ├── hr-entity-scaffold/SKILL.md
│   ├── hr-logging/SKILL.md
│   └── hr-security/SKILL.md
├── agents/
│   ├── hr-security-reviewer.md
│   └── hr-architecture-reviewer.md
├── hooks/                # Auto-format, migration guard, etc.
└── .mcp.json             # Bundled MCP servers
```

Distribute to all teams. Every developer gets the same standards, review agents, and tool integrations from day one.

---

## Module 18: Capstone — End-to-End Feature Build with All Techniques (60 min lab)

### LAB 15: Build the Employee Termination Flow — Full Stack, All Techniques

**Objective:** Build a complete enterprise feature using every technique from the workshop.

This lab ties together ALL 4 days. The student must:

**Phase 1 — Plan (10 min)**
```
[Plan Mode]
I need to build the Employee Termination flow.
Read @docs/requirement.md section 10.1 (Termination details).
Read @docs/figma-ui-spec.md section 3.5 (Termination Wizard).
Read @database/schema.sql for employee and job_history tables.

Create an implementation plan covering:
- Backend: service method, DTOs, validation, audit, notification
- Frontend: 3-step wizard UI
- Security: who can terminate (ADMIN, HR_SPECIALIST only)
- Edge cases: can't terminate CEO, can't terminate already-terminated employee
- Data: sets employment_status='TERMINATED', populates deleted_at,
  deactivates hr_users, creates job_history entry
```

**Phase 2 — Parallel Implementation (25 min)**

Worktree A — Backend:
```
/hr-entity-scaffold termination-flow

Implement HrEmployeeService.terminateEmployee():
- Validates employee exists and is not already terminated
- Validates caller has ADMIN or HR_SPECIALIST role
- Sets employment_status = 'TERMINATED', deleted_at = now()
- Creates job_history entry with termination reason
- Deactivates linked hr_users record (is_active = false)
- Creates notification for HR admin
- Supports Idempotency-Key
- All in one @Transactional
```

Worktree B — Frontend:
```
Build the TerminationWizard following @docs/figma-ui-spec.md section 3.5:
Step 1: Select Employee (search and select)
Step 2: Termination Details (effective date, reason code dropdown, notes)
Step 3: Review & Confirm (summary with warning callout, danger button)
Handle: loading, error, validation states.
```

**Phase 3 — Review (10 min)**
```
/full-review
```
Dispatches security, performance, and architecture agents.

**Phase 4 — Verify with MCP (15 min)**
```
Verify the termination flow end-to-end:

1. [Playwright] Log in as HR Specialist. Navigate to employee Steven King.
   Click "..." menu → Terminate. Complete the 3-step wizard.
   Verify: danger confirmation button, success toast, redirect.

2. [MySQL] Verify:
   - employees.employment_status = 'TERMINATED' for Steven King
   - employees.deleted_at is populated
   - hr_users.is_active = false
   - New job_history entry with termination reason
   - New hr_audit_logs entry

3. [Playwright] Navigate to Employee Directory.
   Verify Steven King does NOT appear in the default view.
   Toggle "Include Terminated" → verify he appears with red TERMINATED badge.

4. [Playwright] Log in as ROLE_EMPLOYEE.
   Verify Terminate option is NOT visible on any employee.

Report: PASS/FAIL for each check.
```

**Deliverable:** Complete Termination flow — planned, parallel-built, agent-reviewed, MCP-verified.

---

# APPENDIX

## Appendix A: Cheat Sheet — Claude Code for Enterprise

```
SETUP
  /init                     → Bootstrap CLAUDE.md
  /permissions              → Allowlist safe commands
  /sandbox                  → Enable OS-level isolation
  /statusline               → Show context usage, git branch, cost
  /plugin                   → Browse & install plugins
  /terminal-setup           → Enable shift+enter for newlines

PLANNING
  Shift+Tab (x2)           → Enter Plan Mode
  Ctrl+G                   → Open plan in editor
  Shift+Tab                → Back to Normal Mode

CONTEXT & SESSION
  /clear                   → Reset between tasks
  /compact Focus on X      → Targeted summarization
  /btw                     → Side question (no context cost)
  /rewind or Esc+Esc       → Restore checkpoint (code + conversation)
  Esc                      → Stop mid-action, redirect
  claude --name "task"     → Named session
  claude --continue        → Resume last session
  claude --resume          → Pick from recent sessions
  /color                   → Color-code parallel sessions
  /rename                  → Rename current session

QUALITY
  /verify-backend          → Run enterprise checks (custom command)
  /full-review             → Dispatch agent team (custom command)
  /simplify                → Review and improve code
  Use subagent to review   → Fresh-context code review

SCALING
  claude --worktree        → Isolated parallel session
  claude -p "prompt"       → Non-interactive (CI/scripts)
  --output-format json     → Structured output for pipelines
  --allowedTools "Edit"    → Restrict tools for safety
  /loop 5m "prompt"        → Recurring local task (up to 3 days)
  /schedule "prompt"       → Cloud cron job (runs when laptop closed)

MCP SERVERS
  claude mcp add ...       → Add MCP server
  claude mcp list          → List all servers
  claude mcp get NAME      → Server details
  claude mcp remove NAME   → Remove server
  /mcp                     → Check status & authenticate

MCP SETUP (HR Project)
  claude mcp add playwright -- npx @playwright/mcp@latest
  claude mcp add hr-database --env MYSQL_USER=hr_readonly ...
  claude mcp add figma --transport http https://mcp.figma.com/mcp

SUBAGENTS
  .claude/agents/*.md      → Define custom agents
  "Use subagent to..."     → Dispatch ad-hoc
  /full-review             → Orchestrate agent team
  isolation: worktree      → Agent works in isolated copy

MEMORY
  "Remember that..."       → Save to persistent memory
  Memory types: user, feedback, project, reference
  Survives across sessions → Applied automatically

SKILLS
  /hr-entity-scaffold X    → Full entity stack
  /fix-issue 1234          → Fix GitHub issue
  /commit-push-pr          → Commit + push + PR

EFFORT LEVELS
  /model                   → View/change model & effort
  Low                      → Fast, simple tasks (rename, typo)
  Medium                   → Default, balanced
  High                     → Complex tasks (multi-file refactor)
  Max                      → Unlimited reasoning (security review)

PROMPT PATTERNS
  @file/path               → Reference file (Claude reads it)
  "Follow pattern in @..."  → Reference-based prompting
  "CONSTRAINTS: ..."        → Constraint-based prompting
  "Try to break it"         → Adversarial testing
  "Interview me"            → Let Claude gather requirements
```

## Appendix B: HR App Build Tracker (Lab Notes Template)

| Module | Feature | Technique Demonstrated | Notes File |
|---|---|---|---|
| Lab 1 | CLAUDE.md | Knowledge encoding | notes/lab1-claude-md.md |
| Lab 2 | Skills | Internal library docs | notes/lab2-skills.md |
| Lab 3 | Plan Mode | Complex service design | notes/lab3-plan-mode.md |
| Lab 4 | Context Mgmt | Subagent investigation | notes/lab4-context.md |
| Lab 5 | Worktrees | Parallel development | notes/lab5-parallel.md |
| Lab 6 | Hooks | Quality gates | notes/lab6-hooks.md |
| Lab 7 | Full Feature | Hire Wizard end-to-end | notes/lab7-hire-wizard.md |
| Lab 8 | Playwright MCP | Browser UI verification | notes/lab8-playwright.md |
| Lab 9 | MySQL MCP | Database verification | notes/lab9-database.md |
| Lab 10 | Figma MCP | Design-driven development | notes/lab10-figma.md |
| Lab 11 | Agent Team | Specialized subagent orchestration | notes/lab11-agents.md |
| Lab 12 | Memory & Sessions | Persistence, rewind, compact | notes/lab12-memory.md |
| Lab 13 | Debugging | Prompt engineering, recovery | notes/lab13-debugging.md |
| Lab 14 | CI/CD | Non-interactive, scheduled agents | notes/lab14-cicd.md |
| Lab 15 | Capstone | Termination flow (all techniques) | notes/lab15-capstone.md |

## Appendix C: Evaluation Rubric

| Criteria | Excellent | Good | Needs Work |
|---|---|---|---|
| CLAUDE.md Quality | <200 lines, all critical rules, tested | Has rules but untested | Too long or missing key rules |
| Skill Coverage | All 4 skills, gotchas sections | 2-3 skills | Missing or generic |
| Plan Quality | Complete, reviewed, edge cases covered | Covers main flow | Missing concerns |
| Context Discipline | `/clear` between tasks, subagents for investigation | Mostly clean | Kitchen sink sessions |
| Verification | Tests + automated checks + review agent | Tests only | No verification |
| Code Compliance | All Hr prefix, logging, DTOs, security | Minor violations | Major violations |
| MCP Integration | All 3 MCPs connected, full verification loop | 1-2 MCPs, partial verification | No MCP setup |
| Design Fidelity | Pixel-accurate to Figma, verified via Playwright | Close match, minor differences | Significant gaps |
| Subagent Usage | 3+ specialized agents, orchestration command | 1-2 agents | No custom agents |
| Prompt Engineering | Reference-based, adversarial, constraint-based | Mostly specific prompts | Vague prompts |
| CI/CD Integration | Automated review script, scheduled monitoring | Manual non-interactive use | Not covered |
| Capstone Completeness | All 4 phases completed, all checks pass | 3 of 4 phases | Incomplete |

## Appendix D: Complete Workshop Schedule

### Day 1 — Foundations: Teaching Claude Your Enterprise
| Time | Module | Type | Duration |
|---|---|---|---|
| 8:45 | Setup Verification & Troubleshooting | Hands-on | 15 min |
| 9:00 | Module 1: The Knowledge Gap Problem | Lecture + Discussion | 60 min |
| 10:00 | *Break* | | 15 min |
| 10:15 | Module 2: CLAUDE.md — Your Enterprise Constitution | Lecture | 30 min |
| 10:45 | **Lab 1: Crafting the HR App CLAUDE.md** | Hands-on | 60 min |
| 11:45 | *Lunch* | | 60 min |
| 12:45 | Module 3: Skills for Custom Libraries | Lecture | 30 min |
| 13:15 | **Lab 2: Building Skills for HR Internal Libraries** | Hands-on | 60 min |
| 14:15 | *Break* | | 15 min |
| 14:30 | Module 4: Plan Mode & Explore-Plan-Implement | Lecture | 30 min |
| 15:00 | **Lab 3: Plan Mode — Designing the Employee Service** | Hands-on | 60 min |
| 16:00 | Day 1 Recap & Q&A | Discussion | 30 min |

### Day 2 — Scaling: Parallel Work, Quality Gates & Automation
| Time | Module | Type | Duration |
|---|---|---|---|
| 8:50 | Day 1 Recap: 5-Minute Technique Review (CLAUDE.md, Skills, Plan Mode) | Discussion | 10 min |
| 9:00 | Module 5: Context Management | Lecture | 30 min |
| 9:30 | **Lab 4: Context-Efficient Development** | Hands-on | 30 min |
| 10:00 | *Break* | | 15 min |
| 10:15 | Module 6: Parallel Sessions & Git Worktrees | Lecture | 30 min |
| 10:45 | **Lab 5: Parallel Development Sprint** | Hands-on | 60 min |
| 11:45 | *Lunch* | | 60 min |
| 12:45 | Module 7: Hooks, Verification & Quality Gates | Lecture | 30 min |
| 13:15 | **Lab 6: Setting Up Quality Gates** | Hands-on | 60 min |
| 14:15 | *Break* | | 15 min |
| 14:30 | Module 8: Enterprise Workflow Automation | Lecture | 30 min |
| 15:00 | **Lab 7: Building the Hire Wizard End-to-End** | Hands-on | 60 min |
| 16:00 | Module 8B: Taking Notes — Building Your Lab Knowledge Base | Lecture | 15 min |
| 16:15 | Day 2 Recap & Q&A | Discussion | 15 min |

### Day 3 — Integration: MCP Servers & End-to-End Verification
| Time | Module | Type | Duration |
|---|---|---|---|
| 8:50 | Day 2 Recap: 5-Minute Technique Review (Context, Worktrees, Hooks) | Discussion | 10 min |
| 9:00 | Checkpoint Sync: `git checkout day3-start` (students who need it) | Hands-on | 10 min |
| 9:10 | Module 9: MCP Servers Overview | Lecture + Discussion | 50 min |
| 10:00 | *Break* | | 15 min |
| 10:15 | Module 10: Playwright MCP — Browser Verification | Lecture | 30 min |
| 10:45 | **Lab 8: Playwright MCP & HR Dashboard Verification** | Hands-on | 60 min |
| 11:45 | *Lunch* | | 60 min |
| 12:45 | Module 11: Database MCP — Data Verification | Lecture | 20 min |
| 13:05 | **Lab 9: Database Verification for HR Operations** | Hands-on | 40 min |
| 13:45 | *Break* | | 15 min |
| 14:00 | Module 12: Figma MCP — Design-Driven Development | Lecture | 20 min |
| 14:20 | **Lab 10: Building HR Components from Figma** | Hands-on | 40 min |
| 15:00 | Module 12B: The MCP Verification Loop | Lecture | 30 min |
| 15:30 | Day 3 Recap & Q&A | Discussion | 30 min |

### Day 4 — Advanced: Agents, Memory, Debugging & Production Workflows
| Time | Module | Type | Duration |
|---|---|---|---|
| 8:50 | Day 3 Recap: 5-Minute Technique Review (Playwright, MySQL, Figma MCP) | Discussion | 10 min |
| 9:00 | Module 13: Custom Subagents Deep Dive | Lecture | 30 min |
| 9:30 | **Lab 11: Building an Enterprise Agent Team** | Hands-on | 60 min |
| 10:30 | *Break* | | 15 min |
| 10:45 | Module 14: Memory, Sessions & Persistent Context | Lecture | 30 min |
| 11:15 | **Lab 12: Session Mastery** | Hands-on | 30 min |
| 11:45 | *Lunch* | | 60 min |
| 12:45 | Module 15: Debugging, Error Recovery & Prompt Engineering | Lecture | 30 min |
| 13:15 | **Lab 13: Debugging & Prompt Engineering Practice** | Hands-on | 30 min |
| 13:45 | *Break* | | 15 min |
| 14:00 | Module 16: CI/CD & Non-Interactive Pipelines | Lecture | 30 min |
| 14:30 | **Lab 14: CI/CD Pipeline Integration** | Hands-on | 30 min |
| 15:00 | Module 17: Plugins & Extensibility | Lecture + Demo | 30 min |
| 15:30 | **Lab 15 (Capstone): Employee Termination — All Techniques** | Hands-on | 60 min |
| 16:30 | Workshop Wrap-Up, Q&A, Next Steps | Discussion | 30 min |

## Appendix E: Pre-Workshop Setup Checklist

> Full setup instructions are in **Module 0**. This is the quick-reference checklist.

Students must complete before Day 1:

```
CORE TOOLS
[ ] Java 21+ installed              → java --version (must show 21+)
[ ] Maven 3.9+ installed            → mvn --version
[ ] Node.js 20+ (LTS) installed     → node --version (must show 20+)
[ ] npm 10+ installed               → npm --version
[ ] npx works                       → npx --version (used by MCP servers!)
[ ] Git configured (name, email)    → git config user.name

DATABASE
[ ] MySQL 8+ running (native or Docker)
[ ] Connection verified              → mysql -h 127.0.0.1 -u root -p -e "SELECT VERSION();"
[ ] HR schema loaded                 → mysql ... < database/schema.sql
[ ] Seed data loaded                 → mysql ... < database/seed-data.sql
[ ] Read-only user created (Lab 9)   → mysql ... < database/create-readonly-user.sql

CLAUDE CODE
[ ] Claude Code CLI installed        → npm install -g @anthropic-ai/claude-code
[ ] API key configured               → export ANTHROPIC_API_KEY=sk-ant-...
[ ] Smoke test passed                → claude -p "Say hello"

BROWSER TESTING (Lab 8)
[ ] Playwright browsers installed    → npx playwright install (~500MB download)

PROJECT
[ ] HR project cloned from git       → git clone <repo-url> && cd hr-app
[ ] Checkpoint branches available    → git tag -l "day*"
[ ] Read requirements document       → docs/requirement.md (sections 1-5 minimum)

RECOMMENDED
[ ] Terminal: Ghostty, iTerm2, or Windows Terminal (24-bit color + Unicode)
[ ] IDE: VS Code or IntelliJ IDEA (Claude Code VS Code extension optional)
[ ] GitHub CLI (Lab 14)              → gh --version
[ ] (Optional) Figma account with HR design file access (Lab 10)

VERIFICATION
[ ] Run scripts/verify-setup.sh      → All checks show ✓
```

## Appendix F: Troubleshooting Guide

Common issues students encounter during the workshop and how to resolve them.

### MCP Server Issues

| Problem | Symptom | Fix |
|---|---|---|
| MCP server won't start | `/mcp` shows server as "disconnected" or "error" | Check `npx` works: `npx --version`. Ensure Node 20+. Try: `claude mcp remove <name>` and re-add. |
| Playwright can't find browser | "browserType.launch: Executable doesn't exist" | Run `npx playwright install`. If behind proxy, set `HTTPS_PROXY`. |
| MySQL MCP auth fails | "Access denied for user 'hr_readonly'" | Verify user exists: `mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT 1;"`. Recreate user if needed. |
| Figma MCP auth prompt | "Authentication required" | Run `/mcp` in Claude Code, follow the OAuth flow. Requires Figma account. |
| MCP tools not appearing | Claude doesn't use MCP tools when prompted | Run `/mcp` to check status. Try: "List the tools available from the Playwright MCP server." |

### Context & Session Issues

| Problem | Symptom | Fix |
|---|---|---|
| Context window full | Status line shows >90% usage, Claude quality degrades | `/clear` and start fresh with a focused prompt. Or `/compact Focus on X`. |
| Claude ignores CLAUDE.md rules | Missing Hr prefix, wrong patterns | CLAUDE.md is too long (>200 lines). Prune. Add "IMPORTANT:" prefix to critical rules. |
| Lost work after /clear | Previous implementation context gone | Use `/rewind` instead of `/clear` if you want to go back. Start named sessions: `claude --name "task"`. |
| Compaction lost important info | After auto-compact, Claude forgot key details | Add a PostCompact hook to re-inject critical rules. Use `/compact Focus on X` with explicit preservation instructions. |
| Can't resume session | `claude --resume` shows empty list | Sessions expire after inactivity. Use `claude --continue` for the most recent. For long-running work, commit often. |

### Build & Runtime Issues

| Problem | Symptom | Fix |
|---|---|---|
| Backend won't compile | `mvn clean install` fails | Check Java version: `java --version` (need 21+). Check Maven: `mvn --version` (need 3.9+). |
| Frontend won't start | `npm run dev` fails | Delete `node_modules` and `package-lock.json`, run `npm install` again. Check Node 20+. |
| Database connection refused | "Communications link failure" | Verify MySQL is running: `systemctl status mysql` or `docker ps`. Check port 3306. |
| Port already in use | "Address already in use: 3000" or ":8080" | Find process: `lsof -i :3000` and kill it, or use a different port. |
| Checkpoint branch missing | `git checkout day3-start` fails | Run `git fetch --all --tags`. If still missing, ask instructor for the branch. |

### Permission & Hook Issues

| Problem | Symptom | Fix |
|---|---|---|
| Claude blocked by permission | "Permission denied for tool X" | Run `/permissions` and allowlist the needed tool/command. |
| Hook blocks legitimate edit | "Hook blocked: cannot edit schema.sql" | The hook is working correctly. Use Flyway migration instead. If truly need to bypass: temporarily disable the hook in settings. |
| Pre-commit hook fails | Commit rejected by quality check | Fix the issues flagged by the hook. Don't use `--no-verify` — the hook exists for a reason. |

### Tips for Instructors

- **Start each day** with 5 min asking "Did anyone hit setup issues overnight?"
- **Have a USB drive** with pre-downloaded installers (Java, Node, MySQL, Playwright browsers) for slow networks
- **Wi-Fi backup**: If network is unreliable, have students pre-download all npm packages the day before
- **Pair struggling students** with someone who completed setup — peer support is faster than instructor support
- **The `day3-start` branch is critical** — verify ALL students can check it out and run the app before Day 3 labs

---

## Appendix G: Technique-to-Feature Mapping

Shows which Claude Code technique is demonstrated by which HR app feature:

| Technique | Day Introduced | HR Feature(s) Used | Why This Feature |
|---|---|---|---|
| CLAUDE.md | Day 1 | Project bootstrap | Many rules to encode (naming, logging, security) |
| Skills | Day 1 | Entity scaffolding, logging, security | Internal patterns that differ from defaults |
| Plan Mode | Day 1 | HrEmployeeService design | Most complex service, many cross-cutting concerns |
| Context Management | Day 2 | HrDepartmentService | Self-referencing hierarchy, moderate complexity |
| Git Worktrees | Day 2 | 3 parallel modules | Independent modules that can be built simultaneously |
| Hooks | Day 2 | Quality gates | Many enforceable rules (prefix, logging, DTOs) |
| Custom Commands | Day 2 | Hire Wizard | Multi-step workflow, repeatable pattern |
| Playwright MCP | Day 3 | Dashboard, Directory, RBAC | Visual components, role-based UI differences |
| Database MCP | Day 3 | Hire flow data verification | Multi-table transaction, complex integrity rules |
| Figma MCP | Day 3 | KPI cards, Directory table | Precise design tokens, component specs |
| Custom Subagents | Day 4 | Security + perf + arch review | Code has many compliance requirements |
| Memory | Day 4 | Personal preferences | Long-running project, preferences accumulate |
| Prompt Engineering | Day 4 | HrNotificationService | Medium complexity, good for reference-based prompts |
| CI/CD | Day 4 | Automated PR review | Many checkable rules, quantifiable compliance |
| Capstone | Day 4 | Termination flow | Touches all layers, all concerns, all techniques |

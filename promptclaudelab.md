# Claude Code Session Kickoff — Training Lab Project

> Paste this into a new Claude Code session to resume training lab work.
> This is the master context prompt for the `/home/ssthakur/app/training` project.

---

```
We are building a 4-day Claude Code enterprise training workshop.
The lab vehicle is a fully-built HR Enterprise Platform (Spring Boot + React).

## IMPORTANT: Single Repo Model

ALL work happens in ONE repo:
  /home/ssthakur/app/training/

This is the student-facing repo. It contains BOTH the training materials AND
the HR app code (on checkpoint branches). Students clone this one repo and get everything.

/home/ssthakur/app/hr/ is the INSTRUCTOR REFERENCE ONLY.
Only consult it if something is found to be MISSING from app/training — and only then.
NEVER reference app/hr during a lab exercise, dry run, or review session.
Never direct work, edits, or builds there.
During a dry run (student simulation) or material review, treat app/training as the ONLY source of truth.

## Repo Structure

/home/ssthakur/app/training/
  main branch         — training materials only (labs, decks, instructor guides, reference files)
  checkpoint branches — HR app code at each workshop stage (see below)

Training materials on main:
  labs/          — 12 lab exercise files (lab-01 through lab-12)
  decks/         — 17 deck files (including v1-deck-06 and v1-deck-14 as updated versions)
  instructor/    — flow-guide.md with pacing, blockers, recovery strategies
  build-notes/   — 23 build notes documenting how the HR app was built (lab source material)
  index.md       — workshop overview, 4-day structure, git checkpoint branches
  lab-builder-prompt.md — meta-prompt recipe for regenerating materials
  worklist.md    — training lab tasks only (open items)
  promptclaudelab.md — this file
  envsetup-instructor.md — pre-workshop environment setup for instructors
  envsetup-student.md    — pre-workshop environment setup for students
  lab-validation-report.md — automated build/file validation findings

## HR App — on Checkpoint Branches

The HR app (Spring Boot + React) lives on the checkpoint branches, not on main.
Paths below are relative to the repo root when a checkpoint branch is checked out:

Backend (Java 21, Spring Boot 3.2, Maven multi-module):
  backend/hrapp-common/   — shared utilities (HrLogHelper, HrApiResponse, etc.)
  backend/hrapp-service/  — main app (8 entities, services, controllers)

Key backend files:
  Entities:    backend/hrapp-service/src/main/java/com/company/hr/model/
  Services:    backend/hrapp-service/src/main/java/com/company/hr/service/
  Controllers: backend/hrapp-service/src/main/java/com/company/hr/controller/
  Migrations:  backend/hrapp-service/src/main/resources/db/migration/
  Tests:       backend/hrapp-service/src/test/java/com/company/hr/service/

Frontend (React 19, TypeScript, Vite, Tailwind + Oracle Redwood tokens):
  frontend/src/
  Components:  frontend/src/components/hr/       — HR-specific (HrWizard, HrStatusBadge, etc.)
               frontend/src/components/ui/       — generic (Button, DataTable, Modal, etc.)
               frontend/src/components/templates/ — page layouts
  Pages:       frontend/src/pages/               — 22 screens
  API hooks:   frontend/src/api/                 — TanStack Query hooks
  E2E tests:   frontend/src/test/e2e/

Database:
  database/schema.sql               — READ ONLY reference DDL
  database/demo.sql                 — seed data
  database/create-readonly-user.sql — for MySQL MCP lab

Claude Code config (present from day2-start onward):
  .claude/settings.json             — hooks (schema guard, Hr naming, Flyway naming, PII detector)
  .claude/skills/scaffold-entity/SKILL.md
  .claude/commands/run-tests.md
  .claude/agents/component-builder.md
  .claude/agents/component-reviewer.md

MCP config (present from day3-start onward):
  .mcp.json                         — Playwright + MySQL MCP configured on day4-start

Project conventions:
  CLAUDE.md                         — all naming/logging/security rules

Note: Makefile and Jenkinsfile do NOT pre-exist — students generate them in Lab 11.

## Git Checkpoint Branches (all in /home/ssthakur/app/training)

checkpoint/day1-start  — backend only, CLAUDE.md intentionally incomplete, no .claude/ config
checkpoint/day2-start  — full backend + complete CLAUDE.md + .claude/skills + .claude/commands, no hooks
checkpoint/day3-start  — full backend + frontend + all 4 hooks in settings.json, .mcp.json stub (empty servers)
checkpoint/day4-start  — full backend + frontend + .mcp.json fully configured (Playwright + MySQL MCP)

Build commands (run from the checkout root):
  Backend:  cd backend && mvn clean compile -q
  Frontend: cd frontend && npm ci --silent && npm run build  (day3-start and day4-start only)
  DB:       mysql -u root -proot123 hr_db -e "SELECT 1;"
  Read-only: mysql -u hr_readonly -preadonly_pass hr_db -e "SELECT 1;"

## Workshop Structure

4 days, 12 labs, mapped to Claude Code features:

Day 1 — Foundation (Labs 1–4):
  Lab 1:  CLAUDE.md — students observe failures, add rules
  Lab 2:  Plan Mode — Explore → Plan → Implement → Commit
  Lab 3:  Skills & Commands — /scaffold-entity skill, /run-tests command
  Lab 4:  Context Management — /clear, /compact, subagents

Day 2 — Productivity (Labs 5–8):
  Lab 5:  Hooks — schema.sql guard, Hr naming, PII detector
  Lab 6:  Subagents — component-builder vs component-reviewer (writer/reviewer pattern)
  Lab 7:  Parallel Sessions & Git Worktrees
  Lab 8:  Verification Loops — test-driven, visual, data-driven

Day 3 — Integration (Labs 9–10):
  Lab 9:  Playwright MCP — browser verification
  Lab 10: MySQL MCP — data verification + full verification loop

Day 4 — Mastery (Labs 11–12):
  Lab 11: CI/CD & Permissions — Makefile, Jenkinsfile, pipeline translation, permissions profile
  Lab 12: Capstone — Employee Transfer end-to-end using all techniques

## Three Core Truths (reinforce in every lab)

1. Context management is the #1 constraint
2. Planning before implementation is non-negotiable
3. Simplicity beats complexity

## Current State of Training Materials

Labs:      All 12 complete. Build-validated across all checkpoint branches (see lab-validation-report.md).
Decks:     16 original + v1-deck-06-hooks (PostCompact added) + v1-deck-14-cicd-governance (claude -p, /schedule, /loop, fan-out added).
Hooks:     deck-12 has awkward merge with CI/CD content — noted, owner will handle.
Deck 13:   Near-duplicate of Deck 11 — noted, owner will handle.

## Reference Sources for Lab Content

- Boris Cherny 57 tips: howborisusesclaudecode.com
- Official best practices: code.claude.com/docs/en/best-practices
- CLAUDE.md guide: claude.com/blog/using-claude-md-files
- Anthropic internal practices PDF: /home/ssthakur/app/training/docs/claudetips/references.md (full list — on checkpoint branches)
- Skills docs: code.claude.com/docs/en/skills
- Hooks docs: code.claude.com/docs/en/hooks

## Open Items (see worklist.md for details)

1. HTML conversion of labs and decks
2. Deck assembly for PPT (v1-deck-06 and v1-deck-14 are the updated versions to use)
3. Review deck-12 (Thinking Modes) — awkward CI/CD merge, owner will handle

## Session Modes — Tell Me Which One Applies

**Review mode:** "Review [lab-XX / deck-XX]" — read the material, assess quality, flag gaps,
unclear instructions, or missing context. Stay in reviewer role, do not execute the lab.

**Dry run mode:** "Do a dry run of [lab-XX] as a student on [checkpoint/dayN-start]" —
switch to the correct checkpoint branch, follow the lab instructions exactly as a student would,
use ONLY what's available on that branch (no peeking at other branches or app/hr), report
where students will get stuck or confused. This is the best way to find gaps before delivery.

**Author mode (default):** Edit, extend, or create training materials. Work on main branch.
```

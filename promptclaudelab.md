# Claude Code Session Kickoff — Training Lab Project

> Paste this into a new Claude Code session to resume training lab work.
> This is the master context prompt for the `/home/ssthakur/app/training` project.

---

```
We are building a 4-day Claude Code enterprise training workshop.
The lab vehicle is a fully-built HR Enterprise Platform (Spring Boot + React).

## Project Locations

Training materials (this project):
  /home/ssthakur/app/training/

HR app (source of truth for all code, config, and lab scenarios):
  /home/ssthakur/app/hr/

## What's Already Built (HR App — DO NOT MODIFY unless fixing a lab issue)

Backend (Java 21, Spring Boot 3.2, Maven multi-module):
  /home/ssthakur/app/hr/backend/hrapp-common/   — shared utilities (HrLogHelper, HrApiResponse, etc.)
  /home/ssthakur/app/hr/backend/hrapp-service/  — main app (8 entities, services, controllers)

Key backend files for lab reference:
  Entities:    backend/hrapp-service/src/main/java/com/company/hr/model/
  Services:    backend/hrapp-service/src/main/java/com/company/hr/service/
  Controllers: backend/hrapp-service/src/main/java/com/company/hr/controller/
  Migrations:  backend/hrapp-service/src/main/resources/db/migration/
  Tests:       backend/hrapp-service/src/test/java/com/company/hr/service/

Frontend (React 19, TypeScript, Vite, Tailwind + Oracle Redwood tokens):
  /home/ssthakur/app/hr/frontend/src/
  Components:  frontend/src/components/hr/       — HR-specific (HrWizard, HrStatusBadge, etc.)
               frontend/src/components/ui/       — generic (Button, DataTable, Modal, etc.)
               frontend/src/components/templates/ — page layouts
  Pages:       frontend/src/pages/               — 22 screens
  API hooks:   frontend/src/api/                 — TanStack Query hooks
  E2E tests:   frontend/src/test/e2e/

Database:
  /home/ssthakur/app/hr/database/schema.sql      — READ ONLY reference DDL
  /home/ssthakur/app/hr/database/demo.sql        — seed data
  /home/ssthakur/app/hr/database/create-readonly-user.sql  — for MySQL MCP lab

CI/CD:
  /home/ssthakur/app/hr/Makefile                 — 8 targets (build, test, lint, verify, etc.)
  /home/ssthakur/app/hr/Jenkinsfile              — 5-stage declarative pipeline

Claude Code config:
  /home/ssthakur/app/hr/.claude/settings.json   — 4 hooks (schema guard, Hr naming, Flyway naming, PII detector)
  /home/ssthakur/app/hr/.claude/skills/scaffold-entity/SKILL.md
  /home/ssthakur/app/hr/.claude/commands/run-tests.md
  /home/ssthakur/app/hr/.claude/agents/component-builder.md
  /home/ssthakur/app/hr/.claude/agents/component-reviewer.md

MCP config:
  /home/ssthakur/app/hr/.mcp.json               — Playwright + MySQL MCP configured

Project conventions:
  /home/ssthakur/app/hr/CLAUDE.md               — all naming/logging/security rules

## What's in the Training Repo (this project)

labs/          — 12 lab exercise files (lab-01 through lab-12)
decks/         — 17 deck files (including v1-deck-06 and v1-deck-14 as updated versions)
instructor/    — flow-guide.md with pacing, blockers, recovery strategies
build-notes/   — 23 build notes documenting how the HR app was built (lab source material)
index.md       — workshop overview, 4-day structure, git checkpoint branches
lab-builder-prompt.md — meta-prompt recipe for regenerating materials
worklist.md    — training lab tasks only (open items)
promptclaudelab.md — this file

## Git Checkpoint Branches (in /home/ssthakur/app/hr)

checkpoint/day1-start  — bootstrap only, CLAUDE.md intentionally incomplete (73 lines)
checkpoint/day2-start  — Region/Country/Location/Job entities + complete CLAUDE.md + skills/commands, no hooks
checkpoint/day3-start  — full backend + frontend wired + all 4 hooks, .mcp.json stub (empty)
checkpoint/day4-start  — current master, .mcp.json fully configured, everything working

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

Labs:      All 12 complete. Lab 9 and 10 escape hatches fixed (MCP package names + credentials).
Decks:     16 original + v1-deck-06-hooks (PostCompact added) + v1-deck-14-cicd-governance (claude -p, /schedule, /loop, fan-out added).
Hooks:     deck-12 has awkward merge with CI/CD content — noted, owner will handle.
Deck 13:   Near-duplicate of Deck 11 — noted, owner will handle.

## Reference Sources for Lab Content

- Boris Cherny 57 tips: howborisusesclaudecode.com
- Official best practices: code.claude.com/docs/en/best-practices
- CLAUDE.md guide: claude.com/blog/using-claude-md-files
- Anthropic internal practices PDF: /home/ssthakur/app/hr/docs/claudetips/references.md (full list)
- Skills docs: code.claude.com/docs/en/skills
- Hooks docs: code.claude.com/docs/en/hooks

## Open Items (see worklist.md for details)

1. HTML conversion of labs and decks
2. Deck assembly for PPT (v1-deck-06 and v1-deck-14 are the updated versions to use)
3. Review deck-12 (Thinking Modes) — awkward CI/CD merge, owner will handle
```

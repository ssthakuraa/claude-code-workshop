# Build Note: Memory & Session Management

**Date:** 2026-03-30
**Module:** Memory — persistent context across Claude Code sessions
**Maps to Lab:** Lab 12: Memory

---

## What This Lab Covers

Claude Code has no built-in memory between sessions — every new session starts fresh. This lab covers three complementary strategies for preserving context:

1. **`claudeprompt.md`** — a hand-maintained resume file you paste at session start
2. **CLAUDE.md rules** — project-level conventions Claude reads automatically every session
3. **Auto-memory** — Claude's file-based memory system that persists facts across sessions automatically

---

## Strategy 1: claudeprompt.md (Session Resume File)

A markdown file that captures enough state to resume work without re-explaining the project. Updated at the end of each session.

**Structure that works:**
```markdown
# Claude Code Resume Prompt

## Context
One paragraph: what the project is, where to find the rules.

## What Has Been Built
Git log + bulleted state of each layer (backend, frontend, infrastructure).

## What Remains
Ordered list of next tasks.

## How to Resume
> Paste this exact prompt: "Read docs/claudeprompt.md and continue. Next task: ..."
```

**Key insight:** The resume file is NOT documentation — it's a prompt. Write it to be read by Claude, not by humans. Include git commit hashes (Claude can verify state), file paths (Claude reads them if needed), and explicit "next task" instructions.

---

## Strategy 2: CLAUDE.md as Persistent Rules

CLAUDE.md is loaded automatically every session. It's the right place for:
- Conventions that must never be violated (naming, logging, security)
- Decisions that were hard-won and would be re-litigated without documentation
- Anti-patterns Claude tends to drift toward (e.g., raw object returns instead of `HrApiResponse`)

**What failed without CLAUDE.md:**
In early sessions without CLAUDE.md, Claude would occasionally return raw entity objects instead of `HrApiResponse<T>` envelopes, use `@Where` (deprecated) instead of `@SQLRestriction`, or forget the `HrLogHelper` entry/exit pattern. Each required a correction prompt.

With CLAUDE.md established, these corrections almost never needed repeating.

---

## Strategy 3: Auto-Memory (File-Based)

Claude Code's auto-memory system writes facts to `~/.claude/projects/<project>/memory/` and reads them at session start. Four memory types:

| Type | Use For |
|------|---------|
| `user` | Who the user is, their expertise, preferences |
| `feedback` | What approaches worked/failed — "never mock the DB", "prefer bundled PRs" |
| `project` | Active work, deadlines, stakeholder context |
| `reference` | Where to find things — Linear board, Grafana dashboard, Slack channels |

**The MEMORY.md index:** Each memory entry is a separate file. `MEMORY.md` is a one-line-per-entry index that loads into every session automatically. Keep it under 200 lines — entries after that are truncated.

---

## The Prompt That Worked (Session Resume)

```
Read docs/claudeprompt.md.
I'm resuming the HR Enterprise Platform build.
Next task: write build notes #18 and #19.
The app is a Spring Boot + React monorepo that doubles as training material.
All rules are in CLAUDE.md — re-read it before touching any code.
```

**Why it works:** One file read gives Claude the full state. CLAUDE.md re-read ensures conventions aren't forgotten. Explicit next task means no time spent asking "what should I do?"

---

## What Failed First

- **Symptom:** After a long session, Claude started generating code that violated CLAUDE.md conventions (raw entity returns, missing `@PreAuthorize`).
- **Root cause:** Context window filling up — later messages push CLAUDE.md out of the effective context.
- **Fix:** If a session runs long, explicitly re-anchor: "Re-read CLAUDE.md before proceeding." This costs one turn but prevents a batch of convention violations.

- **Symptom:** `claudeprompt.md` became stale — it listed features as "pending" that had already been built in a prior session.
- **Root cause:** The file was only updated at session end. If a session was killed (hung), the update never happened.
- **Fix:** Update `claudeprompt.md` after each commit, not just at session end. The git log is the source of truth — claudeprompt.md just summarizes it.

- **Symptom:** Auto-memory entries referenced function names that had since been renamed, leading Claude to confidently suggest calling functions that no longer existed.
- **Root cause:** Memory records are frozen in time. Code moves; memory doesn't.
- **Fix:** Before acting on a memory that names a specific file, function, or flag — verify it exists: grep for it, or read the file. "The memory says X exists" ≠ "X exists now."

---

## CLAUDE.md / Skill Update Made

```markdown
## Session Management
- Resume file: docs/claudeprompt.md — update after every commit
- If session runs long (>50 turns), re-read CLAUDE.md explicitly
- Auto-memory: ~/.claude/projects/.../memory/ — verify named files/functions before acting on them
```

---

## Key Teaching Points

1. **Three tools, three scopes:** `claudeprompt.md` = current session state; `CLAUDE.md` = permanent project rules; auto-memory = cross-session facts about preferences and patterns.
2. **Memory is not documentation** — write it to be consumed by Claude, not by humans. Explicit, terse, actionable.
3. **Stale memory is worse than no memory** — a wrong memory leads to confident wrong answers. Verify before acting.
4. **The hung session problem** — if a session is killed before cleanup, the resume file lags. Use git log as the authoritative state source.

---

## Lab Exercise Derivation

- **Setup:** HR app project with CLAUDE.md and claudeprompt.md in place.
- **Task 1:** Start a fresh session. Paste only claudeprompt.md. Ask Claude to describe what has been built and what remains. Verify accuracy against git log.
- **Task 2:** Ask Claude to add a new endpoint WITHOUT re-reading CLAUDE.md. Observe convention drift (missing logging, wrong response envelope, etc.). Then re-read CLAUDE.md and repeat — observe compliance.
- **Task 3:** Save a feedback memory: "Never return raw entity objects — always wrap in HrApiResponse." Start a new session. Verify the memory loads and Claude applies it without being told.
- **Success criteria:** Task 1 — accurate state summary. Task 2 — measurable improvement with CLAUDE.md. Task 3 — memory persists across session boundary.

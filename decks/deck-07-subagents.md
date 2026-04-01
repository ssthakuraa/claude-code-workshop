# Deck 7: Subagents — Fresh Context, Focused Work

**Duration:** 20 minutes | **Lab:** Lab 6

---

## Slide 1: Why Subagents?
Two problems solved at once:
1. **Context isolation** — heavy work stays in the subagent's window
2. **Fresh perspective** — a reviewer that didn't write the code finds more issues

> **Speaker notes:** Subagents aren't about complexity. They're about separation of concerns — same principle as microservices, applied to AI sessions.

---

## Slide 2: Built-in vs Custom

| Type | Tools | Use For |
|------|-------|---------|
| `Explore` | Read-only | Codebase research |
| `Plan` | Read-only | Architecture design |
| `general-purpose` | All tools | Full implementation |
| **Custom** (`.claude/agents/`) | You define | Specialized roles |

> **Speaker notes:** Built-in agents are for quick delegation. Custom agents are for repeatable roles — security reviewer, component builder, migration specialist.

---

## Slide 3: The Writer/Reviewer Pattern

```
Builder agent → writes HrEmployeeCard.tsx
Reviewer agent → reviews with fresh context → finds 4 issues
Builder agent → fixes the 4 issues
```

**Self-review finds 0–2 issues. Fresh-context review finds 3–6.**

> **Speaker notes:** This is the most impactful pattern. It maps directly to how enterprise teams do code review — the reviewer is always someone who didn't write the code. Subagents replicate this with AI.

---

## Slide 4: Custom Agent Anatomy

```markdown
---
name: component-reviewer
description: Reviews React components for quality
model: sonnet
allowed-tools: Read, Glob, Grep
---

You are a senior frontend engineer performing a thorough code review.
Be specific and actionable. Do NOT make changes.

## Checklist
1. Accessibility (aria, keyboard, contrast)
2. Error states (null, empty, failure)
3. Edge cases (long strings, 0 items, 1000 items)
4. Type safety (no `any`, proper optionals)
5. Performance (re-renders, missing memo)
```

> **Speaker notes:** Two key details: `allowed-tools` scopes what the agent can do (read-only for reviewers). The persona matters — "senior engineer, thorough review, be specific" produces better critique than just "review this."

---

## Slide 5: Your Turn — Lab 6

You'll:
1. Build a component and self-review (observe limited critique)
2. Create builder + reviewer agents
3. Use the reviewer on the same component (observe more findings)
4. Apply feedback and re-verify

**Time:** 60 minutes. Go.



## Slide 6: Parallel Sessions & Git Worktrees: The Multiplier

**Duration:** 20 minutes | **Lab:** Lab 7
```
Sequential: 3 features × 20 min = 60 min
Parallel:   3 features × 20 min / 3 sessions = ~25 min (with merge overhead)
```

Boris runs 5 local + 5–10 web sessions simultaneously. This is the **#1 productivity tip** from the Claude Code team.

> **Speaker notes:** This isn't theoretical. Boris does this daily. The key enabler is git worktrees — not just branches.

---

## Slide 7: Worktrees vs Branches

| Branches | Worktrees |
|----------|-----------|
| Same working directory | **Separate directories** |
| Switch with `git checkout` | Each has its own files on disk |
| Only one active at a time | **All active simultaneously** |
| Claude sessions would conflict | **No conflicts** |

```bash
git worktree add ../hr-feature-a -b feature/departments
git worktree add ../hr-feature-b -b feature/jobs
```

> **Speaker notes:** Branches share a working directory — you can only have one checked out. Worktrees give you parallel directories. Each Claude session runs in its own worktree with its own files. No conflicts possible.

---

## Slide 8: The Workflow

1. Create N worktrees for N features
2. Open N terminals, start Claude in each
3. Give each session its task
4. Let them work — check periodically
5. Merge results back to main

**10–20% of sessions may be abandoned — that's normal.**

> **Speaker notes:** Abandoning a session isn't failure. Sometimes Claude goes sideways. Kill it, restart, spend 2 minutes instead of 20 fighting it. This is how Boris works.

---

## Slide 9: Your Turn — Lab 7

You'll:
1. Create 2 worktrees
2. Build Departments page in one, Jobs page in the other
3. Run them simultaneously
4. Merge back and verify

**Time:** 60 minutes. Go.

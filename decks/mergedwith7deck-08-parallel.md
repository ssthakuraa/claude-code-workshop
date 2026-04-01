# Deck 8: Parallel Sessions & Git Worktrees

**Duration:** 20 minutes | **Lab:** Lab 7

---

## Slide 1: The Multiplier

```
Sequential: 3 features × 20 min = 60 min
Parallel:   3 features × 20 min / 3 sessions = ~25 min (with merge overhead)
```

Boris runs 5 local + 5–10 web sessions simultaneously. This is the **#1 productivity tip** from the Claude Code team.

> **Speaker notes:** This isn't theoretical. Boris does this daily. The key enabler is git worktrees — not just branches.

---

## Slide 2: Worktrees vs Branches

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

## Slide 3: The Workflow

1. Create N worktrees for N features
2. Open N terminals, start Claude in each
3. Give each session its task
4. Let them work — check periodically
5. Merge results back to main

**10–20% of sessions may be abandoned — that's normal.**

> **Speaker notes:** Abandoning a session isn't failure. Sometimes Claude goes sideways. Kill it, restart, spend 2 minutes instead of 20 fighting it. This is how Boris works.

---

## Slide 4: Your Turn — Lab 7

You'll:
1. Create 2 worktrees
2. Build Departments page in one, Jobs page in the other
3. Run them simultaneously
4. Merge back and verify

**Time:** 60 minutes. Go.

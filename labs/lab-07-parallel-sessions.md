# Lab 7: Parallel Sessions & Git Worktrees

**Duration:** 60 minutes
**Day:** 2 — Productivity
**Checkpoint Branch:** `checkpoint/day2-start`
**Builds On:** Labs 5–6 (hooks, subagents)
**Produces:** 2–3 features built in parallel across separate worktrees

---

## Learning Objective

You will run multiple Claude Code sessions simultaneously — each in its own git worktree — and experience how parallelization compresses multi-feature work into a fraction of the time. This is what Boris Cherny calls the **"single biggest productivity unlock."**

---

## The Key Concept

**The problem:** One Claude session = one feature at a time. Complex features take 15–30 minutes. Three features = 45–90 minutes sequential.

**The solution:** Git worktrees give each session its own working directory (not just a branch — a separate checkout on disk). No file conflicts. Each session works independently.

```bash
# Create worktrees
git worktree add ../hr-feature-a -b feature/departments
git worktree add ../hr-feature-b -b feature/jobs
git worktree add ../hr-feature-c -b feature/dashboard
```

**Boris's workflow:**
- 3–5 local terminal sessions, each in its own worktree
- 5–10 additional sessions on claude.ai/code in the browser
- Shell aliases (`za`, `zb`, `zc`) for one-keystroke switching
- 10–20% of sessions are abandoned — that's normal

---

## Setup

```bash
git checkout checkpoint/day2-start

# Verify you have a clean working tree
git status  # Should be clean
```

---

## Exercise 1: Create Worktrees (10 min)

### Goal
Set up two parallel working directories.

### Instructions

1. Create two worktrees from the Day 2 checkpoint:
   ```bash
   git worktree add ../hr-worktree-a -b feature/department-page
   git worktree add ../hr-worktree-b -b feature/jobs-page
   ```

2. Verify both exist:
   ```bash
   git worktree list
   ```

3. Open a **second terminal tab/window**. You now have:
   - **Terminal A** → `../hr-worktree-a` (department feature)
   - **Terminal B** → `../hr-worktree-b` (jobs feature)

4. Start a Claude Code session in each:
   ```bash
   # Terminal A
   cd ../hr-worktree-a && claude

   # Terminal B
   cd ../hr-worktree-b && claude
   ```

---

## Exercise 2: Parallel Feature Build (30 min)

### Goal
Build two features simultaneously. Give each session its task and let them work.

### Instructions

**In Terminal A** — Departments Page:
```
Build the Departments page for the HR app:
1. Create src/pages/organization/DepartmentsPage.tsx
2. Use the SplitViewTemplate — tree on left, detail on right
3. Left panel: department tree (nested children), clickable
4. Right panel: department detail (name, manager, location, employee count)
5. Add/Edit/Delete buttons for ADMIN and HR_SPECIALIST roles
6. Use TanStack Query to fetch from /app/hr/api/v1/departments
7. Follow all CLAUDE.md conventions and existing page patterns.
```

**In Terminal B** — Jobs Page:
```
Build the Jobs page for the HR app:
1. Create src/pages/organization/JobsPage.tsx
2. Use the DataManagementTemplate — table with CRUD
3. Columns: Job ID, Title, Min Salary, Max Salary
4. Add/Edit modal with salary range validation (min < max)
5. Search and pagination
6. Use TanStack Query to fetch from /app/hr/api/v1/jobs
7. Follow all CLAUDE.md conventions and existing page patterns.
```

**Now let them both work.** Switch between terminals to monitor progress. Don't wait for one to finish before checking the other.

### What You Should See

Both sessions work independently — no conflicts, no waiting. Each reads CLAUDE.md from its own worktree copy.

---

## Exercise 3: Merge Results (15 min)

### Goal
Bring both features back into the main branch.

> **Training repo note:** The instructions below show what you would do when building
> a real feature in your own codebase — commit each worktree and merge back to main.
> In this training repo (read-only for students), skip the `git add`, `git commit`,
> and `git merge` commands. Instead, complete steps 1 (verify the build in each
> worktree) and 4 (remove worktrees), and treat the rest as a walkthrough of the
> pattern you'd apply in production.

### Instructions

1. When both sessions are done, verify each independently:
   ```bash
   # Terminal A
   cd ../hr-worktree-a && cd frontend && npm run build

   # Terminal B
   cd ../hr-worktree-b && cd frontend && npm run build
   ```

2. Commit in each worktree:
   ```bash
   # --- In your real codebase, you would: ---
   # Terminal A
   # cd ../hr-worktree-a
   # git add -A && git commit -m "feat: add departments page with tree view"

   # Terminal B
   # cd ../hr-worktree-b
   # git add -A && git commit -m "feat: add jobs page with CRUD and salary validation"
   # --- In this training repo, skip the above and proceed to cleanup ---
   ```

3. Merge back to your main working branch:
   ```bash
   # --- In your real codebase, you would: ---
   # cd /path/to/your/main/clone
   # git merge feature/department-page
   # git merge feature/jobs-page
   # --- In this training repo, skip the above and proceed to cleanup ---
   ```

4. Clean up worktrees:
   ```bash
   git worktree remove ../hr-worktree-a
   git worktree remove ../hr-worktree-b
   ```

5. Verify — both pages should exist and the frontend should build.

---

## Exercise 4: Reflect and Encode (5 min)

1. **Time comparison:**
   - Estimated sequential time (both features one after another): _____ min
   - Actual parallel time: _____ min
   - Time saved: _____ min

2. **Add to CLAUDE.md:**
   ```markdown
   ## Parallel Development
   - Use git worktrees for parallel features — not just branches
   - Each worktree gets its own Claude session
   - Merge back to main when both features are verified independently
   ```

3. **Discussion:** *In your real codebase, what 2–3 features are currently in your backlog that could be built in parallel?*

---

## Success Criteria

- [ ] Two worktrees created and running separate Claude sessions
- [ ] Both features built simultaneously without conflicts
- [ ] Both features merge cleanly back to the main branch
- [ ] Frontend builds after merge
- [ ] You can explain worktrees vs branches (separate directory vs same directory)

---

## Key Takeaways

1. **Worktrees, not branches** — branches share a working directory; worktrees don't. Each Claude session needs its own directory.
2. **Parallelism is multiplicative** — 3 sessions × 15 min ≠ 45 min; it's ~18 min (15 min + merge overhead)
3. **Each session reads its own CLAUDE.md** — consistency is guaranteed because the file is in each worktree
4. **10–20% abandonment is normal** — if a session goes sideways, kill it and restart. Don't over-invest.
5. **Hooks fire in every worktree** — your quality gates from Lab 5 work in parallel sessions too

---

<details>
<summary><strong>Escape Hatch</strong> — Git worktree commands</summary>

```bash
# Create a worktree
git worktree add <path> -b <branch-name>

# List all worktrees
git worktree list

# Remove a worktree (after merging)
git worktree remove <path>

# Clean stale worktree references
git worktree prune

# If merge conflicts occur:
git merge --abort  # Start over
# Or resolve manually, then: git merge --continue
```

If you can't open multiple terminals, use `tmux` or background processes:
```bash
# tmux split
tmux new-session -s lab7
Ctrl+B % (split vertical)
```
</details>

# Lab 07: Parallel Sessions & Isolated Workspaces

**Duration:** 60 minutes

> Recommended Day 2 order: **Lab 09 -> Lab 08 -> Lab 07 -> Lab 10 -> Lab 11 -> optional Lab 12**.

## Learning Objective

You will run multiple Claude Code sessions at once, each in its own isolated
`git worktree`. The goal is to see how parallel work compresses multi-slice
delivery time without causing file collisions.

---

## The Key Concept

One session can usually make progress on one main slice at a time. Multiple
independent slices go faster when each session gets its own isolated working
directory.

```bash
cd /absolute/path/to/claude-workshop
mkdir -p ../claude-workshop-parallel
rm -rf ../claude-workshop-parallel/workspace-a ../claude-workshop-parallel/workspace-b ../claude-workshop-parallel/workspace-c
git worktree add ../claude-workshop-parallel/workspace-a
git worktree add ../claude-workshop-parallel/workspace-b
git worktree add ../claude-workshop-parallel/workspace-c
```

Each worktree carries the same `CLAUDE.md`, docs, and code, but the edits stay
isolated until you choose what to bring back.

If your current learner workspace came from a GitHub zip instead of `git clone`,
make a normal Git clone of the repo before this lab. `git worktree` needs a real
Git repository.

---

## Exercise 1: Create Isolated Workspaces (10 min)

### Goal

Set up two or three parallel working directories.

### Instructions

0. **Commit any pending CLAUDE.md changes before creating worktrees.** Worktrees branch from the current HEAD commit, so any uncommitted changes to `CLAUDE.md` will not be visible in them. If you have updated `CLAUDE.md` during earlier labs without committing, do this first:
   ```bash
   git add CLAUDE.md && git commit -m "Update CLAUDE.md rules from labs 01-06"
   ```
   Then create the worktrees.

1. Confirm the worktrees exist:
   ```bash
   ls ../claude-workshop-parallel/workspace-a
   ls ../claude-workshop-parallel/workspace-b
   ```

2. Verify they started from the same root guidance:
   ```bash
   diff -q CLAUDE.md ../claude-workshop-parallel/workspace-a/CLAUDE.md
   diff -q CLAUDE.md ../claude-workshop-parallel/workspace-b/CLAUDE.md
   ```

3. Open separate terminals:
   - Terminal A -> `../claude-workshop-parallel/workspace-a`
   - Terminal B -> `../claude-workshop-parallel/workspace-b`
   - optional Terminal C -> `../claude-workshop-parallel/workspace-c`

4. Start a Claude Code session in each workspace.

---

## Exercise 2: Run Two Independent Slices In Parallel (30 min)

### Goal

Give each workspace a bounded, independent task.

### Instructions

**Workspace A: Departments page**

```text
This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

Build the Departments page for the HR app.

Requirements:
- create `frontend/src/pages/organization/DepartmentsPage.tsx`
- follow existing list/detail layout patterns already present in the repo
- left side: department tree
- right side: selected department details
- admin and HR specialist actions only where existing role patterns support them
- use the live `/app/hr/api/v1/departments` contract
```

**Workspace B: Jobs page**

```text
This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

Build the Jobs page for the HR app.

Requirements:
- create `frontend/src/pages/organization/JobsPage.tsx`
- follow existing list/table/filter page patterns already present in the repo
- show job id, title, minimum salary, and maximum salary
- support create/edit validation for min < max
- use the live `/app/hr/api/v1/jobs` contract
```

Switch between the sessions while they work. The point is not to babysit one
session to completion before the other starts.

---

## Exercise 3: Validate And Copy Back (15 min)

### Goal

Verify each isolated workspace, then copy back only the intended files.

### Instructions

1. Ask each workspace to verify its own frontend slice:
   ```bash
   cd ../claude-workshop-parallel/workspace-a/frontend && npm run build
   cd ../claude-workshop-parallel/workspace-b/frontend && npm run build
   ```

2. Compare each worktree with the main workspace:
   ```bash
   diff -rq . ../claude-workshop-parallel/workspace-a | head -50
   diff -rq . ../claude-workshop-parallel/workspace-b | head -50
   ```

3. Before copying back, **identify shared integration files** — files that both workspaces may have changed independently:
   ```bash
   diff ../claude-workshop-parallel/workspace-a/frontend/src/routes/router.tsx \
        ../claude-workshop-parallel/workspace-b/frontend/src/routes/router.tsx
   ```
   `router.tsx` (and sometimes `HrSidebar.tsx`) is touched by every new page — both workspaces likely added their own route. If they differ, you must **merge both changes**, not copy one file over the other. Ask Claude Code to apply both workspace's route additions to the main workspace router rather than replacing it wholesale.

4. Copy back only the intended feature files with an exact Claude Code prompt:
   ```text
   Compare the completed frontend changes in:
   - `../claude-workshop-parallel/workspace-a`
   - `../claude-workshop-parallel/workspace-b`

   Restore only the intended Lab 07 feature files into my main workspace.
   Inspect only these candidate paths before copying anything:
   - `frontend/src/pages/organization/DepartmentsPage.tsx`
   - `frontend/src/pages/organization/JobsPage.tsx`
   - `frontend/src/routes/router.tsx`
   - `frontend/src/components/hr/layout/HrSidebar.tsx`
   - `frontend/src/components/hr/layout/HrCommandPalette.tsx`
   - `frontend/src/utils/hrWorkspaceChrome.ts`
   - `frontend/src/utils/hrGlobalSearch.ts`

   IMPORTANT: both workspaces may have edited router.tsx independently.
   For any file edited by both workspaces, merge both sets of changes into
   the main workspace — do not copy one workspace's version over the other.
   Copy-paste new page files directly; merge shared wiring files surgically.
   Then tell me exactly which files were copied or merged.
   ```

5. Rebuild in the main workspace:
   ```bash
   cd frontend && npm run build
   ```

6. Clean up the temporary worktrees when finished:
   ```bash
   git worktree remove ../claude-workshop-parallel/workspace-a
   git worktree remove ../claude-workshop-parallel/workspace-b
   git worktree remove ../claude-workshop-parallel/workspace-c
   ```

---

## Exercise 4: Capture The Rule (5 min)

1. Add a short rule block to `CLAUDE.md`:

   ```markdown
   ## Parallel Development
   - For independent slices, use isolated `git worktree` workspaces instead of sharing one working tree
   - Validate each worktree before bringing files back to the main workspace
   - Merge back only the intended files, not the whole temporary workspace
   ```

2. Reflect:
   - Which backlog items in your real project could be split safely into
     isolated workspace copies?
   - What made these two slices safe to parallelize?

---

## Success Criteria

- [ ] At least two isolated worktrees were created
- [ ] Two Claude Code sessions ran against different worktrees
- [ ] Each worktree was validated before merge-back
- [ ] Only the intended files were copied into the main workspace
- [ ] The main frontend still built after the copy-back

---

## Key Takeaways

1. Parallel sessions need isolated worktrees, not shared edits in one tree.
2. Validation belongs in each temporary worktree before merge-back.
3. Merge back only the finished files you actually want.
4. Parallelism helps most when the slices are independent and bounded.

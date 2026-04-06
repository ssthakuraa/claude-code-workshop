# Lab 7: Parallel Sessions & Git Worktrees

**Duration:** 90 minutes
**Day:** 2 — Productivity
**Builds On:** Lab 3 (Skills), Labs 5–6 (hooks, subagents)
**Produces:** A `/build-page` skill and 2 features built in parallel across separate worktrees

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
# Verify you have a clean working tree
git status  # Should be clean

# Verify backend compiles
cd backend && mvn compile -q && echo "Backend: OK"
```

---

## Exercise 1: Study an Existing Page (10 min)

### Goal
Understand the enterprise page pattern before you try to replicate it.

### Instructions

1. Open `src/pages/employees/EmployeeDirectoryPage.tsx` and study its structure:
   ```bash
   wc -l src/pages/employees/EmployeeDirectoryPage.tsx
   cat src/pages/employees/EmployeeDirectoryPage.tsx
   ```

2. **Note the pattern:**
   - **Header:** Title, count, action buttons (RBAC-conditional)
   - **Filters:** Search input + dropdowns, clear button when any filter active
   - **Data table:** Loading skeletons (`HrSkeleton`), error state, empty state
   - **Row design:** Avatar/initials, badges (`HrStatusBadge`, `HrEmploymentTypeBadge`), hover highlight
   - **API layer:** TanStack Query (`useEmployees()` hook) — no raw fetch calls
   - **Footer:** Results count vs total
   - **Styling:** Tailwind with `bg-white rounded-lg border`, consistent spacing

3. **Key insight:** This page follows every lab's conventions — TanStack Query, Hr naming, RBAC, error handling, loading states. If you clone this pattern, every new page will be correct by construction.

---

## Exercise 1.5: Build the Skill (15 min)

### Goal
Encode the page pattern from Exercise 1 into a reusable `/build-page` skill.

### Instructions

1. Create the skills directory:
   ```bash
   mkdir -p .claude/skills/build-page
   ```

2. Ask Claude to create the skill:
   ```
   Create .claude/skills/build-page/SKILL.md — a skill that encodes the
   enterprise page pattern from EmployeeDirectoryPage.tsx. It should:

   1. Accept parameters: page name, API endpoint, data columns/filters
   2. Generate a complete page component with:
      - Header with title, count, and RBAC-conditional action buttons
      - Filter bar: search input + configurable dropdowns + clear button
      - Data table with loading skeletons (HrSkeleton), error state, empty state
      - Footer with results count
      - All styling: Tailwind bg-white rounded-lg border, consistent spacing
   3. Use TanStack Query (useQuery hook) — never raw fetch
   4. Use HrStatusBadge, HrSkeleton, HrEmploymentTypeBadge where appropriate
   5. Be user-invocable as /build-page

   Study Employee_DIRECTORY_PAGE.tsx for the template pattern.
   ```

3. **Refine the skill:**
   ```
   The skill should also include:
   - useNavigate for row click → detail page
   - Responsive layout (flex-wrap on filters)
   - Empty and error states with helpful messages
   ```

> **Reference:** A reference version already exists at `reference/.claude/skills/build-page/SKILL.md` — build your own first, then compare.

---

## Exercise 2: Create Worktrees (10 min)

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

## Exercise 3: Parallel Feature Build — Use the Skill (30 min)

### Goal
Build two features simultaneously using your `/build-page` skill.

### Instructions

**In Terminal A** — Departments Page:
```
/build-page
Page: DepartmentsPage
Title: Departments
API: /app/hr/api/v1/departments
Layout: tree view (SplitViewTemplate) — tree on left, detail on right
Tree: department hierarchy (nested children), clickable
Detail: name, manager, location, employee count
Buttons: Add/Edit/Delete for ADMIN and HR_SPECIALIST roles
```

**In Terminal B** — Jobs Page:
```
/build-page
Page: JobsPage
Title: Jobs
API: /app/hr/api/v1/jobs
Layout: data table with CRUD
Columns: Job ID, Title, Min Salary, Max Salary
Features: Add/Edit modal with salary range validation (min < max), search, pagination
```

**Now let them both work.** Switch between terminals to monitor progress. Don't wait for one to finish before checking the other.

### What You Should See

Both sessions work independently — no conflicts, no waiting. Each reads CLAUDE.md and the skill from its own worktree copy. The skill ensures both pages follow the same conventions automatically.

> **Reference:** Pre-built versions exist at `reference/frontend/src/pages/organization/DepartmentsPage.tsx` and `reference/frontend/src/pages/organization/JobsPage.tsx`. Build your own first, then compare.

---

## Exercise 4: Merge Results (15 min)

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

4. Before cleaning up, **update the router** in each worktree to include the new pages:
   ```bash
   # Uncomment the DepartmentsPage and JobsPage imports and routes
   # in frontend/src/routes/router.tsx
   ```

5. Clean up worktrees:
   ```bash
   git worktree remove ../hr-worktree-a
   git worktree remove ../hr-worktree-b
   ```

5. Verify — both pages should exist and the frontend should build.

---

## Exercise 5: Reflect and Encode (5 min)

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

- [ ] Studied EmployeeDirectoryPage.tsx and understand the enterprise page pattern
- [ ] Created `/build-page` skill encoding the page pattern
- [ ] Two worktrees created and running separate Claude sessions
- [ ] Both features built simultaneously using the skill without conflicts
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
<summary><strong>Escape Hatch</strong> — /build-page skill</summary>

Copy the reference skill:

```bash
mkdir -p .claude/skills/build-page
cp reference/.claude/skills/build-page/SKILL.md .claude/skills/build-page/SKILL.md
```
</details>

<details>
<summary><strong>Escape Hatch</strong> — Reference page components</summary>

Compare your built pages with the references:

- Departments: `reference/frontend/src/pages/organization/DepartmentsPage.tsx`
- Jobs: `reference/frontend/src/pages/organization/JobsPage.tsx`
</details>

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

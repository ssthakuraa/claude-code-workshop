# Dry-Run Lab Simulation — Instructor Mechanism

**Purpose:** Document the dry-run simulation mechanism so it can be invoked by name in future sessions.

When the user prompts with `dryrunlab.md`, read `claudelabprompt.md` first for full context, then follow this mechanism.

---

## Overview

Simulate a student going through all 12 labs by:
1. Acting as the **instructor** (orchestrator)
2. Spawning **sub-agents** to play the student role (each exercise = fresh sub-agent)
3. Observing outputs against a structured evaluation framework
4. Logging defects, comparing bad-path vs. good-path runs, and producing an actionable final report

The goal is **not** to confirm the labs work. It is to **find the places they don't**, surface pedagogy gaps, and produce a triage queue the maintainer can act on.

---

## Initial Setup (Run Once at Start)

### Step 1: Prepare the Student Repo
Ensure `claude-workshop` is up to date:
```bash
cd /home/ssthakur/projects/hrclaudelab
./maintainer-tools/sync-claude-workshop.sh
```

### Step 2: Create Fresh Dry-Run Workspace
Remove existing dry-run if present, then create a fresh clone:
```bash
cd /home/ssthakur/projects
rm -rf claude-workshop-dryrun
git clone /home/ssthakur/projects/claude-workshop claude-workshop-dryrun
cd claude-workshop-dryrun
git remote remove origin
```

### Step 3: Run Environment Setup
Apply database schema and demo data in sequence (avoid race conditions):
```bash
# Ensure PostgreSQL is running, then:
cd /home/ssthakur/projects/claude-workshop-dryrun

# 1. Setup local config
./lab-materials/setup-local-config.sh

# 2. Load schema (wait for completion)
psql -h localhost -U hrapp -d hrdb -f database/hrschema.sql

# 3. Load demo data (wait for completion)
psql -h localhost -U hrapp -d hrdb -f database/hrdemo.sql

# 4. Verify
PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
```

### Step 4: Initialize Defect Log and Summary Files
```bash
mkdir -p docs
touch docs/dryrun-defect-log.md
touch docs/dryrun-summary.md
```

Seed the defect log with a header:

```markdown
# Dry-Run Defect Log

| Lab | Exercise | Step | Severity | Type | Description | Suggested fix |
|-----|----------|------|----------|------|-------------|---------------|
```

---

## Per-Lab Workflow

### For Each Exercise in a Lab:

1. **Read the lab file** (`lab-materials/claudelabXX.md`) to understand the exercise
2. **Note the start timestamp** for time tracking
3. **Spawn a sub-agent** with the exact exercise prompt from the lab
   - Sub-agent works in: `/home/ssthakur/projects/claude-workshop-dryrun`
   - Sub-agent gets fresh context (simulates student "exit and re-open")
4. **Observe the output** against the lab's checklist/expected behavior
5. **Apply the evaluation framework** (defect logging, learning outcome check)
6. **Note the end timestamp**, log to defect log if exercise took >2x estimated time
7. **When lab says "Exit and resume"** → spawn a NEW sub-agent (fresh context)
8. **When lab says to use escape hatch** → copy from `reference/labXX/` to dry-run workspace, then continue

### Key Rules for Sub-Agents:
- Each exercise = ONE sub-agent (fresh context)
- Sub-agent MUST work in `claude-workshop-dryrun` (never `hrclaudelab`)
- Give the sub-agent the EXACT prompt from the lab chapter
- Do NOT give the sub-agent access to `hrclaudelab` or `maintainer-tools/`
- The sub-agent should follow `CLAUDE.md` in the dry-run workspace

---

## Evaluation Framework

This is the structured part of the dry-run. The mechanical sub-agent isolation
above gives you clean trials; the framework below is how you read them.

### 1. Defect Logging

For every exercise, append findings to `docs/dryrun-defect-log.md` using the
table format. If no defects are found, log a single PASS row with notes on
sub-agent behavior — silence is not data.

**Severity:**
- **blocker** — exercise cannot complete; or it completes but breaks the next exercise
- **major** — exercise completes but the lesson is compromised, or significant rework is needed by a real student
- **minor** — instruction works but is awkward, slow, or unclear; would cause friction not failure
- **nit** — typos, formatting, cosmetic

**Type:**
- **broken** — command fails, file missing, build error
- **ambiguous** — prompt is interpretable two or more ways
- **implicit-dep** — lab assumes prior state not established
- **wrong-order** — step B requires step A but A comes later
- **stale** — instruction reflects old code, UI, API, or behavior
- **scope-creep** — sub-agent did things the lab didn't ask for; lab failed to bound
- **pedagogy-gap** — sub-agent technically completed but missed the teaching moment

### 2. Learning Outcome Check

After each exercise, separately from the steps-completed check, answer in
the defect log notes:

- What was this exercise trying to teach?
- Did the sub-agent demonstrate they learned it?
- If they completed the steps but missed the lesson, log a **pedagogy-gap**
  defect at major or higher severity.

This is the most important check. A lab that runs cleanly but doesn't teach
its intended lesson is broken in the way that hurts students most.

### 3. Bad-Path / Good-Path Comparison

For Labs 01, 02, 04, 06, 08 — the lab's value comes from the **delta**
between the bad-path run and the good-path run. After the good-path
exercise, write a comparison entry in the defect log notes:

- Bad-path failures observed: [explicit list]
- Good-path: did all bad-path failures resolve? [yes / no / partial]
- If partial or no, the lab failed to teach its core lesson — log as
  **blocker** under type **pedagogy-gap**.

This check catches the failure mode where each run individually "looks
fine" but the contrast that drives the lesson never lands.

### 4. Iteration Rules

- Defects are logged but the lab continues to the next exercise.
- If a **blocker** defect makes the next exercise impossible, escape-hatch
  in (`reference/labXX/`) and continue. Note in the defect log that the
  escape hatch was used as a workaround, not as instructed.
- **Do not edit the lab files during the dry-run.** The defect log is the
  deliverable. Editing during the run pollutes the test.
- If a sub-agent appears stuck, give it one nudge (rephrasing the lab's
  prompt slightly). If it's still stuck, that's a defect — log and move on.

### 5. Time Tracking

- Note start and end timestamp per exercise.
- At lab end, sum actual time and compare to lab's estimated duration.
- Flag exercises that took **>2x estimated time** as a minor defect under
  type **ambiguous** or **implicit-dep** (whichever fits) — slow exercises
  almost always indicate something the student is wrestling with that the
  lab didn't anticipate.

### 6. Persona Realism (light touch)

The sub-agent is told to "follow CLAUDE.md" — but a real student wouldn't
always. After each lab, on one randomly-chosen exercise, instruct the
sub-agent to interpret the prompt slightly loosely (a reasonable misreading,
not adversarial). If the lab still works, good. If it falls over, log an
**ambiguous** defect — the lab is too brittle.

---

## Escape Hatch Handling

When a lab instructs to use `reference/labXX/`:
```bash
# Example for Lab 02:
cp /home/ssthakur/projects/claude-workshop-dryrun/reference/lab01/CLAUDE.md \
   /home/ssthakur/projects/claude-workshop-dryrun/CLAUDE.md
```

The `reference/` folder is included in `claude-workshop`, so it's available in the dry-run workspace.

---

## Build, Deploy, and Test (End of Relevant Labs)

When a lab completes a feature and instructs to build/deploy/test:
1. **Build backend**: Run `backend/build-jersey-service.sh` or equivalent
2. **Start services**: Use `./startHRlab.sh` or individual scripts
3. **Verify**: Use the verification steps from the lab
4. **Stop services**: Use `./stopHRlab.sh` when done

---

## Worklist: Labs 01-12

### Lab 01: CLAUDE.md — Your Enterprise Constitution
- [ ] **Exercise 1**: Spawn sub-agent with Region scaffolding prompt (no CLAUDE.md rules)
  - Observe: Jersey/*Resource? Hr* naming? HrApiResponse? HrLogHelper? AIHR_* tables? Read-only?
  - Log violations explicitly — these are your bad-path baseline
- [ ] **Exercise 2**: Spawn sub-agent to update CLAUDE.md with rules from Exercise 1 findings
  - Observe: Concise rules? Covers all gaps found in Exercise 1?
- [ ] **Exercise 3**: Spawn NEW sub-agent with SAME prompt as Exercise 1 (CLAUDE.md now has rules)
  - Observe: 0 convention violations? All checklist items pass?
- [ ] **Exercise 4**: Spawn sub-agent for reflection (CLAUDE.md critique)
  - Observe: Vague rules removed? Redundant rules removed?
- [ ] **Bad-Path/Good-Path comparison**: Did Exercise 3 resolve all violations from Exercise 1? Log to comparison entry.

### Lab 02: Planning Discipline
- [ ] Read lab02, spawn sub-agent for bad-path (no plan) exercise
- [ ] Spawn sub-agent for good-path (plan-first) exercise
- [ ] Spawn sub-agent for compare-and-encode exercise
- [ ] When lab says to use escape hatch: `cp reference/lab01/CLAUDE.md ./CLAUDE.md`
- [ ] **Bad-Path/Good-Path comparison**: Did the planned approach resolve issues from the unplanned approach? Log.

### Lab 03: Skills & Reusable Workflows
- [ ] Spawn sub-agent for manual scaffold baseline
- [ ] Spawn sub-agent for skill creation
- [ ] Spawn sub-agent for skill use in fresh session
- [ ] Spawn sub-agent for run-tests skill
- [ ] Spawn sub-agent for AGENTS/CLAUDE.md update
- [ ] Observe: Skill file created? Reusable? Out-of-scope section present? Follows patterns?

### Lab 04: Context Management
- [ ] Spawn sub-agent for fill-context exercise (bad path)
- [ ] Spawn sub-agent for fresh-session reset exercise (good path)
- [ ] Spawn sub-agent for bounded research delegation
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Did the sub-agent **feel** the degradation curve, or just check boxes? This is a pedagogy-critical lab.
- [ ] **Bad-Path/Good-Path comparison**: Did the fresh session restore quality? Log.

### Lab 05: Hooks — Truthful Guardrails
- [ ] Spawn sub-agent for hooks exercise (now expanded for Claude Code)
- [ ] Observe: Hook warning visible? Cleanup path works? Settings.json hook schema correct?

### Lab 06: Subagents / Delegated Review
- [ ] Spawn sub-agent for build component + self-review (bad path)
- [ ] Spawn sub-agent for fresh-context reviewer (good path) — reviewer must be a NEW sub-agent
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Did fresh-context review find more issues than self-review? Log finding counts explicitly.
- [ ] **Bad-Path/Good-Path comparison**: Did fresh-context review surface issues self-review missed? Log.

### Lab 07: Parallel Sessions & Isolated Workspaces
- [ ] Spawn sub-agent for worktree creation
- [ ] Spawn TWO sub-agents in parallel (DepartmentsPage / JobsPage)
- [ ] Spawn sub-agent for validation and copy-back
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Are the two sessions truly isolated? Any cross-contamination?

### Lab 08: Verification Loops
- [ ] Spawn sub-agent for backend TDD exercise
- [ ] Spawn sub-agent for browser verification loop
- [ ] Spawn sub-agent to articulate the full loop
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] When lab says escape hatch: review `reference/lab08/README.md`
- [ ] **Bad-Path/Good-Path comparison**: Did the verification loop catch issues that "looks right" missed? Log.

### Lab 09: MCP Servers — Playwright & Browser Verification
- [ ] Spawn sub-agent for MCP config exercise
- [ ] Spawn sub-agent for live page verification (login as steven.king, KPI cards, console)
- [ ] Observe: Browser tooling works? Visual inspection? Session restart picked up MCP config?

### Lab 10: Data Verification
- [ ] Spawn sub-agent for DB workflow + smoke test
- [ ] Spawn sub-agent for analytics queries + integrity checks
- [ ] Spawn sub-agent for full hire operation + cross-table verification
- [ ] Spawn sub-agent for full-loop articulation
- [ ] Observe: UI/API/DB three-layer cross-check working? RUN_TAG idempotency understood?

### Lab 11: Enterprise Governance
- [ ] Spawn sub-agent for rollout recommendation
- [ ] Spawn sub-agent for evidence checklist
- [ ] Spawn sub-agent for review model
- [ ] Spawn sub-agent for safety posture configuration (Claude Code permissions, not Codex approval_policy)
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Are the artifacts realistic? Would a real enterprise pilot stand on this?

### Lab 12: Optional Capstone
- [ ] Run all 7 phases as separate sub-agents (each phase = fresh context)
- [ ] Phase 1: PM Brief To Design (no code)
- [ ] Phase 2: Backend Contract
- [ ] Phase 3: Backend Access Control
- [ ] Phase 4: Frontend Data Hook
- [ ] Phase 5: Frontend Page Shell
- [ ] Phase 6: Route And Navigation Wiring
- [ ] Phase 7: Final Audit
- [ ] When lab says escape hatch: use `reference/lab12/`
- [ ] Observe: Did the phase-gate discipline hold? Did each phase produce its review-assist artifact? Did JFR/HAR analysis happen in Phase 7?

---

## Final Report

After all labs complete, produce `docs/dryrun-summary.md` with these sections:

### 1. Per-Lab Status
Table with one row per lab:

| Lab | Status | Defect counts (B/M/m/n) | Time variance | Notes |
|-----|--------|--------------------------|---------------|-------|

Status = pass / partial / fail
Defect counts = blocker / major / minor / nit

### 2. Top 10 Defects by Severity
Pull the highest-severity rows from `dryrun-defect-log.md`. For each:
- Lab and exercise location
- Severity and type
- One-paragraph explanation
- Recommended fix

### 3. Pedagogy Gaps (most important section)
Every defect with type `pedagogy-gap`, regardless of severity. These are
the defects that would silently fail real students. Discuss each in
detail; these get prioritized over broken-but-obvious defects.

### 4. Bad-Path / Good-Path Findings
For each of Labs 01, 02, 04, 06, 08: did the contrast that drives the
lesson actually land? If not, the lab needs structural revision, not
just a step fix.

### 5. Time Variance Summary
Which exercises ran significantly over estimated duration? Group by
likely cause (ambiguous prompt, implicit dependency, missing setup).

### 6. Recommended Changes Ranked by Leverage
Three tiers:

- **Ship-blockers** — must fix before next student-facing release
- **Strong-adds** — substantial improvement to learning outcome
- **Nice-to-have** — polish, clarity, friction reduction

Each recommendation should reference the defect log row(s) it addresses.

### 7. Meta-Observations
Free-form. What patterns emerged across labs? Are there systemic issues
(e.g., every lab assumes a step that should be in setup)? Anything the
maintainer should know that doesn't fit the structured sections?

---

## Key Principle

**Each exercise = new sub-agent = fresh context.**

This simulates the student "exiting Claude Code and re-opening" between exercises. Never reuse a sub-agent for the next exercise — always spawn a new one.

The mechanical isolation produces clean trials. The evaluation framework
turns those trials into a defect queue you can actually act on.

# Dry-Run Lab Simulation — Instructor Mechanism (v1.2)

**Purpose:** Document the dry-run simulation mechanism so it can be invoked by name in future sessions.

When the user prompts with `dryrunlab.md`, read `claudelabprompt.md` first for full context, then follow this mechanism.

**This is the v1.2 version.** It covers the v1.2 curriculum: 13 labs (was 12), with a new Lab 06 (Bad-Agent Recovery) inserted, an expanded Lab 05 (Hooks), and v1.1's Labs 06–12 renumbered to Labs 07–13.

---

## Overview

Simulate a student going through all 13 labs by:
1. Acting as the **instructor** (orchestrator)
2. Spawning **sub-agents** to play the student role (each exercise = fresh sub-agent)
3. Observing outputs against a structured evaluation framework
4. Logging defects, comparing bad-path vs. good-path runs, and producing an actionable final report

The goal is **not** to confirm the labs work. It is to **find the places they don't**, surface pedagogy gaps, and produce a triage queue the maintainer can act on.

**v1.2 sub-agent budget note:** the v1.2 curriculum spawns ~15 more sub-agents per pass than v1.1, almost entirely concentrated in the expanded Lab 05 (~10 sub-agents) and the new Lab 06 (~5–6 sub-agents). Budget time and cost accordingly.

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

### Step 4: v1.2 Pre-flight Checks (NEW)

Run these once before any lab work begins. They confirm the v1.2-specific dependencies are present and the reference solution is healthy.

```bash
# v1.2 pre-flight (run once before Lab 05)
command -v jq >/dev/null || { echo "jq missing — required by Lab 05 hook tests"; exit 1; }
command -v pandoc >/dev/null  # optional, only needed if HTML rebuild is in scope

# Frontend deps for Lab 05 Exercise 3 (PostToolUse eslint hook)
(cd /home/ssthakur/projects/claude-workshop-dryrun/frontend && [ -d node_modules ] || npm install)

# v1.2 reference-solution smoke verification (run once)
cd /home/ssthakur/projects/claude-workshop-dryrun
SETTINGS_FILE=reference/lab05/settings-final.json bash maintainer-tools/claude-hook-smoke-test.sh all
# expect: 7 PASS lines (java-naming, dangerous-bash-block, dangerous-bash-pass,
# frontend-lint, prompt-inject, subagent-stop, notification)
```

If the smoke test produces any FAIL line, log it as a **blocker against the reference solution** — not against any specific lab. Fix the reference solution before proceeding with the dry-run.

### Step 5: Initialize Defect Log and Summary Files
```bash
mkdir -p docs
touch docs/dryrun-defect-log.md
touch docs/dryrun-summary.md
```

Seed the defect log with a header:

```markdown
# Dry-Run Defect Log (v1.2)

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

For Labs 01, 02, 04, 06, 07, 09 (note: list updated for v1.2 — see below) —
the lab's value comes from the **delta** between the bad-path run and the
good-path run. After the good-path exercise, write a comparison entry in
the defect log notes:

- Bad-path failures observed: [explicit list]
- Good-path: did all bad-path failures resolve? [yes / no / partial]
- If partial or no, the lab failed to teach its core lesson — log as
  **blocker** under type **pedagogy-gap**.

This check catches the failure mode where each run individually "looks
fine" but the contrast that drives the lesson never lands.

**v1.2 update on the lab list:** v1.1's Labs 01, 02, 04, 06, 08 are now
01, 02, 04, 07, 09 (the v1.1 06 is now 07; the v1.1 08 is now 09). The
new Lab 06 (Bad-Agent Recovery) is itself a bad-path/good-path lab.
Final v1.2 list: **Labs 01, 02, 04, 06, 07, 09**.

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

### 7. Drift-Recognition Check (v1.2 — Lab 06 only)

After Lab 06 Exercise 1, score the Drift Inventory the sub-agent produces
against the five planted drift moments in
`reference/lab06/transcript-annotated.md`:

- **5 of 5 caught** — excellent
- **4 of 5 caught** — passing (lab's stated success bar)
- **≤ 3 of 5 caught** — log a **major pedagogy-gap** defect; the
  transcript is too subtle or the lab prompt did not direct attention
  well enough

The five planted moments are:
1. Invented `RegionService` architecture (around L9)
2. Hallucinated `AIHR_REGIONS_V2` table (L11)
3. Scope creep into `HrJobResource.java` (L14)
4. Context-fill thrash from five unrelated reads (L17–L23)
5. Self-contradiction late in the session under context pressure (L65 vs L93)

### 8. Hook-Coverage Check (v1.2 — Lab 05 only)

After Lab 05 Exercise 8, verify `.claude/settings.json` was at some point
during the lab populated with all six hook event types:
- PreToolUse
- PostToolUse
- UserPromptSubmit
- Stop
- SubagentStop
- Notification

Use `git log -p .claude/settings.json` against the dry-run workspace to
confirm. If any event type was skipped, log a **major** defect — the
lab failed to walk the full hook surface.

---

## Escape Hatch Handling

When a lab instructs to use `reference/labXX/`:
```bash
# Example for Lab 02:
cp /home/ssthakur/projects/claude-workshop-dryrun/reference/lab01/CLAUDE.md \
   /home/ssthakur/projects/claude-workshop-dryrun/CLAUDE.md
```

The `reference/` folder is included in `claude-workshop`, so it's available in the dry-run workspace.

**v1.2 reference paths (final):**

| Path | Purpose |
|---|---|
| `reference/lab01/` | starter and fuller `CLAUDE.md` plus the Region backend slice |
| `reference/lab02/` | completed `hireEmployee()` snippet for the shared employee command repository |
| `reference/lab03/` | completed Country/Location backend slices plus cumulative resource wiring guidance |
| `reference/lab05/` | **NEW in v1.2** — layered `.claude/settings.json` with all six hook events wired correctly |
| `reference/lab06/` | **NEW in v1.2** — annotated transcript + strong-redirect prompt rewrites for Bad-Agent Recovery |
| `reference/lab08/` | (was `reference/lab07/`) completed Departments/Jobs frontend pages plus shell wiring |
| `reference/lab09/` | (was `reference/lab08/`) completed `promoteEmployee()` snippet |
| `reference/lab13/` | (was `reference/lab12/`) completed Assessments directory page plus router/sidebar wiring |

No `reference/lab04/`, `reference/lab07/`, `reference/lab10/`, `reference/lab11/`, or `reference/lab12/` exist — those labs intentionally rely on prompt-reset guidance rather than file-copy rescue.

---

## Build, Deploy, and Test (End of Relevant Labs)

When a lab completes a feature and instructs to build/deploy/test:
1. **Build backend**: Run `backend/build-jersey-service.sh` or equivalent
2. **Start services**: Use `./startHRlab.sh` or individual scripts
3. **Verify**: Use the verification steps from the lab
4. **Stop services**: Use `./stopHRlab.sh` when done

---

## Worklist: Labs 01-13

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

### Lab 05: Hooks — Structural Guardrails (v1.2 expanded, 75 min)
- [ ] **Pre-flight**: confirm `jq` on PATH; confirm `frontend/node_modules/` exists or run `npm install` once
- [ ] **Pre-flight**: read `reference/lab05/settings-final.json` to know what the layered final state should look like
- [ ] **Exercise 1 (foundation, preserved)**: Spawn sub-agent to add the Java naming PreToolUse hook
  - Observe: hook in `.claude/settings.json` under PreToolUse with the expected statusMessage
  - After restart, spawn sub-agent to attempt creating `EmployeeRatingResource.java`; observe block
- [ ] **Exercise 2**: Spawn sub-agent to add the dangerous-bash PreToolUse hook
  - After restart, spawn sub-agent to attempt `rm -rf /`; observe exit-2 block + `BLOCKED` message
  - Spawn another sub-agent to run benign `ls /tmp`; observe pass (no false positive)
- [ ] **Exercise 3**: Spawn sub-agent to add the PostToolUse eslint hook
  - After restart, spawn sub-agent to make a small frontend edit; observe eslint runs and exit 0 (advisory)
  - Observe whether eslint modified the file behind the agent's back (the lesson)
- [ ] **Exercise 4**: Spawn sub-agent to add the one-line UserPromptSubmit injection
  - After restart, spawn sub-agent to ask "what backend port should I use?"; observe answer reflects the injected `18082` fact
  - Spawn sub-agent to expand injection to a paragraph; observe response style pollution after restart
  - Spawn sub-agent to revert to one-line form
- [ ] **Exercise 5**: Spawn sub-agent to add Stop and SubagentStop hooks
  - After restart, make a small uncommitted edit, exit Claude Code; observe Stop hook fires uncommitted-work warning
  - SubagentStop test may be skipped if the client does not surface delegated-agent events
- [ ] **Exercise 6**: Spawn sub-agent to add the Notification logging hook
  - After restart, trigger a notification (e.g., a permissions-prompted file read); observe `.claude/notification-log.local` appended
- [ ] **Exercise 7**: Spawn sub-agent to enumerate composed hooks; observe accurate event-by-event listing
  - The 8-row anti-pattern audit is a paper exercise; verify the sub-agent's rationales match the lab's rubric on at least 6 of 8 rows
- [ ] **Exercise 8**: Spawn sub-agent for cleanup
  - Observe: `.claude/settings.json` has no `"hooks"` key after this exercise
  - Observe: `CLAUDE.md` contains the `## Hooks (Structural Guardrails)` block
- [ ] **Hook-coverage check** (Evaluation Framework §8): verify all six hook events appeared in `.claude/settings.json` history via `git log -p .claude/settings.json`
- [ ] **Sub-agent budget**: ~10 sub-agents for this lab (highest in the curriculum)

### Lab 06: Bad-Agent Recovery (v1.2 NEW, 60 min)
- [ ] **Pre-flight**: confirm `lab-materials/docs/lab06-bad-agent-transcript.md` exists in the dry-run workspace
- [ ] **Exercise 1**: Spawn sub-agent to read the transcript and produce a Drift Inventory
  - Observe: Drift Inventory captures ≥ 4 of the 5 planted drift moments?
  - The five planted moments are: (1) invented RegionService at L9, (2) hallucinated AIHR_REGIONS_V2 at L11, (3) scope creep into HrJobResource at L14, (4) context-fill thrash from L17–L23 read list, (5) self-contradiction L65 vs L93
  - Apply **Drift-Recognition Check** (Evaluation Framework §7); if Drift Inventory found < 4, log a **major pedagogy-gap** defect
- [ ] **Exercise 2**: Spawn sub-agent for the plan-first Region prompt
  - Observe: did the sub-agent's drift-signal checklist catch any drift in its own plan output?
  - Observe: did the sub-agent name file paths and an explicit "do not implement until I confirm" before allowing implementation?
- [ ] **Exercise 3**: Spawn TWO sub-agents — Scenario A (polluted context) and Scenario B (one localized invention)
  - Observe Scenario A: did the redirect-from-thrashed-session attempt land cleanly, or did it inherit the polluted context?
  - Observe Scenario B: did the redirect on a clean-but-drifted plan succeed?
  - Expected lab outcome: A fails or partially succeeds; B succeeds. If both succeed, the lab failed to make the cost lens visible — log a **major pedagogy-gap** defect
  - Sequential sub-agents are fine; "parallel-conceptually" means each starts from fresh context
- [ ] **Exercise 4**: Spawn sub-agent to test one strong-redirect rewrite in a fresh session
  - Observe: did the rewrite include explicit stop verb + named file paths + contract restate + withhold-permission clause?
  - Observe: did the next plan from the agent no longer contain the drift the redirect was targeting?
- [ ] **Exercise 5**: Spawn sub-agent for the clean-restart Region scaffold
  - Observe: does the produced slice match the Lab 01 Exercise 3 checklist (Jersey/JDBC patterns, Hr* naming, HrApiResponse, HrLogHelper, AIHR_REGIONS, no service layer, no request DTO, no write endpoints)?
  - If yes, recovery actually recovered. If no, the lab's good-path failed.
- [ ] **Exercise 6**: Verify CLAUDE.md contains the `## Recovery Discipline` block after the run
- [ ] **Bad-Path/Good-Path comparison**: Did the recovery moves applied in Exercises 2–5 produce a better outcome than the bad transcript? Specifically: was the final Region slice cleaner than the bad transcript's final state? Log.
- [ ] **Sub-agent budget**: ~5–6 sub-agents for this lab (higher than typical)

### Lab 07: Delegated Review (renumbered from v1.1 Lab 06)
- [ ] Spawn sub-agent for build component + self-review (bad path)
- [ ] Spawn sub-agent for fresh-context reviewer (good path) — reviewer must be a NEW sub-agent
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Did fresh-context review find more issues than self-review? Log finding counts explicitly.
- [ ] **Bad-Path/Good-Path comparison**: Did fresh-context review surface issues self-review missed? Log.

### Lab 08: Parallel Sessions & Isolated Workspaces (renumbered from v1.1 Lab 07)
- [ ] Spawn sub-agent for worktree creation
- [ ] Spawn TWO sub-agents in parallel (DepartmentsPage / JobsPage)
- [ ] Spawn sub-agent for validation and copy-back
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Are the two sessions truly isolated? Any cross-contamination?
- [ ] When lab says escape hatch: review `reference/lab08/README.md` (was `reference/lab07/`)

### Lab 09: Verification Loops (renumbered from v1.1 Lab 08)
- [ ] Spawn sub-agent for backend TDD exercise
- [ ] Spawn sub-agent for browser verification loop
- [ ] Spawn sub-agent to articulate the full loop
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] When lab says escape hatch: review `reference/lab09/README.md` (was `reference/lab08/`)
- [ ] **Bad-Path/Good-Path comparison**: Did the verification loop catch issues that "looks right" missed? Log.

### Lab 10: MCP Servers — Playwright & Browser Verification (renumbered from v1.1 Lab 09)
- [ ] Spawn sub-agent for MCP config exercise
- [ ] Spawn sub-agent for live page verification (login as steven.king, KPI cards, console)
- [ ] Observe: Browser tooling works? Visual inspection? Session restart picked up MCP config?

### Lab 11: Data Verification (renumbered from v1.1 Lab 10)
- [ ] Spawn sub-agent for DB workflow + smoke test
- [ ] Spawn sub-agent for analytics queries + integrity checks
- [ ] Spawn sub-agent for full hire operation + cross-table verification
- [ ] Spawn sub-agent for full-loop articulation
- [ ] Observe: UI/API/DB three-layer cross-check working? RUN_TAG idempotency understood?

### Lab 12: Enterprise Governance (renumbered from v1.1 Lab 11)
- [ ] Spawn sub-agent for rollout recommendation
- [ ] Spawn sub-agent for evidence checklist
- [ ] Spawn sub-agent for review model
- [ ] Spawn sub-agent for safety posture configuration (Claude Code permissions, not Codex approval_policy)
- [ ] Spawn sub-agent for CLAUDE.md update
- [ ] Observe: Are the artifacts realistic? Would a real enterprise pilot stand on this?

### Lab 13: Optional Capstone (renumbered from v1.1 Lab 12)
- [ ] Run all 7 phases as separate sub-agents (each phase = fresh context)
- [ ] Phase 1: PM Brief To Design (no code)
- [ ] Phase 2: Backend Contract
- [ ] Phase 3: Backend Access Control
- [ ] Phase 4: Frontend Data Hook
- [ ] Phase 5: Frontend Page Shell
- [ ] Phase 6: Route And Navigation Wiring
- [ ] Phase 7: Final Audit
- [ ] When lab says escape hatch: use `reference/lab13/` (was `reference/lab12/`)
- [ ] Observe: Did the phase-gate discipline hold? Did each phase produce its review-assist artifact? Did JFR/HAR analysis happen in Phase 7?

---

## Final Report

After all labs complete, produce `docs/dryrun-summary.md` with these sections:

### 1. Per-Lab Status
Table with one row per lab (13 rows for v1.2):

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
For each of **Labs 01, 02, 04, 06, 07, 09**: did the contrast that drives
the lesson actually land? If not, the lab needs structural revision, not
just a step fix.

### 5. v1.2-Specific Findings (NEW)

Two sub-sections, both critical for the v1.2 release:

**5a. New Lab 06 (Bad-Agent Recovery) outcomes:**
- Drift-Recognition Check score (5/5, 4/5, ≤3/5) — and pedagogy implications
- Scenario A vs. Scenario B in Exercise 3: did the cost lens land?
- Did the four-part strong-redirect template produce visibly different agent behavior?
- Did the clean-restart Region slice in Exercise 5 actually conform to Lab 01 conventions?

**5b. Expanded Lab 05 (Hooks) outcomes:**
- Hook-Coverage Check: were all six event types exercised in the wired hooks?
- Did the PostToolUse "behind-the-back" effect actually become visible to the sub-agent in Exercise 3?
- Did the UserPromptSubmit overreach in Exercise 4 produce visible response-style pollution?
- Did Exercise 7's anti-pattern audit produce defensible rationales (≥6 of 8 rows)?
- Did Exercise 8 cleanup leave `.claude/settings.json` in a clean baseline state?

### 6. Time Variance Summary
Which exercises ran significantly over estimated duration? Group by
likely cause (ambiguous prompt, implicit dependency, missing setup).

For v1.2 specifically, watch for:
- Lab 05 running long because of the ~10 sub-agent restart overhead — this may be expected, not a defect
- Lab 06 Exercise 1 running long if the sub-agent is over-thorough on the transcript — note as observation, not necessarily a defect
- Lab 13 phase-gate discipline naturally takes longer than v1.1 Lab 12 because of explicit handoff stops

### 7. Recommended Changes Ranked by Leverage
Three tiers:

- **Ship-blockers** — must fix before next student-facing release
- **Strong-adds** — substantial improvement to learning outcome
- **Nice-to-have** — polish, clarity, friction reduction

Each recommendation should reference the defect log row(s) it addresses.

### 8. Meta-Observations
Free-form. What patterns emerged across labs? Are there systemic issues
(e.g., every lab assumes a step that should be in setup)? Anything the
maintainer should know that doesn't fit the structured sections?

For v1.2: did the curriculum's ambition (recovery + full hooks) feel
proportionate to the time budget? Or do Labs 05 and 06 together feel
over-stuffed in Day 1?

---

## Key Principle

**Each exercise = new sub-agent = fresh context.**

This simulates the student "exiting Claude Code and re-opening" between exercises. Never reuse a sub-agent for the next exercise — always spawn a new one.

The mechanical isolation produces clean trials. The evaluation framework
turns those trials into a defect queue you can actually act on.

---

## v1.2 Summary of Changes from v1.1

For maintainer reference, the deltas in this prompt vs. `dryrunlabv1prompt.md`:

- **Step 4 (NEW):** v1.2 pre-flight checks — `jq`, `npm install` for frontend, reference-solution smoke test
- **Step 5 renumbered** (was Step 4 in v1.1): defect log seeding
- **Evaluation Framework §7 (NEW):** Drift-Recognition Check for Lab 06
- **Evaluation Framework §8 (NEW):** Hook-Coverage Check for Lab 05
- **Evaluation Framework §3:** bad-path/good-path lab list updated to **Labs 01, 02, 04, 06, 07, 09** (was 01, 02, 04, 06, 08)
- **Escape Hatch table:** added `reference/lab05/` and `reference/lab06/`; renumbered v1.1's lab07/08/12 → lab08/09/13
- **Worklist:** new Lab 06 entry inserted; v1.1 Labs 06–12 renumbered to 07–13; Lab 05 worklist substantially expanded for the 8-exercise version
- **Final Report §5 (NEW):** v1.2-Specific Findings — sub-sections for Lab 06 outcomes and Lab 05 outcomes
- **Final Report §6 expanded:** v1.2-specific time variance watchpoints (Lab 05 restart overhead, Lab 06 transcript depth, Lab 13 phase-gate stops)

The mechanical setup, sub-agent isolation rule, and core evaluation framework structure carry over from v1.1 unchanged.

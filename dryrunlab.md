# Dry-Run Lab Simulation — Instructor Mechanism

**Purpose:** Document the dry-run simulation mechanism so it can be invoked by name in future sessions.

When the user prompts with `dryrunlab.md`, read `claudelabprompt.md` first for full context, then follow this mechanism.

---

## Overview

Simulate a student going through all 12 labs by:
1. Acting as the **instructor** (orchestrator)
2. Spawning **sub-agents** to play the student role (each exercise = fresh sub-agent)
3. Observing outputs, commenting on gaps, and launching the next exercise

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

---

## Per-Lab Workflow

### For Each Exercise in a Lab:

1. **Read the lab file** (`lab-materials/claudelabXX.md`) to understand the exercise
2. **Spawn a sub-agent** with the exact exercise prompt from the lab
   - Sub-agent works in: `/home/ssthakur/projects/claude-workshop-dryrun`
   - Sub-agent gets fresh context (simulates student "exit and re-open")
3. **Observe the output** against the lab's checklist/expected behavior
4. **Comment** on gaps, mistakes, or successes
5. **When lab says "Exit and resume"** → spawn a NEW sub-agent (fresh context)
6. **When lab says to use escape hatch** → copy from `reference/labXX/` to dry-run workspace, then continue

### Key Rules for Sub-Agents:
- Each exercise = ONE sub-agent (fresh context)
- Sub-agent MUST work in `claude-workshop-dryrun` (never `hrclaudelab`)
- Give the sub-agent the EXACT prompt from the lab chapter
- Do NOT give the sub-agent access to `hrclaudelab` or `maintainer-tools/`
- The sub-agent should follow `CLAUDE.md` in the dry-run workspace

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
- [ ] **Exercise 2**: Spawn sub-agent to update CLAUDE.md with rules from Exercise 1 findings
  - Observe: Concise rules? Covers all gaps found in Exercise 1?
- [ ] **Exercise 3**: Spawn NEW sub-agent with SAME prompt as Exercise 1 (CLAUDE.md now has rules)
  - Observe: 0 convention violations? All checklist items pass?
- [ ] **Exercise 4**: Spawn sub-agent for reflection (CLAUDE.md critique)
  - Observe: Vague rules removed? Redundant rules removed?

### Lab 02: Planning Discipline
- [ ] Read lab02, spawn sub-agent for planning exercise
- [ ] Observe: Does agent plan before coding? Follows planning discipline?
- [ ] When lab says to use escape hatch: `cp reference/lab01/CLAUDE.md ./CLAUDE.md`

### Lab 03: Skills & Reusable Workflows
- [ ] Spawn sub-agent for skill creation exercise
- [ ] Observe: Skill file created? Reusable? Follows patterns?

### Lab 04: Context Management
- [ ] Spawn sub-agent for context management exercise
- [ ] Observe: Agent selects right files? Stays focused?

### Lab 05: Hooks — Truthful Guardrails
- [ ] Spawn sub-agent for hooks exercise
- [ ] Observe: Hook warning visible? Cleanup path works?

### Lab 06: Subagents — Isolated Specialist Workers
- [ ] Spawn sub-agent for sub-agent exercise
- [ ] Observe: Uses delegated builders/reviewers? Fresh context review?

### Lab 07: Parallel Sessions & Isolated Workspaces
- [ ] Spawn sub-agent for parallel sessions exercise
- [ ] Observe: Separate workspaces? Safe parallel work?

### Lab 08: Verification Loops
- [ ] Spawn sub-agent for verification exercise
- [ ] When lab says escape hatch: review `reference/lab08/README.md`
- [ ] Observe: Tests pass? Runtime checks? Visual verification?

### Lab 09: MCP Servers — Playwright & Browser Verification
- [ ] Spawn sub-agent for MCP/Playwright exercise
- [ ] Observe: Browser tooling works? Visual inspection?

### Lab 10: Data Verification
- [ ] Spawn sub-agent for data verification exercise
- [ ] Observe: UI/API connected to database? Runtime data checks?

### Lab 11: Enterprise Governance
- [ ] Spawn sub-agent for governance exercise
- [ ] Observe: Rollout readiness? Safety posture? Evidence gathered?

### Lab 12: Optional Capstone
- [ ] Spawn sub-agent for capstone exercise
- [ ] When lab says escape hatch: use `reference/lab12/`
- [ ] Observe: Full workflow (planning → context → implementation → review → verification)?

---

## Completion

After all labs:
1. Verify escape hatches were followed correctly
2. Confirm build/deploy/test steps completed as instructed
3. Report summary: which labs passed cleanly, which had issues, any gaps found

---

## Key Principle

**Each exercise = new sub-agent = fresh context**

This simulates the student "exiting Claude Code and re-opening" between exercises. Never reuse a sub-agent for the next exercise — always spawn a new one.

# v1.2 Enrichment Prompt — Adding Tier 1 Labs

**Run from:** the Claude-ported VM repo (e.g. `/home/ssthakur/projects/claude-workshop`)
**Prerequisite:** v1.1 has passed dry-run validation. Defects from `dryrun-defect-log.md` have been addressed.
**Purpose:** Add two new high-leverage labs (Bad-Agent Recovery + expanded Hooks) without disturbing the rest of the curriculum, and produce the materials needed to validate the result.

---

## What this prompt does

Adds two new labs to the workshop:

1. **NEW: Recovering from a Bad Agent Run** — the single most-asked-about topic in real-world Claude Code adoption, currently absent from the curriculum
2. **EXPANDED: Lab 05 (Hooks)** — currently small because Codex hooks were experimental; Claude Code hooks are mature and warrant a full-size lab

Phased so each step has a stop-and-review checkpoint. The pedagogy of existing labs is the model — match it precisely.

---

## The prompt to paste into Claude Code

Copy everything between the lines below and paste it as a single message to Claude Code. Use Sonnet, not Haiku.

---

You are adding two new labs to this workshop. The pedagogical style, structure, and discipline of the existing labs is the model — match it precisely. Do not deviate from the workshop's voice, formatting conventions, or pedagogical patterns.

# Source material to study before writing

Before writing anything, read these existing labs in full to internalize style, structure, depth, and tone:

- `lab-materials/claudelab01.md` (CLAUDE.md / Constitution — bad-path/good-path structure)
- `lab-materials/claudelab04.md` (Context Management — visceral teaching of degradation)
- `lab-materials/claudelab06.md` (Delegated Review — empirical measurement)
- `lab-materials/claudelab08.md` (Verification Loops — three-layer pattern)
- `lab-materials/claudelab11.md` (Enterprise Governance — leader-voice writing)
- `lab-materials/claudelab-reference.md` (do/don't card)
- `CLAUDE.md` (project constitution — to understand conventions)
- `docs/v1.2-enrichment-plan.md` if present (notes from prior planning; ignore if absent)

Note especially:
- The bad-path-then-good-path structure used in Labs 01, 02, 04, 06, 08
- The compounding rule loop: every lab adds a section to CLAUDE.md
- Out-of-scope sections to bound the agent
- The escape-hatch / `reference/` pattern
- Estimated duration block at top
- Exercise structure with explicit observations
- Hands-on, not abstract — every concept must be felt, not just read

# What to build

## NEW LAB: Recovering from a bad agent run

This lab teaches what to do when the agent goes off-track. It is the single most-asked-about topic in real-world Claude Code adoption and is absent from the current curriculum.

Required structure:

- Estimated duration: 60 minutes
- Bad-path/good-path structure: student first watches a session go wrong without intervention, then learns recovery moves
- 4-5 exercises covering:
  1. Spotting drift early (reading the plan, recognizing scope creep, watching for hallucinated APIs/schemas/files)
  2. The escape hatch: when to interrupt, what signals warrant it
  3. Surgical correction vs. full restart: decision criteria
  4. Writing redirect prompts that work (specific patterns, common mistakes)
  5. Salvaging good work from a bad run (what to keep, what to discard, how to extract context for the next attempt)
- Empirical exercise: present the student with a deliberately bad agent run (write the simulated transcript) and have them practice recovery on it
- Compounding rule: add "Recovery Discipline" section to CLAUDE.md
- Out-of-scope: prompt engineering basics (covered separately if at all); context management (Lab 04 covers this)
- Reference solution in `reference/<lab-number>/`

## EXPANDED LAB: Lab 05 (Hooks)

The current Lab 05 is intentionally small (Codex hooks were experimental). Claude Code hooks are mature. Expand the lab while keeping its existing exercise as the foundation.

Required additions:

- Cover all hook types: PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, Notification
- One exercise per hook category, building progressively
- Real validation pipelines, not just naming-violation warnings:
  - PreToolUse hook that blocks dangerous bash commands
  - PostToolUse hook that runs lint/format after edits
  - UserPromptSubmit hook that injects project context
  - Stop hook that checks for uncommitted work
- Exit code semantics (0 / 2 / other) and how Claude Code reacts to each
- Hook composition: multiple hooks on the same event
- When NOT to use hooks: discuss anti-patterns
- Compounding rule: extend "Hooks" or "Guardrails" section in CLAUDE.md
- Estimated duration: 75 minutes (up from 25)
- Reference solution in `reference/lab05/`

# Phasing

## Phase 1 — Plan only, no edits

Produce `docs/v1.2-enrichment-worklist.md` with:

- **Lab numbering decision**: propose two options:
  - Option A: insert as Lab 5.5 (least disruption, awkward number)
  - Option B: renumber existing 06-12 → 07-13 (cleaner, more cross-reference updates)
  - Recommend one; list every file that needs updating under each option.
- **Per-lab outline**: every exercise listed with goal, mechanic, expected observations, planning artifacts produced, CLAUDE.md additions
- **File-level change list**: all new files to create, all existing files to update (lab files, CLAUDE.md, README, student-workspace-guide.md, reference/, html docs)
- **Risks and open questions**

Stop after Phase 1. Wait for explicit approval before Phase 2.

## Phase 2 — Write the new bad-agent-recovery lab

Only after Phase 1 approved. Produce:
- The lab file matching existing voice and structure
- The simulated bad-agent transcript artifact (separate file under `lab-materials/` or wherever fits)
- The reference solution in `reference/<lab-number>/`

Stop after Phase 2. Wait for approval before Phase 3.

## Phase 3 — Expand Lab 05 (Hooks)

Only after Phase 2 approved. Rewrite Lab 05 keeping the existing exercise as foundation. Add new exercises in progressive order. Update reference solution.

Stop after Phase 3. Wait for approval before Phase 4.

## Phase 4 — Update surrounding materials

Only after Phase 3 approved.
- README curriculum section
- `lab-materials/student-workspace-guide.md` chapter map
- `lab-materials/claudelab-reference.md` (do/don't card additions for both new labs)
- Any cross-references in other labs that should now mention the new lab
- `docs/v1.2-release-notes.md` draft

Stop after Phase 4. Wait for approval before Phase 5.

## Phase 5 — Rebuild HTML docs

Only after Phase 4 approved. Run `maintainer-tools/build-html-docs.sh`. Verify all HTML files regenerate cleanly.

## Phase 6 — Produce the v1.2 dry-run prep bundle

This is the critical phase for downstream validation. Produce a single file at `docs/v1.2-dryrun-bundle.md` containing everything needed to update the dry-run prompt for v1.2. The bundle must include:

### A. Final lab numbering and full lab list
The complete list of all labs in v1.2 with their final numbers and titles, in the order they appear. If any labs were renumbered, show before/after mapping.

### B. New lab: Bad-Agent Recovery — full spec
- Final lab number and title
- Estimated duration
- Concepts/features taught
- Planning artifacts students must produce
- Phase/exercise structure with each exercise's goal
- Out-of-scope statement
- Bad-path/good-path structure (if applicable)
- Verification requirements
- Success criteria
- Path to reference solution
- Any setup steps a dry-run would need beyond what already exists

### C. Expanded lab: Hooks — full spec
- Final lab number and title (likely unchanged)
- New estimated duration
- All concepts taught (full list, including new additions)
- All exercises listed with each exercise's goal
- Hook types covered (PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, Notification)
- Out-of-scope statement
- Verification requirements (including hook smoke-test command)
- Success criteria
- Path to reference solution
- Any new dependencies or setup steps a dry-run would need

### D. Cross-lab impact
- Did any other labs get cross-references updated?
- Did the compounding-rule sequence in CLAUDE.md change?
- Any new escape-hatch reference solutions added?
- Any changes to setup/teardown scripts?

### E. New pedagogical patterns introduced
If the new labs introduce any patterns not present in v1.1 (recovery discipline, hook composition, etc.), describe each:
- Pattern name
- Which lab/exercise uses it
- 2-3 sentence description

### F. Dry-run worklist deltas
Explicit instructions for updating the v1.1 dry-run prompt to v1.2:
- Which entries in the per-lab worklist need adding
- Which entries need modifying (Lab 05 expansion)
- Any new bad-path/good-path comparison checkpoints
- Any new sub-agent isolation considerations (e.g., the recovery lab may require multiple sub-agents per exercise to simulate the bad run + recovery attempt)

Be exhaustive. The downstream consumer will use this bundle to write a fresh v1.2 dry-run prompt without re-reading the lab files.

# Working rules

- One phase per turn. Stop after each, summarize, wait for "proceed."
- Match the existing labs' voice and structure precisely. The workshop has a distinctive style; new labs must feel native, not bolted on.
- Hands-on every time. No theory section without an immediate exercise that makes it concrete.
- Every lab ends with a CLAUDE.md update — preserve the compounding rule loop pattern.
- Every new exercise spec must specify: what to observe, what counts as success, what counts as a defect.
- If anything is ambiguous, surface it for decision rather than guessing.

---

## What you'll have when this finishes

1. Two new/expanded labs integrated cleanly into the workshop
2. Updated surrounding materials (README, student guide, reference card, release notes)
3. Regenerated HTML docs
4. **`docs/v1.2-dryrun-bundle.md`** — the input file you'll bring back to produce the v1.2 dry-run prompt

When all phases pass, share `v1.2-dryrun-bundle.md` to generate the v1.2 dry-run prompt.

---

## Notes for running this

- **Phase 1 is the most important checkpoint.** Read the proposed lab outlines carefully before approving Phase 2. If the bad-agent-recovery outline doesn't read as obviously useful to a real student, push back and have it rewritten.
- **The numbering decision matters.** Option B (renumber) is cleaner but more work. Option A (Lab 5.5) is faster but awkward in a TOC. Make Claude Code lay out both and pick deliberately.
- **Don't skip the persona realism check during Phase 2.** When Claude Code writes the simulated bad-agent transcript, verify it reads like a *plausible* bad run — not a strawman. The empirical exercise only works if the bad run is realistic.
- **Phase 6 is non-negotiable.** Without the bundle, the v1.2 dry-run prompt has to be reconstructed from re-reading the labs, which wastes a session.

Realistic timeline:
- Phase 1: 30-45 min Claude Code work, plus your review
- Phase 2: 1-2 hours Claude Code work (the lab + transcript), plus your review
- Phase 3: 1-1.5 hours Claude Code work, plus your review
- Phase 4: 30-45 min
- Phase 5: 5-10 min
- Phase 6: 30 min

Two focused evenings, plus the dry-run on a third.

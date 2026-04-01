# Lab Builder — Reproducible Prompt for Generating Training Labs

## Purpose

This document is a **meta-prompt and recipe**. Give it to a fresh Claude Code session along with access to a codebase and build notes, and it can generate a complete training workshop — labs, decks, instructor guides — following the same structure and pedagogy as this workshop.

---

## How to Use This

### Prerequisites
1. A **built application** with working code across multiple layers (backend, frontend, database)
2. **Build notes** documenting how the app was built — specifically:
   - What Claude Code techniques were used (Plan Mode, Skills, Hooks, etc.)
   - What failed first and how it was fixed
   - What CLAUDE.md rules were added and why
3. **CLAUDE.md** from the project (demonstrates the conventions)
4. **Research references** on Claude Code best practices (optional — this doc includes the key principles)

### The Prompt

Copy-paste this into a new Claude Code session:

```
Read these files for full context:
- @docs/training/lab-builder-prompt.md (this recipe — follow it exactly)
- @CLAUDE.md (project conventions)
- @docs/training/index.md (reference training structure)

Then read ALL build notes in docs/claudetips/build-notes/ to understand:
- What techniques were used to build each feature
- What failed first and how it was fixed
- What rules were added to CLAUDE.md

Your task: Generate a complete training workshop following the lab-builder-prompt recipe.
The output should be:
1. An index.md with workshop overview and lab links
2. 10-12 lab exercise files (one per lab)
3. Presentation deck outlines with speaker notes (one per lecture)
4. An instructor flow guide with pacing, blockers, and recovery strategies

Use the build notes as your source material. Each build note's "What Failed First"
becomes a lab exercise's failure-first moment. Each build note's "Key Teaching Points"
become the deck's slides.
```

---

## The Recipe

### Step 1: Analyze the Codebase and Build Notes

Read:
- The project's CLAUDE.md — what conventions exist
- All build notes — extract the technique, the failure, the fix, the teaching point
- The app structure — what layers exist (backend, frontend, database, etc.)

**Create a feature-to-technique map:**

| Feature Built | Claude Code Technique | "What Failed First" | Teaching Point |
|--------------|----------------------|---------------------|----------------|
| Entity scaffolding | Skills | Manual = 10 prompts, skill = 1 | Skills compound engineering |
| Complex service | Plan Mode | Skipped job_history without plan | Planning surfaces implicit requirements |
| Schema protection | Hooks (PreToolUse) | Claude edited schema.sql | Hooks = structural enforcement |
| ... | ... | ... | ... |

This map becomes the lab outline.

### Step 2: Design the Lab Sequence

**Principles:**
1. **Phase 1 (Foundation):** CLAUDE.md, Plan Mode, Skills/Commands, Context Management
2. **Phase 2 (Productivity):** Hooks, Subagents, Parallel Sessions, Verification
3. **Phase 3 (Mastery):** MCP, Thinking Modes, CI/CD, Capstone

**Rules:**
- Each lab teaches ONE primary Claude Code feature
- Each lab has a deliberate failure moment (the "aha")
- Each lab ends with the self-improvement coda (encode in CLAUDE.md)
- Later labs reference skills learned in earlier labs (cumulative arc)
- The capstone uses ALL techniques together

### Step 3: Write Each Lab

**Every lab follows this structure:**

```markdown
# Lab N: [Feature Name] — [Subtitle]

**Duration:** X minutes
**Day:** N — [Theme]
**Checkpoint Branch:** checkpoint/dayN-start
**Builds On:** Labs [prerequisites]
**Produces:** [Tangible artifact]

---

## Learning Objective
[One paragraph: what the student will experience and understand]

## The Key Concept
[Feature explanation with table/diagram — what it is, why it matters]
[Include: when to use, when not to use, enterprise relevance]

## Setup
[Git checkout, verify prerequisites]

## Exercise 1: The Failure (observe the problem)
[Student does the task WITHOUT the technique → sees predictable failure]
[Checklist of what to look for]

## Exercise 2: The Solution (apply the technique)
[Student uses the technique → problem solved]
[Step-by-step with exact prompts shown as guidance]

## Exercise 3: Verify (prove it works)
[Student runs the same task again → confirms the technique works]

## Exercise 4: The Self-Improvement Coda
[Student adds a rule to CLAUDE.md encoding the lesson]

## Success Criteria
[Checklist — 4-5 observable outcomes]

## Key Takeaways
[3-5 bullet points — the lasting insights]

<details>
<summary>Escape Hatch — Click if stuck</summary>
[Exact solution — prompts, config, code — for students blocked >5 min]
</details>
```

### Step 4: Write Each Deck

**Every deck follows this structure:**

```markdown
# Deck N: [Title]

**Duration:** X minutes | **Lab:** Lab N

## Slide 1: [Hook — the problem or concept]
[Content]
> **Speaker notes:** [What to say, what to emphasize]

## Slide 2-5: [Key concepts, tables, diagrams]
[Content]
> **Speaker notes:** [Teaching strategy, what to demo live]

## Slide N: Your Turn — Lab N
[Quick summary of what students will do]
[Time. Go.]
```

**Deck rules:**
- Max 7-9 slides per deck
- Every slide has speaker notes
- At least one live demo per deck (instructor does it, students watch)
- Last slide always transitions to the lab

### Step 5: Write the Instructor Flow Guide

**Structure:**
- Day-by-day schedule with times
- Instructor notes per lab (what to watch for, the "aha" moment to not rush)
- Common blockers per day with recovery steps
- Post-workshop follow-up suggestions

### Step 6: Write the Index

**Structure:**
- Workshop overview (audience, duration, theme)
- Three core truths (context, planning, simplicity)
- Mindset shift table (from/to)
- Git checkpoint branches
- Links to all labs and decks
- The self-improvement loop explanation

---

## Key Pedagogical Principles

These MUST be followed in every lab:

### 1. Failure-First Pedagogy
Every lab starts by deliberately triggering the problem the technique solves. Students experience the pain before learning the cure. This creates motivation and makes the solution stick.

### 2. The Self-Improvement Loop (Every Lab)
Every lab ends with:
1. What went wrong?
2. Write a CLAUDE.md rule that prevents it
3. Verify the rule works

This is the compounding mechanism. It's not a separate module — it's woven into every lab.

### 3. Starter Pack + Targeted Gap
Pre-build everything that isn't directly teaching a Claude Code skill. Students should spend 90% of lab time on the technique, not on boilerplate. The HR app (or whatever app) is the vehicle, not the destination.

### 4. Guided, Not Prescriptive
Enterprise architects don't want "type exactly this." Give:
- The goal
- Hints and guidance
- A collapsible escape hatch with the exact solution (for students stuck >5 min)

### 5. Three Core Truths (Reinforced Throughout)
1. **Context management is the #1 constraint**
2. **Planning before implementation is non-negotiable**
3. **Simplicity beats complexity**

Reference these in every lab where relevant. By the capstone, students should be able to recite them.

---

## Claude Code Features to Cover

The lab MUST cover all of these. Map each to a build note from the project:

| Feature | Description | Lab Design Pattern |
|---------|-------------|-------------------|
| CLAUDE.md | Project conventions, always loaded | Incomplete → fail → complete → succeed |
| Plan Mode | Explore → Plan → Implement → Commit | No plan → miss requirements → plan → find them |
| Skills | On-demand knowledge packs (.claude/skills/) | Manual repetition → skill → one-prompt |
| Commands | Slash commands (.claude/commands/) | Repetitive workflow → command → instant |
| Context Management | /clear, /compact, subagents, /status | Overloaded → degraded → clean → quality |
| Hooks | PreToolUse/PostToolUse lifecycle events | Advisory rule ignored → hook enforced |
| Subagents | Custom agents (.claude/agents/) | Self-review weak → fresh-context review strong |
| Parallel Sessions | Git worktrees + multiple sessions | Sequential slow → parallel fast |
| Verification | Test-driven, visual, data-driven loops | "Looks right" → proven correct |
| MCP | External tool integration (.mcp.json) | Manual tool-switching → integrated loop |
| Thinking Modes | think/ultrathink effort calibration | Default shallow → ultrathink deep |
| Permissions | .claude/settings.json safety profile | Open → locked-down → safe |
| CI/CD | Pipeline generation and translation | Manual config → generated + translated |

---

## Reference Sources

Include these in the workshop materials:

1. **Boris Cherny's 57 Tips:** howborisusesclaudecode.com
2. **Official Best Practices:** code.claude.com/docs/en/best-practices
3. **CLAUDE.md Guide:** claude.com/blog/using-claude-md-files
4. **How Anthropic Teams Use Claude Code:** anthropic PDF (internal practices)
5. **Skills Documentation:** code.claude.com/docs/en/skills
6. **Hooks Documentation:** code.claude.com/docs/en/hooks

---

## Adaptation Notes

When adapting this recipe for a different codebase:

1. **Replace the HR app** with whatever app was built. The technique-to-lab mapping stays the same.
2. **Replace build notes** with your own. Each build note's "What Failed First" is your failure-first moment.
3. **Adjust MCP servers** to match the project's tech stack (PostgreSQL instead of MySQL, etc.)
4. **Adjust the CI/CD platform** to match the enterprise's tools.
5. **Keep the 3-phase structure** (Foundation → Productivity → Mastery) — it's the learning arc, not app-specific.
6. **Keep the self-improvement coda** on every lab — this is the core compounding mechanism regardless of app.

The app is the vehicle. Claude Code mastery is the destination.

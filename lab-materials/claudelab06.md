# Lab 06: Delegated Review — Fresh Context Beats Self-Review

**Duration:** 60 minutes

## Learning Objective

You will compare a same-session self-review with a fresh-context delegated
review. The goal is to see why a separate reviewer catches more issues than the
 session that just wrote the code.

---

## The Key Concept

Delegated review works because the reviewer:

- did not write the code
- starts with a cleaner context window
- can be given a narrower, more critical brief

In this repo, the durable lesson matters more than the exact product surface.
If your Claude Code client supports reusable project agents, you can store reviewer
and builder instructions under `.claude/agents/`. If it does not, use a fresh
Claude Code session with the same instructions pasted in. The fresh-context pattern is
the point of the lab.

---

## Setup

Ask Claude Code to check the current component surface:

```text
Check the current frontend component workspace state.
Read `frontend/src/components/` and tell me which component areas already exist.
```

---

## Exercise 1: Same-Session Self-Review (15 min)

### Goal

Build a component and then ask the same session to review it.

### Instructions

1. Ask Claude Code to build a component:
   ```text
   Create `frontend/src/components/hr/HrEmployeeCard.tsx`.

   It should display:
   - employee avatar with initials fallback
   - employee name and job title
   - department and location
   - employment status badge using the existing status-badge pattern
   - hire date
   - click handler for navigation to the detail page

   Follow the existing HR component patterns and the current Vertex Agentics /
   Modern visual direction already present in the repo.
   ```

2. In the same session, ask for a review:
   ```text
   Review the `HrEmployeeCard` component you just created.
   Check accessibility, error states, edge cases, performance, and consistency
   with sibling components.
   ```

3. Record how many useful findings the same-session review surfaced: _____

---

## Exercise 2: Create Reviewer And Builder Instructions (15 min)

### Goal

Create two reusable instruction sets: one for building, one for review.

### Instructions

1. Ask Claude Code to create markdown instruction files in `.claude/`:
   - `.claude/component-builder.md`
   - `.claude/component-reviewer.md`

   Reference these files from `CLAUDE.md` so future sessions know they exist.

2. If you prefer not to keep them as files, ask Claude Code to draft the
   two instruction sets in markdown so you can reuse them in fresh sessions.

3. The builder instructions should require:
   - existing repo patterns first
   - TypeScript prop safety
   - accessible states
   - no invented design system
   - CLAUDE.md compliance

4. The reviewer instructions should require:
   - findings first, no fluff
   - accessibility review
   - loading/empty/error-state review
   - long-string/null/edge-case review
   - contract mismatch review
   - consistency with the current Vertex Agentics / Modern UI direction

Recommended prompt:

```text
Create reusable builder and reviewer instructions for this repo.

Builder scope:
- React + TypeScript HR components
- existing repo patterns first
- CLAUDE.md compliance
- accessible states and sane defaults

Reviewer scope:
- findings-first review
- accessibility
- edge cases
- error and loading states
- contract mismatches
- consistency with sibling components and the current Vertex Agentics / Modern UI direction

Store the files as `.claude/component-builder.md` and `.claude/component-reviewer.md`.
Otherwise draft the exact instruction text in markdown for later reuse.
```

---

## Exercise 3: Fresh-Context Review (20 min)

### Goal

Run the same component through a separate reviewer context.

### Instructions

1. Start a fresh Claude Code session from your workspace root, or invoke the
   reviewer through your client’s delegated-agent surface if available.

2. Ask the reviewer to inspect only the component:
   ```text
   Review `frontend/src/components/hr/HrEmployeeCard.tsx`.
   Focus on accessibility, error states, long-string handling, null safety, and
   consistency with existing HR components.
   Return findings only.
   ```

3. Record how many useful findings the fresh-context review surfaced: _____

4. Compare:
   - same-session review: _____ findings
   - fresh-context review: _____ findings

5. Apply the reviewer feedback in the original implementation session or in a
   separate builder session.

6. Re-run the review once after fixes if you want to confirm the issues are
   actually resolved.

---

## Exercise 4: Capture The Rule (10 min)

1. Add a short rule block to `CLAUDE.md`:

   ```markdown
   ## Delegated Review
   - For meaningful UI or workflow changes, prefer a fresh-context review over same-session self-review
   - Reviewer instructions should be findings-first and read-only in spirit
   - Reusable reviewer/builder prompts or agent files belong in repo-local config, not in CLAUDE.md
   ```

2. Reflect:
   - What did the fresh-context reviewer catch that the writer missed?
   - Which reviewer specializations would matter most in your real codebase:
     accessibility, API contract, security, performance, or release readiness?

---

## Success Criteria

- [ ] `HrEmployeeCard` exists and follows current repo patterns
- [ ] Reusable reviewer and builder instructions were created
- [ ] Fresh-context review found more or better issues than self-review
- [ ] Reviewer feedback was applied
- [ ] `CLAUDE.md` now captures the delegated-review rule

---

## Key Takeaways

1. Same-session self-review is weak because the session is biased toward its own work.
2. Fresh context usually improves review quality immediately.
3. Reusable reviewer instructions compound just like `CLAUDE.md` rules do.
4. The exact custom-agent feature surface can vary; the fresh-context review
   pattern is the durable lesson.

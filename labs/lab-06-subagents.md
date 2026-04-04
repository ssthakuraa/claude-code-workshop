# Lab 6: Subagents — Isolated Specialist Workers

**Duration:** 60 minutes
**Day:** 2 — Productivity
**Builds On:** Lab 4 (context management), Lab 5 (hooks)
**Produces:** A custom subagent (component-reviewer)

---

## Learning Objective

You will create a reviewer subagent and observe how a fresh-context reviewer finds issues that a self-reviewing session misses. This pattern maps directly to enterprise code review workflows.

---

## The Key Concept

Subagents are specialized Claude instances that:
- Run in their **own context** (don't pollute your main window)
- Have **scoped tool access** (you control what they can do)
- Return **only results** to the main conversation

**Three built-in types:**
| Type | Use For |
|------|---------|
| `Explore` | Read-only codebase exploration and research |
| `Plan` | Architecture and design (no edits) |
| `general-purpose` | Full capability — research, edit, run commands |

**Custom subagents** are defined in `.claude/agents/` with persona, tools, and model specification.

### The Writer/Reviewer Pattern
```
Session A (Writer) → builds code
Session B (Reviewer) → reviews with fresh context → finds issues Writer missed
```
The reviewer sees code it didn't write — no confirmation bias, no context fatigue.

---

## Setup

```bash
# Verify frontend components exist
ls frontend/src/components/hr/   # Should show existing HR components
```

---

## Exercise 1: Self-Review (The Weak Version) (15 min)

### Goal
Build a component and ask the same session to review it. Observe limited critique.

### Instructions

1. Ask Claude to build a new HR component:
   ```
   Create src/components/hr/HrEmployeeCard.tsx — a card component that displays:
   - Employee avatar (initials fallback), name, job title
   - Department and location
   - Employment status badge (using HrStatusBadge)
   - Hire date
   - Click handler for navigation to detail page
   Follow the patterns from existing components in src/components/hr/.
   ```

2. In the **same session**, ask Claude to review it:
   ```
   Review the HrEmployeeCard component you just created.
   Check for: accessibility issues, missing error states,
   performance concerns, and consistency with our existing components.
   ```

3. **Count the issues found:** _____ (likely 0–2)

> Claude tends to be lenient reviewing its own code — it just wrote it and thinks it's correct.

---

## Exercise 2: Create the Reviewer Subagent (15 min)

### Goal
Define a reviewer subagent with a critical persona and read-only tools.

### Instructions

1. Create the agents directory:
   ```bash
   mkdir -p .claude/agents
   ```

2. Ask Claude to create the component-reviewer agent:
   ```
   Create .claude/agents/component-reviewer.md — a subagent that reviews
   React components. It should check:
   - Accessibility (aria labels, keyboard navigation, color contrast)
   - Error states and loading states
   - Prop validation and type safety
   - Consistency with existing component patterns
   - Performance (unnecessary re-renders, missing memoization)
   - Missing edge cases (empty data, long strings, null values)
   Give it a critical persona: "You are a senior frontend engineer
   performing a thorough code review. Be specific and actionable."
   It should be read-only (Read, Glob, Grep only — no edits).
   ```

3. Note: You don't need a builder agent. You build in the main session.
   The reviewer's value comes from NOT being the session that built the
   code — fresh eyes, no confirmation bias.

---

## Exercise 3: The Fresh-Context Review (20 min)

### Goal
Use the reviewer subagent on the component from Exercise 1.

### Instructions

1. Send the component to the reviewer:
   ```
   Use the component-reviewer agent to review
   src/components/hr/HrEmployeeCard.tsx.
   Focus on accessibility, error states, and edge cases.
   ```

2. **Count the issues found:** _____ (likely 3–6)

3. **Compare:**
   - Self-review (Exercise 1): _____ issues
   - Subagent review (Exercise 3): _____ issues

4. **Apply the reviewer's feedback in the main session:**
   ```
   Fix these issues in HrEmployeeCard (from the reviewer):
   [paste the reviewer's findings]
   ```

5. **Optional: Review again** after fixes to verify they're addressed.

### What You Should See

The fresh-context reviewer finds significantly more issues because:
- It didn't write the code (no confirmation bias)
- Its context is clean (no fatigue from the build session)
- Its persona is explicitly critical (optimized for finding problems)

---

## Exercise 4: The Self-Improvement Coda (10 min)

1. Add to CLAUDE.md:
   ```markdown
   ## Code Review Pattern
   - Never self-review in the same session — use component-reviewer agent
   - Reviewer agent in .claude/agents/ — read-only, fresh context
   - You build in the main session; reviewer critiques from separate context
   ```

2. Reflect:
   - *What types of review agents would your enterprise team need?*
   - Security reviewer? Performance reviewer? API contract reviewer?
   - *How would you customize the persona for your codebase?*

---

## Success Criteria

- [ ] `.claude/agents/component-reviewer.md` exists with critical review checklist
- [ ] Self-review found fewer issues than subagent review
- [ ] Reviewer's feedback was applied and verified
- [ ] You can explain why fresh-context review beats self-review

---

## Key Takeaways

1. **Self-review is weak** — Claude is lenient toward code it just wrote
2. **Fresh context = fresh eyes** — the reviewer subagent has no history with the code
3. **Personas matter** — "senior engineer performing a thorough review" produces better critique than "review this"
4. **The reviewer's value is separation** — a different context reviewing code it didn't write
5. **Subagents protect main context** — heavy review work stays in the subagent's window

---

<details>
<summary><strong>Escape Hatch</strong> — component-reviewer agent template</summary>

```markdown
---
name: component-reviewer
description: Reviews React components for quality, accessibility, and consistency
model: sonnet
allowed-tools: Read, Glob, Grep
---

You are a senior frontend engineer performing a thorough code review.
Be specific and actionable. Do NOT make changes — only report findings.

## Review Checklist
1. **Accessibility:** aria labels, keyboard nav, color contrast, screen reader support
2. **Error handling:** null props, empty arrays, missing data, API failures
3. **Edge cases:** long strings (truncation?), zero items, single item, 1000+ items
4. **Type safety:** no `any`, proper optional chaining, exhaustive switch cases
5. **Performance:** unnecessary re-renders, missing useMemo/useCallback where needed
6. **Consistency:** matches patterns in sibling components? Uses shared UI primitives?
7. **Missing states:** loading spinner? Empty state message? Error boundary?

## Output format
For each finding:
- **Severity:** Critical / Warning / Suggestion
- **Location:** file:line
- **Issue:** what's wrong
- **Fix:** what to do instead
```
</details>

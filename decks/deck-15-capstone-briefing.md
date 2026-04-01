# Deck 15: Capstone Briefing

**Duration:** 15 minutes | **Lab:** Lab 12

---

## Slide 1: The Feature

**Employee Transfer** — move an employee to a different department.

- Backend: `transferEmployee()` with idempotency, job_history, validation
- Frontend: 3-step wizard (Select Employee → Select Department → Confirm)
- Verification: tests + Playwright + MySQL cross-check

---

## Slide 2: The Challenge

Build this feature using **every technique from the workshop:**

| Technique | Where to Use |
|-----------|-------------|
| CLAUDE.md | Conventions followed automatically |
| Plan Mode | Design before implementation |
| Skills/Commands | Scaffolding, test runner |
| Hooks | PII guard, naming convention |
| Subagents | Code review after building |
| Verification (test-driven) | Backend tests first |
| Verification (visual) | Playwright screenshot |
| Verification (data) | MySQL query |

---

## Slide 3: The Workflow

```
Part 1 (60 min):
  Plan Mode → design the feature
  Skills → scaffold/generate boilerplate
  Write tests first → define expected behavior

Part 2 (90 min):
  Implement backend → run tests until green
  Implement frontend → visual verify
  Subagent review → apply feedback
  Full MCP loop → browser + database cross-check
```

---

## Slide 4: Presentation Expectations

After completing, walk through:
1. **Your plan** — what did Plan Mode surface?
2. **Your CLAUDE.md** — compare Day 1 vs now
3. **Your verification loop** — show the screenshot, the query, the cross-check
4. **Your adoption plan** — 3 commitments for Monday

---

## Slide 5: Escape Hatch

If you're behind at 60 min into Part 2:
- Skip the frontend
- Focus on: backend + tests + MySQL verification
- The verification pattern is the core learning — the UI is bonus

**Go. You have 150 minutes.**


### Part 1: Workshop Retro & Adoption Plan: CLAUDE.md Before/After (10 min)

Ask students to compare their Day 1 CLAUDE.md with their Day 4 version:
```
git diff checkpoint/day1-start -- CLAUDE.md
```

**Discussion prompts:**
- How many rules did you add?
- Which rule was the most valuable? (Saved the most time)
- Which rule surprised you? (Didn't expect to need it)

> **Speaker notes:** The diff is the tangible proof of compounding engineering. Some students will have 15+ rules added. The contrast is dramatic and makes the abstract concept concrete.

---

### Part 2: Capstone Presentations (if not done already, 10 min)

3-4 students walk through their capstone. Focus on technique, not code:
- *"What technique did you use where, and why?"*
- *"What would you do differently next time?"*

---

### Part 3: Adoption Plan (10 min)

Each student writes three commitments on sticky notes (or shared doc):

**1. CLAUDE.md:**
*"I will create a CLAUDE.md for _____________ that includes _____________"*

**2. Hooks:**
*"I will add a _____________ hook that prevents _____________"*

**3. Workflow:**
*"I will use _____________ (Plan Mode / Skills / Subagents / MCP) for _____________"*

> **Speaker notes:** Make this concrete. Not "I'll use Claude Code more" but "I'll write a CLAUDE.md for our payment service that includes the idempotency rules and the Kafka consumer patterns." Specificity = follow-through.

---

### Closing

**Follow-up suggestions:**
- Schedule a **1-hour "30 days later" check-in** — how did adoption go?
- Share the reference sources:
  - howborisusesclaudecode.com (Boris's 57 tips)
  - code.claude.com/docs/en/best-practices (official docs)
  - claude.com/blog/using-claude-md-files (CLAUDE.md guide)
- Create a team Slack channel for Claude Code tips and CLAUDE.md improvements

> **Speaker notes:** The workshop ends, but the compounding loop doesn't. Every week their CLAUDE.md should grow, their skills should expand, and their hooks should catch more. The 30-day check-in is what makes this stick.

# Lab 4: Context Management — The #1 Performance Lever

**Duration:** 45 minutes
**Day:** 1 — Foundation
**Checkpoint Branch:** `checkpoint/day1-start` (continues from Labs 1–3)
**Builds On:** All Day 1 labs
**Produces:** Practical context discipline habits

---

## Learning Objective

You will experience context window degradation firsthand — watching Claude's quality drop as context fills up — then redo the same work with proper context hygiene. This lab teaches the single most important operational discipline for Claude Code.

---

## The Key Concept

Claude's context window is finite. Everything — files read, command outputs, messages, tool results — consumes tokens.

**The degradation curve:**
- **0–60% full:** Claude is sharp, follows all rules, produces quality code
- **60–80% full:** Subtle drift — may miss a convention, skip a step
- **80–90% full:** Noticeable quality drop — hallucinations increase, CLAUDE.md rules get ignored
- **90%+:** Erratic — Claude may contradict itself or produce broken code

**The tools:**
| Tool | When to Use |
|------|-------------|
| `/clear` | Between different tasks — wipe conversation history |
| `/compact` | Within a long task — compress history while preserving key context |
| Subagents | For research-heavy work — keeps main context clean |
| Fresh session | New task entirely — cheapest way to get clean context |
| `/status` | Check current context usage |

---

## Setup

Continue from Labs 1–3. You should have CLAUDE.md, Region, Country, and Location entities.

---

## Exercise 1: Fill the Context (15 min)

### Goal
Deliberately overload a single session to experience degradation.

### Instructions

1. **In a single session, without clearing**, perform all of these tasks sequentially:

   a. Read the full requirements document:
   ```
   Read docs/requirement.md and summarize the key entities.
   ```

   b. Read the technical design:
   ```
   Read docs/technical-design.md and list all API endpoints.
   ```

   c. Read the schema:
   ```
   Read database/schema.sql and list all tables with their columns.
   ```

   d. Ask Claude to generate a Department entity:
   ```
   Scaffold HrDepartment: entity, repo, DTO, request, service, controller.
   Departments have a tree structure (parent_department_id FK to self).
   Include soft delete. The service should support findTree() returning
   nested children. Follow all CLAUDE.md conventions.
   ```

2. **Check `/status`** — observe the context usage percentage.

3. Now ask Claude to generate the Job entity:
   ```
   Scaffold HrJob: entity (job_id VARCHAR PK, job_title, min_salary, max_salary),
   repo, DTO, request, service with salary range validation, controller.
   Cache the findAll() results for 1 hour. Follow all CLAUDE.md conventions.
   ```

4. **Review the Job output carefully:**
   - [ ] Did Claude follow all CLAUDE.md conventions?
   - [ ] Is the logging pattern correct?
   - [ ] Is the caching annotation correct?
   - [ ] Did it validate min_salary < max_salary?

5. **Score the quality** on a 1–5 scale: _____

> If context is above 70%, you'll likely see 1–2 convention violations that wouldn't have happened in a fresh session.

---

## Exercise 2: The Clean Way (15 min)

### Goal
Redo the Job entity with proper context management.

### Instructions

1. **Clear the context:**
   ```
   /clear
   ```

2. Ask for the Job entity with the **same prompt** as Exercise 1:
   ```
   Scaffold HrJob: entity (job_id VARCHAR PK, job_title, min_salary, max_salary),
   repo, DTO, request, service with salary range validation, controller.
   Cache the findAll() results for 1 hour. Follow all CLAUDE.md conventions.
   ```

3. **Review the output.** Score quality 1–5: _____

4. **Compare:**
   - Quality score with overloaded context: _____
   - Quality score with clean context: _____

### What You Should See

The clean-context version should score higher — conventions followed more precisely, fewer omissions, cleaner code structure.

---

## Exercise 3: Subagent for Research (10 min)

### Goal
Use a subagent to do research without polluting your main context.

### Instructions

1. Instead of reading large files yourself, delegate:
   ```
   Use a subagent to read docs/requirement.md and extract:
   1. All entity names and their relationships
   2. All RBAC rules
   3. All API endpoints
   Return a concise summary — not the full document.
   ```

2. **Check `/status`** after the subagent returns. Notice that the full document content stayed in the subagent's context, not yours. Only the summary was added to your main context.

3. Now use the summary to do work:
   ```
   Based on that entity summary, which entities still need to be scaffolded?
   ```

### What You Should See

Your main context consumed only the summary (~50 lines), not the full document (~500+ lines). This is how you keep context clean during research-heavy work.

---

## Exercise 4: Context Habits Checklist (5 min)

Review and internalize these habits:

- [ ] **`/clear` between tasks** — don't let Task A's context pollute Task B
- [ ] **Don't read files "just in case"** — every file read costs tokens
- [ ] **Delegate research to subagents** — keep your main context for implementation
- [ ] **Use `/compact` for long tasks** — when you can't clear but context is growing
- [ ] **Start fresh sessions for new features** — cheapest clean context
- [ ] **Check `/status` periodically** — know your context level

Add to CLAUDE.md:
```markdown
## Session Discipline
- /clear between unrelated tasks
- Delegate large file reads to subagents
- If context > 70%, /compact or start fresh session
```

---

## Success Criteria

- [ ] Experienced measurable quality difference between overloaded and clean context
- [ ] Used `/clear` to reset context between tasks
- [ ] Used a subagent for research without polluting main context
- [ ] Can explain the degradation curve (60% → 80% → 90%)
- [ ] CLAUDE.md updated with session discipline rules

---

## Key Takeaways

1. **Context is your most precious resource** — guard it jealously
2. **`/clear` is free, debugging isn't** — clearing context takes 0 seconds; fixing a context-poisoned generation takes 10 minutes
3. **Subagents are context firewalls** — heavy reading stays in their context, only summaries cross into yours
4. **Check `/status` like checking fuel** — you wouldn't drive without a gas gauge

---

<details>
<summary><strong>Escape Hatch</strong> — If you can't trigger degradation</summary>

Context degradation is easier to trigger with:
- Reading multiple large files (requirement.md + technical-design.md + schema.sql)
- Asking for multiple scaffolds in the same session
- Pasting long error outputs

If you're on a model with a large context window and can't trigger degradation within the lab time, the instructor will demo the effect. The key insight remains: clean context = better output, always.
</details>

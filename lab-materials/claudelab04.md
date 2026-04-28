# Lab 04: Context Management — The #1 Performance Lever

**Duration:** 45 minutes

## Learning Objective

You will explore how overloaded context can reduce Claude Code quality, then redo the same work with better context hygiene. Modern LLM context windows are getting larger, so in this exercise you may not actually see the context fill up firsthand. The important habit is to watch context usage during development and notice when the agent starts to drift. As context fills and gets compacted, some details may be dropped, so if the agent starts deviating from the task or missing earlier constraints, treat that as a signal to steer it back in the right direction.

---

## The Key Concept

Claude Code's context window is finite. Everything — files read, command outputs, messages, tool results — consumes tokens.

**The degradation curve:**
- **0–60% full:** Claude Code is sharp, follows all rules, produces quality code
- **60–80% full:** Subtle drift — may miss a convention, skip a step
- **80–90% full:** Noticeable quality drop — hallucinations increase, CLAUDE.md rules get ignored
- **90%+:** Erratic — Claude Code may contradict itself or produce broken code

**The tools and habits:**
| Tool | When to Use |
|------|-------------|
| Fresh session | Between different tasks — cheapest clean context |
| Short context summary | Within a long task — preserve only the essentials |
| Delegated research | For research-heavy work — keeps main context clean |
| Read exemplars first | Larger codebases — lets Claude Code anchor on real patterns |
| Status indicator if available | Check context usage when the client exposes it |

---

## Setup

Continue from Labs 1–3. You should have CLAUDE.md, Region, Country, and Location patterns in place.

Before starting, remember the large-codebase rule for this workspace:

- read examples before generation
- read docs before code
- avoid reading large files "just in case"

---

## Exercise 1: Fill the Context (15 min)

### Goal
Deliberately overload a single session to experience degradation.

### Instructions

1. **In a single session, without clearing**, perform all of these tasks sequentially:

   a. Read the full requirements document:
   ```
   Read lab-materials/docs/requirement.md and summarize the key entities.
   ```

   b. Read the technical design:
   ```
   Read lab-materials/docs/technical-design-jersey-rewrite.md and extract the HR API endpoints
   or API-capability list described there.
   ```

   c. Read the schema:
   ```
   Read database/hrschema.sql and list the key `AIHR_*` tables.
   ```

   d. Ask Claude Code to draft the Department backend slice in chat only:
   ```
   Draft the Department backend slice for the current repo, but do not edit any files.
   I only want the proposed shape in chat so I can evaluate output quality.
   request/response DTOs, JDBC repository methods, and Jersey resource.
   Departments have a tree structure and the read API should support nested children.
   Follow all CLAUDE.md conventions.
   ```

2. **If your Claude Code client exposes a status/context indicator, check it.** Otherwise, simply note that you have now loaded multiple large files plus multi-step instructions into one session.

3. Now ask Claude Code to draft the Job backend slice in chat only:
   ```
   Draft the Job backend slice, but do not edit any files.
   I only want the proposed shape in chat so I can evaluate output quality.
   request/response DTOs, JDBC repository methods, and Jersey resource.
   Include salary range validation and follow all CLAUDE.md conventions.
   ```

4. **Review the Job output carefully:**
   - [ ] Did Claude Code follow all CLAUDE.md conventions?
   - [ ] Is the logging pattern correct?
   - [ ] Is the response-envelope and base-path pattern correct?
   - [ ] Did it validate min_salary < max_salary?
   - [ ] Did it stay within the current Jersey/JDBC + PostgreSQL runtime shape?

5. **Score the quality** on a 1–5 scale: _____

> If context is above 70%, you'll likely see 1–2 convention violations that wouldn't have happened in a fresh session.

---

## Exercise 2: The Clean Way (15 min)

### Goal
Redo the Job backend module with proper context management.

### Instructions

1. **Start a fresh Claude Code session.** Exit the current session and start a new
   one for this exercise.

2. Ask for the Job backend module with the **same prompt** as Exercise 1:
   ```
   Draft the Job backend slice, but do not edit any files.
   I only want the proposed shape in chat so I can evaluate output quality.
   request/response DTOs, JDBC repository methods, and Jersey resource.
   Include salary range validation and follow all CLAUDE.md conventions.
   ```

3. **Review the output.** Score quality 1–5: _____

4. **Compare:**
   - Quality score with overloaded context: _____
   - Quality score with clean context: _____

### What You Should See

The clean-context version should score higher — conventions followed more precisely, fewer omissions, cleaner code structure.

---

## Exercise 3: Delegated Research (10 min)

### Goal
Use delegated research to do heavy reading without polluting your main context.

### Instructions

1. Instead of reading large files yourself, delegate or ask for a bounded research summary:
   ```
   Read lab-materials/docs/requirement.md and extract only:
   1. All entity names and their relationships
   2. All RBAC rules
   3. All API endpoints
   Return a concise summary — not the full document.
   ```

2. **Notice what changed:** only the summary should remain in your working context, not the full document contents.

3. Now use the summary to do work:
   ```
   Based on that entity summary, which entities still need to be scaffolded?
   ```

### What You Should See

Your main context consumed only the summary (~50 lines), not the full document (~500+ lines). This is how you keep context clean during research-heavy work. Lab 06 will go deeper on dedicated reviewer/builder agents.

---

## Exercise 4: Context Habits Checklist (5 min)

Review and internalize these habits:

- [ ] **Start a fresh session between unrelated tasks** — don't let Task A's context pollute Task B
- [ ] **Don't read files "just in case"** — every file read costs tokens
- [ ] **Ask for bounded summaries during research** — keep your main context for implementation
- [ ] **Use a short summary for long tasks** — when you can't restart but context is growing
- [ ] **Start fresh sessions for new features** — cheapest clean context
- [ ] **Check a status indicator if available** — know your context level

Add to CLAUDE.md:
```markdown
## Session Discipline
- Start fresh sessions between unrelated tasks
- Delegate or summarize large file reads instead of carrying full file contents
- If the session feels overloaded, summarize the task state and restart cleanly
```

---

## Success Criteria

- [ ] Experienced measurable quality difference between overloaded and clean context
- [ ] Used a fresh session to reset context between tasks
- [ ] Used delegated research without polluting main context
- [ ] Can explain the degradation curve (60% → 80% → 90%)
- [ ] CLAUDE.md updated with session discipline rules

---

## Key Takeaways

1. **Context is your most precious resource** — guard it jealously
2. **A fresh session is free, debugging isn't** — restarting cleanly is cheaper than fixing context-poisoned output
3. **Delegated research is a context firewall** — heavy reading stays bounded, only summaries cross into the implementation loop
4. **In larger repos, read exemplars before generating** — context quality matters as much as context size

---

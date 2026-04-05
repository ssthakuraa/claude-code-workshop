# Lab 4: Context Management — The #1 Performance Lever

**Duration:** 45 minutes
**Day:** 1 — Foundation
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

Continue from Labs 1–3. You should have CLAUDE.md, Region (or PayGrade), Country, Location, and the Notification entity you scaffolded in Lab 3 using `/scaffold-entity`.

---

## Exercise 1: Review with Fresh Context (15 min)

### Goal
Experience the difference between "accumulated context" and "clean context" by reviewing the Notification entity you built in Lab 3.

### The Professional Mindset

Rather than asking "why does context degrade," ask "how would I plan this work so I never get there?" That's how experienced Claude Code users operate. The degradation curve exists — but professionals design around it, not into it.

### Instructions

1. **Check your current session state.** If you've been running Claude since Lab 3, your context is polluted with prior work:
   ```
   /status
   ```

2. **Ask for a review with polluted context:**
   ```
   Review my Notification entity for correctness and convention compliance.
   ```
   Notice what Claude reviews — in a long session, it may reference outdated details from earlier labs.

3. **Now clear and review with fresh context:**
   ```
   /clear
   ```
   Check `/status` — you should be back near 0%.

   Then ask the same question:
   ```
   Review the HrNotification entity, HrNotificationController,
   and HrNotificationService. Check for correct conventions:
   Hr prefix, HrLogHelper entry/exit, @SQLRestriction,
   @PreAuthorize, and HrApiResponse return types.
   ```

4. **Compare the two reviews.** Did the fresh-context review find things the polluted one missed?

> You've just experienced context degradation firsthand. Session 1 was polluted with accumulated state from labs past. Session 2 was clean — Claude focused only on what you asked about.

---

## Exercise 2: Session 2 — Plan the Next Entity with Clean Context (15 min)

### Goal
Execute the next session cleanly, observing context usage before and after `/clear`.

### Instructions

1. **Check `/status`:**
   ```
   /status
   ```
   Check the context percentage.

2. Architect the next entity — HrDepartment:
   ```
   I need to scaffold HrDepartment in a clean session. Design the
   session plan: what files to create, what order, what to verify.
   Department hierarchy: parent_department_id FK to self (tree structure).
   Include soft delete (@SQLRestriction). Service needs findTree()
   returning nested children. Follow all CLAUDE.md conventions.
   ```
   Plan it first — don't build yet. This keeps the session focused on design, not implementation.

3. **Check `/status` again.** Notice how much context the design consumed. This is your baseline for one focused task.

### What You Should See

A focused session — one focused question, no accumulated reads from prior tasks — stays well under 30% context. Claude follows conventions precisely because it isn't sifting through a history of prior work.

---

## Exercise 3: Using /compact for Long Tasks (10 min)

### Goal
Use `/compact` to compress a long session without losing the key implementation context you need to continue working.

### When to Use /compact

`/compact` is for situations where:
- You're mid-task and can't start fresh (too much context built up)
- You want to shed accumulated file reads and tool outputs
- You need to continue the same task but context is getting large

Unlike `/clear` (which wipes everything), `/compact` summarizes history while preserving what you tell it to keep.

### Instructions

1. Continue from Exercise 2. You have a session with the HrJob scaffold. Check `/status` to note the current percentage.

2. Add some bulk to the session — ask Claude to read a large file:
   ```
   Read docs/requirement.md and list the entities mentioned.
   ```
   Check `/status` again. Context has grown.

3. Now run `/compact` with a directive:
   ```
   /compact
   ```
   When prompted (or in the same message), tell Claude what to preserve:
   ```
   Compact this session. Preserve: the CLAUDE.md rules in effect,
   the HrJob entity we scaffolded (entity fields, service methods,
   caching annotation), and any pending compile issues.
   Discard: the full requirement.md content we just read.
   ```

4. **Check `/status` after** — context should be significantly reduced.

5. Verify Claude retained the key context:
   ```
   What caching configuration did we add to HrJob?
   What CLAUDE.md rules are we following in this session?
   ```
   It should answer correctly from the compacted summary.

### What You Should See

`/compact` compresses prior history while keeping the context you directed it to preserve. The percentage drops. Claude still knows your session's key decisions and the code it produced.

> **Comparison:** `/clear` = full reset. `/compact` = summarize and continue. Use `/clear` between tasks. Use `/compact` within a long task that isn't done yet.

---

## Exercise 4: Context Habits Checklist (5 min)

Review and internalize these habits:

- [ ] **Design sessions before starting** — one entity per session, explicit `/clear` between them
- [ ] **`/clear` between tasks** — don't let Task A's context pollute Task B
- [ ] **Don't read files "just in case"** — every file read costs tokens
- [ ] **Separate research from implementation** — read docs in a dedicated pass, then `/clear` before building
- [ ] **Use `/compact` mid-task** — when you can't clear but context is growing and you need to continue
- [ ] **Start fresh sessions for new features** — cheapest clean context
- [ ] **Check `/status` periodically** — know your context level

Add to CLAUDE.md:
```markdown
## Session Discipline
- /clear between unrelated tasks
- Delegate large file reads to subagents
- If context > 70%, /compact or start fresh session
- Check /status periodically — context is your most precious resource
```

---

## Success Criteria

- [ ] Experienced context degradation by reviewing Notification in polluted vs fresh context
- [ ] Used `/clear` between Exercise 1 and Exercise 2
- [ ] Used `/compact` in Exercise 3 and verified Claude retained key context
- [ ] Can explain the degradation curve (60% → 80% → 90%)
- [ ] Can explain the difference between `/clear` and `/compact`
- [ ] CLAUDE.md updated with session discipline rules

---

## Key Takeaways

1. **Design sessions before you start** — one focused task per session is a professional habit, not a workaround
2. **`/clear` is free, debugging isn't** — clearing context takes 0 seconds; fixing a context-poisoned generation takes 10 minutes
3. **`/compact` preserves intent** — use it mid-task to shed accumulated noise without losing your session's key decisions
4. **Separate reading from building** — docs in one session, implementation in the next; never both in the same window
5. **Check `/status` like checking fuel** — you wouldn't drive without a gas gauge

---

<details>
<summary><strong>Escape Hatch</strong> — If /compact doesn't visibly reduce context</summary>

`/compact` reduction depends on how much history has accumulated:
- If context is under 30%, compaction may not show a dramatic percentage drop
- Build up more history first: read `docs/requirement.md` and `docs/technical-design.md`, scaffold an additional entity, ask a few questions — then compact

The key test isn't the percentage number — it's whether Claude can answer "what did we build in this session?" correctly after compaction. If it can, the compaction preserved what matters.
</details>

# Deck 5: Context Window — The #1 Constraint

**Duration:** 20 minutes | **Lab:** Lab 4

---

## Slide 1: The Context Window

Everything consumes tokens: files read, command outputs, messages, tool results.

**The degradation curve:**
- **0–60%:** Sharp, follows all rules
- **60–80%:** Subtle drift, may miss a convention
- **80–90%:** Quality drops, hallucinations increase
- **90%+:** Erratic, may contradict itself

> **Speaker notes:** This is the single most important operational concept. Every best practice we teach — /clear, subagents, skills — exists because of this constraint.

---

## Slide 2: The Tools

| Tool | When |
|------|------|
| `/clear` | Between different tasks |
| `/compact` | Within a long task |
| Subagents | Research-heavy work (keeps main context clean) |
| Fresh session | New task entirely |
| `/status` | Check current context usage |

> **Speaker notes:** `/clear` is free. Debugging context-poisoned output costs 10 minutes. Always clear between tasks.

---

## Slide 3: The Subagent as Context Firewall

```
Without subagent:
  Read 500-line doc → 500 lines in YOUR context

With subagent:
  Subagent reads 500-line doc → returns 20-line summary
  → 20 lines in YOUR context
```

**25x context savings.** Subagents keep heavy reading in their own window.

> **Speaker notes:** This is why subagents exist. Not for sophistication — for context efficiency. Delegate reading, keep your window for implementation.

---

## Slide 4: Context Hygiene Habits

- [ ] `/clear` between unrelated tasks
- [ ] Don't read files "just in case"
- [ ] Delegate large reads to subagents
- [ ] `/compact` when context grows within a task
- [ ] Start fresh sessions for new features
- [ ] Check `/status` periodically

> **Speaker notes:** These habits feel unnatural at first — you want to keep everything in one session. Resist that. Clean context = better output, every single time.

---

## Slide 5: Your Turn — Lab 4

You'll:
1. Deliberately overload a session to experience degradation
2. Redo the same work with clean context
3. Compare quality scores
4. Use a subagent for research without polluting main context

**Time:** 45 minutes. Go.

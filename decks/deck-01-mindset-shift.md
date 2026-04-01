# Deck 1: The Mindset Shift

**Duration:** 20 minutes
**When:** Day 1, 9:30 AM (first lecture after setup check)
**Lab:** None — this sets the mental model for the entire workshop

---

## Slide 1: Title
**Mastering Claude Code for Enterprise Development**
*A 4-Day Hands-On Workshop*

> **Speaker notes:** Welcome. This workshop is about changing how you work — not learning a new tool. By Friday, the way you approach coding will be fundamentally different. Not because Claude Code is magic, but because the workflow it enables is structurally better than what you do today.

---

## Slide 2: The Old Way vs The New Way

| Before | After |
|--------|-------|
| You write code | You describe intent |
| Autocomplete assistant | Autonomous collaborator |
| Manual coding | Steering and reviewing |
| Single-task execution | Parallel orchestration |
| Individual memory | Encoded team knowledge |

> **Speaker notes:** This isn't about typing faster. It's about changing your role. You become the architect, the reviewer, the quality gate — and Claude becomes the implementer. Boris Cherny, who created Claude Code, says: "I want implementation to be boring. The creative work happens in the planning phase."

---

## Slide 3: Three Core Truths

**1. Context management is the #1 constraint.**
Claude's context window fills up. Performance degrades. The best users obsessively manage context.

**2. Planning before implementation is non-negotiable.**
Explore → Plan → Implement → Commit. Skipping planning costs more time than it saves.

**3. Simplicity beats complexity.**
Simple prompts + good CLAUDE.md > elaborate multi-agent orchestration. Boris's CLAUDE.md is ~100 lines.

> **Speaker notes:** These three truths will come up in every lab. By Day 4, you'll have experienced each one personally — not because I told you, but because you'll have seen the failure that happens when you violate them.

---

## Slide 4: The Enterprise Challenge

Claude is powerful but **ignorant of your codebase.**

It doesn't know:
- Your naming conventions
- Your internal frameworks
- Your deployment process
- Your architectural decisions
- Your team's hard-won lessons

**This workshop teaches you to bridge that gap — systematically and permanently.**

> **Speaker notes:** Generic AI demos use generic codebases. That's not your world. You have custom frameworks, 10-year-old conventions, regulatory requirements, and tribal knowledge that isn't written down anywhere. The tools we'll learn — CLAUDE.md, Skills, Hooks — are how you encode all of that so Claude works within YOUR enterprise context.

---

## Slide 5: The Compounding Mechanism

```
Claude makes a mistake
    → You correct it
        → You encode the correction in CLAUDE.md
            → Claude never makes that mistake again
                → Repeat 100x
                    → Claude just works the way you want
```

> **Speaker notes:** This is the most important slide in the entire workshop. Boris calls this "compounding engineering." Every correction makes Claude permanently better at YOUR project. By Day 4, your CLAUDE.md will have 20+ rules — and Claude will be noticeably different from Day 1. This is the productivity multiplier that no other workflow gives you.

---

## Slide 6: The 5 Layers of Enterprise Claude Code

| Layer | Tool | Loaded When | Purpose |
|-------|------|-------------|---------|
| 1 | CLAUDE.md | Every session | Core conventions |
| 2 | Skills | On-demand | Domain knowledge |
| 3 | Subagents | When spawned | Specialist work |
| 4 | Hooks | Every action | Enforcement |
| 5 | MCP | When configured | External tools |

> **Speaker notes:** Over the next 4 days, you'll build each layer. By the end, you'll have a fully configured Claude Code environment that knows your conventions, loads domain knowledge on-demand, delegates specialist work, enforces rules automatically, and connects to your database and browser. Each layer compounds on the previous.

---

## Slide 7: What This Workshop Is NOT

- ❌ A demo of AI writing code
- ❌ A tutorial on prompt engineering tricks
- ❌ A "hello world" AI coding exercise

**This IS:**
- ✅ A discipline for integrating agentic coding into enterprise workflows
- ✅ A practice of encoding team knowledge so AI gets better over time
- ✅ A methodology for maintaining quality at scale with AI assistance

> **Speaker notes:** If you came expecting to watch Claude generate code and be impressed — you'll be disappointed. The impressive part isn't what Claude generates. It's the system you build around it that makes the generation consistently correct, safe, and enterprise-grade. That's what we're building this week.

---

## Slide 8: Workshop Structure

| Day | Theme | Message |
|-----|-------|---------|
| 1 | Foundation | *Teach Claude your enterprise* |
| 2 | Productivity | *Scale and automate* |
| 3 | Integration | *Connect Claude to your ecosystem* |
| 4 | Mastery | *The full end-to-end workflow* |

**Every lab ends with the same ritual:**
1. What went wrong?
2. Write a rule that prevents it
3. Verify the rule works

> **Speaker notes:** This ritual is the compounding mechanism in action. Don't skip it. By Day 4, the rules you've written will be the most valuable artifact from this workshop — more valuable than the code.

---

## Slide 9: Before We Start

**Mindset check:**

Think of Claude as a **capable junior engineer with perfect memory and no context.**

- Give it context → it does great work
- Give it no context → it makes predictable mistakes
- Encode corrections → it never repeats them

Your job shifts from **writing code** to **building the system that produces correct code.**

> **Speaker notes:** Let's begin. Lab 1 starts in 10 minutes. You'll see Claude make a predictable mistake, fix it by writing a rule, and verify the rule works. That loop is the entire workshop in microcosm.

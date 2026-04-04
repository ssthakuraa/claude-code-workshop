# Mastering Claude Code for Enterprise Development

## A 4-Day Hands-On Workshop

**Audience:** Engineers, Tech Leads, Architects working in enterprise codebases
**Lab Project:** Enterprise HR Management System (Spring Boot + React, Oracle Redwood Design System)

---

## Workshop Structure

| Day | Theme | Labs | Core Message |
|-----|-------|------|--------------|
| **Day 1** | Foundation — Teach Claude Your Enterprise | Labs 1–4 | *Context is everything. Teach Claude once, benefit forever.* |
| **Day 2** | Productivity — Scale and Automate | Labs 5–8 | *Encode quality. Parallelize. Let Claude verify its own work.* |
| **Day 3** | Integration — Connect Claude to Your Ecosystem | Labs 9–10 | *MCP bridges Claude to databases, browsers, and external tools.* |
| **Day 4** | Mastery — Operate at Enterprise Scale | Labs 11–12 | *CI/CD, permissions, and the full end-to-end workflow.* |

---

## Three Core Truths (Reinforced in Every Lab)

1. **Context management is the #1 constraint.** Claude's context window fills up fast and performance degrades. The most successful Claude Code users obsessively manage context.

2. **Planning before implementation is non-negotiable.** Explore → Plan → Implement → Commit. Skipping planning costs more time than it saves.

3. **Simplicity beats complexity.** Simple prompts + good CLAUDE.md > elaborate multi-agent orchestration.

---

## The Mindset Shift

This workshop requires a fundamental reorientation:

| From | To |
|------|-----|
| Writing code | Describing intent |
| Autocomplete assistant | Autonomous collaborator |
| Manual coding | Steering and reviewing |
| Single-task execution | Parallel orchestration |
| Individual memory | Encoded team knowledge |

> *"I want implementation to be boring. The creative work happens in the planning phase."* — Boris Cherny, creator of Claude Code

---

## Start of Each Day

Run this before the first lab of each day to reload the database and verify the backend compiles:

```bash
bash scripts/start-day.sh <day>   # 1, 2, 3, or 4
```

---

## Lab Exercises

- [Lab 01: CLAUDE.md — Your Enterprise Constitution](labs/lab-01-claudemd.md)
- [Lab 02: Plan Mode — Think Before You Build](labs/lab-02-plan-mode.md)
- [Lab 03: Skills & Commands — Reusable Knowledge Packs](labs/lab-03-skills-commands.md)
- [Lab 04: Context Management — The #1 Performance Lever](labs/lab-04-context-management.md)
- [Lab 05: Hooks — Deterministic Quality Gates](labs/lab-05-hooks.md)
- [Lab 06: Subagents — Isolated Specialist Workers](labs/lab-06-subagents.md)
- [Lab 07: Parallel Sessions & Git Worktrees](labs/lab-07-parallel-sessions.md)
- [Lab 08: Verification Loops — The Quality Multiplier](labs/lab-08-verification-loops.md)
- [Lab 09: MCP Servers — Playwright & Browser Verification](labs/lab-09-mcp-playwright.md)
- [Lab 10: MCP Servers — MySQL & Data Verification](labs/lab-10-mcp-mysql.md)
- [Lab 11: CI/CD, Permissions & Enterprise Governance](labs/lab-11-cicd-permissions.md)
- [Lab 12: Capstone — End-to-End Feature Build](labs/lab-12-capstone.md)
- All labs are in the `labs/` directory

---

## The Self-Improvement Loop (Every Lab Ends With This)

After every lab exercise, complete this ritual:

1. **What went wrong?** — Identify where Claude made a mistake or missed a requirement
2. **Write a rule** — Add a line to CLAUDE.md that prevents the mistake
3. **Verify it works** — Run the same task again and confirm Claude follows the new rule

> By Lab 12, your CLAUDE.md will be meaningfully richer than what you started with — and Claude will be visibly better at your specific project. This is compounding engineering.

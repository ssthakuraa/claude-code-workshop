# Claude Code Lab Reference Card — Best Practices Summary

**Duration:** 10 to 15 minutes

This final reference is intentionally compact. It should feel like a durable operating card, not leftover notes. The goal is to leave the learner with something short enough to revisit under delivery pressure and specific enough to prevent expensive mistakes.

## Learning Objective

You will distill the course into a short, reusable self-check that helps you start and finish real work without re-reading the full lab set.

## The Key Concept

The best reference cards are short enough to use and concrete enough to change behavior. If the card reads like a chapter summary, it is too broad. If it reads like slogans, it is too vague.

## Suggested Exercise

After reading the table below, pick:

1. the five rules most likely to prevent expensive mistakes in this repo
2. the three rules that protect quality most strongly
3. the two rules you are most likely to forget under delivery pressure

Then rewrite those ten items in your own words if needed, as long as the meaning stays intact.

## Best Practices Reference Card

| Do | Don't |
|---|---|
| Start with the prerequisite bring-up lab and align the workspace to the learner VM and database. | Treat every learner machine as if it has identical host, browser, and database setup. |
| Read `CLAUDE.md`, the learner workspace guide, and the relevant docs before coding. | Start by asking Claude Code to build a large feature from memory. |
| Ask for a repo-grounded plan before multi-file or high-risk work. | Skip directly to implementation when scope or constraints are still fuzzy. |
| Improve the task brief before asking Claude Code to solve it. | Accept a vague feature request as implementation-ready. |
| Read examples before generation and docs before code. | Invent patterns without checking how the repo already works. |
| Keep the learner starter substantial and only remove surgical exercise-specific slices. | Turn the starter workspace into a thin scaffold that no longer feels real. |
| Promote repeated corrections into the right mechanism: `CLAUDE.md`, skills, workflows, repo config, or reference material. | Keep fixing the same mistake manually in every new conversation. |
| Keep `CLAUDE.md` lean, durable, and repo-specific. | Turn `CLAUDE.md` into a giant procedural dump. |
| Use skills and reusable workflow artifacts for repeatable middle sections of work. | Put every repeated process directly into `CLAUDE.md`. |
| Use browser, API, and database verification when a change spans layers. | Stop after the UI "looks right" in one view. |
| Treat PostgreSQL as the active local runtime direction in this workspace. | Reintroduce legacy vendor-specific, MySQL-only, or other stale runtime assumptions. |
| Use the repo's current browser-verification path and repo rules; record fallbacks explicitly when the host cannot launch the preferred browser. | Invent bundled browser runtimes or switch browser/tooling assumptions silently. |
| Start fresh sessions between unrelated tasks and summarize before continuing long ones. | Let stale context accumulate until Claude Code starts guessing. |
| Use worklists and resume prompts for tasks that may span sessions or days. | Trust memory to carry long-running work forward cleanly. |
| Require at least one explicit self-review before marking work complete. | Treat the first workable output as finished. |
| For high-stakes work, do a second review pass focused on learner impact and clarity. | Assume technical correctness alone makes training material ready. |
| Use a bounded pilot with named review roles and evidence before broader rollout. | Announce broad adoption without stop conditions or evidence gates. |
| Read the agent's plan before it implements; restart fresh when the session is thrashed and redirect only when the drift is one localized invention. | Try to redirect a session whose context has already filled, or salvage by cherry-picking lines from a bad run. |
| Use hooks for narrow, deterministic safety checks; keep `PreToolUse` for must-block, `PostToolUse` for should-clean-up. | Encode taste as a hook, inject paragraph-length context via `UserPromptSubmit`, or leave demo hooks active across labs. |

## What Good Looks Like

By the end of the course, this card should feel usable under time pressure. If you would not actually consult it before a real task, tighten it until you would.

## Use In This Workspace

Keep this card close to:

- the learner workspace guide in `lab-materials/student-workspace-guide.md`
- the Claude Code lab markdown set in `lab-materials/`

## Final Check

Before starting meaningful Claude Code-assisted work in this repo, ask:

1. Do I understand the real runtime direction and repo conventions?
2. Do I need a plan, a skill, a workflow artifact, a repo-config change, or a reference file?
3. How will I verify the result?
4. What needs to be updated so the next session does not rediscover my work?

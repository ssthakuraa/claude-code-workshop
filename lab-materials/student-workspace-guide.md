# Start Here: Learner Workspace Guide

Read this first.

This guide is the short orientation for the learner workspace. It tells you what this training is, how to move through it, and which repo rules stay true across the whole lab sequence.

Use [Setup](./claudelabsetup.md) for the actual machine bring-up steps. Use the numbered labs for the hands-on exercises.

---

## What This Training Is

This training is a hands-on introduction to using Claude Code in a realistic enterprise-style repository. Your learner workspace is the repo root: the directory that contains `CLAUDE.md`, `backend/`, `frontend/`, `database/`, and `lab-materials/`.

This workspace is a learner starter, not a fully completed application. Some lab-taught slices are intentionally incomplete. Use `lab-materials/` for learner-facing instructions and use `reference/` only when a lab explicitly tells you to.

The training focuses on three themes that make collaboration with AI coding agents effective in real project work.

1. **Context engineering**
   Agentic tools are broadly capable, but they do not start with your enterprise standards, architecture, or domain knowledge. This training shows how to provide that context through prompts, `CLAUDE.md`, skills, and supporting documentation so the agent can produce better results.

2. **Structured engineering workflows with agents**
   Effective use of AI agents depends on disciplined, repeatable workflows. The labs introduce patterns for planning, design, iterative prompting, coding, review, testing, and refinement so the work stays consistent and verifiable.

3. **Mindset shift: agent as a peer programmer**
   Agentic coding tools are not just IDE features or simple code generators. This training treats the agent as a collaborative engineer that must be onboarded with context, guided through tradeoffs, and used as a partner for exploration, implementation, and refinement.

---

## Chapter Map

| Chapter | Main Focus |
|---|---|
| [Setup](./claudelabsetup.md) | Prepares the learner machine, aligns the database settings, and proves the learner workspace can build, run, and open correctly before the real labs begin. |
| [CLAUDE.md — Your Enterprise Constitution](./claudelab01.md) | Shows why project-specific guidance matters by letting you observe Claude Code without enough conventions, then turning those corrections into durable `CLAUDE.md` rules. |
| [Planning Discipline — Think Before You Build](./claudelab02.md) | Teaches the habit of planning before implementation so Claude Code work starts from a repo-grounded design instead of jumping straight into code. |
| [Skills & Reusable Workflows — Repo Skills](./claudelab03.md) | Demonstrates how to capture repeatable patterns as skills so you stop restating the same scaffolding and verification instructions by hand. |
| [Context Management — The #1 Performance Lever](./claudelab04.md) | Teaches how context quality drives output quality and how to keep Claude Code focused by choosing the right files, summaries, and session boundaries. |
| [Hooks — Structural Guardrails](./claudelab05.md) | Walks the full Claude Code hook surface — PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, Notification — so you know which hook is the right tool, when a hook is the wrong tool, and how to layer them without producing noise. |
| [Bad-Agent Recovery — Catching and Correcting Drift](./claudelab06.md) | Teaches the moves that catch drift early, redirect surgically, and salvage usable work when an agent run goes off-track, using a pre-baked simulated transcript so the practice is concrete. |
| [Delegated Review — Fresh Context Beats Self-Review](./claudelab07.md) | Introduces delegated builder and reviewer agents so you can compare same-context work with fresh-context review. |
| [Parallel Sessions & Isolated Workspaces](./claudelab08.md) | Shows how to run multiple workstreams safely in parallel by separating workspace copies, responsibilities, and verification. |
| [Verification Loops — The Quality Multiplier](./claudelab09.md) | Teaches the habit of proving work through tests, runtime checks, and visual verification instead of stopping at “the code looks done.” |
| [MCP Servers — Playwright & Browser Verification](./claudelab10.md) | Shows how to extend Claude Code with browser tooling so it can inspect the running app and verify behavior visually, not just through static code review. |
| [Data Verification — Runtime Data Checks](./claudelab11.md) | Connects UI and API behavior back to the database so you can confirm that application actions produced the expected runtime data changes. |
| [Enterprise Governance — Rollout Readiness, Safety Posture & Evidence](./claudelab12.md) | Focuses on bounded rollout, safety posture, and evidence gathering so agentic work is ready for enterprise review and controlled adoption. |
| [Optional Capstone — End-to-End Feature Build](./claudelab13.md) | Combines the full workflow into one feature exercise so you can practice planning, context, implementation, review, and verification together. |
| [Claude Code Lab Reference Card — Best Practices Summary](./claudelab-reference.md) | Condenses the full training into a short operating card you can reuse later without rereading the whole course. |

---

## What To Expect

- You may clone the repo with Git or download it as a GitHub zip and extract it anywhere you have normal developer access. The labs should not assume `/scratch`, `/tmp`, or any company-internal staging path.
- Some labs are intentionally incomplete so you can observe how Claude Code behaves before adding better guidance.
- The root workspace is intentionally incomplete in a few places so the labs have real work to do. Do not treat a missing file or disabled route as accidental drift until you check the current lab and `reference/`.
- This is a teaching lab for Claude Code features and workflow discipline. Avoid diluting that by having Claude Code mine `frontend/` or `backend/` for example implementations unless the current lab explicitly tells it to inspect those files.
- Read `CLAUDE.md` before treating any imported lab instruction as authoritative. If a lab chapter conflicts with `CLAUDE.md` or the current shared docs under `lab-materials/docs/`, the repo rules win.
- When a lab says "workspace root" or "project root", use your actual local repo path, for example `~/projects/claude-code-workshop` or `/scratch/training/claude-code-workshop`.
- Use current repo commands and environment prerequisites. Do not resurrect bundled Java, Maven, Node, browser, or SQL tooling under `runtime/`.
- For backend work on this host, explicitly use JDK 21:
  - `JAVA_HOME=/usr/lib/jvm/java-21-openjdk`
  - `PATH=/usr/lib/jvm/java-21-openjdk/bin:$PATH`
- For database setup and verification, prefer PostgreSQL-oriented flows that target `database/hrschema.sql` and `database/hrdemo.sql`.
- Before running the repo-local bootstrap or loading schema/demo data, make sure PostgreSQL server is installed locally and that the database/user from `dbdetails.md` already exist.
- For a normal local PostgreSQL install, port `5432` is the usual default. If your machine already uses a different PostgreSQL port, update `dbdetails.md` first so the learner setup steps match your real local environment.
- If the app-user connection command does not work yet, stop and finish local PostgreSQL setup first. Do not continue until a command like `PGPASSWORD=hrapp psql -h localhost -U hrapp -d hrdb -c "select current_user, current_database();"` works cleanly.
- For learner bring-up, do the database path sequentially:
  - verify connection first
  - then run `./lab-materials/setup-local-config.sh`
  - then load `database/hrschema.sql`
  - then load `database/hrdemo.sql`
  - then run a verification query
- For local bring-up in this repo, prefer frontend `5182` and backend `18082` unless a chapter explicitly says otherwise.
- If those default ports work on your machine, do not change them. Continue with the lab as written.
- If those default ports conflict with something already running, change only your local config files:
  - backend: `backend/.env.local`
  - frontend: `frontend/.env.local`
- Keep frontend and backend aligned when you change ports:
  - backend port: `HR_APP_PORT`
  - frontend dev port: `HR_DEV_SERVER_PORT`
  - frontend API proxy target: `HR_API_PROXY_TARGET`
- For local config bootstrap and validation, use `./lab-materials/setup-local-config.sh`.
- On a fresh GitHub clone or extracted zip, expect to install frontend dependencies before the first frontend build or dev-server run.
- Playwright default in this lab is Chrome/Chromium-first. Use Firefox only when a task explicitly calls for it and the host can launch it cleanly.
- Some commands take time. Wait for build, startup, and verification steps to finish before moving on.
- If a chapter offers a `reference/` escape hatch, use it only when that chapter tells you to. The copies under `reference/labXX/` are rescue material, not the main workspace.

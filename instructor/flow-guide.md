# Instructor Flow Guide

## Overview

This guide covers pacing, transitions, common student blockers, and recovery strategies for each day. Read this before the workshop.

---

## General Principles

### Pacing Rules
- **Lectures:** 20–30 min max. Enterprise devs want to type, not listen.
- **Labs:** 45–60 min. Always pad 10 min for setup issues.
- **Transitions:** 5 min between modules. Use this to check stragglers.
- **Daily retro:** 15 min end-of-day to capture "what surprised you?" moments.

### The #1 Risk: Students Falling Behind
If a student is stuck >5 min, they should:
1. Try the **escape hatch** (collapsible section in each lab with the exact prompt)
2. If still stuck, `git checkout checkpoint/dayN-start` and resume from known state
3. Flag the instructor — it's likely a setup issue, not a skill issue

### How to Demo
- Always live-code the first exercise of each lab while students watch
- Deliberately make a mistake during the demo (e.g., forget a CLAUDE.md rule) — students see the failure and the recovery
- Then students do exercises 2+ independently

### API Key Cost
- Estimate: ~$15–25 per student per day with Sonnet
- Opus sessions (Plan Mode, ultrathink) are more expensive — call this out
- If budget is tight: use Sonnet for all labs, Opus only for Lab 10 (Thinking Modes)

---

## Day 1 — Foundation (Labs 1–4)

### Theme: *"Teach Claude Your Enterprise"*

**Key message to land:** Claude is powerful but ignorant of your codebase. Today you'll teach it — and everything you teach it compounds.

### Schedule

| Time | Activity | Duration |
|------|----------|----------|
| 9:00 | **Welcome & Setup Check** | 30 min |
| 9:30 | **Lecture: The Mindset Shift** | 20 min |
| 9:50 | **Lecture: CLAUDE.md Deep Dive** | 20 min |
| 10:10 | **Lab 1: CLAUDE.md** | 60 min |
| 11:10 | Break | 15 min |
| 11:25 | **Lecture: Plan Mode & the 4-Phase Workflow** | 20 min |
| 11:45 | **Lab 2: Plan Mode** | 60 min |
| 12:45 | Lunch | 60 min |
| 13:45 | **Lecture: Skills, Commands & On-Demand Knowledge** | 20 min |
| 14:05 | **Lab 3: Skills & Commands** | 60 min |
| 15:05 | Break | 15 min |
| 15:20 | **Lecture: Context Window — Why It's the #1 Constraint** | 20 min |
| 15:40 | **Lab 4: Context Management** | 45 min |
| 16:25 | **Day 1 Retro** | 15 min |
| 16:40 | End | — |

### Instructor Notes

**Lab 1 critical moment:** When students see Claude use `@Where` (deprecated) instead of `@SQLRestriction` because the CLAUDE.md rule is missing — this is the "aha" moment. Make sure you don't rush past it. Ask: *"Who here has a codebase where Claude would make a similar mistake? What rule would you write?"*

**Lab 2 transition:** Before Lab 2, show a 2-minute demo of Plan Mode failing without it — Claude implementing `hireEmployee()` without job_history. Then show the Plan Mode output that catches it. The contrast should be visceral.

**Lab 3 scaffolding:** Students who finish early can scaffold a third entity (Location). Don't wait for everyone — let fast students explore while you help slower ones.

**Lab 4 is shorter intentionally.** Context management is conceptual — the lab reinforces it, but the real learning happens when they hit context limits naturally in Days 2–4.

### Common Blockers — Day 1

| Blocker | Recovery |
|---------|----------|
| `mvn` not found or wrong Java version | `sdk install java 21.0.5-tem && sdk install maven 3.9.9` |
| Claude ignores CLAUDE.md | File not in project root, or named wrong. Check `ls -la CLAUDE.md` |
| Plan Mode not activating | `Shift+Tab` twice (not once). Or type `/plan` |
| MySQL connection refused | `docker start hr-mysql` or check port 3306 |

---

## Day 2 — Productivity (Labs 5–8)

### Theme: *"Scale and Automate"*

**Key message to land:** Individual productivity is good. Encoded, automated, parallel productivity is enterprise-grade.

### Schedule

| Time | Activity | Duration |
|------|----------|----------|
| 9:00 | **Day 1 Recap & Q&A** | 15 min |
| 9:15 | **Lecture: Hooks — Your Enterprise Guardrails** | 25 min |
| 9:40 | **Lab 5: Hooks** | 60 min |
| 10:40 | Break | 15 min |
| 10:55 | **Lecture: Subagents — Fresh Context, Focused Work** | 20 min |
| 11:15 | **Lab 6: Subagents** | 60 min |
| 12:15 | Lunch | 60 min |
| 13:15 | **Lecture: Parallel Sessions & Git Worktrees** | 20 min |
| 13:35 | **Lab 7: Parallel Sessions** | 60 min |
| 14:35 | Break | 15 min |
| 14:50 | **Lecture: Verification — The #1 Quality Multiplier** | 20 min |
| 15:10 | **Lab 8: Verification Loops** | 60 min |
| 16:10 | **Day 2 Retro** | 15 min |
| 16:25 | End | — |

### Instructor Notes

**Lab 5 is the enterprise "aha" lab.** When the schema.sql hook blocks Claude's edit, it clicks: *"Hooks make rules structural, not advisory."* Give this moment space. Ask: *"What's the most dangerous file in YOUR codebase that you'd protect with a PreToolUse hook?"*

**Lab 6 builder vs reviewer demo:** Show the same code reviewed by the session that wrote it (finds nothing) vs a fresh subagent (finds 2-3 issues). This is visually compelling and maps directly to enterprise code review workflows.

**Lab 7 requires terminal setup.** Students need 2-3 terminal tabs/windows. Check that everyone can run `git worktree add` before starting. If anyone's git is too old, pair them with someone.

**Lab 8 ties Day 2 together.** Verification loops use hooks (Lab 5), can be delegated to subagents (Lab 6), and run in parallel sessions (Lab 7). Make this connection explicit.

### Common Blockers — Day 2

| Blocker | Recovery |
|---------|----------|
| Hook not firing | Check `.claude/settings.json` is valid JSON. Missing comma is the usual culprit. |
| Subagent not returning | Set timeout. Long-running agents should have a `timeout` parameter. |
| Git worktree conflict | `git worktree prune` to clean stale worktrees |
| Tests failing in verification | Check that backend is running. `mvn spring-boot:run` in another terminal. |

---

## Day 3 — Integration (Labs 9–10)

### Theme: *"Connect Claude to Your Ecosystem"*

**Key message to land:** MCP turns Claude from a code-only tool into an ecosystem-aware tool. Databases, browsers, APIs — Claude can interact with all of them.

### Schedule

| Time | Activity | Duration |
|------|----------|----------|
| 9:00 | **Day 2 Recap & Q&A** | 15 min |
| 9:15 | **Lecture: MCP — What It Is and Why It Matters** | 30 min |
| 9:45 | **Lab 9: Playwright MCP — Browser Verification** | 75 min |
| 11:00 | Break | 15 min |
| 11:15 | **Lab 10: MySQL MCP — Data Verification** | 75 min |
| 12:30 | Lunch | 60 min |
| 13:30 | **Lecture: The MCP Verification Loop (All Together)** | 20 min |
| 13:50 | **Workshop: MCP Loop Exercise** | 60 min |
| 14:50 | Break | 15 min |
| 15:05 | **Lecture: Thinking Modes & Effort Calibration** | 20 min |
| 15:25 | **Workshop: Thinking Modes Exercise** | 30 min |
| 15:55 | **Lecture: MCP Ecosystem Awareness** | 20 min |
| 16:15 | **Day 3 Retro** | 15 min |
| 16:30 | End | — |

### Instructor Notes

**MCP setup is the #1 blocker on Day 3.** Verify ALL students have:
- Playwright browsers installed (`npx playwright install chromium`)
- MySQL running and accessible
- `.mcp.json` in project root

Do a 10-min setup check before Lab 9. Fix issues before they cascade.

**Lab 9 Playwright demo:** Navigate to the HR dashboard, take a screenshot, ask Claude to verify the KPI cards match expected data. This is the "wow" moment — Claude is looking at a browser.

**Lab 10 MySQL demo:** Query employee data, verify a hire operation wrote to both `employees` and `job_history`. This shows MCP as a verification tool, not just a query tool.

**MCP Ecosystem lecture (end of day):** Cover Figma MCP, Slack MCP, Sentry MCP, Jira/Linear MCP, BigQuery MCP at awareness level. Show the `.mcp.json` config pattern. Students don't need to set these up — just understand the pattern is the same.

**Thinking Modes workshop is quick.** Same refactoring task at default vs `ultrathink`. 20 min hands-on. The before/after is dramatic enough to make the point without a long lab.

### Common Blockers — Day 3

| Blocker | Recovery |
|---------|----------|
| Playwright browser not found | `cd frontend && npx playwright install chromium` |
| MCP server not connecting | Check `.mcp.json` path. Restart Claude Code session. |
| MySQL MCP permission denied | Run `database/create-readonly-user.sql` as root |
| Thinking modes no visible difference | Use a genuinely complex task — simple tasks show no delta |

---

## Day 4 — Mastery (Labs 11–12)

### Theme: *"Operate at Enterprise Scale"*

**Key message to land:** You now have every tool. The capstone proves you can orchestrate them all into a production-grade workflow.

### Schedule

| Time | Activity | Duration |
|------|----------|----------|
| 9:00 | **Day 3 Recap & Q&A** | 15 min |
| 9:15 | **Lecture: CI/CD + Permissions + Enterprise Governance** | 30 min |
| 9:45 | **Lab 11: CI/CD & Permissions** | 75 min |
| 11:00 | Break | 15 min |
| 11:15 | **Lecture: Capstone Briefing — The Termination Flow** | 15 min |
| 11:30 | **Lab 12: Capstone (Part 1 — Plan & Setup)** | 60 min |
| 12:30 | Lunch | 60 min |
| 13:30 | **Lab 12: Capstone (Part 2 — Implement & Verify)** | 90 min |
| 15:00 | Break | 15 min |
| 15:15 | **Capstone Presentations & Code Walk** | 45 min |
| 16:00 | **Workshop Retro: Your Claude Code Adoption Plan** | 30 min |
| 16:30 | End | — |

### Instructor Notes

**Lab 11 Jenkins context:** Not all students will know Jenkins. That's fine — the lab teaches them to ask Claude to generate pipeline configs for ANY CI tool. The translation exercise (Jenkinsfile → GitLab CI) is the real lesson.

**Lab 12 is the payoff.** Students use everything: Plan Mode to design, skills to scaffold, hooks to enforce quality, subagents to build/review in parallel, MCP to verify, and the self-improvement loop to encode learnings. Give them space — resist the urge to help early. Struggle is part of the learning.

**Capstone presentations:** Have 3-4 students walk through their approach. Focus on: *"What technique did you use where, and why?"* — not on the code itself.

**Adoption Plan retro:** The final 30 minutes should produce a concrete takeaway: *"On Monday, what CLAUDE.md will you write for YOUR codebase? What hooks? What skills?"* Have students write 3 commitments on sticky notes or in a shared doc.

### Common Blockers — Day 4

| Blocker | Recovery |
|---------|----------|
| Capstone feels overwhelming | Remind: Plan Mode first. Break it into 4 phases. Don't start coding without a plan. |
| Student tries to do everything manually | Nudge: "What skill from Day 1 could you use here?" |
| Time pressure on capstone | Part 2 is 90 min. If someone is blocked at 60 min, have them checkpoint/day4-start and focus on the verification loop only. |

---

## Post-Workshop

### Student Takeaways
- Their grown CLAUDE.md (compare Day 1 vs Day 4)
- All lab files and exercises
- The HR app as a reference implementation
- A personal Claude Code adoption plan (3 commitments)

### Follow-Up Suggestions
- Schedule a 1-hour "30 days later" check-in
- Create a shared team CLAUDE.md in one real project
- Set up 2-3 hooks in their actual CI pipeline
- Share the reference sources: howborisusesclaudecode.com, code.claude.com/docs/en/best-practices

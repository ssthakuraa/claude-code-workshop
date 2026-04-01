# Presentation Decks — Outline & Speaker Notes

Each deck is delivered before its corresponding lab(s). Decks cover the **concept** — labs cover the **practice**.

---

## Day 1 — Foundation

### [Deck 1: The Mindset Shift](deck-01-mindset-shift.md)
- 20 min lecture, no lab (sets the mental model for the whole workshop)
- From writing code → describing intent
- The 3 core truths: context, planning, simplicity
- Boris Cherny quotes and workflow overview

### [Deck 2: CLAUDE.md Deep Dive](deck-02-claudemd.md)
- 20 min lecture → Lab 1
- What to include vs exclude, hierarchical files, team-shared via git
- Live demo: Claude failing without rules, then succeeding with them

### [Deck 3: Plan Mode & the 4-Phase Workflow](deck-03-plan-mode.md)
- 20 min lecture → Lab 2
- Explore → Plan → Implement → Commit
- When to plan vs when to skip

### [Deck 4: Skills, Commands & On-Demand Knowledge](deck-04-skills-commands.md)
- 20 min lecture → Lab 3
- Skills (auto-discovered) vs Commands (explicit invocation)
- SKILL.md anatomy, YAML frontmatter

### [Deck 5: Context Window — The #1 Constraint](deck-05-context.md)
- 20 min lecture → Lab 4
- The degradation curve (60/80/90%)
- /clear, /compact, subagents, fresh sessions

---

## Day 2 — Productivity

### [Deck 6: Hooks — Enterprise Guardrails](deck-06-hooks.md)
- 25 min lecture → Lab 5
- PreToolUse vs PostToolUse, advisory vs structural
- Enterprise governance: compliance, naming, safety

### [Deck 7: Subagents — Fresh Context, Focused Work](deck-07-subagents.md)
- 20 min lecture → Lab 6
- Built-in types, custom agents, Writer/Reviewer pattern
- Context isolation benefits

### [Deck 8: Parallel Sessions & Git Worktrees](deck-08-parallel.md)
- 20 min lecture → Lab 7
- Boris's 5+10 session workflow, worktree setup
- Shell aliases, notification-driven workflow

### [Deck 9: Verification — The #1 Quality Multiplier](deck-09-verification.md)
- 20 min lecture → Lab 8
- Test-driven, visual, data-driven strategies
- The 2-3 iteration loop, Boris quote on verification

---

## Day 3 — Integration

### [Deck 10: MCP — Connecting Claude to Your Ecosystem](deck-10-mcp-overview.md)
- 30 min lecture → Labs 9, 10
- What MCP is, .mcp.json config, security considerations
- Available servers: Playwright, MySQL, Figma, Slack, Sentry, Jira

### [Deck 11: The MCP Verification Loop](deck-11-mcp-loop.md)
- 20 min lecture → MCP Loop workshop
- Browser + API + Database = complete confidence
- When to use which MCP tool

### [Deck 12: Thinking Modes & Effort Calibration](deck-12-thinking-modes.md)
- 20 min lecture → Thinking Modes workshop
- think < think hard < think harder < ultrathink
- /effort command, matching effort to task complexity

### [Deck 13: MCP Ecosystem Awareness](deck-13-mcp-ecosystem.md)
- 20 min lecture, awareness only (no hands-on)
- Figma, Slack, Sentry, Jira/Linear, BigQuery
- The transferable pattern: add to .mcp.json, restart, Claude has new tools

---

## Day 4 — Mastery

### [Deck 14: CI/CD + Permissions + Enterprise Governance](deck-14-cicd-governance.md)
- 30 min lecture → Lab 11
- Makefile as contract, Jenkinsfile as orchestrator
- Permission profiles, three governance layers
- Pipeline translation demo

### [Deck 15: Capstone Briefing](deck-15-capstone-briefing.md)
- 15 min briefing → Lab 12
- The Transfer feature requirement
- Expected workflow: Plan → Tests → Implement → Review → Verify
- Presentation expectations

### [Deck 16: Workshop Retro & Adoption Plan](deck-16-retro.md)
- 30 min facilitated discussion, no slides needed
- Compare Day 1 CLAUDE.md vs Day 4 CLAUDE.md
- Three commitments exercise
- Follow-up scheduling

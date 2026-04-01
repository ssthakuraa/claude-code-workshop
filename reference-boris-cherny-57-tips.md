# Boris Cherny's 57 Tips for Claude Code

> Source: [howborisusesclaudecode.com](https://howborisusesclaudecode.com/)

---

## Parallel Execution & Scaling

### Multiple Sessions Strategy
- Run 5 simultaneous Claude Code instances using separate git checkouts (numbered tabs 1-5)
- Launch 5-10 additional sessions on claude.ai/code in parallel
- Use `&` command or `--teleport` flag to move between local and web contexts
- Implement git worktrees instead of checkouts for cleaner isolation

### Mobile & Desktop Integration
- Kick off sessions from Claude iOS app in morning, resume on desktop later
- Use `claude --worktree` to run instances without code conflicts

---

## Model & Planning Strategy

### Why Opus 4.5 with Thinking
- "It's the best coding model... less steering + better tool use = faster overall results," despite being slower per token
- Reduces iteration cycles despite larger model size

### Plan Mode as Foundation
- Start complex tasks in Plan mode (shift+tab twice)
- Iterate on plan until solid, then switch to auto-accept
- Momentum key: "don't keep pushing when things go sideways -- re-plan"
- Use separate Claude instance to review plans as staff engineer

---

## Knowledge Management

### CLAUDE.md as Living Documentation
- Single file checked into git, team contributes multiple times weekly
- Add entries whenever Claude makes mistakes: "Claude knows not to do it next time"
- Use `@.claude` tags on PRs to append learnings to CLAUDE.md automatically
- Practice "Compounding Engineering" -- progressively build institutional knowledge

### Memory Systems
- Use `/memory` to configure persistent memory between sessions
- Enable auto-memory for automatic preference/correction storage
- Use `/dream` for periodic memory consolidation via subagent review
- Build notes directories for tasks, update CLAUDE.md to reference them

---

## Workflow Automation

### Slash Commands for Inner Loops
- Create commands for frequent workflows in `.claude/commands/`
- Include inline Bash to pre-compute info (git status, etc.)
- Examples: `/commit-push-pr`, `/techdebt`, `/simplify`
- Check into git for team sharing

### Custom Agents & Subagents
- Store as `.md` files in `.claude/agents/` with custom names, colors, tool sets
- Pre-allow/disallow specific tools per agent
- Use for common PR workflows: code-simplifier, verify-app, build-validator
- Enable worktree isolation: add `isolation: worktree` to agent frontmatter
- Dispatch agent teams for specific concerns (logic, security, performance)

### Hooks for Deterministic Automation
- PostToolUse hooks: auto-format code after generation
- PostCompact hook: re-inject critical instructions after context compression
- WorktreeCreate/WorktreeRemove: support Mercurial, Perforce, SVN via custom commands
- Route permission requests to Opus 4.5 for attack scanning and auto-approval

---

## Tool Integration & Data

### MCP Servers & Integrations
- Connect Slack MCP to post messages, search threads, fix bugs from Slack directly
- Use BigQuery `bq` CLI for analytics queries without writing SQL
- Fetch error logs from Sentry; point Claude at Docker logs for distributed troubleshooting
- Create team `.mcp.json` and check into git

### Permissions & Safety
- Pre-allow common safe commands via `/permissions` instead of `--dangerously-skip-permissions`
- Use wildcard syntax: `"Bash(bun run *)"`, `"Edit(/docs/**)"`
- Enable sandboxing via `/sandbox` for file and network isolation
- Activate auto mode for built-in safety classifiers (auto-approve safe operations)

---

## Code Quality & Verification

### Verification as #1 Priority
- "Give Claude a way to verify its work... 2-3x the quality of final result"
- Use Chrome extension to test UI changes in real browser
- Verify via: test suites, Bash commands, simulators, browser testing
- Have Claude test every change before landing

### Advanced Prompting Techniques
- Challenge Claude: "Don't make a PR until I pass your test"
- Ask Claude to prove it works by diffing main vs. feature branch
- After mediocre fix: "Scrap this and implement the elegant solution"
- Write detailed specs to reduce ambiguity before handing off work

### Code Quality Automation
- Use `/simplify` with parallel agents to improve code, tune efficiency, ensure CLAUDE.md compliance
- Use `/batch` to plan then execute migrations in parallel (each in own worktree, each with independent PR)

---

## Terminal & Environment Setup

### Development Environment
- Use Ghostty for synchronized rendering, 24-bit color, proper Unicode
- Color-code and name terminal tabs by task/worktree; consider tmux
- Use `/statusline` to show context usage, git branch, cost, time
- Enable shift+enter for newlines via `/terminal-setup`
- Use voice dictation (fn x2 on macOS) for 3x faster, more detailed prompts

### Configuration & Customization
- Run `/vim` for vim mode, `/config` for theme/output style
- Customize every keybinding via `/keybindings`; settings live-reload
- Create custom spinner verbs for personality via settings.json
- Set `/model` effort: Low (fast), Medium (default), High (more intelligence), Max (unlimited reasoning)

---

## Advanced Features

### Scheduled & Long-Running Tasks
- `/loop` for recurring tasks up to 3 days locally; runs on an interval
- `/schedule` for cloud-based jobs that run beyond closed laptop (like cron)
- Use background agents when Claude finishes long tasks
- Use `--permission-mode=dontAsk` for uninterrupted execution in sandboxed environments

### Session Management
- Use `--name` flag to name sessions at launch
- Auto-naming after plan mode based on task description
- Use `/color` to visually distinguish parallel sessions
- Remote control sessions: spawn from mobile via `claude remote-control`

### Output & Learning
- Set output style to "Explanatory" or "Learning" via `/config`
- Have Claude generate HTML presentations explaining unfamiliar code
- Use ASCII diagrams to visualize protocols and codebases
- Build spaced-repetition learning skills: explain understanding, Claude fills gaps

### Question Mid-Task
- Use `/btw` slash command to ask questions during Claude's work without breaking flow
- Single-turn with full context, no tool calls

---

## Plugins & Extensions

### Extensibility
- Run `/plugin` to browse and install LSPs, MCPs, skills, custom hooks
- Create company-wide plugin marketplaces; check `settings.json` into codebase
- iMessage plugin available: text Claude like a contact from any Apple device

### Bug Fixing Patterns
- Paste Slack bug thread: just say "fix" (with Slack MCP enabled)
- Command: "Go fix the failing CI tests" (no micromanaging)
- Docker logs for distributed system troubleshooting

---

## Enterprise & Team Scale

### Parallel Architecture
- Create 3-5 git worktrees simultaneously, each with own Claude session
- Recommended: use worktrees over checkouts (native Desktop app support)
- Dedicate "analysis" worktree for reading logs and running queries
- Use shell aliases (za, zb, zc) for one-keystroke worktree switching

### Permissions & Governance
- Set default agent in `settings.json` or use `--agent` flag
- Support configuring: by codebase, by sub-folder, per-user, or enterprise-wide
- System uses combination of "prompt injection detection, static analysis, sandboxing, human oversight"
- 37 settings and 84 environment variables available

### Code Review Automation
- Dispatch specialized agent team on every PR
- Each agent focuses on different concern (logic, security, performance)
- Posts inline comments on real bugs directly to PR
- Anthropic's own output/engineer increased 200% year-over-year with this system

---

## Custom Skills Development

### 9 Skill Types (from Production)

1. Library & API reference
2. Product verification (drive running product)
3. Data & analysis (IDs, query patterns)
4. Business automation (multi-tool workflows)
5. Scaffolding & templates
6. Code quality & review (adversarial review, style, testing)
7. CI/CD & deployment
8. Incident runbooks (symptom -> investigation)
9. Infrastructure ops (safety-gated cleanup)

### Skill Authoring Best Practices

- Build Gotchas section (highest-signal content)
- Use progressive disclosure: hub file (SKILL.md) with spokes
- Don't railroad; give info, let Claude adapt
- Write descriptions for the model (trigger phrases), not humans
- Store config in config.json; ask on first run if missing
- Include helper scripts for composition vs. reconstruction
- Use on-demand hooks for session-scoped guardrails: `/careful` blocks `rm -rf`, `/freeze` locks edits

### Distribution

- Check into git under `.claude/skills/`
- Team shares across all projects
- Skill marketplace integration for company-wide adoption

---

**Installation Pattern**: `mkdir -p ~/.claude/skills/[name] && curl -L -o ~/.claude/skills/[name]/SKILL.md [url]`

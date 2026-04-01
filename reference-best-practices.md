# Claude Code Best Practices for Complex Enterprise Codebases

> Sourced from Boris Cherny (Claude Code creator), official Anthropic docs, and enterprise adoption patterns.

---

## 1. CLAUDE.md as Living Institutional Knowledge

- **Compounding Engineering**: Every time Claude makes a mistake, tell it to update CLAUDE.md so it never repeats it. The file compounds in value over time.
- Keep it **under ~200 lines** — bloated files cause Claude to ignore rules.
- **Prefer pointers over copies**: use `file:line` references instead of pasting code snippets (they go stale).
- Use `@` imports to reference other docs: `@docs/git-instructions.md`.
- Place CLAUDE.md at multiple levels:
  - Root (team-wide)
  - Subdirectories (domain-specific)
  - `~/.claude/CLAUDE.md` (personal prefs)
- Check it into git so the whole team contributes.

### What to Include vs Exclude

| Include | Exclude |
|---|---|
| Bash commands Claude can't guess | Anything Claude can figure out by reading code |
| Code style rules that differ from defaults | Standard language conventions Claude already knows |
| Testing instructions and preferred test runners | Detailed API documentation (link to docs instead) |
| Repository etiquette (branch naming, PR conventions) | Information that changes frequently |
| Architectural decisions specific to your project | Long explanations or tutorials |
| Developer environment quirks (required env vars) | File-by-file descriptions of the codebase |
| Common gotchas or non-obvious behaviors | Self-evident practices like "write clean code" |

### Example CLAUDE.md

```markdown
# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
```

### Importing Other Files

```markdown
See @README.md for project overview and @package.json for available npm commands.

# Additional Instructions
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

---

## 2. Plan Mode -> Auto-Accept Pattern

Boris's #1 workflow for complex tasks:

1. Enter **Plan Mode** (`Shift+Tab` twice)
2. Pour energy into iterating the plan until it's solid
3. Switch to **auto-accept mode** so Claude executes the entire implementation in one shot
4. Use a **separate Claude instance** to review the plan as a "staff engineer"

### Four-Phase Workflow

1. **Explore**: Enter Plan Mode. Claude reads files and answers questions without making changes.
2. **Plan**: Ask Claude to create a detailed implementation plan. Press `Ctrl+G` to open the plan in your text editor.
3. **Implement**: Switch to Normal Mode and let Claude code, verifying against its plan.
4. **Commit**: Ask Claude to commit with a descriptive message and create a PR.

> Plan Mode is most useful when you're uncertain about the approach, when the change modifies multiple files, or when you're unfamiliar with the code being modified. If you could describe the diff in one sentence, skip the plan.

---

## 3. Parallel Sessions with Git Worktrees

Boris calls this the **single biggest productivity unlock**:

- Spin up 3-5 git worktrees, each running its own Claude session
- No code conflicts between sessions
- Use shell aliases (`za`, `zb`, `zc`) for one-keystroke switching
- Dedicate an "analysis" worktree just for reading logs and running queries
- Run 5-10 additional sessions on claude.ai/code in parallel

### Writer/Reviewer Pattern

| Session A (Writer) | Session B (Reviewer) |
|---|---|
| `Implement a rate limiter for our API endpoints` | |
| | `Review the rate limiter implementation in @src/middleware/rateLimiter.ts. Look for edge cases, race conditions, and consistency with our existing middleware patterns.` |
| `Here's the review feedback: [Session B output]. Address these issues.` | |

---

## 4. Skills for Custom Libraries & Domain Knowledge

Unlike CLAUDE.md (loaded every session), **skills load on-demand** — keeping context lean.

### Example Skill

```markdown
# .claude/skills/api-conventions/SKILL.md
---
name: api-conventions
description: REST API design conventions for our services
---
# API Conventions
- Use kebab-case for URL paths
- Use camelCase for JSON properties
- Always include pagination for list endpoints
- Version APIs in the URL path (/v1/, /v2/)
```

### Example Workflow Skill

```markdown
# .claude/skills/fix-issue/SKILL.md
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---
Analyze and fix the GitHub issue: $ARGUMENTS.

1. Use `gh issue view` to get the issue details
2. Understand the problem described in the issue
3. Search the codebase for relevant files
4. Implement the necessary changes to fix the issue
5. Write and run tests to verify the fix
6. Ensure code passes linting and type checking
7. Create a descriptive commit message
8. Push and create a PR
```

Run `/fix-issue 1234` to invoke it.

### 9 Skill Types for Enterprise (from Boris)

1. **Library & API reference** — internal frameworks, custom libraries
2. **Product verification** — drive the running product
3. **Data & analysis** — IDs, query patterns
4. **Business automation** — multi-tool workflows
5. **Scaffolding & templates** — boilerplate generation
6. **Code quality & review** — adversarial review, style, testing
7. **CI/CD & deployment** — pipeline automation
8. **Incident runbooks** — symptom to investigation
9. **Infrastructure ops** — safety-gated cleanup

### Skill Authoring Best Practices

- Build a **Gotchas section** — highest-signal content
- Use **progressive disclosure**: hub file (`SKILL.md`) with spoke files
- Don't railroad; give info, let Claude adapt
- Write descriptions for the model (trigger phrases), not humans
- Store config in `config.json`; ask on first run if missing
- Include **helper scripts** so Claude composes rather than reconstructs boilerplate
- Use on-demand hooks for session-scoped guardrails: `/careful` blocks `rm -rf`, `/freeze` locks edits

### Skills Hierarchy (Enterprise)

When skills share the same name across levels, higher-priority locations win:
**enterprise > personal > project**

Plugin skills use a `plugin-name:skill-name` namespace, so they cannot conflict with other levels.

---

## 5. Subagents to Protect Context

Context is the fundamental constraint. Subagents run in **separate context windows** and report back summaries.

```
Use subagents to investigate how our authentication system handles token
refresh, and whether we have any existing OAuth utilities I should reuse.
```

- Use them for code review (fresh context = less bias toward code Claude just wrote)
- Dispatch specialized agent teams on every PR (logic, security, performance)
- Each agent focuses on different concern and posts inline comments

---

## 6. Custom Subagents for Specialized Review

```markdown
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling

Provide specific line references and suggested fixes.
```

Tell Claude to use subagents explicitly: *"Use a subagent to review this code for security issues."*

---

## 7. Hooks for Deterministic Guardrails

For things that **must happen 100% of the time** — unlike CLAUDE.md rules which are advisory, hooks are guaranteed:

- **PostToolUse hooks**: auto-format code after every edit
- **PostCompact hook**: re-inject critical instructions after context compression
- **WorktreeCreate/WorktreeRemove**: support Mercurial, Perforce, SVN via custom commands
- Auto-run linting, security checks on every file change

Claude can write hooks for you:
- *"Write a hook that runs eslint after every file edit"*
- *"Write a hook that blocks writes to the migrations folder."*

---

## 8. Context Management Discipline

### Common Failure Patterns

| Pattern | Fix |
|---|---|
| **Kitchen sink session** — mixing unrelated tasks | `/clear` between unrelated tasks |
| **Correcting over and over** — polluted context with failed approaches | After 2 failed corrections, `/clear` and write a better prompt |
| **Over-specified CLAUDE.md** — rules get lost in noise | Ruthlessly prune. If Claude does it correctly without the instruction, delete it |
| **Trust-then-verify gap** — plausible but broken code | Always provide verification (tests, scripts, screenshots) |
| **Infinite exploration** — reads hundreds of files | Scope narrowly or use subagents |

### Context Management Commands

- `/clear` — reset context between tasks
- `/compact <instructions>` — control what survives summarization (e.g., `/compact Focus on the API changes`)
- `/btw` — side questions that don't pollute context
- `/rewind` — restore previous conversation and code state
- `Esc` — stop Claude mid-action, redirect
- `Esc + Esc` — open rewind menu

### Customizing Compaction

Add to CLAUDE.md: `"When compacting, always preserve the full list of modified files and any test commands"`

---

## 9. Verification-First Development

Boris says this is the **single highest-leverage thing**:

| Strategy | Before | After |
|---|---|---|
| Provide verification criteria | "implement a function that validates email addresses" | "write a validateEmail function. test cases: user@example.com is true, invalid is false. run the tests after implementing" |
| Verify UI changes visually | "make the dashboard look better" | "[paste screenshot] implement this design. take a screenshot and compare. list differences and fix them" |
| Address root causes | "the build is failing" | "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error" |

- Use the Chrome extension for UI verification
- Have Claude write a failing test first, then fix it
- Challenge Claude: *"Don't make a PR until I pass your test"*

---

## 10. Clean Codebase = Better AI Output

From Boris's time at Meta: **partially-migrated codebases with multiple frameworks confuse both humans and models**. Clean, consistent codebases meaningfully boost Claude's output quality.

---

## 11. Enterprise-Specific Patterns

| Technique | Purpose |
|---|---|
| **Hierarchical skills** (enterprise > personal > project) | Enforce org-wide standards while allowing team customization |
| **Team `.mcp.json` in git** | Shared tool integrations (Slack, Sentry, DBs) |
| **Permission allowlists** | Pre-approve safe commands instead of clicking through approvals |
| **Fan-out pattern** | Loop `claude -p` over thousands of files for large migrations |
| **Agent teams** | Automated coordination of multiple sessions with shared tasks and a team lead |
| **Code intelligence plugins** | Give Claude precise symbol navigation for typed languages |
| **On-demand hooks** (`/careful`, `/freeze`) | Session-scoped guardrails for sensitive operations |
| **Sandboxing** (`/sandbox`) | OS-level file and network isolation |
| **Auto mode** | Classifier-based approval for uninterrupted execution |

---

## 12. Prompting Techniques

- Reference existing patterns: *"look at how existing widgets are implemented. HotDogWidget.php is a good example. follow the pattern."*
- Let Claude interview you: *"I want to build [brief description]. Interview me in detail using the AskUserQuestion tool."*
- Scope investigations: *"read /src/auth and understand how we handle sessions"* (not just "investigate auth")
- After mediocre output: *"Scrap this and implement the elegant solution"*
- Write detailed specs to reduce ambiguity before handing off work

---

## 13. CLI Tools and MCP Integration

- Install `gh` CLI for GitHub operations (PRs, issues, comments)
- Connect MCP servers: `claude mcp add` for Notion, Figma, databases, Slack
- Use CLI tools Claude doesn't know: *"Use 'foo-cli-tool --help' to learn about foo tool, then use it to solve A, B, C."*
- Pipe data: `cat error.log | claude`

---

## 14. Scaling with Non-Interactive Mode

```bash
# One-off queries
claude -p "Explain what this project does"

# Fan-out migrations
for file in $(cat files.txt); do
  claude -p "Migrate $file from React to Vue. Return OK or FAIL." \
    --allowedTools "Edit,Bash(git commit *)"
done

# Structured output for scripts
claude -p "List all API endpoints" --output-format json
```

---

## 15. Session Management

- `claude --continue` — resume most recent conversation
- `claude --resume` — select from recent conversations
- `/rename` — give sessions descriptive names like "oauth-migration"
- `claude --worktree` — run instances without code conflicts
- `/color` — visually distinguish parallel sessions
- `/model` effort levels: Low (fast), Medium (default), High (more intelligence), Max (unlimited reasoning)

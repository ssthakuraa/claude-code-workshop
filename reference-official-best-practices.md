# Official Claude Code Best Practices

> Source: [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)

---

## Core Constraint

Most best practices are based on one constraint: **Claude's context window fills up fast, and performance degrades as it fills.**

Claude's context window holds your entire conversation, including every message, every file Claude reads, and every command output. LLM performance degrades as context fills -- Claude may start "forgetting" earlier instructions or making more mistakes.

Track context usage continuously with a custom status line, and use strategies to reduce token usage.

---

## 1. Give Claude a Way to Verify Its Work

**This is the single highest-leverage thing you can do.**

Claude performs dramatically better when it can verify its own work -- run tests, compare screenshots, and validate outputs.

| Strategy | Before | After |
|---|---|---|
| Provide verification criteria | "implement a function that validates email addresses" | "write a validateEmail function. test cases: user@example.com is true, invalid is false. run the tests after implementing" |
| Verify UI changes visually | "make the dashboard look better" | "[paste screenshot] implement this design. take a screenshot and compare. list differences and fix them" |
| Address root causes | "the build is failing" | "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error" |

Verification can be a test suite, a linter, or a Bash command that checks output.

---

## 2. Explore First, Then Plan, Then Code

Separate research and planning from implementation to avoid solving the wrong problem. Use Plan Mode.

### Four Phases

1. **Explore** — Enter Plan Mode. Claude reads files and answers questions without making changes.
2. **Plan** — Ask Claude to create a detailed implementation plan. Press `Ctrl+G` to open in editor.
3. **Implement** — Switch to Normal Mode and let Claude code, verifying against its plan.
4. **Commit** — Ask Claude to commit with a descriptive message and create a PR.

> Plan Mode is most useful when you're uncertain about the approach, when the change modifies multiple files, or when you're unfamiliar with the code. If you could describe the diff in one sentence, skip the plan.

---

## 3. Provide Specific Context in Your Prompts

| Strategy | Before | After |
|---|---|---|
| Scope the task | "add tests for foo.py" | "write a test for foo.py covering the edge case where the user is logged out. avoid mocks." |
| Point to sources | "why does ExecutionFactory have such a weird api?" | "look through ExecutionFactory's git history and summarize how its api came to be" |
| Reference existing patterns | "add a calendar widget" | "look at how existing widgets are implemented on the home page. HotDogWidget.php is a good example. follow the pattern..." |
| Describe the symptom | "fix the login bug" | "users report that login fails after session timeout. check the auth flow in src/auth/, especially token refresh. write a failing test that reproduces the issue, then fix it" |

### Provide Rich Content

- **Reference files with `@`** instead of describing where code lives
- **Paste images directly** — copy/paste or drag and drop
- **Give URLs** for documentation and API references
- **Pipe in data** — `cat error.log | claude`
- **Let Claude fetch what it needs** — Bash commands, MCP tools, reading files

---

## 4. Write an Effective CLAUDE.md

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

### Key Principles

- Keep it concise. For each line, ask: "Would removing this cause Claude to make mistakes?" If not, cut it.
- Tune instructions by adding emphasis (e.g., "IMPORTANT" or "YOU MUST") to improve adherence.
- Check CLAUDE.md into git so your team can contribute.
- Treat CLAUDE.md like code: review it when things go wrong, prune it regularly.

### Placement

- **Home folder (`~/.claude/CLAUDE.md`)**: applies to all sessions
- **Project root (`./CLAUDE.md`)**: check into git for team
- **Parent directories**: useful for monorepos
- **Child directories**: pulled in on demand

---

## 5. Configure Permissions

Three ways to reduce permission interruptions:

- **Auto mode**: classifier model reviews commands, blocks only risky ones
- **Permission allowlists**: permit specific safe tools like `npm run lint`
- **Sandboxing**: OS-level isolation restricting filesystem and network access

---

## 6. Use CLI Tools

CLI tools are the most context-efficient way to interact with external services. Install `gh` for GitHub, `aws`, `gcloud`, `sentry-cli` etc.

Claude can learn new CLI tools: *"Use 'foo-cli-tool --help' to learn about foo tool, then use it to solve A, B, C."*

---

## 7. Connect MCP Servers

Run `claude mcp add` to connect external tools like Notion, Figma, or your database.

---

## 8. Set Up Hooks

Hooks run scripts automatically at specific points in Claude's workflow. Unlike CLAUDE.md instructions which are advisory, **hooks are deterministic**.

Claude can write hooks for you:
- "Write a hook that runs eslint after every file edit"
- "Write a hook that blocks writes to the migrations folder"

---

## 9. Create Skills

Skills extend Claude's knowledge with project/team/domain-specific information. They load on-demand, not every session.

Create in `.claude/skills/` with `SKILL.md` files.

---

## 10. Create Custom Subagents

Define specialized assistants in `.claude/agents/` that run in their own context with their own allowed tools.

---

## 11. Install Plugins

Run `/plugin` to browse the marketplace. Plugins bundle skills, hooks, subagents, and MCP servers.

---

## 12. Communicate Effectively

### Ask Codebase Questions
Ask Claude the same questions you'd ask another engineer:
- How does logging work?
- How do I make a new API endpoint?
- What edge cases does `CustomerOnboardingFlowImpl` handle?

### Let Claude Interview You
For larger features, have Claude interview you first:
```
I want to build [brief description]. Interview me in detail using the AskUserQuestion tool.
Ask about technical implementation, UI/UX, edge cases, concerns, and tradeoffs.
Keep interviewing until we've covered everything, then write a complete spec to SPEC.md.
```

---

## 13. Manage Your Session

### Course-Correct Early
- `Esc` — stop mid-action, redirect
- `Esc + Esc` or `/rewind` — restore previous state
- `"Undo that"` — revert changes
- `/clear` — reset context between unrelated tasks

> If you've corrected Claude more than twice on the same issue, `/clear` and start fresh with a better prompt.

### Manage Context Aggressively
- Use `/clear` frequently between tasks
- Run `/compact <instructions>` for controlled summarization
- Use `/btw` for side questions that don't pollute context
- Customize compaction in CLAUDE.md

### Use Subagents for Investigation
```
Use subagents to investigate how our authentication system handles token
refresh, and whether we have any existing OAuth utilities I should reuse.
```

---

## 14. Automate and Scale

### Non-Interactive Mode
```bash
claude -p "Explain what this project does"
claude -p "List all API endpoints" --output-format json
```

### Fan-Out Pattern
```bash
for file in $(cat files.txt); do
  claude -p "Migrate $file from React to Vue. Return OK or FAIL." \
    --allowedTools "Edit,Bash(git commit *)"
done
```

### Multiple Sessions
- Claude Code desktop app: visual session management
- Claude Code on the web: isolated VMs
- Agent teams: automated coordination with shared tasks

---

## 15. Common Failure Patterns

| Pattern | Fix |
|---|---|
| Kitchen sink session | `/clear` between unrelated tasks |
| Correcting over and over | After 2 failures, `/clear` and write a better prompt |
| Over-specified CLAUDE.md | Prune ruthlessly |
| Trust-then-verify gap | Always provide verification |
| Infinite exploration | Scope narrowly or use subagents |

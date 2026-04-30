# Lab 10: MCP Servers — Playwright & Browser Verification

**Duration:** 75 minutes

> Recommended Day 2 order: **Lab 10 → Lab 09 → Lab 08 → Lab 11 → Lab 12 → optional Lab 13**.
> Start Day 2 here. Once browser verification is in place, the later
> verification and parallel-work chapters become much more realistic and
> valuable.

## Learning Objective

You will connect Claude Code to a real browser through the repo's current Playwright
MCP path. Claude Code will navigate the running HR app, inspect page state, take
screenshots, and verify that the UI matches expectations from the terminal.

## The Key Concept

**MCP (Model Context Protocol)** is the standardized way to connect Claude Code to
external tools and data sources.

**Playwright MCP** gives Claude Code browser tools such as:

| Tool | What It Does |
|------|-------------|
| `browser_navigate` | Go to a URL |
| `browser_snapshot` | Get page accessibility tree |
| `browser_take_screenshot` | Capture a visual screenshot |
| `browser_click` | Click an element |
| `browser_fill_form` | Fill in form fields |
| `browser_console_messages` | Read browser console output |

**Why this matters for enterprise work:**

- visual regression testing without a separate tool handoff
- Claude Code can verify its own frontend changes against a running app
- end-to-end verification: write code, run app, verify in browser, iterate

**Configuration note:** In Claude Code, MCP config lives in `.claude/settings.json` under the `mcpServers` key, or in `~/.claude/settings.json` for user-level config. There is no `.mcp.json` file in Claude Code. In this workspace, do not guess. Inspect the repo rules first. If a project `.claude/settings.json` already exists, extend the `mcpServers` section within it. If the active client uses another surface, draft the exact content for that surface instead of inventing `runtime/` assets or home-directory paths.

Fresh-session validation still matters. Edit the project config, restart Claude Code
if required by your client, then prove that the tools are actually visible.

---

## Setup

Ask Claude Code to bring up the backend and frontend for you before you configure
MCP:

```text
This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use hidden completed examples or old conversion notes.

Start the backend and frontend for this workspace using the current repo
commands from CLAUDE.md and the active docs.

Requirements:
- backend on port 18082
- frontend on port 5182
- frontend API proxy target http://127.0.0.1:18082
- verify the backend health endpoint
- verify the frontend responds
- create repo-local browser state directories if needed under `.playwright-mcp/`

If port 18082 or 5182 is already in use, treat a stale repo-owned process as
the first suspect and restart cleanly on the reserved ports.
For backend cleanup, use `cd backend && ./stop-jersey-service.sh`.
Keep any local port overrides in `backend/.env.local` and `frontend/.env.local`.

Tell me when both services are ready and when I should wait before moving to
the next step.
```

Wait for Claude Code to confirm that both services are ready before moving on.
Later in this chapter, after project MCP config changes, close and reopen the project in Claude Code if your client requires a fresh session for MCP changes to take effect. There is no `claude resume` command — re-opening the project is the correct restart path.

Important control-plane note:

- inspect `CLAUDE.md` first for repo MCP rules
- if a repo MCP file already exists, preserve it
- do not use `runtime/`-bundled browser, Node, or MCP assets
- keep browser user-data and output directories repo-local under `.playwright-mcp/`
- avoid absolute paths into your home directory when repo-local or installed-tool paths are available
- if `CLAUDE.md` does not yet define a browser preference, use Chrome/Chromium-first and record any fallback explicitly

---

## Exercise 1: Configure Playwright MCP (15 min)

### Goal

Add a Playwright MCP server using the current repo/client config surface.

### Instructions

1. Ask Claude Code to inspect the active config surface before editing anything:
   ```text
   This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use hidden completed examples or old conversion notes.

   Read `CLAUDE.md` first.
   Then inspect `.claude/settings.json` if it exists, to see whether an
   `mcpServers` section is already present.

   Tell me the current state of the project MCP config before you make any edits.
   ```

2. Ask Claude Code to draft or apply the MCP configuration:
   ```text
   Update the active project MCP config for this repo.
   Preserve any existing sections already present.

   Requirements:
   - use repo-local or installed-tool paths only
   - do not use `runtime/`
   - do not use paths from my home directory unless there is no repo-local alternative
   - store browser profile and output under:
     - `.playwright-mcp/profile`
     - `.playwright-mcp/output`
   - prefer the repo browser policy from `CLAUDE.md`; if it is not defined yet, use Chrome/Chromium-first and record any fallback explicitly
   - if the preferred browser cannot be launched on this host, record the fallback explicitly instead of guessing

   If my client cannot edit the active config file directly, draft the exact
   content for me and tell me where it belongs.
   ```

3. **Verify the configuration.** Open the active config file and confirm it:

   - contains a Playwright MCP entry for this project
   - preserves any earlier project config sections
   - uses repo-local profile/output paths under `.playwright-mcp/`
   - does not reference `runtime/`
   - does not rely on stale `/scratch/training/...` paths

4. **Restart Claude Code if needed** to load the project-scoped MCP server.

   Exit the current Claude Code session and restart it from the repo root after
   editing the project config if your client requires that for MCP discovery.
   There is no `claude resume` command — re-opening the project is the correct restart path.

5. **Ask Claude Code to verify that MCP is working.**
   In the fresh Claude Code session, ask:
   ```text
   Before you navigate anywhere, tell me which Playwright/browser MCP tools you can see.
   Then navigate to the HR dashboard and take a screenshot.
   Describe what you see.
   ```

6. **If MCP Playwright is not working:**
   Keep this as a browser-verification lab, not an argument about config
   surfaces. Record the environment limitation explicitly and continue with the
   fallback helper or manual browser path below.

## Troubleshooting Path

Use this section only if you want to debug MCP itself instead of moving on with
the fallback browser verification path.

Ask Claude Code:

```text
The Playwright MCP configuration is present but the tools are still unavailable.
Inspect the active project config file, then walk me through the smallest next
debug steps one at a time.
First tell me whether the issue looks like:
1. wrong config surface
2. wrong executable path
3. browser launch problem
4. client restart/trust issue
```

Treat this as a debugging path, not as the main learner path for the chapter.

---

## Exercise 2: Dashboard Verification (5 min)

### Goal

Use Playwright MCP to verify the dashboard page renders correctly.

### Instructions

1. **Navigate and log in** if auth is required:
   ```text
   Navigate to http://127.0.0.1:5182/hr/login.
   Log in with username "steven.king" and password "password123".
   Then navigate to the dashboard page.
   Take a screenshot and describe which KPI cards are showing.
   ```

2. **Verify KPI data against the page state:**
   ```text
   The dashboard should show:
   - total employees
   - active vs terminated breakdown
   - departments count
   - average salary

   Take a snapshot of the page and check if these KPI cards exist.
   Are they showing data or are they empty?
   ```

3. **Find and report issues:**
   ```text
   Check the dashboard for:
   1. are all charts rendering, not just empty boxes?
   2. is the main navigation present?
   3. are there any console errors?
   Report what you find.
   ```

4. **If issues are found, fix and verify in a loop:**
   ```text
   Fix the issue you just identified, then take another screenshot
   to verify the fix is visible in the browser.
   ```

## Fallback Path

If MCP tools are unavailable in your current client, use one of these fallback
paths and record which one you used:

- repo browser helper scripts under `frontend/`
- another repo-supported browser tool path already available in your Claude Code client
- a manual browser check using the running app URL

The fallback is acceptable for this lab. What matters is that browser evidence
becomes part of the workflow.

## Success Criteria

- [ ] The active project config contains a Playwright/browser MCP entry or a clearly documented equivalent
- [ ] Any prior project config already in that file was preserved
- [ ] A fresh Claude Code session either named or successfully used the browser MCP tools
- [ ] Claude Code completed at least one real browser screenshot step through MCP, or the environment limitation was recorded explicitly
- [ ] Dashboard verification was completed through MCP or a documented fallback path

---

## Key Takeaways

1. Browser tooling must follow the repo's current config surface, not a copied old recipe
2. Fresh-session validation matters; do not assume MCP loaded just because the file exists
3. Repo-local profile/output state keeps browser work isolated from other repos
4. Fallback browser helpers are useful, but they are not proof that MCP itself is wired in

---

<details>
<summary><strong>Recovery Path</strong> — Use this if config work gets noisy</summary>

Stay inside the current lab. Do not scan ahead or use `reference/` unless this
recovery path explicitly tells you to.

If the config surface becomes confusing, reset to the smallest safe task:

```text
Read `CLAUDE.md` and inspect only the existing project MCP/config files in the
repo root.
Tell me which file is authoritative for browser/MCP setup in this workspace.
Do not edit anything yet.
Then draft the smallest valid Playwright/browser entry for that file using
repo-local browser state under `.playwright-mcp/`.
```

Review the draft before applying it, then restart Claude Code if your client requires
that for project MCP discovery.
</details>

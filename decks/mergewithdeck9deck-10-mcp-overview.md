# Deck 10: MCP — Connecting Claude to Your Ecosystem

**Duration:** 30 minutes | **Labs:** Labs 9, 10

---

## Slide 1: What Is MCP?

**Model Context Protocol** — a standardized way to connect Claude Code to external tools and data sources.

Without MCP: Claude can only read/write files and run commands.
With MCP: Claude can browse your app, query your database, read your Jira tickets, check your Sentry errors.

> **Speaker notes:** MCP is what turns Claude from a code assistant into an ecosystem-aware collaborator. It can see what your users see, query what your database stores, and check what your monitoring reports.

---

## Slide 2: Configuration

```json
// .mcp.json — committed to git, team-shared
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-playwright@latest"]
    },
    "mysql": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-mysql@latest", "--host", "127.0.0.1", ...]
    }
  }
}
```

**Team-shared via git.** Every developer gets the same MCP servers on `git clone`.

> **Speaker notes:** The configuration pattern is identical for every MCP server. Learn it once, apply everywhere.

---

## Slide 3: Playwright MCP — What Claude Can Do

| Tool | Action |
|------|--------|
| `browser_navigate` | Go to URL |
| `browser_snapshot` | Read DOM structure |
| `browser_take_screenshot` | Visual capture |
| `browser_click` | Interact with elements |
| `browser_fill_form` | Fill inputs |
| `browser_console_messages` | Read JS errors |

**Use case:** Claude writes frontend code → navigates to the page → screenshots → compares to spec → iterates.

---

## Slide 4: MySQL MCP — What Claude Can Do

| Tool | Action |
|------|--------|
| `mysql_query` | Run SELECT queries |

**Read-only.** Claude can verify data but cannot mutate it. This is intentional — verification should never have side effects.

**Use case:** Claude implements a hire endpoint → queries `employees`, `job_history`, `hr_users` → verifies all records written correctly.

---

## Slide 5: The Full Verification Loop

```
Browser (Playwright MCP)    → sees what the user sees
    ↓
API (curl)                   → sees the API response
    ↓
Database (MySQL MCP)         → sees the actual stored data
    ↓
Compare all three            → any mismatch = bug
```

This is the most powerful verification pattern available. No manual testing needed.

> **Speaker notes:** In Labs 9 and 10, you'll build each leg of this loop. By the end of Day 3, you'll have a full-stack verification workflow.

---

## Slide 6: Security Considerations

- MCP servers run locally with your permissions
- They can read your codebase and access your network
- **Vet servers carefully** — only use trusted sources
- Use read-only database users for MySQL MCP
- Playwright runs headless Chromium — no data leaves your machine

> **Speaker notes:** Enterprise teams should audit MCP servers before adding them to `.mcp.json`. The server has the same access as a local process running under your user account.

---

## Slide 7: Labs 9 & 10

**Lab 9 (75 min):** Configure Playwright MCP. Navigate the HR app, verify dashboard, test a form wizard.

**Lab 10 (75 min):** Configure MySQL MCP. Explore data, verify a hire operation across 3 tables, cross-reference with Playwright.

**Go.**

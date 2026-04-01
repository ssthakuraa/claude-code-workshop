# Deck 13: MCP Ecosystem Awareness

**Duration:** 20 minutes | **No hands-on** — awareness lecture

---

## Slide 1: The Pattern Is Always the Same

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["@scope/mcp-server@latest", "--config", "..."]
    }
  }
}
```

Add to `.mcp.json` → restart session → Claude has new tools. Same pattern, every time.

---

## Slide 2: Available MCP Servers

| Server | Connects To | Enterprise Use Case |
|--------|------------|-------------------|
| **Playwright** | Browser | Visual verification, E2E testing |
| **MySQL/PostgreSQL** | Database | Data verification, integrity checks |
| **Figma** | Design files | Extract tokens, compare UI to designs |
| **Slack** | Team chat | Read bug reports, post status updates |
| **Sentry** | Error monitoring | Pull stack traces during debugging |
| **Jira / Linear** | Issue tracking | Fetch ticket context for implementations |
| **BigQuery** | Analytics | Query metrics during performance work |
| **GitHub** | Source control | PR management, issue tracking |

> **Speaker notes:** You used Playwright and MySQL hands-on. The rest follow the same pattern. When you're back at work, the first MCP you set up should be the tool your team uses most — probably Jira/Linear or Slack.

---

## Slide 3: CLI vs MCP — When to Use Which

**CLI tools are more context-efficient** — they don't load tool schemas into context.

```
# CLI approach (lighter)
"Use `jq` to parse the JSON response from curl"

# MCP approach (richer)
"Query the database using the MySQL MCP tools"
```

**Rule:** Use CLI for tools Claude already knows (curl, git, jq). Use MCP when Claude needs structured access to something it can't easily CLI into (browser, database GUI, design files).

> **Speaker notes:** Boris's team uses MCP for Slack and BigQuery — things that are painful via CLI. They use plain CLI for git, npm, docker. Don't MCP everything — it adds context overhead.

---

## Slide 4: Security Reminder

- MCP servers run as local processes with your permissions
- They see your network, your files, your credentials
- **Vet third-party servers** — check the source, check the permissions
- Use read-only database users
- Keep secrets out of `.mcp.json` (use env vars)

---

## Slide 5: Your First MCP at Work

**Homework question:** When you get back to your desk, what's the first MCP server you'd set up?

Think about:
- What tool do you context-switch to most often?
- What would save time if Claude could access it directly?
- What data source would make verification loops possible?

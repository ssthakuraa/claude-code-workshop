# Deck 11: The MCP Verification Loop

**Duration:** 20 minutes | **Workshop:** MCP Loop Exercise

---

## Slide 1: Putting It All Together

You now have:
- **Playwright MCP** — sees the browser
- **MySQL MCP** — sees the database
- **curl/API** — sees the API response

The verification loop runs all three against the same operation and compares.

---

## Slide 2: The Loop in Practice

```
1. Perform an action (hire an employee via API)
2. Playwright: navigate to employee detail → screenshot
3. MySQL: SELECT * FROM employees WHERE email = 'new@...'
4. MySQL: SELECT * FROM job_history WHERE employee_id = ...
5. Compare: does the UI show the same department as the DB?
6. Any mismatch → bug
```

> **Speaker notes:** This is the workflow you'll use in the capstone on Day 4. Master it now.

---

## Slide 3: Workshop Exercise (60 min)

Pick an existing feature (dashboard, employee directory, or a wizard) and run the full loop:
1. Navigate in browser → capture state
2. Query database → capture data
3. Compare → report discrepancies
4. If issues found → fix → re-verify

---

## Slide 4: When to Use Which

| Verification Type | Best For | MCP Tool |
|-------------------|----------|----------|
| "Does it look right?" | Layout, styling, visual | Playwright screenshot |
| "Does it work?" | Interactions, forms, flows | Playwright click/fill |
| "Is the data correct?" | Database integrity | MySQL query |
| "Any JS errors?" | Runtime issues | Playwright console |

## Slide 5: The Pattern Is Always the Same

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

## Slide 6: Available MCP Servers

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

## Slide 7: CLI vs MCP — When to Use Which

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

## Slide 8: Security Reminder

- MCP servers run as local processes with your permissions
- They see your network, your files, your credentials
- **Vet third-party servers** — check the source, check the permissions
- Use read-only database users
- Keep secrets out of `.mcp.json` (use env vars)

---

## Slide 9: Your First MCP at Work

**Homework question:** When you get back to your desk, what's the first MCP server you'd set up?

Think about:
- What tool do you context-switch to most often?
- What would save time if Claude could access it directly?
- What data source would make verification loops possible?

# Build Note: Playwright MCP Setup & UI Verification

**Date:** 2026-03-30
**Module:** MCP — Playwright browser automation
**Maps to Lab:** Lab 8: Playwright MCP

---

## What We Built

Playwright MCP server configured in `.mcp.json` — allows Claude to:
- Navigate to pages in the running HR app
- Take screenshots and verify UI state
- Click buttons, fill forms, assert text content
- Catch visual regressions before manual testing

## Setup

1. Playwright already installed (`npx playwright --version` → 1.58.2)
2. Added to `.mcp.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp", "--headless"],
      "env": {}
    }
  }
}
```
3. Set `"enableAllProjectMcpServers": true` in `.claude/settings.json`

## Technique Used

MCP server registration + UI verification workflow:
1. Start the frontend dev server (`npm run dev` in background)
2. Ask Claude to navigate, screenshot, and verify using Playwright MCP tools
3. Catch layout/content issues without opening a browser manually

## The Prompt That Worked

```
The frontend dev server is running at http://localhost:5173.
Use Playwright MCP to:
1. Navigate to http://localhost:5173/hr/login
2. Take a screenshot — verify the login card is centered with username/password fields
3. Fill username=admin, password=admin123, click Sign In
4. Take a screenshot of the Dashboard — verify 5 KPI cards are visible
5. Navigate to /hr/employees — verify the employee table shows at least one row
Report any visual issues found.
```

## What Failed First

- **Symptom:** Playwright MCP couldn't connect — "browser not found" error.
- **Root cause:** Playwright browsers weren't installed (`npx playwright install` had never been run).
- **Fix:** `npx playwright install chromium` — only chromium needed for headless verification.

- **Symptom:** Login page screenshot showed blank white — dev server not running.
- **Root cause:** Playwright MCP requires the app to already be running. It doesn't start the dev server.
- **Fix:** Start `npm run dev` with `run_in_background: true` first, wait 3 seconds, then use Playwright MCP.

## CLAUDE.md / Skill Update Made

```markdown
## MCP — Playwright
- Install browsers first: npx playwright install chromium
- Dev server must be running before Playwright MCP can verify pages
- Start dev server: npm run dev (use run_in_background: true)
- Playwright MCP is headless by default — no visible browser window
```

Created skill `/verify-ui`:
```
Start the dev server if not running. Use Playwright MCP to navigate to $PAGE,
take a screenshot, and verify: $ASSERTIONS
Report pass/fail for each assertion.
```
**Why:** UI verification is now a single-command operation, not a multi-step manual process.

## Key Teaching Points

1. Playwright MCP is a verifier, not a test runner — it uses Claude's judgment to assess screenshots.
2. Always install browsers (`playwright install chromium`) before first use — easy to forget.
3. The MCP server is stateless between Claude sessions — no browser state persists.

## Lab Exercise Derivation

- **Setup:** Frontend running at localhost:5173. Playwright installed.
- **Task:** Use Playwright MCP to verify the Dashboard renders 5 KPI cards. Deliberately break one card (empty value), re-verify, observe the failure report.
- **Expected discovery:** Playwright MCP catches UI regressions that TypeScript can't — visual completeness vs type safety are complementary.
- **Success criteria:** Claude reports "5 KPI cards visible" on correct Dashboard; reports failure after intentional break.

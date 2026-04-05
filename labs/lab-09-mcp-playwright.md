# Lab 9: MCP Servers — Playwright & Browser Verification

**Duration:** 75 minutes
**Day:** 3 — Integration
**Builds On:** Lab 8 (verification loops)
**Produces:** Playwright MCP configured, 2 browser-driven verifications completed

---

## Learning Objective

You will connect Claude Code to a real browser via the Playwright MCP server. Claude will navigate your running HR app, take screenshots, inspect elements, and verify that the UI matches expectations — all from the terminal. This transforms Claude from a code-only tool into a full-stack verifier.

---

## The Key Concept

**MCP (Model Context Protocol)** is a standardized way to connect Claude Code to external tools and data sources.

**Playwright MCP** gives Claude these tools:
| Tool | What It Does |
|------|-------------|
| `browser_navigate` | Go to a URL |
| `browser_snapshot` | Get page accessibility tree (structured DOM) |
| `browser_take_screenshot` | Capture a visual screenshot |
| `browser_click` | Click an element |
| `browser_fill_form` | Fill in form fields |
| `browser_console_messages` | Read browser console output |

**Why this matters for enterprise:**
- Visual regression testing without a separate tool
- Claude can verify its own frontend changes against a running app
- End-to-end verification: Claude writes code → deploys → verifies in browser → iterates

**Configuration:** MCP servers are declared in `.mcp.json` at the project root, committed to git so the whole team shares them.

---

## Setup

```bash
# Install Playwright browsers (if not done in pre-workshop)
cd frontend && npx playwright install chromium

# Start the backend
cd backend && mvn spring-boot:run -pl hrapp-service -Dspring-boot.run.profiles=dev &

# Start the frontend
cd frontend && npm run dev &

# Verify both are running
curl -s http://localhost:5173 | head -5    # Frontend
curl -s http://localhost:8080/app/hr/api/v1/regions | head -5  # Backend
```

---

## Exercise 1: Study the Existing Playwright MCP Setup (15 min)

### Goal
Understand how MCP server configuration works and verify Playwright is connected.

### Instructions

1. **Read `.mcp.json` at the project root:**
   ```
   Read .mcp.json and explain what MCP servers are configured.
   For each, explain the command, arguments, and environment variables.
   ```

2. **Verify the Playwright configuration.** `.mcp.json` should already contain:
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

3. **Verify Playwright tools are available.** Claude should confirm that Playwright tools (browser_navigate, browser_snapshot, etc.) are present.
   If they don't appear, install Playwright browsers:
   ```bash
   cd frontend && npx playwright install chromium
   ```
   Then `/clear` to restart the session.

4. **Smoke test — use Playwright to verify:**
   ```
   Navigate to http://localhost:5173 and take a screenshot.
   Describe what you see.
   ```

5. **Understand the pattern:** MCP configuration is team-shared — `.mcp.json` is committed to git so every developer gets the same tools. This is why enterprise projects use MCP: one config, everyone benefits.

### What You Should See

Claude navigates to the app, takes a screenshot, and describes the login page (or dashboard, depending on auth state). This confirms the MCP connection works.

---

## Exercise 2: Dashboard Verification (25 min)

### Goal
Use Playwright MCP to verify the dashboard page renders correctly.

### Instructions

1. **Navigate and log in** (if auth is required):
   ```
   Navigate to http://localhost:5173/login.
   Log in with username "steven.king" and password "password123".
   Then navigate to the dashboard page.
   Take a screenshot and describe what KPI cards are showing.
   ```

2. **Verify KPI data against the database:**
   ```
   The dashboard should show:
   - Total Employees count
   - Active vs Terminated breakdown
   - Departments count
   - Average salary

   Take a snapshot of the page and check if these KPI cards exist.
   Are they showing data or are they empty?
   ```

3. **Find and report issues:**
   ```
   Check the dashboard for:
   1. Are all charts rendering (not just empty boxes)?
   2. Is the navigation sidebar showing all menu items?
   3. Are there any console errors? Check browser_console_messages.
   Report what you find.
   ```

4. **If issues are found, fix and verify in a loop:**
   ```
   Fix [the issue Claude found], then take another screenshot
   to verify the fix is visible in the browser.
   ```

### What You Should See

Claude iterates: screenshot → find issue → fix code → screenshot → verify. This is the visual verification loop from Lab 8, now automated with MCP.

---

## Exercise 3: Form Verification (25 min)

### Goal
Use Playwright MCP to test an interactive form workflow.

### Instructions

1. **Navigate to the Hire Wizard:**
   ```
   Navigate to the hire employee page.
   Take a screenshot of the first step of the wizard.
   Describe the form fields.
   ```

2. **Fill the form and test validation:**
   ```
   Fill the hire form with:
   - First Name: Test
   - Last Name: Employee
   - Email: test.employee@example.com
   - Leave the Job field empty

   Try to advance to the next step. What happens?
   Is there a validation error for the missing Job field?
   Take a screenshot showing the validation state.
   ```

3. **Complete the form:**
   ```
   Fill in all required fields with valid data and complete all steps
   of the wizard. Take a screenshot at each step.
   Does the final step show a confirmation summary?
   ```

4. **Report findings:**
   ```
   Summarize your findings:
   1. Which form fields have validation?
   2. Which are missing validation that should have it?
   3. Are error messages clear and positioned correctly?
   4. Does the wizard flow feel complete?
   ```

---

## Exercise 4: The Self-Improvement Coda (10 min)

1. Add to CLAUDE.md:
   ```markdown
   ## MCP — Playwright
   - Configured in .mcp.json (committed to git)
   - Use browser_snapshot for structured checks, browser_take_screenshot for visual
   - Always check browser_console_messages for JS errors after navigation
   - Verification loop: navigate → screenshot → assess → fix → re-verify
   ```

2. **Discussion:** *Where else could browser-driven verification help?*
   - Responsive design checks (resize browser)
   - Accessibility audits (read snapshot for aria labels)
   - Multi-page workflow testing (login → navigate → action → verify)

3. **MCP Ecosystem Awareness** (instructor will cover in lecture):
   - Figma MCP — extract design tokens and compare to implementation
   - Slack MCP — post updates, read bug reports
   - Sentry MCP — pull error logs during debugging
   - Jira/Linear MCP — fetch ticket context for implementations
   - BigQuery/analytics MCP — query production metrics

---

## Success Criteria

- [ ] `.mcp.json` configured with Playwright MCP
- [ ] Claude successfully navigated to the app and took a screenshot
- [ ] Dashboard verified — KPI cards checked, console errors reported
- [ ] Form workflow tested — validation and wizard flow verified
- [ ] CLAUDE.md updated with MCP Playwright patterns

---

## Key Takeaways

1. **MCP turns Claude into a full-stack verifier** — not just code, but running applications
2. **Screenshots enable visual loops** — Claude sees what users see
3. **Snapshots enable structural checks** — DOM tree, aria labels, form states
4. **Console messages catch invisible errors** — JS errors users don't see but affect behavior
5. **MCP config is team-shared** — `.mcp.json` in git means every developer gets the same tools

---

<details>
<summary><strong>Escape Hatch</strong> — .mcp.json configuration</summary>

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

If Playwright fails to connect:
```bash
# Check Chromium is installed
npx playwright install chromium

# Check frontend is running
curl http://localhost:5173

# Restart Claude Code session after adding .mcp.json
```
</details>

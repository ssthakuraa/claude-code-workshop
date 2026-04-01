# MCP Servers for the HR Enterprise Platform

> How to connect Claude Code to Playwright (browser testing), MySQL (database), Figma (design specs), and other tools relevant to the HR app build.

---

## Overview

MCP (Model Context Protocol) is an open standard that lets Claude Code connect to external tools, databases, and APIs. Instead of copying data into prompts, Claude can directly query your database, drive a browser, or read Figma designs.

**Why MCP matters for enterprise development:**
- Claude can verify UI changes by driving a real browser (Playwright)
- Claude can query the HR database to validate data operations
- Claude can read Figma designs to match pixel-perfect implementation
- Claude can check GitHub issues, Slack threads, Sentry errors in context
- Team shares MCP config via `.mcp.json` checked into git

---

## 1. Playwright MCP — Browser Testing & UI Verification

### What It Does
Lets Claude drive a real browser through the Model Context Protocol. Claude can navigate pages, click buttons, fill forms, take screenshots, and verify UI matches the Figma spec.

### Setup
```bash
# Install Playwright browsers
npx playwright install

# Add Playwright MCP server (user-scoped — available across all projects)
claude mcp add playwright -s user -- npx @playwright/mcp@latest

# Or project-scoped (for team sharing via .mcp.json)
claude mcp add playwright -- npx @playwright/mcp@latest
```

### Key Capabilities
- Uses browser **accessibility tree** for interactions (faster, more token-efficient than screenshots)
- Supports Chromium, Firefox, WebKit
- Can manage authenticated sessions via storage state
- Generates test code from browser exploration

### HR App Use Cases

**Verify Hire Wizard Flow:**
```
Open http://localhost:3000/login, log in as admin.
Navigate to Hire Employee wizard.
Fill in: First Name "Rajesh", Last Name "Kumar", Email "rajesh@company.com".
Go to Step 2, select Job "Programmer", Department "IT Dev India".
Go to Step 3, enter Salary 8000. Verify the salary grade bar shows within range.
Go to Step 4, verify the review summary matches inputs.
Click "Hire Employee" and verify success toast appears.
```

**Verify Dashboard KPIs:**
```
Navigate to the dashboard. Verify:
1. Total Headcount card shows a number
2. Donut chart renders with country labels
3. Bar chart shows department names
4. Attrition trend line chart has 12 data points
Take a screenshot and compare layout to @docs/figma-ui-spec.md section 3.2
```

**Verify RBAC UI Guards:**
```
Log in as ROLE_EMPLOYEE user.
Verify: Hire button is NOT visible, Admin menu is NOT visible,
Salary column in employee directory shows "—" for other employees.
Log out. Log in as ROLE_HR_SPECIALIST.
Verify: Hire button IS visible, can access all employee profiles.
```

**Verify Responsive Layout:**
```
Set viewport to 768x1024 (tablet).
Verify sidebar collapses to icon-only mode (64px).
Set viewport to 375x812 (mobile).
Verify sidebar is hidden and hamburger menu appears.
```

### Playwright MCP vs Claude in Chrome
| Feature | Playwright MCP | Claude in Chrome |
|---|---|---|
| Cross-browser | Chromium, Firefox, WebKit | Chrome only |
| Headless mode | Yes | No |
| CI/CD integration | Yes | No |
| Token efficiency | Accessibility tree (fewer tokens) | Screenshots (more tokens) |
| Setup complexity | MCP server | Browser extension |
| Best for | Automated verification, cross-browser | Quick visual checks |

---

## 2. MySQL MCP — Database Verification

### What It Does
Lets Claude query your MySQL database directly — inspect schemas, run SELECT queries, validate data after API operations.

### Setup Options

**Option A: Read-Only MCP Server (Recommended for safety)**
```bash
# Using the community MySQL MCP server
claude mcp add mysql --transport stdio \
  --env MYSQL_HOST=localhost \
  --env MYSQL_PORT=3306 \
  --env MYSQL_USER=hr_readonly \
  --env MYSQL_PASSWORD=readonly_pass \
  --env MYSQL_DATABASE=hr_db \
  -- npx -y @benborla/mcp-server-mysql
```

**Option B: Enterprise MCP (MintMCP — with audit trails)**
```bash
# MintMCP provides OAuth, audit trails, SOC2/GDPR compliance
claude mcp add mysql --transport http https://your-org.mintmcp.com/mysql
```

**Option C: Team-shared via .mcp.json**
```json
{
  "mcpServers": {
    "hr-database": {
      "command": "npx",
      "args": ["-y", "@benborla/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "hr_readonly",
        "MYSQL_DATABASE": "hr_db"
      }
    }
  }
}
```

### Security Best Practices
- **ALWAYS use a read-only database user** for the MCP server
- Never give write access through MCP — writes go through the application API
- Use a separate database user with limited permissions
- Don't commit passwords in `.mcp.json` — use environment variable references
- For production data: use a read replica, never the primary

### HR App Use Cases

**Verify Hire Operation:**
```
I just ran the hire wizard for "Rajesh Kumar".
Query the database:
1. Check employees table for the new record
2. Check hr_users table for the user account
3. Check hr_user_roles for the role assignment
4. Check job_history for the initial job entry
5. Check hr_audit_logs for the INSERT audit record
Verify all records are consistent.
```

**Validate Schema Matches Entities:**
```
Compare our JPA entity definitions in src/main/java/com/company/hr/model/
against the actual database schema.
Flag any mismatches: missing columns, wrong types, missing indexes.
```

**Check Data Integrity:**
```
Run these integrity checks on the HR database:
1. Any employees with employment_status='ACTIVE' but deleted_at IS NOT NULL?
2. Any departments with parent_department_id pointing to non-existent department?
3. Any employees with salary outside their job's min_salary/max_salary range?
4. Any hr_users with is_active=true but linked employee is TERMINATED?
```

**Verify Soft Deletes:**
```
After I terminate employee 312, verify:
1. employees.deleted_at is populated
2. employees.employment_status = 'TERMINATED'
3. hr_users.is_active = false for linked user
4. The employee does NOT appear in: SELECT * FROM employees WHERE deleted_at IS NULL
```

---

## 3. Figma MCP — Design Spec Integration

### What It Does
Lets Claude read your Figma designs — layer structure, colors, fonts, spacing, Auto Layout settings — and generate code that matches the mockups. Also supports pushing Claude-built UI back to Figma.

### Setup

**Option A: Remote Server (Recommended)**
```bash
# Figma's cloud-hosted MCP server — no desktop app required
claude mcp add figma --transport http https://mcp.figma.com/mcp
```
Then authenticate via `/mcp` in Claude Code when prompted.

**Option B: Local Desktop Server**
Requires Figma desktop app running locally. The MCP server runs from the Figma app.

### Key Capabilities
- **Design to Code**: Read layer structure, colors, fonts, spacing, Auto Layout → generate matching code
- **Code to Canvas**: Push rendered UI back to Figma as editable layers
- Read component variants and design tokens
- Access specific frames, pages, or components by URL

### HR App Use Cases

**Build Component from Figma:**
```
Read the HrKpiCard component from our Figma file.
Extract: dimensions, padding, typography, colors, shadow, border-radius.
Implement it as a React component using our RDS design tokens and Tailwind CSS.
Match the Figma spec exactly.
```

**Verify Implementation Against Design:**
```
Compare the Employee 360 View implementation at http://localhost:3000/employees/100
against the Figma design for section 3.4 (Employee 360 View).
List all differences: spacing, colors, typography, layout, missing elements.
```

**Extract Design Tokens:**
```
Read the design token library from our Figma file.
Extract all color, typography, spacing, shadow, and border-radius tokens.
Generate a Tailwind CSS config file that maps to these tokens.
Use the Oracle Redwood naming convention.
```

**Build Full Page from Figma:**
```
Read the Dashboard page design from Figma (section 3.2 of our spec).
Build the full page:
1. KPI Scoreboard row (5 cards)
2. Charts row (donut + bar + quick actions)
3. Bottom row (attrition trend + activity feed)
Use our HrKpiCard, HrDonutChart, HrBarChart components.
Match the Figma layout grid (3 columns: 4/12 + 4/12 + 4/12).
```

---

## 4. Other Useful MCP Servers for Enterprise HR App

### GitHub MCP
```bash
claude mcp add github --transport http https://mcp.github.com/mcp
```
- Create issues, PRs, review code
- Read PR comments and CI results
- Automate release notes

### Sentry MCP (Error Monitoring)
```bash
claude mcp add sentry --transport http https://mcp.sentry.io/sse
```
- Fetch error logs and stack traces
- Debug production issues with full context
- Link errors to code changes

### Slack MCP (Team Communication)
```bash
# Check official Slack MCP availability
claude mcp add slack --transport http https://mcp.slack.com/mcp
```
- Read bug reports from Slack channels
- Post deployment notifications
- Search for context in team discussions

### Notion MCP (Documentation)
```bash
claude mcp add notion --transport http https://mcp.notion.com/mcp
```
- Read project documentation and specs
- Update runbooks and process docs
- Fetch meeting notes for context

---

## 5. Team MCP Configuration (.mcp.json)

Check this file into git so the whole team gets the same MCP setup:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "hr-database": {
      "command": "npx",
      "args": ["-y", "@benborla/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "${HR_DB_HOST:-localhost}",
        "MYSQL_PORT": "${HR_DB_PORT:-3306}",
        "MYSQL_USER": "${HR_DB_READONLY_USER}",
        "MYSQL_PASSWORD": "${HR_DB_READONLY_PASS}",
        "MYSQL_DATABASE": "hr_db"
      }
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### Security Rules for .mcp.json
- NEVER commit passwords or API keys — use environment variable references
- Database MCP must use read-only user
- Document which env vars team members need to set in CLAUDE.md
- Review MCP server sources before adding (supply chain risk)

---

## 6. MCP Management Commands

```bash
# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get playwright

# Remove a server
claude mcp remove playwright

# Check server status (inside Claude Code)
/mcp

# Scopes
claude mcp add --scope local ...    # You only, this project (default)
claude mcp add --scope project ...  # Team-shared via .mcp.json
claude mcp add --scope user ...     # You, across all projects
```

---

## Sources
- [Connect Claude Code to tools via MCP — Official Docs](https://code.claude.com/docs/en/mcp)
- [Playwright MCP with Claude Code — Builder.io](https://www.builder.io/blog/playwright-mcp-server-claude-code)
- [Microsoft Playwright MCP — GitHub](https://github.com/microsoft/playwright-mcp)
- [MySQL MCP Server — GitHub](https://github.com/benborla/mcp-server-mysql)
- [Figma MCP Server Guide — Figma](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Claude Code + Figma — Builder.io](https://www.builder.io/blog/claude-code-figma-mcp-server)
- [MintMCP MySQL Enterprise — MintMCP](https://www.mintmcp.com/mysql/claude-code)

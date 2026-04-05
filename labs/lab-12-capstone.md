# Lab 12: Capstone — End-to-End Visual Improvement

**Duration:** 150 minutes (Part 1: 60 min, Part 2: 90 min)
**Day:** 4 — Mastery
**Builds On:** Everything from Labs 1–11
**Produces:** A dashboard visualization improvement — fully verified with screenshots and data checks

---

## Learning Objective

You will improve the dashboard visualization using every technique from this workshop. This is the synthesis lab. There is no new concept to learn. The goal is to prove you can orchestrate CLAUDE.md, Plan Mode, Skills, Hooks, Subagents, Verification, and MCP into a single, cohesive workflow.

---

## The Task: Dashboard Chart Swap

**Management request:** The dashboard charts need a visual refresh to match new stakeholder requirements:

1. **"Headcount by Country"** — currently a donut chart, convert to a **horizontal bar chart** for easier value comparison between countries
2. **"Top Departments"** — currently a horizontal bar chart, convert to a **donut chart** with the title **"Headcount by Department"** for a more compact look

The change is in `frontend/src/pages/dashboard/DashboardPage.tsx`. Two `Card` components need their chart component swapped, with data adapted to the new format.

**Visual proof:** Take a screenshot before and after — the swap should be obvious and visually correct.

---

## Part 1: Plan & Setup (60 min)

### Step 1: Before Screenshot (5 min)

First, capture the current state for comparison:

```
Navigate to http://localhost:5173/hr/dashboard (or wherever the dashboard is).
Take a screenshot of the charts row. This is our "before" image.
```

### Step 2: Plan Mode (15 min)

Enter Plan Mode and design the approach:

```
/plan
I need to swap two charts on the dashboard:
1. Headcount by Country: change from HrDonutChart to HrHorizontalBarChart
2. Top Departments: change from HrHorizontalBarChart to HrDonutChart

Read DashboardPage.tsx and identify exactly what changes are needed.
Plan the data format adapters — each chart component expects slightly different
data shapes. Don't implement yet.
```

Iterate on the plan. **Do not proceed until the plan is solid.**

### Step 3: Set Up Hooks (10 min)

Verify your hooks from Lab 5 are active. They should catch:
- Any accidental edit to `schema.sql`
- Any new Java class without `Hr` prefix
- Any PII in logger statements

This is a frontend-only change, but verify hooks are in place.

### Step 4: Write a Verification Spec (15 min)

Define what "done" looks like before implementing:

```
Create a verification checklist for the dashboard chart swap.
What should I see in a screenshot after the change?
What data integrity checks should I run via Playwright and MySQL?
```

Save this as a reference — you'll use it in Part 2.

### Step 5: Context Discipline (15 min)

Before implementation, use `/compact` to free context. You're about to start the build phase and want Claude focused on the task, not the plan conversation.

---

## Part 2: Implement & Verify (90 min)

### Step 6: Implement the Change (20 min)

Switch to normal mode and implement:

```
Implement the dashboard chart swap following the plan:
1. Headcount by Country → HrHorizontalBarChart
2. Top Departments → HrDonutChart (title: "Headcount by Department")

Make minimal changes — only what's needed to swap the charts.
```

### Step 7: Visual Verification (20 min)

After — take screenshots and compare:

```
Navigate to the dashboard and take a screenshot of the charts row.
Compare to our "before" screenshot:
1. Is Headcount by Country now a horizontal bar chart?
2. Is Top Departments now a donut chart with title "Headcount by Department"?
3. Are the data values correct? (same numbers, different visualization)
4. Are there any console errors?
Report what you find.
```

If issues are found, iterate:
```
Fix [the specific issue found], then take another screenshot.
```

### Step 8: Subagent Review (10 min)

Send the implementation to the reviewer:

```
Use the component-reviewer agent to review the changed DashboardPage.tsx.
Check accessibility, chart data formats, and edge cases.
```

Apply any feedback.

### Step 9: Full Verification Loop (25 min)

Now verify with the complete three-layer loop from Labs 8–10:

**9a. Backend compilation (still works):**
```
Run make build to confirm the full project still compiles after the change.
```

**9b. Visual verification (Playwright MCP):** Take the "after" screenshot.
```
Navigate to the dashboard. Screenshot the charts row. Compare to the before image.
```

**9c. Data verification (MySQL MCP):** The chart data comes from the backend API, which queries the database. Verify the raw data:
```
Query the database to verify the headcount numbers that should appear:
1. Employee count by country (through the location → country join)
2. Employee count by department
Show me the actual counts. Do they match what the dashboard charts display?
```

**9d. Cross-verification:**
```
Compare: does the dashboard chart data match the raw database query results?
Any mismatch = a bug in the data layer.
```

### Step 10: The Final Self-Improvement Coda (15 min)

1. **Review your CLAUDE.md.** Compare it to what you started with on Day 1.
   ```
   Compare my CLAUDE.md now to what it looked like at the start of Lab 1.
   How many rules were added across the workshop?
   ```

2. **Reflect on the techniques used:**
   | Technique | Where You Used It |
   |-----------|------------------|
   | CLAUDE.md | Conventions followed automatically |
   | Plan Mode | Step 2 — feature design |
   | Context Management | Step 5 — /compact before build |
   | Hooks | Passive check during implementation |
   | Subagents | Step 8 — component review |
   | Verification (visual) | Step 7 — Playwright before/after screenshots |
   | Verification (data) | Step 9c — MySQL query |
   | Full verification loop | Step 9d — cross-reference chart data with DB |
   | Full pipeline (make build) | Step 9a — compile check |

3. **The compounding effect:** On Day 1, a simple change took 10 prompts and multiple corrections. By Day 4, you made a multi-component visual change with fewer corrections because your CLAUDE.md, hooks, and verification loops prevented mistakes that would have slowed you down.

---

## Success Criteria

- [ ] Dashboard planned in Plan Mode before any implementation
- [ ] "Headcount by Country" displays as a horizontal bar chart
- [ ] "Top Departments" displays as a donut chart titled "Headcount by Department"
- [ ] Before/after screenshots captured and compared
- [ ] Subagent review completed and feedback applied
- [ ] Playwright MCP verified the visual change
- [ ] MySQL MCP verified the underlying data matches the chart values
- [ ] `make build` still passes (no broken code)
- [ ] CLAUDE.md grown significantly from Day 1 starting point

---

## Capstone Presentation (15 min per student)

After completing the capstone, be prepared to walk through:

1. **Your plan** — what did Plan Mode surface that you wouldn't have caught otherwise?
2. **Your before/after screenshots** — show the visual diff
3. **Your verification loop** — show the Playwright screenshot and the MySQL data cross-check
4. **Your CLAUDE.md growth** — what rules did you add? Which was most valuable?
5. **Your adoption plan** — what will you bring back to your team on Monday?

---

## Your Adoption Plan (Take This Home)

Write three concrete commitments:

1. **CLAUDE.md:** *"I will create a CLAUDE.md for _____________ that includes _____________"*

2. **Hooks:** *"I will add a _____________ hook that prevents _____________"*

3. **Workflow:** *"I will use _____________ (Plan Mode / Skills / Subagents / MCP) for _____________"*

> Share these with your team. Claude Code compounds — the sooner you start, the faster it improves.

---

<details>
<summary><strong>Escape Hatch</strong> — what the change looks like</summary>

The swap is straightforward — only the dashboard file changes:

**Headcount by Country:** Replace `HrDonutChart` with `HrHorizontalBarChart`. The country data needs a small format adapter for bar chart (remove percentage/centerLabel fields).

**Top Departments:** Replace `HrHorizontalBarChart` with `HrDonutChart`. The department data needs percentage calculation for the donut chart.

The actual change is roughly 15-20 lines of JSX with data format adjustments.

If you're behind at the end of Part 2:
1. Focus on the visual change and Playwright verification
2. Skip the MySQL cross-check step — the data comes from the backend API which is already verified by `make build`
3. For the presentation, focus on: your plan, your before/after screenshots, and your CLAUDE.md growth
</details>

# Build Note: Dashboard & Analytics

**Date:** 2026-03-30
**Module:** Frontend — Dashboard page + chart components
**Maps to Lab:** — (foundational, referenced in MCP labs)

---

## What We Built

Full Dashboard implementation:
- **KPI Scoreboard**: 5 `HrScoreboardCard` components (Headcount, New Hires, Attrition, Probations, Contracts)
- **Charts row**: `HrDonutChart` (headcount by country), `HrHorizontalBarChart` (top departments), Quick Actions panel
- **Bottom row**: `HrLineChart` (attrition trend 12mo), Recent Activity (HrActivityFeed)
- All charts use typed interfaces from `src/components/hr/charts/`
- Mock data adapter layer converts `mockDashboard.ts` format to chart component interfaces

## Technique Used

Component extraction — Dashboard started with inline recharts code. Charts were extracted into reusable components, then Dashboard was refactored to use them. This is the "extract then refactor" pattern.

## The Prompt That Worked

```
The Dashboard currently has inline recharts code. Extract it into reusable components:
1. src/components/hr/charts/HrDonutChart.tsx — props: data (label/value/percentage/color[]),
   centerLabel, onClick, loading, height. Show legend. Empty state: "No data available".
2. src/components/hr/charts/HrHorizontalBarChart.tsx — sorted descending, gradient opacity,
   value labels at bar end, click handler.
3. src/components/hr/charts/HrLineChart.tsx — smooth curve, y=0 reference line, configurable color.
After building each, refactor DashboardPage to import and use them.
Mock data adapters: map mockDashboard.ts fields to each chart's interface.
```

## What Failed First

- **Symptom:** Dashboard used `<Card title="...">` but Card component has no `title` prop — it uses composition (`<CardHeader><CardTitle>`). TypeScript didn't catch it because `title` is a valid HTML attribute.
- **Root cause:** Relying on intuitive API assumptions without reading the component source.
- **Fix:** Read `Card.tsx`, updated all Dashboard card usages to `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader><CardContent>...</CardContent></Card>`.

- **Symptom:** `HrBoxPlotChart` — no native recharts box-plot component exists. First attempt used `<Scatter>` which produced dots, not boxes.
- **Root cause:** recharts library gap. Scatter doesn't support whisker shapes.
- **Fix:** Used `ComposedChart` + `Bar` with a custom `shape` render prop that draws SVG `<rect>`, `<line>` elements using the YAxis scale function passed via props.

## CLAUDE.md / Skill Update Made

```markdown
## Frontend Rules (additions)
- Card composition: always use CardHeader/CardTitle/CardContent — Card has no title prop
- recharts box-plot: use ComposedChart + Bar with custom shape prop (no native component)
- Always read component source before using — don't assume API from component name
```
**Why:** Card API mismatch is invisible to TypeScript (title is valid HTML). Box-plot approach is non-obvious and will be needed again.

## Key Teaching Points

1. Always read a component before using it — `title` on `<Card>` is valid HTML, TypeScript won't warn.
2. recharts custom shapes unlock any visualization. The `shape` prop receives full SVG context including the Y-axis scale function.
3. Mock data adapter layer keeps chart components decoupled from mock data shape — when API is connected, only the adapter changes.

## Lab Exercise Derivation

- **Setup:** Dashboard with inline recharts. Empty `src/components/hr/charts/` directory.
- **Task:** Extract `HrDonutChart` from inline code. Introduce a Card title prop mistake to demonstrate TypeScript won't catch it.
- **Expected discovery:** Students must read Card.tsx to understand the composition API. A simple mistake teaches the "read before use" habit.
- **Success criteria:** `tsc --noEmit` clean; Dashboard renders all 3 charts; TypeScript hook fires after each extraction.

# Build Note: Frontend Component Library

**Date:** 2026-03-30
**Module:** Frontend Component Library
**Maps to Lab:** Lab 5: Parallel Dev

---

## What We Built

All 40 UI components across 4 phases:

**Phase 1 — Reused from rental app (17 components):**
- `src/components/ui/`: Button, Input, Select, Checkbox, Radio, Badge, Avatar, Card, DataTable, PageHeader, Tabs, Modal, Toast, Breadcrumbs, DatePicker, SearchInput, Dropdown
- `src/components/templates/`: DataManagementTemplate, DetailTemplate, FormTemplate (+ 6 HR-specific templates)

**Phase 2 — HR layout components:**
- `src/components/hr/layout/`: HrTopBar, HrSidebar, HrPageLayout

**Phase 3 — HR domain components:**
- HrScoreboardCard, HrStatusBadge, HrEmploymentTypeBadge, HrSkeleton, HrNotificationItem, HrAuditLogRow, HrConfirmDialog, HrWizard, HrSalaryRangeInput, HrJobSelector, HrEmployeeSelector

**Phase 4 — Chart + i18n components:**
- `src/components/hr/charts/`: HrDonutChart, HrHorizontalBarChart, HrLineChart, HrBoxPlotChart
- `src/components/hr/i18n/`: HrLanguageSelector, HrCurrencyDisplay, HrDateDisplay

## Technique Used

Sequential builds by phase. Charts built with recharts library (already in package.json). Rental app components copied verbatim then adapted to HR naming.

## The Prompt That Worked

```
Build chart components in src/components/hr/charts/ using recharts.
Specs in docs/hr_components_specification.md sections 3.1-3.4.
Each component: typed props, loading skeleton (HrSkeleton), empty state, tooltip.
HrDonutChart: centerLabel prop, legend, click handler.
HrHorizontalBarChart: sorted descending, gradient opacity, show values.
HrLineChart: smooth curve, reference line at y=0, configurable color.
HrBoxPlotChart: custom recharts shape via ComposedChart (no native support).
```

## What Failed First

- **Symptom:** HrBoxPlotChart — recharts has no native box-plot. First attempt used `<Scatter>` which doesn't support whiskers.
- **Root cause:** recharts doesn't ship a box-plot component; needed a custom SVG shape inside `<Bar shape={...}>`.
- **Fix:** Used `ComposedChart` + `Bar` with a custom `shape` render prop that draws SVG lines/rects using the YAxis scale function.

- **Symptom (Dashboard):** Used `title` as a prop on `<Card>` but Card only supports composition (`<CardHeader>/<CardTitle>`).
- **Root cause:** Dashboard was written before Card API was verified.
- **Fix:** Updated Dashboard to use `<CardHeader><CardTitle>` composition pattern.

## CLAUDE.md / Skill Update Made

```markdown
## Frontend Rules
- Card uses composition: <Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>...</CardContent></Card>
- recharts box-plot: use ComposedChart + Bar with custom shape prop — no native component exists
```
**Why:** Prevents repeated mistakes on these non-obvious patterns.

## Key Teaching Points

1. Always verify a component's actual API by reading the file — don't assume from component name.
2. recharts custom shapes via `shape` prop unlock any visualization not in the library.
3. Separating chart components from pages keeps Dashboard clean and charts reusable.

## Lab Exercise Derivation

- **Setup:** Dashboard page with inline recharts code. Empty `src/components/hr/charts/` directory.
- **Task:** Extract inline chart code into proper typed components, then refactor Dashboard to use them.
- **Expected discovery:** Students find the Card API mismatch and learn to read source before using.
- **Success criteria:** `tsc --noEmit` passes; Dashboard renders all 3 charts.

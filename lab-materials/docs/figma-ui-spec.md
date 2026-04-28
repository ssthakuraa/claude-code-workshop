# Figma UI Specification: HR Enterprise Platform

## Design System Foundation: Vertex Tech Modern (RDS) 24C


### 1.1 Global Layout Structure

```
+-------------------------------------------------------------------+
| TOP BAR (56px height, white, Level 1 shadow)                      |
| [Logo] [==Global Search===========] [Country▼] [Bell] [Avatar▼]  |
+--------+----------------------------------------------------------+
| SIDE   |                                                          |
| BAR    |  PAGE CONTENT AREA                                       |
| (240px |  (Padding: 32px top, 24px sides)                         |
|  wide, |                                                          |
|  white,|  Max content width: 1200px (centered on wide screens)    |
|  full  |                                                          |
|  height|                                                          |
| )      |                                                          |
+--------+----------------------------------------------------------+
```

- Top Bar is fixed, always visible.
- Sidebar: Collapsible to 64px (icon-only mode) on tablet. Hidden on mobile with hamburger toggle.
- Active sidebar item: Blue-60 left border (4px), blue-60 text, neutral-5 background.
- Sidebar sections: Grouped with section labels (12px, uppercase, neutral-30).

### 3.2 Dashboard Template

```
+-------------------------------------------------------------------+
| Welcome back, Steven King                              Mar 25, 2026|
| Executive | Seattle, WA                                            |
+-------------------------------------------------------------------+
| ROW 1: KPI SCOREBOARD CARDS (5 cards, equal width, 24px gap)      |
| +----------+ +----------+ +----------+ +----------+ +----------+  |
| |Total     | |New Hires | |Attrition | |Open      | |Contracts |  |
| |Headcount | |This Month| |Rate 12mo | |Probations| |Expiring  |  |
| |  212     | |  6       | |  6.5%    | |  19      | |  4       |  |
| | ▲+3      | | ▲ vs 4   | | ▼ Good   | |          | | ⚠ Amber  |  |
| +----------+ +----------+ +----------+ +----------+ +----------+  |
+-------------------------------------------------------------------+
| ROW 2: CHARTS + QUICK ACTIONS (3 columns: 4/12 + 4/12 + 4/12)    |
| +-------------------+ +-------------------+ +------------------+  |
| | Headcount by      | | Headcount by      | | QUICK ACTIONS    |  |
| | Country (Donut)   | | Department (Bar)  | |                  |  |
| |                   | |                   | | [+ Hire]         |  |
| |   [  USA  150 ]   | | Shipping ████ 45  | | [↔ Transfer]     |  |
| |   [ India  28 ]   | | IT       ███ 28   | | [$ Payroll Rpt]  |  |
| |   [Mexico  22 ]   | | Sales    ██  22   | | [◉ Org Chart]    |  |
| |   [Europe  12 ]   | | Finance  █  12    | |                  |  |
| +-------------------+ +-------------------+ +------------------+  |
+-------------------------------------------------------------------+
| ROW 3: BOTTOM STRIP (2 columns: 7/12 + 5/12)                     |
| +------------------------------+ +-----------------------------+  |
| | Attrition Trend (Line Chart) | | Recent Activity Feed        |  |
| |                              | |                             |  |
| | Terminated ╱╲               | | [AV] Neena updated salary  |  |
| | Count    ╱    ╲    ╱╲       | |      for Alexander Hunold   |  |
| |        ╱      ╲  ╱   ╲     | | [AV] Steven terminated      |  |
| |      ╱         ╲╱     ╲    | |      Donna Snythia           |  |
| | Apr May Jun Jul Aug...Mar   | | [AV] Susan onboarded        |  |
| |                              | |      Varun Bhatt             |  |
| +------------------------------+ +-----------------------------+  |
+-------------------------------------------------------------------+
| [Date Range: Last 12 Months ▼]  [Country: All ▼]  [Dept: All ▼]  |
+-------------------------------------------------------------------+
```

Dashboard filter bar is at the bottom (sticky) or top — designer's choice. Filters apply to all widgets simultaneously.

### 3.3 Employee Directory Template (Data Management)

```
+-------------------------------------------------------------------+
| Employees                                                          |
+-------------------------------------------------------------------+
| [Search: Name, ID, Job Title...] [Status ▼] [Dept ▼] [Country ▼] |
| [Type ▼]                                    [Export CSV] [+ Hire]  |
+-------------------------------------------------------------------+
| [ ] | [AV] Name          | Dept         | Job        | Status     |
+-------------------------------------------------------------------+
| [ ] | [AV] Steven King    | Executive    | President  | ● ACTIVE   |
| [ ] | [AV] Rajesh Kumar   | IT Dev India | Programmer | ● ACTIVE   |
| [ ] | [AV] Carlos Garcia  | Sales Mexico | Sales Mgr  | ● ACTIVE   |
| [ ] | [AV] Diana Lorentz  | IT           | Programmer | ● PROBATION|
| [ ] | [AV] Bruce Ernst    | IT           | Programmer | ● ON_LEAVE |
+-------------------------------------------------------------------+
| Showing 1-20 of 212 active employees   [< 1 2 3 ... 11 >]        |
+-------------------------------------------------------------------+
```

- Default view: Only ACTIVE + ON_LEAVE + PROBATION employees. Toggle to include TERMINATED.
- Click row: Navigate to Employee 360 View.
- Multi-select rows: Bulk action bar appears at top ("Export Selected", "Send Notification").

### 3.4 Employee 360 View Template (Item Overview)

```
+-------------------------------------------------------------------+
| [← Back to Directory]                                              |
+-------------------------------------------------------------------+
| HERO SECTION                                                       |
| +-------+  Steven King                              [Edit] [...]  |
| |       |  President - Executive (Dept 90)                         |
| | [AVT] |  Seattle, WA, United States                              |
| | [XL]  |  ● ACTIVE  |  FULL_TIME  |  Hired: Jun 17, 2013        |
| +-------+  Employee ID: 100  |  Reports to: — (CEO)               |
+-------------------------------------------------------------------+
| [Profile] [Career Timeline] [Documents] [Compensation]             |
+-------------------------------------------------------------------+
|                                                                    |
| << TAB: Profile >>                                                 |
| +-----------------------------+ +-------------------------------+  |
| | Personal Information        | | Job Information               |  |
| | First Name: Steven          | | Job Title: President          |  |
| | Last Name: King             | | Job ID: AD_PRES               |  |
| | Email: steven.king@...      | | Department: Executive         |  |
| | Phone: 515.1234567          | | Location: Seattle, WA         |  |
| | Hire Date: Jun 17, 2013     | | Manager: — (CEO)              |  |
| +-----------------------------+ +-------------------------------+  |
|                                                                    |
| << TAB: Career Timeline >>                                        |
| Uses HrActivityFeed component showing job_history entries          |
| chronologically (newest first).                                    |
|                                                                    |
| << TAB: Documents >>                                               |
| DataTable: Name | Category | Type | Size | Uploaded | Actions     |
| [Upload Document] button at top-right.                             |
|                                                                    |
| << TAB: Compensation >>                                            |
| Current Salary: $24,000.00                                         |
| Job Grade Range: $20,000 - $40,000  [====●===========] 60%        |
| Commission: N/A                                                    |
| Salary History: DataTable with effective date, old, new, reason.   |
+-------------------------------------------------------------------+
```

### 3.5 Wizard Template (Hire / Promote / Transfer / Terminate)

See HrWizard component (Section 2.12). Each wizard uses the same shell.

**Hire Wizard Steps:**
1. Personal Details: First/Last Name, Email, Phone, Hire Date.
2. Job Information: Job dropdown (with grade preview), Department, Location, Manager.
3. Compensation: Salary input (with min/max validation bar), Commission %, Employment Type.
4. Review & Confirm: Read-only summary of all steps. "Hire Employee" primary button.

**Promotion Wizard Steps:**
1. Select Employee: Search and select (pre-filled if navigated from 360 view).
2. New Job: New Job Title, New Department (optional), Effective Date.
3. Compensation: New salary (old salary shown for reference, grade bar shown), Reason Code.

**Transfer Wizard Steps:**
1. Select Employee: Search and select.
2. New Assignment: New Department, New Location, New Manager, Effective Date.
3. Review & Confirm: Side-by-side comparison (old vs new).

**Termination Wizard Steps:**
1. Select Employee: Search and select.
2. Termination Details: Effective Date, Reason Code dropdown (Voluntary Resignation, Performance, Contract End, Role Elimination, Relocation, Better Opportunity), Notes.
3. Review & Confirm: Summary with warning callout. "Confirm Termination" danger button.

### 3.6 Org Chart Template

```
+-------------------------------------------------------------------+
| Organization Chart                    [Search: employee name...]   |
+-------------------------------------------------------------------+
|                                                                    |
|                        +------------------+                        |
|                        | [AV] Steven King |                        |
|                        | President        |                        |
|                        | Executive        |                        |
|                        +--------+---------+                        |
|                  _______________|________________                  |
|                 |                |                |                 |
|     +-----------+--+   +--------+-------+  +-----+--------+       |
|     | Neena Kochhar|   | Lex De Haan    |  | Den Raphaely |       |
|     | Admin VP     |   | Admin VP       |  | Purch Mgr    |       |
|     | Executive    |   | Executive      |  | Purchasing   |       |
|     +----+---------+   +--------+-------+  +--------------+       |
|          |                      |                                  |
|    +-----+------+        +-----+--------+                         |
|    | Nancy      |        | Alexander    |                         |
|    | Greenberg  |        | Hunold       |                         |
|    | Finance Mgr|        | IT Mgr       |                         |
|    +------------+        +------+-------+                         |
|                                 |                                  |
|                   +-------------+-------------+                    |
|                   |             |             |                    |
|              [Rajesh]     [Deepa Nair]  [Rahul Verma]             |
|              IT Dev India  IT QA India  IT Infra India             |
|              Bangalore     Mumbai       Gurugram                   |
+-------------------------------------------------------------------+
```

- Node card: 160px wide, 80px tall. Avatar (SM), Name, Title, Department, optional Location.
- Country flag icon or color indicator on node border.
- Zoom controls: +/- buttons, fit-to-screen.
- Pan: Click and drag canvas.

### 3.7 Admin Portal — Audit Logs

```
+-------------------------------------------------------------------+
| Audit Logs                                                         |
+-------------------------------------------------------------------+
| [Date From 📅] [Date To 📅] [Table ▼] [Action ▼] [Employee ▼]    |
|                                                    [Search]        |
+-------------------------------------------------------------------+
| Timestamp         | Table      | Action | Record | Changed By      |
+-------------------------------------------------------------------+
| Mar 15, 2026 5pm  | employees  | UPDATE | 312    | Susan Mavris    |
|   [Expand ▼]                                                       |
|   +-----------------------------------------------------------+   |
|   | OLD: {"employment_status": "ACTIVE"}                      |   |
|   | NEW: {"employment_status": "TERMINATED",                  |   |
|   |       "reason": "Contract End"}                           |   |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
| Mar 1, 2026 9am   | employees  | INSERT | 322    | Susan Mavris    |
+-------------------------------------------------------------------+
```

- Expandable rows showing JSON diff (old_value vs new_value).
- Color-coded: Green for INSERT, blue for UPDATE, red for DELETE.
- Export filtered results as CSV.

### 3.8 Notification Center (Full Page)

```
+-------------------------------------------------------------------+
| Notifications                          [Mark All Read] [Filter ▼]  |
+-------------------------------------------------------------------+
| TODAY                                                              |
| +---------------------------------------------------------------+ |
| | ⚠ Probation ending: Diana Lorentz                     [NEW]  | |
| | IT Department — probation ends Apr 7, 2026                    | |
| | 2 hours ago                                    [View Employee]| |
| +---------------------------------------------------------------+ |
| | ⚠ Contract expiring: Guy Himuro                        [NEW]  | |
| | Purchasing — contract expires Jun 30, 2026                    | |
| | 2 hours ago                                    [View Employee]| |
| +---------------------------------------------------------------+ |
| EARLIER THIS WEEK                                                  |
| +---------------------------------------------------------------+ |
| | ✓ Salary adjustment processed                                 | |
| | Alexander Hunold — $8,500 → $9,000                            | |
| | Jan 1, 2026                                    [View Employee]| |
| +---------------------------------------------------------------+ |
| | ℹ Annual compensation review window open                      | |
| | All manager salary proposals due by Apr 15, 2026              | |
| | Mar 20, 2026                                                  | |
| +---------------------------------------------------------------+ |
+-------------------------------------------------------------------+
```

- Grouped by time: Today, This Week, This Month, Older.
- Filter by type: All, Probation Alerts, Contract Expiry, Action Complete, System.
- Unread: Bold title, blue left border, [NEW] tag.
- "View Employee" link navigates to Employee 360.

### 3.9 Login Page

```
+-------------------------------------------------------------------+
|                                                                    |
|              +-----------------------------------+                 |
|              |        [Company Logo]             |                 |
|              |   HR Enterprise Platform          |                 |
|              |                                   |                 |
|              |   Username                        |                 |
|              |   [________________________]      |                 |
|              |                                   |                 |
|              |   Password                        |                 |
|              |   [________________________] [👁]  |                 |
|              |                                   |                 |
|              |   [        Sign In        ]       |                 |
|              |                                   |                 |
|              |   Forgot password?                |                 |
|              +-----------------------------------+                 |
|                                                                    |
|              Background: Subtle gradient or                        |
|              abstract Modern pattern                              |
+-------------------------------------------------------------------+
```

- Centered card (400px wide) on gradient background.
- Error state: Red banner above form ("Invalid username or password").
- Loading state: Button shows spinner, disabled.

### 3.10 User Settings / Preferences

```
+-------------------------------------------------------------------+
| Settings                                                           |
+-------------------------------------------------------------------+
| Preferences                                                       |
| +---------------------------------------------------------------+ |
| | Language          [English ▼]                                  | |
| | Timezone          [America/Chicago (CST) ▼]                    | |
| | Date Format       [MM/DD/YYYY ▼]                               | |
| | Currency          [USD - US Dollar ▼]                           | |
| | Number Format     [1,000.00 ▼]                                 | |
| +---------------------------------------------------------------+ |
| | Preview:                                                       | |
| | Date: 03/25/2026   Salary: $24,000.00   Number: 1,234,567.89  | |
| +---------------------------------------------------------------+ |
|                                               [Cancel] [Save]     |
+-------------------------------------------------------------------+
```

- Live preview section: Updates in real-time as user changes dropdowns.
- Save triggers page refresh to apply new locale.

### 3.11 Structure Manager — Departments (with Hierarchy)

```
+-------------------------------------------------------------------+
| Departments                                     [+ New Department] |
+-------------------------------------------------------------------+
| [Search departments...]                                            |
+-------------------------------------------------------------------+
| TREE VIEW                          | DETAIL PANEL                 |
| ▼ Executive (90)                   | Department: IT                |
|   ├── Administration (10)          | ID: 60                        |
|   ├── Marketing (20)              | Manager: Alexander Hunold     |
|   ├── Purchasing (30)             | Location: Southlake, TX       |
|   ├── Human Resources (40)        | Parent: Executive (90)        |
|   │   ├── Benefits (160)          | Employees: 28                 |
|   │   ├── Recruiting (260)        |                               |
|   │   └── Payroll (270)           | [Edit] [Move] [Deactivate]    |
|   ├── Shipping (50)               |                               |
|   ├── ★ IT (60)                   | Child Departments:            |
|   │   ├── IT Dev India (280)      | - IT Dev India (Bangalore)    |
|   │   ├── IT QA India (290)       | - IT QA India (Mumbai)        |
|   │   ├── IT Infra India (300)    | - IT Infra India (Gurugram)   |
|   │   ├── IT Support (210)        | - IT Support (Bangalore)      |
|   │   ├── NOC (220)               | - NOC (Mumbai)                |
|   │   └── IT Help Desk (230)      | - IT Help Desk (Seattle)      |
|   ├── Sales (80)                  |                               |
|   │   ├── Sales Mexico (310)      |                               |
|   │   ├── Gov Sales (240)         |                               |
|   │   └── Retail Sales (250)      |                               |
+-------------------------------------------------------------------+
```

- Left: Collapsible tree view. Right: Detail panel for selected node.
- Drag-and-drop to reparent departments (with confirmation modal).

---

## 4. State Variations (Design for All States)

Every screen and component must be designed in the following states:

| State | Description | Visual Treatment |
|---|---|---|
| Loading | Data is being fetched | Skeleton loaders (gray pulsing rectangles matching content layout) |
| Empty | No data to display | Illustration + message + CTA (e.g., "No employees found. [Hire your first employee]") |
| Error | API call failed | Red banner with error message + "Retry" button |
| Success | Action completed | Green toast notification (top-right, auto-dismiss 5s) |
| Partial | Some widgets loaded, some failed | Individual widget error states (don't block the whole page) |
| Validation | Form field errors | Red border, red helper text, error icon. Summary banner at top of form. |

---

## 5. Interaction & Animation Guidelines

| Interaction | Animation | Duration |
|---|---|---|
| Page transition | Fade in | 200ms ease-out |
| Modal open | Fade in + scale up from 95% | 250ms ease-out |
| Modal close | Fade out + scale down to 95% | 200ms ease-in |
| Sidebar collapse | Width transition | 300ms ease |
| Toast notification | Slide in from top-right | 300ms ease-out, auto-dismiss 5s |
| Table row hover | Background color change | Instant (no transition) |
| Button hover | Background darken 10% | 100ms ease |
| Dropdown open | Fade in + slide down 4px | 150ms ease-out |
| Chart data load | Bars/segments animate from 0 | 600ms ease-out (staggered) |
| Skeleton loader | Pulsing opacity (0.4 → 1.0) | 1.5s infinite ease-in-out |

---

## 6. Accessibility Requirements

- All colors must meet WCAG 2.1 AA contrast ratio (4.5:1 for text, 3:1 for large text).
- All interactive elements must be keyboard navigable (Tab order, Enter/Space to activate).
- Focus indicators: 2px blue-60 outline, 2px offset.
- Screen reader: All images have alt text, all icons have aria-label, form fields have associated labels.
- Status badges use both color AND text (not color alone).
- Charts must have a data table alternative accessible via a "View as Table" toggle.

---

## 7. Figma Deliverable Checklist

The Figma designer should produce the following:

| # | Deliverable | Priority |
|---|---|---|
| 1 | **Design Token Library** — Colors, typography, spacing, shadows, radius as Figma styles/variables | P0 |
| 2 | **Component Library** — All 14 components (2.1–2.14) with variants and states | P0 |
| 3 | **Login Page** — Desktop + Tablet + Mobile | P0 |
| 4 | **Dashboard — Admin/HR View** — Full KPI row, all charts, activity feed | P0 |
| 5 | **Dashboard — Manager View** — Team-scoped KPIs, team charts | P1 |
| 6 | **Dashboard — Employee View** — Personal summary, payslips, timeline | P1 |
| 7 | **Employee Directory** — DataTable with filters, empty state | P0 |
| 8 | **Employee 360 View** — All 4 tabs (Profile, Career, Documents, Compensation) | P0 |
| 9 | **Hire Employee Wizard** — All 4 steps + validation states | P0 |
| 10 | **Promotion Wizard** — All 3 steps | P1 |
| 11 | **Transfer Wizard** — All 3 steps | P1 |
| 12 | **Termination Wizard** — All 3 steps + danger confirmation | P1 |
| 13 | **Org Chart** — 3-level deep with mixed countries | P1 |
| 14 | **Admin — User Management** — DataTable + Create/Edit modal | P1 |
| 15 | **Admin — Audit Logs** — Filterable table with expandable JSON diff | P2 |
| 16 | **Structure Manager — Departments** — Tree view + detail panel | P1 |
| 17 | **Structure Manager — Other entities** (Regions, Countries, Locations, Jobs) — DataTable + form | P2 |
| 18 | **Notification Center** — Full page, grouped, filtered | P1 |
| 19 | **User Settings** — Preferences form with live preview | P2 |
| 20 | **Responsive Variants** — Tablet and Mobile for screens #3, #4, #7, #8 | P1 |
| 21 | **State Variants** — Loading, Empty, Error for screens #4, #7, #8 | P1 |
| 22 | **Prototype** — Click-through flow: Login → Dashboard → Directory → Employee 360 → Hire Wizard | P1 |

---

## 8. Sample Data for Figma Mockups

Use the following realistic values when populating Figma screens:

**KPI Cards:**
- Total Headcount: 212
- New Hires This Month: 6 (vs 4 last month)
- Attrition Rate (12mo): 6.5%
- Open Probations: 19
- Contracts Expiring (30d): 4

**Donut Chart — Headcount by Country:**
- United States: 150 (71%)
- India: 28 (13%)
- Mexico: 22 (10%)
- Europe/Other: 12 (6%)

**Bar Chart — Top 10 Departments:**
1. Shipping: 45
2. IT (all sub-depts): 28
3. Sales (all sub-depts): 22
4. Finance: 12
5. Purchasing: 8
6. Manufacturing: 7
7. Marketing: 3
8. Executive: 3
9. HR: 3
10. Accounting: 3

**Line Chart — Monthly Attrition (Apr 2025 - Mar 2026):**
Apr: 1, May: 0, Jun: 1, Jul: 0, Aug: 1, Sep: 1, Oct: 1, Nov: 1, Dec: 1, Jan: 2, Feb: 2, Mar: 2

**Sample Employees for Directory:**
| Name | Department | Job Title | Country | Status |
|---|---|---|---|---|
| Steven King | Executive | President | USA | ACTIVE |
| Rajesh Kumar | IT Dev India | Programmer | India | ACTIVE |
| Carlos Garcia | Sales Mexico | Sales Manager | Mexico | ACTIVE |
| Diana Lorentz | IT | Programmer | USA | PROBATION |
| Bruce Ernst | IT | Programmer | USA | ON_LEAVE |
| Valentina Flores | Sales Mexico | Sales Rep | Mexico | ACTIVE (CONTRACT) |
| Donna Snythia | Shipping | Shipping Clerk | USA | TERMINATED |

**Sample Notifications:**
- "Probation ending: Diana Lorentz" — 2 hours ago — Unread
- "Contract expiring: Guy Himuro" — 2 hours ago — Unread
- "Salary adjustment processed" — Jan 1, 2026 — Read
- "Annual compensation review window open" — Mar 20, 2026 — Unread

---

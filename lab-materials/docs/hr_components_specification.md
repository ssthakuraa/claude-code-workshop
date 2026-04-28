# HR Enterprise Platform - Component Library Specification

## Overview
This document specifies all UI components required for the HR Management System, following Vertex Tech Modern Design System (RDS) 24C patterns. Components are organized into categories and designed for mobile-first responsive behavior.

**Design System:** Vertex Tech Modern (RDS) 24C  
**Theme:** Light blue (#C7E0FF background, #1F6BCC primary)  
**Approach:** Reuse the current shared UI primitives where they fit and build HR-specific components where needed

---

## Component Categories

1. [Reusable Components](#1-reusable-components)
2. [HR-Specific Components](#2-hr-specific-components)
3. [Chart Components](#3-chart-components)
4. [Layout Components](#4-layout-components)

---

## 1. Reusable Components

These components already exist in `frontend/src/components/ui/` and can be reused as-is:

### 1.1 Button
- **Props:** variant (primary, secondary, tertiary, danger, ghost), size (sm, md, lg), disabled, loading, icon, children
- **Usage:** All CTAs, form submissions, actions

### 1.2 Input
- **Props:** type, value, onChange, placeholder, label, error, helperText, required, disabled
- **Usage:** All text input fields

### 1.3 Select
- **Props:** options, value, onChange, placeholder, label, error, required, disabled, searchable
- **Usage:** All dropdown selections

### 1.4 Checkbox
- **Props:** checked, onChange, label, disabled, indeterminate
- **Usage:** Multi-select, boolean toggles

### 1.5 Radio
- **Props:** options, value, onChange, name, disabled
- **Usage:** Single selection from multiple options

### 1.6 Badge
- **Props:** variant (success, warning, danger, info, neutral), size (sm, md), children, icon, dot
- **Usage:** Status indicators (ACTIVE, PROBATION, TERMINATED, ON_LEAVE)

### 1.7 Avatar
- **Props:** src, alt, size (xs, sm, md, lg, xl), initials, status (online/offline dot)
- **Usage:** Employee photos, user profile icons

### 1.8 Card
- **Props:** title, children, actions, padding, shadow, hoverable
- **Usage:** Content containers, KPI cards, panels

### 1.9 DataTable
- **Props:** columns (ColumnDef[]), data, onRowClick, selectable, sortable, pagination, loading, empty state
- **Features:** Row selection, sorting, pagination, freeze header, custom cell renderers
- **Usage:** Employee directory, audit logs, all data lists

### 1.10 PageHeader
- **Props:** title, subtitle, breadcrumbs, actions, tabs
- **Usage:** Top section of all pages

### 1.11 Tabs
- **Props:** tabs (Tab[]), activeTab, onChange, variant (line, pill)
- **Usage:** Employee 360 View, multi-section pages

### 1.12 Modal
- **Props:** isOpen, onClose, title, children, footer, size (sm, md, lg, xl, full), closeOnOverlay
- **Usage:** Dialogs, confirmations, forms

### 1.13 Toast
- **Props:** variant (success, error, warning, info), message, duration, position
- **Usage:** Success/error notifications

### 1.14 Breadcrumbs
- **Props:** items (BreadcrumbItem[]), separator
- **Usage:** Navigation trail

### 1.15 DatePicker
- **Props:** value, onChange, label, error, minDate, maxDate, disabled, format
- **Usage:** Hire date, effective date, date ranges

### 1.16 SearchInput
- **Props:** value, onChange, placeholder, onSearch, debounce, loading
- **Usage:** Global search, table filters

### 1.17 Dropdown
- **Props:** trigger, items (DropdownItem[]), placement, onSelect
- **Usage:** User menu, action menus, filters

---

## 2. HR-Specific Components

New components to be built for HR functionality:

### 2.1 HrScoreboardCard
**Purpose:** Display KPI metrics with trend indicators  
**Location:** `frontend/src/components/hr/HrScoreboardCard.tsx`

**Props:**
```typescript
interface HrScoreboardCardProps {
  title: string                    // e.g., "Total Headcount"
  value: string | number            // e.g., 212 or "6.5%"
  subtitle?: string                 // e.g., "Active Employees"
  trend?: {
    value: string                   // e.g., "+3" or "▼ Good"
    direction: 'up' | 'down' | 'neutral'
    variant: 'success' | 'danger' | 'warning' | 'info'
  }
  icon?: React.ComponentType
  loading?: boolean
  onClick?: () => void
}
```

**Variants:**
- Default (blue icon background)
- Success (green trend)
- Danger (red trend)
- Warning (amber trend)

**States:** Default, Loading (skeleton), Hover (if clickable)

**Mobile:** Stack vertically, full width

---

### 2.2 HrWizard
**Purpose:** Multi-step wizard for complex processes (Hire, Promote, Transfer, Terminate)  
**Location:** `frontend/src/components/hr/HrWizard.tsx`

**Props:**
```typescript
interface HrWizardProps {
  steps: WizardStep[]               // Array of step configs
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: (data: any) => void
  onCancel: () => void
  title: string
  subtitle?: string
}

interface WizardStep {
  id: string
  label: string                     // e.g., "Personal Details"
  description?: string
  component: React.ComponentType<any>
  validation?: (data: any) => boolean
  optional?: boolean
}
```

**Features:**
- Step indicator (numbered circles, progress bar)
- Previous/Next/Cancel/Submit buttons
- Validation per step
- Review step (read-only summary)
- Sticky footer with actions

**Mobile:** Collapse step labels to numbers only, full-width buttons

---

### 2.3 HrActivityFeed
**Purpose:** Display chronological activity timeline (career history, audit logs)  
**Location:** `frontend/src/components/hr/HrActivityFeed.tsx`

**Props:**
```typescript
interface HrActivityFeedProps {
  items: ActivityItem[]
  variant?: 'default' | 'compact'
  groupBy?: 'date' | 'none'
  loading?: boolean
  emptyMessage?: string
}

interface ActivityItem {
  id: string
  type: 'job_change' | 'salary' | 'transfer' | 'hire' | 'termination' | 'document'
  title: string                     // e.g., "Promoted to Manager"
  description?: string
  date: Date
  user?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>    // Old/new values for display
}
```

**Visual:**
- Vertical timeline with connecting line
- Type icon (left of timeline)
- Avatar (if user present)
- Date grouping headers ("Today", "This Week", "March 2026")

**Mobile:** Compact spacing, smaller icons

---

### 2.4 HrOrgChartNode
**Purpose:** Individual employee card in org chart  
**Location:** `frontend/src/components/hr/HrOrgChartNode.tsx`

**Props:**
```typescript
interface HrOrgChartNodeProps {
  employee: {
    id: number
    name: string
    title: string
    department: string
    avatar?: string
    location?: string
    country?: string
  }
  isExpanded?: boolean
  hasChildren?: boolean
  onExpand?: () => void
  onClick?: () => void
  variant?: 'default' | 'compact'
}
```

**Visual:**
- 160px × 80px card (desktop)
- Avatar (SM) + Name + Title + Department
- Country flag/indicator (optional)
- Expand icon if has children
- Hover: Shadow elevation

**Mobile:** 140px × 70px, smaller text

---

### 2.5 HrFileUpload
**Purpose:** Document upload with drag-drop, preview, and categorization  
**Location:** `frontend/src/components/hr/HrFileUpload.tsx`

**Props:**
```typescript
interface HrFileUploadProps {
  value: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  accept?: string                   // Default: "application/pdf,image/*"
  maxSize?: number                  // Default: 10MB
  maxFiles?: number
  category?: 'contract' | 'id' | 'certificate' | 'payslip' | 'other'
  disabled?: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  category?: string
  uploadedAt: Date
  url?: string
}
```

**Features:**
- Drag-drop zone with dashed border
- File list with preview thumbnails (for images)
- Progress bar during upload
- Remove/download actions
- Category dropdown per file
- Validation: file type, size limits

**Mobile:** Simplified preview, tap to select files

---

### 2.6 HrSalaryRangeInput
**Purpose:** Salary input with min/max validation bar  
**Location:** `frontend/src/components/hr/HrSalaryRangeInput.tsx`

**Props:**
```typescript
interface HrSalaryRangeInputProps {
  value: number
  onChange: (value: number) => void
  min: number                       // Job grade minimum
  max: number                       // Job grade maximum
  currency?: string                 // Default: "USD"
  label?: string
  error?: string
  helperText?: string
  warning?: boolean                 // Show warning if outside range
}
```

**Visual:**
- Number input with currency symbol
- Horizontal bar below showing min/max range
- Current value indicator (diamond) on bar
- Color coding: Green (within range), Amber (outside but acceptable), Red (far outside)
- Warning message: "Salary is 15% above the job grade maximum"

**Mobile:** Full width, stacked layout

---

### 2.7 HrEmployeeSelector
**Purpose:** Search and select employee (used in wizards)  
**Location:** `frontend/src/components/hr/HrEmployeeSelector.tsx`

**Props:**
```typescript
interface HrEmployeeSelectorProps {
  value: Employee | null
  onChange: (employee: Employee | null) => void
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  excludeIds?: number[]             // Don't show these employees
}
```

**Features:**
- Searchable dropdown (Combobox pattern)
- Shows employee photo + name + title + ID
- Live search results
- "No results" empty state

**Mobile:** Full-screen modal on mobile, dropdown on desktop

---

### 2.8 HrNotificationItem
**Purpose:** Individual notification card  
**Location:** `frontend/src/components/hr/HrNotificationItem.tsx`

**Props:**
```typescript
interface HrNotificationItemProps {
  notification: {
    id: string
    type: 'probation' | 'contract' | 'action' | 'system'
    title: string
    message: string
    date: Date
    isRead: boolean
    actionUrl?: string
    actionLabel?: string
  }
  onMarkRead?: (id: string) => void
  onClick?: () => void
}
```

**Visual:**
- Card with type icon (left)
- [NEW] badge if unread
- Blue left border if unread
- Bold title if unread
- Action button (optional)
- Relative time ("2 hours ago")

**Mobile:** Full width, compact padding

---

### 2.9 HrJobSelector
**Purpose:** Job selection with grade preview  
**Location:** `frontend/src/components/hr/HrJobSelector.tsx`

**Props:**
```typescript
interface HrJobSelectorProps {
  value: string | null              // Job ID
  onChange: (jobId: string, job: Job) => void
  label?: string
  error?: string
  required?: boolean
  showGradePreview?: boolean        // Show salary range below
}

interface Job {
  jobId: string                     // e.g., "AD_PRES"
  title: string                     // e.g., "President"
  minSalary: number
  maxSalary: number
}
```

**Visual:**
- Searchable dropdown
- Option shows: Job Title + Job ID
- Grade preview below: "$20,000 - $40,000 salary range"

**Mobile:** Full-width select

---

### 2.10 HrStatusBadge
**Purpose:** Specialized badge for employee/contract status  
**Location:** `frontend/src/components/hr/HrStatusBadge.tsx`

**Props:**
```typescript
interface HrStatusBadgeProps {
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'PROBATION'
  size?: 'sm' | 'md'
  showDot?: boolean
}
```

**Variants:**
- ACTIVE: Green dot + text
- PROBATION: Orange dot + text
- ON_LEAVE: Blue dot + text
- TERMINATED: Gray dot + text

**Usage:** Employee tables, employee header

---

### 2.11 HrEmploymentTypeBadge
**Purpose:** Badge for employment type  
**Location:** `frontend/src/components/hr/HrEmploymentTypeBadge.tsx`

**Props:**
```typescript
interface HrEmploymentTypeBadgeProps {
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
  size?: 'sm' | 'md'
}
```

**Variants:**
- FULL_TIME: Blue outline
- PART_TIME: Purple outline
- CONTRACT: Amber outline
- INTERN: Gray outline

---

### 2.12 HrAuditLogRow
**Purpose:** Expandable row showing JSON diff  
**Location:** `frontend/src/components/hr/HrAuditLogRow.tsx`

**Props:**
```typescript
interface HrAuditLogRowProps {
  log: {
    id: string
    timestamp: Date
    table: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    recordId: number
    changedBy: string
    oldValue?: Record<string, any>
    newValue?: Record<string, any>
  }
  isExpanded?: boolean
  onToggle?: () => void
}
```

**Visual:**
- Collapsible row
- Color-coded action: Green (INSERT), Blue (UPDATE), Red (DELETE)
- Expandable section shows formatted JSON diff
- Highlight changed fields

**Mobile:** Full-width, simplified diff view

---

### 2.13 HrKpiFilter
**Purpose:** Dashboard filter bar (date range, country, department)  
**Location:** `frontend/src/components/hr/HrKpiFilter.tsx`

**Props:**
```typescript
interface HrKpiFilterProps {
  dateRange: { from: Date; to: Date }
  country: string | null
  department: number | null
  onFilterChange: (filters: KpiFilters) => void
}
```

**Visual:**
- Horizontal row with 3 filters (desktop)
- Sticky at top or bottom of dashboard
- Apply button (or auto-apply on change)

**Mobile:** Vertical stack, drawer overlay

---

## 3. Chart Components

Built using **recharts** library:

### 3.1 HrDonutChart
**Purpose:** Headcount by Country/Department  
**Location:** `frontend/src/components/hr/charts/HrDonutChart.tsx`

**Props:**
```typescript
interface HrDonutChartProps {
  data: DonutDataPoint[]
  title?: string
  centerLabel?: string              // e.g., "212 Total"
  onClick?: (segment: DonutDataPoint) => void
  loading?: boolean
  height?: number                   // Default: 300
}

interface DonutDataPoint {
  label: string                     // e.g., "United States"
  value: number
  percentage: number
  color?: string
}
```

**Features:**
- Interactive segments (hover shows tooltip)
- Legend with clickable items
- Center label (total count)
- Empty state: "No data available"

**Mobile:** Smaller height (200px), legend below chart

---

### 3.2 HrHorizontalBarChart
**Purpose:** Headcount by Department  
**Location:** `frontend/src/components/hr/charts/HrHorizontalBarChart.tsx`

**Props:**
```typescript
interface HrHorizontalBarChartProps {
  data: BarDataPoint[]
  title?: string
  onClick?: (bar: BarDataPoint) => void
  loading?: boolean
  height?: number                   // Default: 400
  showValues?: boolean              // Show count at end of bar
}

interface BarDataPoint {
  label: string                     // e.g., "Shipping"
  value: number
  color?: string
}
```

**Features:**
- Sorted descending by value
- Gradient bar colors by intensity
- Hover: Tooltip with exact count
- Responsive: Auto font size

**Mobile:** Smaller font, shortened labels

---

### 3.3 HrLineChart
**Purpose:** Attrition trend over time  
**Location:** `frontend/src/components/hr/charts/HrLineChart.tsx`

**Props:**
```typescript
interface HrLineChartProps {
  data: LineDataPoint[]
  title?: string
  xAxisLabel?: string               // e.g., "Month"
  yAxisLabel?: string               // e.g., "Count"
  color?: string                    // Default: danger red
  showGrid?: boolean
  showDots?: boolean
  loading?: boolean
  height?: number                   // Default: 300
}

interface LineDataPoint {
  x: string | Date                  // Month name or date
  y: number                         // Count
  metadata?: any                    // For tooltip (e.g., reasons)
}
```

**Features:**
- Smooth curve or straight lines
- Data point dots with hover tooltip
- Grid lines (optional)
- Zero line emphasized

**Mobile:** Smaller height (200px), rotated x-axis labels

---

### 3.4 HrBoxPlotChart
**Purpose:** Salary distribution  
**Location:** `frontend/src/components/hr/charts/HrBoxPlotChart.tsx`

**Props:**
```typescript
interface HrBoxPlotChartProps {
  data: BoxPlotDataPoint[]
  title?: string
  loading?: boolean
  height?: number                   // Default: 400
}

interface BoxPlotDataPoint {
  label: string                     // Job family (e.g., "IT")
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers?: number[]
}
```

**Features:**
- Box-and-whisker visualization
- Outliers shown as dots
- Hover: Show all statistics
- Currency formatting

**Mobile:** Horizontal scroll if too many categories

---

## 4. Layout Components

### 4.1 HrTopBar
**Purpose:** Global navigation bar  
**Location:** `frontend/src/components/hr/layout/HrTopBar.tsx`

**Props:**
```typescript
interface HrTopBarProps {
  user: {
    name: string
    avatar?: string
    role: string
  }
  notificationCount?: number
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  onLogout?: () => void
}
```

**Visual:**
- Fixed top, 56px height, white background, Level 1 shadow
- Left: Logo + Global Search
- Right: Country selector + Notification bell (with badge) + User avatar dropdown

**Mobile:** Hamburger menu (left), hide search (move to dedicated page), smaller avatar

---

### 4.2 HrSidebar
**Purpose:** Main navigation sidebar  
**Location:** `frontend/src/components/hr/layout/HrSidebar.tsx`

**Props:**
```typescript
interface HrSidebarProps {
  userRole: 'ADMIN' | 'HR_SPECIALIST' | 'MANAGER' | 'EMPLOYEE'
  activeRoute: string
  isCollapsed?: boolean
  onToggle?: () => void
}
```

**Visual:**
- 240px wide (expanded), 64px (collapsed), full height, white background
- Active item: 4px blue left border, blue-60 text, neutral-5 background
- Section labels: 12px uppercase, neutral-30
- Collapsible to icon-only mode

**Navigation Structure:**
```
Dashboard
Employees
  ├─ Directory
  └─ Org Chart
Actions (HR/Manager only)
  ├─ Hire Employee
  ├─ Promote
  ├─ Transfer
  └─ Terminate
Organization (HR/Admin only)
  ├─ Regions
  ├─ Countries
  ├─ Locations
  ├─ Departments
  └─ Jobs
Admin (Admin only)
  ├─ Users
  └─ Audit Logs
Settings
```

**Mobile:** Hidden by default, drawer overlay when opened

---

### 4.3 HrPageLayout
**Purpose:** Master layout wrapper (TopBar + Sidebar + Content)  
**Location:** `frontend/src/components/hr/layout/HrPageLayout.tsx`

**Props:**
```typescript
interface HrPageLayoutProps {
  children: React.ReactNode
  user: User
  showSidebar?: boolean             // Default: true
}
```

**Usage:** Wrap all authenticated pages

---

## 5. Utility Components

### 5.1 HrSkeleton
**Purpose:** Loading skeleton for various content types  
**Location:** `frontend/src/components/hr/HrSkeleton.tsx`

**Props:**
```typescript
interface HrSkeletonProps {
  variant: 'text' | 'card' | 'table' | 'chart' | 'avatar'
  count?: number                    // Number of repeated skeletons
  width?: string | number
  height?: string | number
}
```

**Usage:** Show during data loading

---

### 5.2 HrEmptyState
**Purpose:** Empty state with illustration + message + CTA  
**Location:** `frontend/src/components/hr/HrEmptyState.tsx`

**Props:**
```typescript
interface HrEmptyStateProps {
  title: string
  message: string
  icon?: React.ComponentType
  action?: {
    label: string
    onClick: () => void
  }
}
```

**Usage:** Show when no data (empty tables, no results)

---

### 5.3 HrErrorBoundary
**Purpose:** Catch and display component errors  
**Location:** `frontend/src/components/hr/HrErrorBoundary.tsx`

**Features:**
- Fallback UI with error message
- Retry button
- Error reporting (console/external service)

---

### 5.4 HrConfirmDialog
**Purpose:** Confirmation modal for destructive actions  
**Location:** `/src/app/components/hr/HrConfirmDialog.tsx`

**Props:**
```typescript
interface HrConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string             // Default: "Confirm"
  cancelLabel?: string              // Default: "Cancel"
  variant?: 'default' | 'danger'
  loading?: boolean
}
```

**Usage:** Terminate employee, delete records, bulk actions

---

## 6. Internationalization (i18n) Components

### 6.1 HrLanguageSelector
**Purpose:** Language switcher dropdown  
**Location:** `/src/app/components/hr/i18n/HrLanguageSelector.tsx`

**Props:**
```typescript
interface HrLanguageSelectorProps {
  currentLanguage: string           // e.g., "en-US"
  languages: Language[]
  onChange: (language: string) => void
}

interface Language {
  code: string                      // e.g., "en-US"
  label: string                     // e.g., "English (United States)"
  flag?: string                     // Country flag emoji or icon
}
```

**Usage:** User settings page, top bar (optional)

---

### 6.2 HrCurrencyDisplay
**Purpose:** Format currency based on user locale  
**Location:** `/src/app/components/hr/i18n/HrCurrencyDisplay.tsx`

**Props:**
```typescript
interface HrCurrencyDisplayProps {
  value: number
  currency?: string                 // Default: user's preference
  locale?: string                   // Default: user's preference
}
```

**Usage:** Salary displays, compensation pages

---

### 6.3 HrDateDisplay
**Purpose:** Format date based on user locale  
**Location:** `/src/app/components/hr/i18n/HrDateDisplay.tsx`

**Props:**
```typescript
interface HrDateDisplayProps {
  value: Date | string
  format?: string                   // Default: user's preference
  locale?: string                   // Default: user's preference
  relative?: boolean                // Show "2 hours ago" instead
}
```

**Usage:** All date displays

---

## 7. Component Build Phases

**Recommendation:** Build components in phases to manage complexity:

### Phase 1: Foundation (Core Reusables)
- All reusable shared UI components listed in 1.1 - 1.17
- HrTopBar, HrSidebar, HrPageLayout (4.1 - 4.3)
- HrSkeleton, HrEmptyState, HrErrorBoundary (5.1 - 5.3)

### Phase 2: Data Display
- HrScoreboardCard (2.1)
- HrActivityFeed (2.3)
- HrStatusBadge, HrEmploymentTypeBadge (2.10 - 2.11)
- HrNotificationItem (2.8)

### Phase 3: Charts
- HrDonutChart (3.1)
- HrHorizontalBarChart (3.2)
- HrLineChart (3.3)
- HrBoxPlotChart (3.4)

### Phase 4: Forms & Inputs
- HrSalaryRangeInput (2.6)
- HrJobSelector (2.9)
- HrEmployeeSelector (2.7)
- HrFileUpload (2.5)

### Phase 5: Complex Components
- HrWizard (2.2)
- HrOrgChartNode (2.4)
- HrAuditLogRow (2.12)
- HrKpiFilter (2.13)

### Phase 6: i18n
- HrLanguageSelector (6.1)
- HrCurrencyDisplay (6.2)
- HrDateDisplay (6.3)

---

## 8. Accessibility Checklist

All components must meet:
- ✅ WCAG 2.1 AA contrast ratios
- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ✅ Focus indicators (2px blue outline, 2px offset)
- ✅ Screen reader support (aria-label, aria-describedby, role)
- ✅ Color + text for status (not color alone)
- ✅ Alt text for images/icons

---

## 9. Testing Requirements

Each component should have:
- Unit tests (React Testing Library)
- Visual regression tests (Storybook)
- Accessibility tests (jest-axe)
- Mobile responsiveness tests

---

## 10. Component Documentation Template

Each component should include:
```typescript
/**
 * Component Name
 * 
 * Purpose: Brief description
 * 
 * @example
 * <ComponentName prop1="value" prop2={value} />
 * 
 * @see Related components or templates
 */
```

---

**Total Component Count:** ~40 components (17 reused + 23 new)

**Estimated Build Time:** 4-6 weeks with proper testing and documentation

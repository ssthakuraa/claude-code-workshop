# HR Enterprise Platform - Template Library Specification

## Overview
This document specifies all page templates required for the HR Management System, following Vertex Tech Modern Design System (RDS) 24C layout patterns. Templates are reusable layout structures that compose multiple components into consistent page patterns.

**Design Approach:** Mobile-first, responsive layouts  
**Theme:** Light blue (#C7E0FF background, #1F6BCC primary)  
**Reuse Strategy:** Reuse the current shared template patterns where applicable

---

## Template Categories

1. [Reusable Templates](#1-reusable-templates)
2. [HR-Specific Templates](#2-hr-specific-templates)
3. [Responsive Behavior](#3-responsive-behavior)

---

## 1. Reusable Templates

These templates can be reused with minor adaptations:

### 1.1 DataManagementTemplate
**Location:** Already exists in `frontend/src/components/templates/DataManagementTemplate.tsx`

**Usage in HR:**
- Employee Directory
- Admin - Users
- Structure Manager - Regions/Countries/Locations/Jobs
- Global Search Results

**Structure:**
```tsx
<DataManagementTemplate
  breadcrumbs={...}
  title="..."
  subtitle="..."
  actions={...}         // e.g., [+ Hire], [Export CSV]
  filters={...}         // Search + Status/Dept/Country dropdowns
  table={<DataTable />}
/>
```

**No changes needed** - can use as-is.

---

### 1.2 DetailTemplate
**Location:** Already exists in `frontend/src/components/templates/DetailTemplate.tsx`

**Usage in HR:**
- Employee 360 View
- User Settings / Preferences

**Structure:**
```tsx
<DetailTemplate
  breadcrumbs={...}
  title="Steven King"
  subtitle="President - Executive"
  actions={...}         // [Edit] [...]
  headerContent={...}   // Status badges, hire date, etc.
  tabs={<Tabs />}
  sidebar={...}         // Optional quick links
>
  {/* Tab content */}
</DetailTemplate>
```

**No changes needed** - can use as-is.

---

### 1.3 FormTemplate
**Location:** Already exists in `frontend/src/components/templates/FormTemplate.tsx`

**Usage in HR:**
- Structure Manager create/edit forms (when not in split view)
- Bulk import forms

**Structure:**
```tsx
<FormTemplate
  breadcrumbs={...}
  title="Edit Department"
  onSubmit={...}
  onCancel={...}
  loading={...}
>
  <FormFields />
</FormTemplate>
```

**No changes needed** - can use as-is.

---

## 2. HR-Specific Templates

New templates to be built:

### 2.1 HrDashboardTemplate
**Purpose:** Dashboard layout with KPI cards, charts, and activity feed  
**Location:** `frontend/src/components/templates/HrDashboardTemplate.tsx`

**Props:**
```typescript
interface HrDashboardTemplateProps {
  welcomeMessage: string              // "Welcome back, Steven King"
  userRole: string                    // "Executive"
  userLocation: string                // "Seattle, WA"
  date: Date                          // Current date (top-right)
  
  kpiCards: React.ReactNode           // Row of HrScoreboardCard components
  charts: React.ReactNode             // Grid of chart components
  quickActions: React.ReactNode       // Quick action buttons panel
  activityFeed: React.ReactNode       // Recent activity list
  filters?: React.ReactNode           // Dashboard filters (optional)
  
  loading?: boolean
  className?: string
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Welcome back, {name}                        {date}      │
│ {role} | {location}                                      │
├─────────────────────────────────────────────────────────┤
│ ROW 1: KPI CARDS (5 equal-width cards, 24px gap)       │
│ [Card] [Card] [Card] [Card] [Card]                     │
├─────────────────────────────────────────────────────────┤
│ ROW 2: CHARTS + QUICK ACTIONS (4/4/4 grid)             │
│ [Donut Chart]  [Bar Chart]  [Quick Actions]            │
├─────────────────────────────────────────────────────────┤
│ ROW 3: BOTTOM STRIP (7/5 grid)                         │
│ [Line Chart - Attrition]    [Activity Feed]            │
├─────────────────────────────────────────────────────────┤
│ FILTERS (sticky top or bottom)                          │
│ [Date Range] [Country] [Department] [Apply]            │
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Welcome message + date: Stack vertically
- KPI Cards: Horizontal scroll or vertical stack (2 per row)
- Charts: Full-width, stack vertically
- Quick Actions: Horizontal scroll or 2×2 grid
- Activity Feed: Full-width
- Filters: Drawer overlay (bottom sheet)

**Variants:**
- Admin/HR View: Full KPIs, all charts
- Manager View: Team-scoped KPIs, team charts
- Employee View: Simplified (profile summary, payslips, career timeline)

**Example Usage:**
```tsx
<HrDashboardTemplate
  welcomeMessage="Welcome back, Steven King"
  userRole="Executive"
  userLocation="Seattle, WA"
  date={new Date()}
  kpiCards={
    <>
      <HrScoreboardCard title="Total Headcount" value={212} trend={{...}} />
      <HrScoreboardCard title="New Hires" value={6} trend={{...}} />
      {/* ... more cards */}
    </>
  }
  charts={
    <>
      <HrDonutChart data={countryData} />
      <HrHorizontalBarChart data={deptData} />
    </>
  }
  quickActions={<QuickActionsPanel />}
  activityFeed={<HrActivityFeed items={recentActivity} />}
  filters={<HrKpiFilter {...filterProps} />}
/>
```

---

### 2.2 HrWizardTemplate
**Purpose:** Multi-step wizard layout for complex processes  
**Location:** `frontend/src/components/templates/HrWizardTemplate.tsx`

**Props:**
```typescript
interface HrWizardTemplateProps {
  title: string                       // "Hire Employee"
  subtitle?: string
  currentStep: number                 // 0-indexed
  totalSteps: number
  steps: WizardStepConfig[]
  onNext: () => void
  onPrevious: () => void
  onCancel: () => void
  onComplete: () => void
  loading?: boolean
  canProceed: boolean                 // Enable/disable Next button
  children: React.ReactNode           // Current step content
}

interface WizardStepConfig {
  id: string
  label: string                       // "Personal Details"
  description?: string
  optional?: boolean
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ [X]  {title}                                            │
│      {subtitle}                                          │
├─────────────────────────────────────────────────────────┤
│ STEP INDICATOR (horizontal)                             │
│ (1)────●────(2)────○────(3)────○────(4)────○            │
│ Personal  Job Info  Compensation  Review                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│              STEP CONTENT AREA                          │
│              (scrollable if needed)                     │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ STICKY FOOTER                                           │
│ [Cancel]                      [< Previous] [Next >]     │
│                              (or [Complete] on last step)│
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Step indicator: Collapse labels, show only numbers
- Buttons: Stack vertically or full-width
- Content: Full viewport height, scrollable

**Variants:**
- Hire Wizard (4 steps)
- Promotion Wizard (3 steps)
- Transfer Wizard (3 steps)
- Termination Wizard (3 steps, danger styling on last step)

**Example Usage:**
```tsx
<HrWizardTemplate
  title="Hire Employee"
  currentStep={0}
  totalSteps={4}
  steps={[
    { id: 'personal', label: 'Personal Details' },
    { id: 'job', label: 'Job Information' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'review', label: 'Review & Confirm' }
  ]}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onCancel={handleCancel}
  onComplete={handleComplete}
  canProceed={isStepValid}
>
  <PersonalDetailsStep />
</HrWizardTemplate>
```

---

### 2.3 HrOrgChartTemplate
**Purpose:** Organization chart visualization layout  
**Location:** `frontend/src/components/templates/HrOrgChartTemplate.tsx`

**Props:**
```typescript
interface HrOrgChartTemplateProps {
  title?: string                      // Default: "Organization Chart"
  searchValue?: string
  onSearch?: (query: string) => void
  controls?: React.ReactNode          // Zoom controls, view toggles
  children: React.ReactNode           // Org chart visualization
  loading?: boolean
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Organization Chart      [Search employee...]   [Export] │
├─────────────────────────────────────────────────────────┤
│ CONTROLS BAR                                            │
│ [Zoom In] [Zoom Out] [Fit to Screen] [Expand All]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│           ORG CHART CANVAS                              │
│           (pannable, zoomable)                          │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Controls: Horizontal scroll or drawer
- Canvas: Touch pan/pinch zoom
- Search: Full-width sticky top

**Features:**
- Pan: Click and drag
- Zoom: Mouse wheel or touch pinch
- Search: Highlight and center matched employee
- Export: Download as PNG/PDF

**Example Usage:**
```tsx
<HrOrgChartTemplate
  searchValue={searchQuery}
  onSearch={setSearchQuery}
  controls={
    <>
      <Button onClick={zoomIn}>Zoom In</Button>
      <Button onClick={zoomOut}>Zoom Out</Button>
      <Button onClick={fitToScreen}>Fit to Screen</Button>
    </>
  }
>
  <OrgChartVisualization data={orgData} />
</HrOrgChartTemplate>
```

---

### 2.4 HrSplitViewTemplate
**Purpose:** Two-panel layout (tree/list + detail panel)  
**Location:** `frontend/src/components/templates/HrSplitViewTemplate.tsx`

**Props:**
```typescript
interface HrSplitViewTemplateProps {
  breadcrumbs?: BreadcrumbItem[]
  title: string
  actions?: React.ReactNode           // e.g., [+ New Department]
  
  leftPanel: React.ReactNode          // Tree view or list
  rightPanel: React.ReactNode         // Detail/edit panel
  leftPanelWidth?: number             // Default: 40% (desktop)
  
  loading?: boolean
  className?: string
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Home > Organization > Departments     [+ New Department]│
├─────────────────────────────────────────────────────────┤
│                          │                               │
│  LEFT PANEL (40%)        │  RIGHT PANEL (60%)           │
│  Tree/List View          │  Detail Panel                │
│                          │                               │
│  ▼ Executive (90)        │  Department: IT               │
│    ├─ Admin (10)         │  ID: 60                       │
│    ├─ Marketing (20)     │  Manager: Alexander Hunold    │
│    ├─ IT (60) ●         │  Location: Southlake, TX      │
│    ├─ Sales (80)         │                               │
│                          │  [Edit] [Move] [Deactivate]   │
│                          │                               │
│                          │  Child Departments:           │
│  (scrollable)            │  - IT Dev India               │
│                          │  - IT QA India                │
│                          │  (scrollable)                 │
└──────────────────────────┴───────────────────────────────┘
```

**Mobile Behavior:**
- Single panel view (toggle between left/right)
- Tab bar at top: [List] [Detail]
- Or: List view → click item → navigate to detail page

**Usage in HR:**
- Structure Manager - Departments (tree + detail)
- Could be adapted for other split views

**Example Usage:**
```tsx
<HrSplitViewTemplate
  breadcrumbs={[...]}
  title="Departments"
  actions={<Button>+ New Department</Button>}
  leftPanel={
    <DepartmentTreeView
      departments={deptTree}
      selectedId={selectedDept}
      onSelect={setSelectedDept}
    />
  }
  rightPanel={
    <DepartmentDetailPanel department={selectedDept} />
  }
/>
```

---

### 2.5 HrAuthTemplate
**Purpose:** Authentication pages layout (Login, Forgot Password)  
**Location:** `frontend/src/components/templates/HrAuthTemplate.tsx`

**Props:**
```typescript
interface HrAuthTemplateProps {
  title: string                       // "HR Enterprise Platform"
  logo?: React.ReactNode
  children: React.ReactNode           // Form content
  footer?: React.ReactNode            // "Forgot password?" link
  loading?: boolean
  error?: string                      // Error banner
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│           ┌──────────────────────┐                      │
│           │     [LOGO]           │                      │
│           │ HR Enterprise        │                      │
│           │                      │                      │
│           │  {children}          │                      │
│           │  (form inputs)       │                      │
│           │                      │                      │
│           │  {footer}            │                      │
│           └──────────────────────┘                      │
│                                                          │
│  Background: Gradient or subtle pattern                 │
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Card takes full width with padding
- Background: Solid color (simpler than gradient)

**Example Usage:**
```tsx
<HrAuthTemplate
  title="HR Enterprise Platform"
  logo={<CompanyLogo />}
  error={loginError}
  footer={<Link href="/forgot-password">Forgot password?</Link>}
>
  <Input label="Username" {...} />
  <Input type="password" label="Password" {...} />
  <Button type="submit">Sign In</Button>
</HrAuthTemplate>
```

---

### 2.6 HrNotificationCenterTemplate
**Purpose:** Notification center page layout  
**Location:** `frontend/src/components/templates/HrNotificationCenterTemplate.tsx`

**Props:**
```typescript
interface HrNotificationCenterTemplateProps {
  title?: string                      // Default: "Notifications"
  filters?: React.ReactNode           // Filter dropdown
  actions?: React.ReactNode           // [Mark All Read] button
  children: React.ReactNode           // Notification list (grouped)
  loading?: boolean
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Notifications        [Filter ▼]        [Mark All Read]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ TODAY                                                    │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ⚠ Probation ending: Diana Lorentz         [NEW]   │ │
│ │ IT Department — probation ends Apr 7               │ │
│ │ 2 hours ago                      [View Employee]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ EARLIER THIS WEEK                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ✓ Salary adjustment processed                       │ │
│ │ Alexander Hunold — $8,500 → $9,000                 │ │
│ │ Jan 1, 2026                      [View Employee]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ (scrollable)                                             │
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Full-width notifications
- Filters: Bottom sheet drawer
- Actions: Sticky header

**Example Usage:**
```tsx
<HrNotificationCenterTemplate
  filters={<NotificationFilter value={filter} onChange={setFilter} />}
  actions={<Button onClick={markAllRead}>Mark All Read</Button>}
>
  <NotificationGroup title="Today">
    <HrNotificationItem notification={...} />
    <HrNotificationItem notification={...} />
  </NotificationGroup>
  <NotificationGroup title="Earlier This Week">
    <HrNotificationItem notification={...} />
  </NotificationGroup>
</HrNotificationCenterTemplate>
```

---

### 2.7 HrSettingsTemplate
**Purpose:** Settings/preferences page layout  
**Location:** `frontend/src/components/templates/HrSettingsTemplate.tsx`

**Props:**
```typescript
interface HrSettingsTemplateProps {
  title?: string                      // Default: "Settings"
  sections: SettingsSection[]
  onSave: () => void
  onCancel: () => void
  hasChanges: boolean
  loading?: boolean
}

interface SettingsSection {
  id: string
  title: string                       // e.g., "Preferences"
  description?: string
  content: React.ReactNode
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Settings                                                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ SECTION 1: Preferences                                  │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Language       [English ▼]                         │ │
│ │ Timezone       [America/Chicago (CST) ▼]           │ │
│ │ Date Format    [MM/DD/YYYY ▼]                      │ │
│ │ Currency       [USD - US Dollar ▼]                 │ │
│ │                                                     │ │
│ │ Preview:                                            │ │
│ │ Date: 03/25/2026  Salary: $24,000.00               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ SECTION 2: Notifications (optional)                     │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [✓] Email me about probation alerts                │ │
│ │ [✓] Email me about contract expiries               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│                              [Cancel]  [Save Changes]   │
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Sections: Full-width, stack vertically
- Buttons: Full-width or stacked

**Example Usage:**
```tsx
<HrSettingsTemplate
  sections={[
    {
      id: 'preferences',
      title: 'Preferences',
      content: <PreferencesForm />
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      content: <NotificationSettings />
    }
  ]}
  onSave={handleSave}
  onCancel={handleCancel}
  hasChanges={isDirty}
/>
```

---

### 2.8 HrBulkImportTemplate
**Purpose:** Bulk import/export page layout  
**Location:** `frontend/src/components/templates/HrBulkImportTemplate.tsx`

**Props:**
```typescript
interface HrBulkImportTemplateProps {
  title: string                       // "Bulk Import Employees"
  steps: BulkImportStep[]
  currentStep: number
  onNext: () => void
  onPrevious: () => void
  onComplete: () => void
  children: React.ReactNode
}

interface BulkImportStep {
  id: string
  label: string                       // "Upload File", "Map Columns", "Review", "Import"
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Bulk Import Employees                                    │
├─────────────────────────────────────────────────────────┤
│ (1)────●────(2)────○────(3)────○────(4)────○            │
│ Upload    Map      Review    Import                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              STEP CONTENT                               │
│                                                          │
│  Step 1: Upload File                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Drag and drop CSV/Excel file here             │    │
│  │  or [Browse Files]                              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│                              [Cancel]  [Next >]         │
└─────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Similar to HrWizardTemplate
- File upload: Full-width

**Example Usage:**
```tsx
<HrBulkImportTemplate
  title="Bulk Import Employees"
  steps={[
    { id: 'upload', label: 'Upload File' },
    { id: 'map', label: 'Map Columns' },
    { id: 'review', label: 'Review' },
    { id: 'import', label: 'Import' }
  ]}
  currentStep={0}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onComplete={handleComplete}
>
  <UploadFileStep />
</HrBulkImportTemplate>
```

---

### 2.9 HrEmptyStateTemplate
**Purpose:** Full-page empty state layout  
**Location:** `frontend/src/components/templates/HrEmptyStateTemplate.tsx`

**Props:**
```typescript
interface HrEmptyStateTemplateProps {
  title: string                       // "404 - Page Not Found"
  message: string
  icon?: React.ComponentType
  illustration?: string               // Image URL
  actions?: React.ReactNode           // Buttons
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                    [ICON/ILLUSTRATION]                   │
│                                                          │
│                      {title}                             │
│                                                          │
│                      {message}                           │
│                                                          │
│                      {actions}                           │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Usage:**
- 404 Page
- Unauthorized Page
- Empty search results (full page version)

**Example Usage:**
```tsx
<HrEmptyStateTemplate
  title="404 - Page Not Found"
  message="The page you're looking for doesn't exist or has been moved."
  icon={AlertCircle}
  actions={
    <>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
      <Button variant="secondary" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </>
  }
/>
```

---

## 3. Responsive Behavior

### 3.1 Breakpoints
Following standard breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 3.2 Layout Adaptations

#### Mobile (< 640px)
- **Sidebar:** Hidden by default, drawer overlay when opened
- **TopBar:** Hamburger menu (left), smaller avatar, hide search (dedicated page)
- **Grid layouts:** Single column
- **Cards:** Full width
- **Tables:** Horizontal scroll or card view
- **Filters:** Bottom sheet drawer
- **Modal/Wizard:** Full screen

#### Tablet (640px - 1024px)
- **Sidebar:** Collapsible to icon-only (64px)
- **TopBar:** Show search, compact spacing
- **Grid layouts:** 2 columns where appropriate
- **Cards:** 2 per row
- **Tables:** All columns visible (reduce padding)
- **Filters:** Inline (collapsed by default)
- **Modal/Wizard:** Large size (90% viewport)

#### Desktop (> 1024px)
- **Sidebar:** Full width (240px), always visible
- **TopBar:** Full search, all controls visible
- **Grid layouts:** 3-4 columns
- **Cards:** Optimal size based on content
- **Tables:** All columns visible with comfortable spacing
- **Filters:** Always visible inline
- **Modal/Wizard:** Fixed width (600-800px)

### 3.3 Mobile-First Approach

All templates should be built mobile-first:
1. Start with mobile layout (single column, stacked)
2. Add tablet breakpoint (some columns, compact)
3. Add desktop breakpoint (full layout)

Example:
```tsx
// Mobile: stack vertically
<div className="flex flex-col gap-4">
  
// Tablet: 2 columns
<div className="flex flex-col gap-4 md:grid md:grid-cols-2">
  
// Desktop: 3 columns
<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
```

---

## 4. Template Composition Pattern

All templates follow this structure:

```tsx
export function TemplateName({
  // Props
}: TemplateNameProps) {
  return (
    <div className="template-container">
      {/* Header Section */}
      <header>...</header>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer Section (optional) */}
      <footer>...</footer>
    </div>
  )
}
```

---

## 5. Template Usage Examples

### Example 1: Dashboard Page
```tsx
function DashboardPage() {
  return (
    <HrPageLayout user={currentUser}>
      <HrDashboardTemplate
        welcomeMessage={`Welcome back, ${user.name}`}
        userRole={user.role}
        userLocation={user.location}
        date={new Date()}
        kpiCards={<KpiCardsRow />}
        charts={<ChartsGrid />}
        quickActions={<QuickActionsPanel />}
        activityFeed={<ActivityFeedPanel />}
        filters={<DashboardFilters />}
      />
    </HrPageLayout>
  )
}
```

### Example 2: Employee Directory Page
```tsx
function EmployeeDirectoryPage() {
  return (
    <HrPageLayout user={currentUser}>
      <DataManagementTemplate
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Employees' }]}
        title="Employees"
        subtitle={`${filteredCount} employees`}
        actions={
          <>
            <Button variant="secondary">Export CSV</Button>
            <Button>+ Hire Employee</Button>
          </>
        }
        filters={<EmployeeFilters />}
        table={<EmployeeTable data={employees} />}
      />
    </HrPageLayout>
  )
}
```

### Example 3: Hire Wizard Page
```tsx
function HireEmployeePage() {
  return (
    <HrPageLayout user={currentUser} showSidebar={false}>
      <HrWizardTemplate
        title="Hire Employee"
        currentStep={currentStep}
        totalSteps={4}
        steps={wizardSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onCancel={handleCancel}
        onComplete={handleComplete}
        canProceed={isStepValid}
      >
        {renderCurrentStep()}
      </HrWizardTemplate>
    </HrPageLayout>
  )
}
```

---

## 6. Template Build Priority

**Phase 1: Essential Layouts (Week 1)**
- HrPageLayout (master wrapper)
- Reuse DataManagementTemplate, DetailTemplate, FormTemplate as-is

**Phase 2: Dashboard & Auth (Week 2)**
- HrDashboardTemplate
- HrAuthTemplate
- HrEmptyStateTemplate

**Phase 3: Complex Templates (Week 3)**
- HrWizardTemplate
- HrSplitViewTemplate
- HrOrgChartTemplate

**Phase 4: Specialized Templates (Week 4)**
- HrNotificationCenterTemplate
- HrSettingsTemplate
- HrBulkImportTemplate

---

## 7. Accessibility Checklist

All templates must:
- ✅ Use semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`)
- ✅ Provide skip links ("Skip to main content")
- ✅ Support keyboard navigation (Tab order makes sense)
- ✅ Announce dynamic content changes (aria-live regions)
- ✅ Maintain focus management (modals, wizards)
- ✅ Scale text up to 200% without breaking layout

---

## 8. Testing Checklist

Each template should be tested for:
- ✅ Mobile, Tablet, Desktop viewports
- ✅ Light and dark mode (if applicable)
- ✅ Loading states
- ✅ Empty states
- ✅ Error states
- ✅ Overflow content (long titles, many items)
- ✅ RTL support (if multi-language includes RTL languages)

---

**Total Template Count:** 11 templates (3 reused + 8 new)

**Estimated Build Time:** 3-4 weeks with proper testing and responsive behavior

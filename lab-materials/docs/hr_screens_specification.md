# HR Enterprise Platform - Screens & Pages Specification

## Overview
This document provides a complete inventory of all screens/pages for the HR Management System, organized by module with routing structure, component composition, and user access controls.

**Total Screens:** 22 screens across 7 modules  
**Routing:** Independent HR app with role-based access  
**Data:** Runtime-backed application data

---

## Table of Contents

1. [Authentication Module](#1-authentication-module)
2. [Dashboard Module](#2-dashboard-module)
3. [Employee Management Module](#3-employee-management-module)
4. [Actions Module (Wizards)](#4-actions-module-wizards)
5. [Organization Structure Module](#5-organization-structure-module)
6. [Admin Module](#6-admin-module)
7. [Settings & Utilities Module](#7-settings--utilities-module)
8. [Error & System Pages](#8-error--system-pages)
9. [Routing Structure](#9-routing-structure)
10. [Screen Priority Matrix](#10-screen-priority-matrix)

---

## 1. Authentication Module

### 1.1 Login Page
**Route:** `/hr/login`  
**Access:** Public (unauthenticated users only)  
**Template:** `HrAuthTemplate`

**Purpose:** User authentication with username/password

**Components Used:**
- HrAuthTemplate
- Input (username, password)
- Button (Sign In)
- Link (Forgot password)
- Toast (error notifications)

**Layout:**
```tsx
<HrAuthTemplate
  title="HR Enterprise Platform"
  logo={<CompanyLogo />}
  error={loginError}
  footer={<Link href="/hr/forgot-password">Forgot password?</Link>}
>
  <form onSubmit={handleLogin}>
    <Input
      label="Username"
      value={username}
      onChange={setUsername}
      required
    />
    <Input
      type="password"
      label="Password"
      value={password}
      onChange={setPassword}
      required
      showPasswordToggle
    />
    <Button type="submit" loading={isLoggingIn} fullWidth>
      Sign In
    </Button>
  </form>
</HrAuthTemplate>
```

**Mock Data:**
- Demo users: admin@hr.com, hr@hr.com, manager@hr.com, employee@hr.com
- Password: "Password123!"

**States:**
- Default (empty form)
- Loading (submitting)
- Error (invalid credentials - show red banner)
- Success (redirect to dashboard)

**Mobile:** Full-width card with padding

---

### 1.2 Forgot Password Page (Optional)
**Route:** `/hr/forgot-password`  
**Access:** Public  
**Template:** `HrAuthTemplate`

**Purpose:** Password reset request

**Components Used:**
- HrAuthTemplate
- Input (email)
- Button (Send Reset Link)

**Priority:** P2 (optional for MVP)

---

## 2. Dashboard Module

### 2.1 Dashboard - Admin/HR View
**Route:** `/hr/dashboard` (default landing)  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `HrDashboardTemplate`

**Purpose:** Executive overview with global KPIs and insights

**Components Used:**
- HrDashboardTemplate
- HrScoreboardCard × 5 (KPI cards)
- HrDonutChart (Headcount by Country)
- HrHorizontalBarChart (Headcount by Department)
- HrLineChart (Attrition Trend)
- HrActivityFeed (Recent Activity)
- HrKpiFilter (Date/Country/Department filters)
- Card (Quick Actions panel)
- Button (quick action buttons)

**Layout:**
```tsx
<HrDashboardTemplate
  welcomeMessage={`Welcome back, ${user.name}`}
  userRole={user.role}
  userLocation={user.location}
  date={new Date()}
  kpiCards={
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <HrScoreboardCard
        title="Total Headcount"
        value={212}
        trend={{ value: '+3', direction: 'up', variant: 'success' }}
        icon={Users}
      />
      <HrScoreboardCard
        title="New Hires This Month"
        value={6}
        subtitle="vs 4 last month"
        trend={{ value: '+2', direction: 'up', variant: 'info' }}
        icon={UserPlus}
      />
      <HrScoreboardCard
        title="Attrition Rate (12mo)"
        value="6.5%"
        trend={{ value: '▼ Good', direction: 'down', variant: 'success' }}
        icon={TrendingDown}
      />
      <HrScoreboardCard
        title="Open Probations"
        value={19}
        icon={Clock}
      />
      <HrScoreboardCard
        title="Contracts Expiring (30d)"
        value={4}
        trend={{ value: '⚠ Amber', direction: 'neutral', variant: 'warning' }}
        icon={AlertCircle}
      />
    </div>
  }
  charts={
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Headcount by Country">
        <HrDonutChart
          data={countryData}
          centerLabel="212 Total"
        />
      </Card>
      <Card title="Headcount by Department">
        <HrHorizontalBarChart
          data={departmentData}
          showValues
        />
      </Card>
      <Card title="Quick Actions" className="flex flex-col gap-3">
        <Button leftIcon={<UserPlus />} onClick={handleHire}>
          Hire Employee
        </Button>
        <Button leftIcon={<ArrowRightLeft />} onClick={handleTransfer}>
          Transfer Employee
        </Button>
        <Button leftIcon={<DollarSign />} onClick={handlePayrollReport}>
          Run Payroll Report
        </Button>
        <Button leftIcon={<GitBranch />} onClick={handleOrgChart}>
          View Org Chart
        </Button>
      </Card>
    </div>
  }
  activityFeed={
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card title="Attrition Trend" className="lg:col-span-7">
        <HrLineChart
          data={attritionData}
          xAxisLabel="Month"
          yAxisLabel="Terminated Count"
          color="red"
        />
      </Card>
      <Card title="Recent Activity" className="lg:col-span-5">
        <HrActivityFeed
          items={recentActivity}
          variant="compact"
        />
      </Card>
    </div>
  }
  filters={
    <HrKpiFilter
      dateRange={dateRange}
      country={selectedCountry}
      department={selectedDepartment}
      onFilterChange={handleFilterChange}
    />
  }
/>
```

**Mock Data:**
- Total Headcount: 212
- New Hires: 6 (vs 4 last month)
- Attrition Rate: 6.5%
- Open Probations: 19
- Contracts Expiring: 4
- Country breakdown: USA (150), India (28), Mexico (22), Europe (12)
- Department breakdown: Shipping (45), IT (28), Sales (22), Finance (12), etc.
- Monthly attrition: Apr-Mar data (1, 0, 1, 0, 1, 1, 1, 1, 1, 2, 2, 2)
- Recent activity: Last 10 HR actions

**States:**
- Loading (show skeletons for all widgets)
- Partial (some widgets loaded, some failed)
- Filtered (apply filters to all widgets)

**Mobile:**
- KPI cards: 2 per row or horizontal scroll
- Charts: Stack vertically, full width
- Activity feed: Full width

---

### 2.2 Dashboard - Manager View
**Route:** `/hr/dashboard` (same route, different content based on role)  
**Access:** MANAGER  
**Template:** `HrDashboardTemplate`

**Purpose:** Team-scoped dashboard for line managers

**Differences from Admin/HR View:**
- KPI cards scoped to direct + indirect reports only
- KPI variants: "My Team Size", "My Team Attrition", "My Team Probations"
- Charts show team-only data
- Quick Actions: "Promote", "Transfer" (no "Hire" - only HR can hire)
- Activity Feed: Team actions only

**Mock Data:**
- Team Size: 12 (direct: 5, indirect: 7)
- Team Attrition: 8.3%
- Team Probations: 3

---

### 2.3 Dashboard - Employee View
**Route:** `/hr/dashboard` (same route, different content based on role)  
**Access:** EMPLOYEE  
**Template:** `HrDashboardTemplate` (simplified variant)

**Purpose:** Personal dashboard for employees (ESS)

**Layout:**
```tsx
<HrDashboardTemplate
  welcomeMessage={`Welcome back, ${user.name}`}
  userRole={user.role}
  userLocation={user.location}
  date={new Date()}
  kpiCards={null} // No KPI cards for employees
  charts={
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="My Profile">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} size="xl" />
          <div>
            <h3>{user.name}</h3>
            <p>{user.title}</p>
            <p>{user.department}</p>
            <HrStatusBadge status={user.status} />
            <HrEmploymentTypeBadge type={user.employmentType} />
          </div>
        </div>
        <Button variant="secondary" onClick={handleViewProfile}>
          View Full Profile
        </Button>
      </Card>
      
      <Card title="Recent Payslips">
        <PayslipList payslips={recentPayslips} />
        <Button variant="secondary" onClick={handleViewAllPayslips}>
          View All Payslips
        </Button>
      </Card>
    </div>
  }
  activityFeed={
    <Card title="My Career Timeline">
      <HrActivityFeed
        items={myCareerHistory}
        variant="compact"
      />
    </Card>
  }
/>
```

**Mock Data:**
- Personal profile info
- Last 3 payslips
- Career history (last 5 events)

---

## 3. Employee Management Module

### 3.1 Employee Directory
**Route:** `/hr/employees`  
**Access:** ALL (data visibility per role)  
**Template:** `DataManagementTemplate`

**Purpose:** Searchable, filterable list of all employees

**Components Used:**
- DataManagementTemplate
- SearchInput (global employee search)
- Select × 4 (Status, Department, Country, Type filters)
- Button (Export CSV, + Hire)
- DataTable (employee list)
- Avatar (employee photos)
- HrStatusBadge
- HrEmploymentTypeBadge
- Pagination

**Layout:**
```tsx
<DataManagementTemplate
  breadcrumbs={[
    { label: 'Home', href: '/hr/dashboard' },
    { label: 'Employees' }
  ]}
  title="Employees"
  subtitle={`${filteredCount} employees`}
  actions={
    <>
      <Button variant="secondary" leftIcon={<Download />}>
        Export CSV
      </Button>
      {canHire && (
        <Button leftIcon={<Plus />} onClick={handleHire}>
          + Hire Employee
        </Button>
      )}
    </>
  }
  filters={
    <div className="flex flex-col md:flex-row gap-4">
      <SearchInput
        placeholder="Search by name, ID, or job title..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="flex-1"
      />
      <Select
        options={statusOptions}
        value={statusFilter}
        onChange={setStatusFilter}
        placeholder="Status"
      />
      <Select
        options={departmentOptions}
        value={departmentFilter}
        onChange={setDepartmentFilter}
        placeholder="Department"
      />
      <Select
        options={countryOptions}
        value={countryFilter}
        onChange={setCountryFilter}
        placeholder="Country"
      />
      <Select
        options={typeOptions}
        value={typeFilter}
        onChange={setTypeFilter}
        placeholder="Type"
      />
    </div>
  }
  table={
    <DataTable
      columns={[
        {
          id: 'select',
          header: ({ table }) => <Checkbox {...} />,
          cell: ({ row }) => <Checkbox {...} />
        },
        {
          id: 'employee',
          header: 'Employee',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <Avatar src={row.avatar} size="sm" />
              <div>
                <div className="font-medium">{row.name}</div>
                <div className="text-sm text-neutral-60">
                  ID: {row.employeeId}
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'department',
          header: 'Department',
          accessorKey: 'department'
        },
        {
          id: 'jobTitle',
          header: 'Job Title',
          accessorKey: 'jobTitle'
        },
        {
          id: 'location',
          header: 'Location',
          cell: ({ row }) => `${row.city}, ${row.country}`
        },
        {
          id: 'status',
          header: 'Status',
          cell: ({ row }) => <HrStatusBadge status={row.status} />
        },
        {
          id: 'type',
          header: 'Type',
          cell: ({ row }) => <HrEmploymentTypeBadge type={row.type} />
        },
        {
          id: 'actions',
          header: '',
          cell: ({ row }) => (
            <Dropdown
              trigger={<Button variant="ghost" size="sm" icon={<MoreVertical />} />}
              items={[
                { label: 'View Profile', onClick: () => handleView(row.id) },
                { label: 'Edit', onClick: () => handleEdit(row.id) },
                { label: 'Promote', onClick: () => handlePromote(row.id) },
                { label: 'Transfer', onClick: () => handleTransfer(row.id) }
              ]}
            />
          )
        }
      ]}
      data={filteredEmployees}
      onRowClick={(row) => navigate(`/hr/employees/${row.id}`)}
      selectable
      sortable
      pagination={{
        pageSize: 20,
        pageIndex: currentPage,
        pageCount: totalPages,
        onPageChange: setCurrentPage
      }}
    />
  }
/>
```

**Sample Data Shape:**
- 212 employees in the current training dataset
- Employees: Steven King, Rajesh Kumar, Carlos Garcia, Diana Lorentz, Bruce Ernst, etc.
- Status: ACTIVE (190), PROBATION (10), ON_LEAVE (8), TERMINATED (4 - hidden by default)
- Types: FULL_TIME (180), CONTRACT (20), PART_TIME (8), INTERN (4)
- Countries: USA, India, Mexico, UK
- Departments: Executive, IT, Sales, Finance, Shipping, etc.

**States:**
- Loading (skeleton table)
- Empty (no employees - show "No employees found. Hire your first employee?")
- Filtered (show count + active filters)
- Bulk selection (show action bar: "Export Selected", "Send Notification")

**Mobile:**
- Filters: Drawer overlay
- Table: Card view (vertical stack)

---

### 3.2 Employee 360 View
**Route:** `/hr/employees/:id`  
**Access:** ALL (data visibility per role)  
**Template:** `DetailTemplate`

**Purpose:** Complete employee profile with all information

**Components Used:**
- DetailTemplate
- Tabs (Profile, Career Timeline, Documents, Compensation)
- Avatar (XL size)
- HrStatusBadge
- HrEmploymentTypeBadge
- Badge (for quick facts)
- HrActivityFeed (career timeline tab)
- DataTable (documents, salary history)
- HrFileUpload (documents tab)
- HrSalaryRangeInput (compensation tab)
- Card (info sections)
- Button (Edit, actions)

**Layout:**
```tsx
<DetailTemplate
  breadcrumbs={[
    { label: 'Home', href: '/hr/dashboard' },
    { label: 'Employees', href: '/hr/employees' },
    { label: employee.name }
  ]}
  title={employee.name}
  subtitle={`${employee.jobTitle} - ${employee.department}`}
  headerContent={
    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
      <Avatar src={employee.avatar} size="xl" />
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <HrStatusBadge status={employee.status} />
          <HrEmploymentTypeBadge type={employee.type} />
        </div>
        <div className="text-sm text-neutral-60 space-y-1">
          <div>📍 {employee.city}, {employee.country}</div>
          <div>📅 Hired: {formatDate(employee.hireDate)}</div>
          <div>🆔 Employee ID: {employee.employeeId}</div>
          <div>👤 Reports to: {employee.manager || '— (CEO)'}</div>
        </div>
      </div>
    </div>
  }
  actions={
    <>
      <Button variant="secondary" leftIcon={<Edit />}>
        Edit
      </Button>
      <Dropdown
        trigger={<Button variant="ghost" icon={<MoreVertical />} />}
        items={[
          { label: 'Promote', onClick: handlePromote },
          { label: 'Transfer', onClick: handleTransfer },
          { label: 'Adjust Salary', onClick: handleSalary },
          { label: 'Terminate', onClick: handleTerminate, variant: 'danger' }
        ]}
      />
    </>
  }
  tabs={
    <Tabs
      tabs={[
        { id: 'profile', label: 'Profile' },
        { id: 'timeline', label: 'Career Timeline' },
        { id: 'documents', label: 'Documents' },
        { id: 'compensation', label: 'Compensation' }
      ]}
      activeTab={activeTab}
      onChange={setActiveTab}
    />
  }
>
  {activeTab === 'profile' && (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Personal Information">
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-neutral-60">First Name</dt>
            <dd className="font-medium">{employee.firstName}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Last Name</dt>
            <dd className="font-medium">{employee.lastName}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Email</dt>
            <dd className="font-medium">{employee.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Phone</dt>
            <dd className="font-medium">{employee.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Hire Date</dt>
            <dd className="font-medium">{formatDate(employee.hireDate)}</dd>
          </div>
        </dl>
      </Card>
      
      <Card title="Job Information">
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-neutral-60">Job Title</dt>
            <dd className="font-medium">{employee.jobTitle}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Job ID</dt>
            <dd className="font-medium">{employee.jobId}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Department</dt>
            <dd className="font-medium">{employee.department}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Location</dt>
            <dd className="font-medium">{employee.city}, {employee.country}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-60">Manager</dt>
            <dd className="font-medium">{employee.manager || '— (CEO)'}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )}
  
  {activeTab === 'timeline' && (
    <Card>
      <HrActivityFeed
        items={employee.careerHistory}
        groupBy="date"
      />
    </Card>
  )}
  
  {activeTab === 'documents' && (
    <Card
      title="Documents"
      actions={
        <Button leftIcon={<Upload />}>
          Upload Document
        </Button>
      }
    >
      <DataTable
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Category', accessorKey: 'category' },
          { header: 'Type', accessorKey: 'type' },
          { header: 'Size', accessorKey: 'size' },
          { header: 'Uploaded', accessorKey: 'uploadedAt' },
          {
            header: 'Actions',
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" leftIcon={<Download />}>
                  Download
                </Button>
                <Button size="sm" variant="ghost" leftIcon={<Trash />}>
                  Delete
                </Button>
              </div>
            )
          }
        ]}
        data={employee.documents}
      />
    </Card>
  )}
  
  {activeTab === 'compensation' && (
    <div className="space-y-6">
      <Card title="Current Salary">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-60">Current Salary</label>
            <div className="text-3xl font-bold">
              {formatCurrency(employee.salary)}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-neutral-60 mb-2 block">
              Job Grade Range: {formatCurrency(employee.minSalary)} - {formatCurrency(employee.maxSalary)}
            </label>
            <div className="relative h-2 bg-neutral-10 rounded-full">
              <div
                className="absolute h-2 bg-blue-60 rounded-full"
                style={{
                  width: `${((employee.salary - employee.minSalary) / (employee.maxSalary - employee.minSalary)) * 100}%`
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-60 border-2 border-white rounded-full"
                style={{
                  left: `${((employee.salary - employee.minSalary) / (employee.maxSalary - employee.minSalary)) * 100}%`
                }}
              />
            </div>
            <div className="text-sm text-neutral-60 mt-1">
              60% of grade range
            </div>
          </div>
          
          {employee.commissionPct && (
            <div>
              <label className="text-sm text-neutral-60">Commission</label>
              <div className="font-medium">{employee.commissionPct}%</div>
            </div>
          )}
        </div>
      </Card>
      
      <Card title="Salary History">
        <DataTable
          columns={[
            {
              header: 'Effective Date',
              accessorKey: 'effectiveDate',
              cell: ({ value }) => formatDate(value)
            },
            {
              header: 'Old Salary',
              accessorKey: 'oldSalary',
              cell: ({ value }) => formatCurrency(value)
            },
            {
              header: 'New Salary',
              accessorKey: 'newSalary',
              cell: ({ value }) => formatCurrency(value)
            },
            {
              header: 'Change',
              cell: ({ row }) => {
                const change = row.newSalary - row.oldSalary
                const pct = ((change / row.oldSalary) * 100).toFixed(1)
                return (
                  <span className={change > 0 ? 'text-success-60' : 'text-danger-60'}>
                    {formatCurrency(change)} ({pct}%)
                  </span>
                )
              }
            },
            { header: 'Reason', accessorKey: 'reason' },
            { header: 'Changed By', accessorKey: 'changedBy' }
          ]}
          data={employee.salaryHistory}
        />
      </Card>
    </div>
  )}
</DetailTemplate>
```

**Mock Data (Steven King example):**
```javascript
{
  employeeId: 100,
  firstName: 'Steven',
  lastName: 'King',
  name: 'Steven King',
  email: 'steven.king@company.com',
  phone: '515.123.4567',
  hireDate: '2013-06-17',
  jobId: 'AD_PRES',
  jobTitle: 'President',
  department: 'Executive',
  departmentId: 90,
  city: 'Seattle',
  country: 'United States',
  salary: 24000,
  minSalary: 20000,
  maxSalary: 40000,
  commissionPct: null,
  manager: null, // CEO
  status: 'ACTIVE',
  type: 'FULL_TIME',
  avatar: '/avatars/steven-king.jpg',
  careerHistory: [
    {
      id: 1,
      type: 'hire',
      title: 'Hired as President',
      date: '2013-06-17',
      user: { name: 'System' }
    }
  ],
  documents: [
    {
      id: 1,
      name: 'Employment_Contract.pdf',
      category: 'contract',
      type: 'PDF',
      size: '245 KB',
      uploadedAt: '2013-06-17'
    }
  ],
  salaryHistory: [
    {
      effectiveDate: '2013-06-17',
      oldSalary: 0,
      newSalary: 24000,
      reason: 'Initial Hire',
      changedBy: 'System'
    }
  ]
}
```

**States:**
- Loading (skeleton for all sections)
- Error (employee not found)
- Restricted (employee can only see own profile)

**Mobile:**
- Header: Stack vertically
- Tabs: Horizontal scroll
- Info sections: Single column

---

### 3.3 Org Chart
**Route:** `/hr/org-chart`  
**Access:** ALL  
**Template:** `HrOrgChartTemplate`

**Purpose:** Visual organization hierarchy

**Components Used:**
- HrOrgChartTemplate
- HrOrgChartNode (employee cards)
- SearchInput
- Button (zoom, expand controls)
- Third-party: react-organizational-chart or custom canvas

**Layout:**
```tsx
<HrOrgChartTemplate
  searchValue={searchQuery}
  onSearch={setSearchQuery}
  controls={
    <div className="flex gap-2">
      <Button size="sm" onClick={handleZoomIn} leftIcon={<ZoomIn />}>
        Zoom In
      </Button>
      <Button size="sm" onClick={handleZoomOut} leftIcon={<ZoomOut />}>
        Zoom Out
      </Button>
      <Button size="sm" onClick={handleFitToScreen} leftIcon={<Maximize />}>
        Fit to Screen
      </Button>
      <Button size="sm" onClick={handleExpandAll} leftIcon={<Expand />}>
        Expand All
      </Button>
      <Button size="sm" variant="secondary" onClick={handleExport} leftIcon={<Download />}>
        Export PNG
      </Button>
    </div>
  }
>
  <OrganizationChart
    data={orgData}
    renderNode={(employee) => (
      <HrOrgChartNode
        employee={employee}
        onClick={() => navigate(`/hr/employees/${employee.id}`)}
      />
    )}
  />
</HrOrgChartTemplate>
```

**Mock Data:**
- Org tree starting from Steven King (CEO)
- 3-4 levels deep
- Mixed countries (show flag icons)

**Features:**
- Pan: Click and drag
- Zoom: Mouse wheel or buttons
- Search: Highlight and center employee
- Click node: Navigate to employee profile
- Expand/collapse branches

**Mobile:**
- Touch pan/pinch zoom
- Simplified node cards (smaller)
- Horizontal scroll

---

## 4. Actions Module (Wizards)

### 4.1 Hire Employee Wizard
**Route:** `/hr/actions/hire`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `HrWizardTemplate`

**Purpose:** Multi-step wizard to onboard new employee

**Steps:**
1. Personal Details
2. Job Information
3. Compensation
4. Review & Confirm

**Components Used:**
- HrWizardTemplate
- Input (firstName, lastName, email, phone)
- DatePicker (hireDate)
- HrJobSelector (with grade preview)
- Select (department, location, manager)
- HrSalaryRangeInput (with validation bar)
- Input (commission %)
- Radio (employmentType: FULL_TIME, PART_TIME, CONTRACT, INTERN)
- DatePicker (contractEndDate - if CONTRACT)
- Card (review summary)
- Button (Previous, Next, Cancel, Hire Employee)

**Step 1: Personal Details**
```tsx
<div className="space-y-4">
  <Input
    label="First Name"
    value={formData.firstName}
    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
    required
  />
  <Input
    label="Last Name"
    value={formData.lastName}
    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
    required
  />
  <Input
    type="email"
    label="Email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    required
  />
  <Input
    label="Phone"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  />
  <DatePicker
    label="Hire Date"
    value={formData.hireDate}
    onChange={(date) => setFormData({ ...formData, hireDate: date })}
    required
    minDate={new Date()}
  />
</div>
```

**Step 2: Job Information**
```tsx
<div className="space-y-4">
  <HrJobSelector
    label="Job Title"
    value={formData.jobId}
    onChange={(jobId, job) => setFormData({
      ...formData,
      jobId,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary
    })}
    showGradePreview
    required
  />
  <Select
    label="Department"
    options={departmentOptions}
    value={formData.departmentId}
    onChange={(value) => setFormData({ ...formData, departmentId: value })}
    required
  />
  <Select
    label="Location"
    options={locationOptions}
    value={formData.locationId}
    onChange={(value) => setFormData({ ...formData, locationId: value })}
    required
  />
  <Select
    label="Manager"
    options={managerOptions}
    value={formData.managerId}
    onChange={(value) => setFormData({ ...formData, managerId: value })}
  />
</div>
```

**Step 3: Compensation**
```tsx
<div className="space-y-4">
  <HrSalaryRangeInput
    label="Annual Salary"
    value={formData.salary}
    onChange={(value) => setFormData({ ...formData, salary: value })}
    min={formData.minSalary}
    max={formData.maxSalary}
    currency="USD"
    required
    warning={formData.salary < formData.minSalary || formData.salary > formData.maxSalary}
    helperText={
      formData.salary > formData.maxSalary
        ? `Salary is ${(((formData.salary - formData.maxSalary) / formData.maxSalary) * 100).toFixed(0)}% above the job grade maximum`
        : undefined
    }
  />
  <Input
    type="number"
    label="Commission %"
    value={formData.commissionPct}
    onChange={(e) => setFormData({ ...formData, commissionPct: e.target.value })}
    helperText="Leave blank if not applicable"
  />
  <Radio
    label="Employment Type"
    options={[
      { value: 'FULL_TIME', label: 'Full Time' },
      { value: 'PART_TIME', label: 'Part Time' },
      { value: 'CONTRACT', label: 'Contract' },
      { value: 'INTERN', label: 'Intern' }
    ]}
    value={formData.employmentType}
    onChange={(value) => setFormData({ ...formData, employmentType: value })}
    required
  />
  {formData.employmentType === 'CONTRACT' && (
    <DatePicker
      label="Contract End Date"
      value={formData.contractEndDate}
      onChange={(date) => setFormData({ ...formData, contractEndDate: date })}
      required
      minDate={formData.hireDate}
    />
  )}
</div>
```

**Step 4: Review & Confirm**
```tsx
<Card title="Review New Employee">
  <div className="space-y-6">
    <div>
      <h4 className="font-medium mb-3">Personal Details</h4>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-neutral-60">Name</dt>
          <dd>{formData.firstName} {formData.lastName}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Email</dt>
          <dd>{formData.email}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Phone</dt>
          <dd>{formData.phone}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Hire Date</dt>
          <dd>{formatDate(formData.hireDate)}</dd>
        </div>
      </dl>
    </div>
    
    <div>
      <h4 className="font-medium mb-3">Job Information</h4>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-neutral-60">Job Title</dt>
          <dd>{formData.jobTitle}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Department</dt>
          <dd>{formData.departmentName}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Location</dt>
          <dd>{formData.locationName}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Manager</dt>
          <dd>{formData.managerName}</dd>
        </div>
      </dl>
    </div>
    
    <div>
      <h4 className="font-medium mb-3">Compensation</h4>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-neutral-60">Salary</dt>
          <dd className="text-lg font-bold">{formatCurrency(formData.salary)}</dd>
        </div>
        {formData.commissionPct && (
          <div>
            <dt className="text-neutral-60">Commission</dt>
            <dd>{formData.commissionPct}%</dd>
          </div>
        )}
        <div>
          <dt className="text-neutral-60">Employment Type</dt>
          <dd><HrEmploymentTypeBadge type={formData.employmentType} /></dd>
        </div>
        {formData.contractEndDate && (
          <div>
            <dt className="text-neutral-60">Contract End Date</dt>
            <dd>{formatDate(formData.contractEndDate)}</dd>
          </div>
        )}
      </dl>
    </div>
  </div>
</Card>
```

**Sample Data Shape:**
- Jobs: President, Manager, Programmer, Sales Rep, etc.
- Departments: Executive, IT, Sales, Finance, etc.
- Locations: Seattle, Bangalore, Mexico City, London, etc.
- Managers: List of employees with management roles

**Validation:**
- Step 1: First name, last name, email required
- Step 2: Job, department, location required
- Step 3: Salary required, must be > 0
- Contract type: End date required

**Success:**
- Show toast: "Employee hired successfully!"
- Navigate to new employee profile: `/hr/employees/{newId}`

**Mobile:**
- Full-screen wizard
- Form inputs: Full width
- Review: Single column

---

### 4.2 Promotion Wizard
**Route:** `/hr/actions/promote` or `/hr/employees/:id/promote`  
**Access:** ADMIN, HR_SPECIALIST, MANAGER (own team)  
**Template:** `HrWizardTemplate`

**Purpose:** Promote employee to new job/title

**Steps:**
1. Select Employee (skip if navigated from employee profile)
2. New Job & Department
3. Review & Confirm

**Components Used:**
- HrWizardTemplate
- HrEmployeeSelector
- HrJobSelector
- Select (department - optional)
- DatePicker (effectiveDate)
- HrSalaryRangeInput (new salary)
- Select (reasonCode)
- Card (side-by-side comparison)

**Step 1: Select Employee**
```tsx
<HrEmployeeSelector
  label="Select Employee to Promote"
  value={selectedEmployee}
  onChange={setSelectedEmployee}
  required
/>
{selectedEmployee && (
  <Card title="Current Position" className="mt-4">
    <dl className="space-y-2 text-sm">
      <div>
        <dt className="text-neutral-60">Job Title</dt>
        <dd>{selectedEmployee.jobTitle}</dd>
      </div>
      <div>
        <dt className="text-neutral-60">Department</dt>
        <dd>{selectedEmployee.department}</dd>
      </div>
      <div>
        <dt className="text-neutral-60">Current Salary</dt>
        <dd className="font-bold">{formatCurrency(selectedEmployee.salary)}</dd>
      </div>
    </dl>
  </Card>
)}
```

**Step 2: New Job & Compensation**
```tsx
<div className="space-y-4">
  <HrJobSelector
    label="New Job Title"
    value={formData.newJobId}
    onChange={(jobId, job) => setFormData({
      ...formData,
      newJobId: jobId,
      newMinSalary: job.minSalary,
      newMaxSalary: job.maxSalary
    })}
    showGradePreview
    required
  />
  <Select
    label="New Department (optional)"
    options={departmentOptions}
    value={formData.newDepartmentId}
    onChange={(value) => setFormData({ ...formData, newDepartmentId: value })}
    helperText="Leave blank if no department change"
  />
  <DatePicker
    label="Effective Date"
    value={formData.effectiveDate}
    onChange={(date) => setFormData({ ...formData, effectiveDate: date })}
    required
    minDate={new Date()}
  />
  <HrSalaryRangeInput
    label="New Salary"
    value={formData.newSalary}
    onChange={(value) => setFormData({ ...formData, newSalary: value })}
    min={formData.newMinSalary}
    max={formData.newMaxSalary}
    currency="USD"
    required
    helperText={`Current salary: ${formatCurrency(selectedEmployee.salary)}`}
  />
  <Select
    label="Reason Code"
    options={[
      { value: 'MERIT', label: 'Merit Promotion' },
      { value: 'CAREER', label: 'Career Progression' },
      { value: 'PERFORMANCE', label: 'Performance Excellence' },
      { value: 'OTHER', label: 'Other' }
    ]}
    value={formData.reasonCode}
    onChange={(value) => setFormData({ ...formData, reasonCode: value })}
    required
  />
</div>
```

**Step 3: Review & Confirm**
```tsx
<Card title="Promotion Summary">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-medium mb-3">Current</h4>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-neutral-60">Job Title</dt>
          <dd>{selectedEmployee.jobTitle}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Department</dt>
          <dd>{selectedEmployee.department}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Salary</dt>
          <dd className="font-bold">{formatCurrency(selectedEmployee.salary)}</dd>
        </div>
      </dl>
    </div>
    
    <div>
      <h4 className="font-medium mb-3 text-success-60">New (Effective {formatDate(formData.effectiveDate)})</h4>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-neutral-60">Job Title</dt>
          <dd className="font-medium text-success-60">{formData.newJobTitle}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Department</dt>
          <dd>{formData.newDepartmentName || selectedEmployee.department}</dd>
        </div>
        <div>
          <dt className="text-neutral-60">Salary</dt>
          <dd className="font-bold text-success-60">
            {formatCurrency(formData.newSalary)}
            <span className="text-sm ml-2">
              (+{((formData.newSalary / selectedEmployee.salary - 1) * 100).toFixed(1)}%)
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </div>
  
  <div className="mt-4 pt-4 border-t border-neutral-20">
    <dl className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <dt className="text-neutral-60">Reason</dt>
        <dd>{formData.reasonLabel}</dd>
      </div>
    </dl>
  </div>
</Card>
```

**Success:**
- Toast: "Employee promoted successfully!"
- Navigate to employee profile

---

### 4.3 Transfer Wizard
**Route:** `/hr/actions/transfer` or `/hr/employees/:id/transfer`  
**Access:** ADMIN, HR_SPECIALIST, MANAGER (own team)  
**Template:** `HrWizardTemplate`

**Purpose:** Transfer employee to new department/location/manager

**Steps:**
1. Select Employee
2. New Assignment
3. Review & Confirm

**Components Used:**
- HrWizardTemplate
- HrEmployeeSelector
- Select (department, location, manager)
- DatePicker (effectiveDate)
- Card (comparison)

**Similar to Promotion Wizard but focuses on organizational assignment changes, not job/salary**

---

### 4.4 Termination Wizard
**Route:** `/hr/actions/terminate` or `/hr/employees/:id/terminate`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `HrWizardTemplate`

**Purpose:** Terminate employee with proper documentation

**Steps:**
1. Select Employee
2. Termination Details
3. Review & Confirm (with danger confirmation)

**Components Used:**
- HrWizardTemplate
- HrEmployeeSelector
- DatePicker (effectiveDate)
- Select (reasonCode)
- Textarea (notes)
- HrConfirmDialog (final confirmation)
- Card (summary with warning)

**Step 2: Termination Details**
```tsx
<Card className="border-danger-60 bg-danger-5">
  <div className="flex items-start gap-3 mb-4">
    <AlertCircle className="text-danger-60 flex-shrink-0" />
    <div>
      <h4 className="font-medium text-danger-60">Termination Action</h4>
      <p className="text-sm text-neutral-60">
        This action will change the employee's status to TERMINATED and end their access to the system.
      </p>
    </div>
  </div>
</Card>

<div className="space-y-4 mt-6">
  <DatePicker
    label="Effective Date"
    value={formData.effectiveDate}
    onChange={(date) => setFormData({ ...formData, effectiveDate: date })}
    required
  />
  <Select
    label="Reason Code"
    options={[
      { value: 'VOLUNTARY_RESIGNATION', label: 'Voluntary Resignation' },
      { value: 'PERFORMANCE', label: 'Performance Issues' },
      { value: 'CONTRACT_END', label: 'Contract End' },
      { value: 'ROLE_ELIMINATION', label: 'Role Elimination' },
      { value: 'RELOCATION', label: 'Relocation' },
      { value: 'BETTER_OPPORTUNITY', label: 'Better Opportunity' },
      { value: 'OTHER', label: 'Other' }
    ]}
    value={formData.reasonCode}
    onChange={(value) => setFormData({ ...formData, reasonCode: value })}
    required
  />
  <Textarea
    label="Notes (optional)"
    value={formData.notes}
    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
    rows={4}
    placeholder="Add any additional context..."
  />
</div>
```

**Step 3: Review & Confirm**
```tsx
<Card className="border-danger-60">
  <div className="flex items-start gap-3 mb-4">
    <AlertCircle className="text-danger-60 flex-shrink-0" size={24} />
    <div>
      <h4 className="font-medium text-danger-60 text-lg">Confirm Termination</h4>
      <p className="text-sm text-neutral-60 mt-1">
        Please review the details carefully. This action cannot be undone.
      </p>
    </div>
  </div>
  
  <dl className="space-y-3 mt-4">
    <div>
      <dt className="text-sm text-neutral-60">Employee</dt>
      <dd className="font-medium">{selectedEmployee.name}</dd>
    </div>
    <div>
      <dt className="text-sm text-neutral-60">Job Title</dt>
      <dd>{selectedEmployee.jobTitle}</dd>
    </div>
    <div>
      <dt className="text-sm text-neutral-60">Department</dt>
      <dd>{selectedEmployee.department}</dd>
    </div>
    <div>
      <dt className="text-sm text-neutral-60">Effective Date</dt>
      <dd>{formatDate(formData.effectiveDate)}</dd>
    </div>
    <div>
      <dt className="text-sm text-neutral-60">Reason</dt>
      <dd>{formData.reasonLabel}</dd>
    </div>
    {formData.notes && (
      <div>
        <dt className="text-sm text-neutral-60">Notes</dt>
        <dd className="text-sm">{formData.notes}</dd>
      </div>
    )}
  </dl>
</Card>
```

**Final confirmation button:**
```tsx
<Button
  variant="danger"
  onClick={handleConfirmTermination}
  loading={isSubmitting}
>
  Confirm Termination
</Button>
```

**Success:**
- Toast: "Employee terminated"
- Navigate to employee directory (terminated employees filtered out by default)

---

## 5. Organization Structure Module

### 5.1 Structure Manager - Regions
**Route:** `/hr/organization/regions`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `DataManagementTemplate`

**Purpose:** Manage geographic regions

**Components Used:**
- DataManagementTemplate
- DataTable
- Modal (create/edit form)
- Input (region name)
- Button

**Table Columns:**
- Region ID
- Region Name
- Countries (count)
- Actions (Edit, Deactivate)

**Mock Data:**
- Europe
- Americas
- Middle East and Africa
- Asia

**Priority:** P2 (lower priority)

---

### 5.2 Structure Manager - Countries
**Route:** `/hr/organization/countries`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `DataManagementTemplate`

**Purpose:** Manage countries

**Components Used:**
- DataManagementTemplate
- DataTable
- Modal (create/edit form)
- Input (country name, country code)
- Select (region)

**Table Columns:**
- Country ID
- Country Code
- Country Name
- Region
- Actions

**Mock Data:**
- US (Americas)
- India (Asia)
- Mexico (Americas)
- UK (Europe)

**Priority:** P2

---

### 5.3 Structure Manager - Locations
**Route:** `/hr/organization/locations`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `DataManagementTemplate`

**Purpose:** Manage office locations

**Components Used:**
- DataManagementTemplate
- DataTable
- Modal (create/edit form)
- Input (street address, postal code, city, state)
- Select (country)

**Table Columns:**
- Location ID
- City
- State/Province
- Country
- Employees (count)
- Actions

**Mock Data:**
- Seattle, WA, USA
- Bangalore, Karnataka, India
- Mexico City, Mexico
- London, UK

**Priority:** P2

---

### 5.4 Structure Manager - Departments
**Route:** `/hr/organization/departments`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `HrSplitViewTemplate`

**Purpose:** Manage department hierarchy

**Components Used:**
- HrSplitViewTemplate
- Tree view (left panel) - collapsible department tree
- Card (right panel) - department details
- Modal (create/edit form)
- Input (department name)
- Select (parent department, manager, location)

**Left Panel: Tree View**
```tsx
<div className="p-4">
  <SearchInput
    placeholder="Search departments..."
    value={searchQuery}
    onChange={setSearchQuery}
  />
  
  <div className="mt-4">
    <DepartmentTree
      departments={departmentTree}
      selectedId={selectedDepartmentId}
      onSelect={setSelectedDepartmentId}
      expandedIds={expandedIds}
      onToggle={handleToggleExpand}
    />
  </div>
</div>
```

**Right Panel: Detail Panel**
```tsx
{selectedDepartment ? (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
        <p className="text-sm text-neutral-60">Department ID: {selectedDepartment.id}</p>
      </div>
      <Dropdown
        trigger={<Button variant="ghost" icon={<MoreVertical />} />}
        items={[
          { label: 'Edit', onClick: handleEdit },
          { label: 'Add Child Department', onClick: handleAddChild },
          { label: 'Move', onClick: handleMove },
          { label: 'Deactivate', onClick: handleDeactivate, variant: 'danger' }
        ]}
      />
    </div>
    
    <dl className="space-y-4">
      <div>
        <dt className="text-sm text-neutral-60">Manager</dt>
        <dd className="font-medium">{selectedDepartment.manager || 'Not assigned'}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-60">Location</dt>
        <dd>{selectedDepartment.location}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-60">Parent Department</dt>
        <dd>{selectedDepartment.parentName || '— (Top Level)'}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-60">Employees</dt>
        <dd className="font-bold text-2xl">{selectedDepartment.employeeCount}</dd>
      </div>
    </dl>
    
    {selectedDepartment.children && selectedDepartment.children.length > 0 && (
      <div className="mt-6">
        <h3 className="font-medium mb-3">Child Departments</h3>
        <ul className="space-y-2">
          {selectedDepartment.children.map(child => (
            <li key={child.id} className="flex items-center justify-between py-2 px-3 bg-neutral-5 rounded">
              <span>{child.name}</span>
              <span className="text-sm text-neutral-60">{child.employeeCount} employees</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center justify-center h-full text-neutral-60">
    <p>Select a department to view details</p>
  </div>
)}
```

**Mock Data (Department Tree):**
```javascript
{
  id: 90,
  name: 'Executive',
  manager: 'Steven King',
  location: 'Seattle, WA',
  employeeCount: 3,
  children: [
    {
      id: 10,
      name: 'Administration',
      manager: 'Jennifer Whalen',
      location: 'Seattle, WA',
      employeeCount: 1,
      children: []
    },
    {
      id: 20,
      name: 'Marketing',
      manager: 'Michael Hartstein',
      location: 'Toronto, ON',
      employeeCount: 3,
      children: []
    },
    {
      id: 60,
      name: 'IT',
      manager: 'Alexander Hunold',
      location: 'Southlake, TX',
      employeeCount: 28,
      children: [
        {
          id: 280,
          name: 'IT Dev India',
          manager: 'Rajesh Kumar',
          location: 'Bangalore, India',
          employeeCount: 10,
          children: []
        },
        {
          id: 290,
          name: 'IT QA India',
          manager: 'Deepa Nair',
          location: 'Mumbai, India',
          employeeCount: 8,
          children: []
        },
        // ... more IT sub-departments
      ]
    },
    // ... more departments
  ]
}
```

**Features:**
- Drag-and-drop to reparent (with confirmation)
- Click tree node: Show detail panel
- Create: Add child department
- Edit: Update name, manager, location
- Move: Change parent department
- Deactivate: Soft delete (require moving employees first)

**Mobile:**
- Single panel view
- Toggle between tree and detail
- Tabs: [Tree] [Detail]

**Priority:** P1 (important for org structure)

---

### 5.5 Structure Manager - Jobs
**Route:** `/hr/organization/jobs`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `DataManagementTemplate`

**Purpose:** Manage job titles and salary grades

**Components Used:**
- DataManagementTemplate
- DataTable
- Modal (create/edit form)
- Input (job ID, job title, min salary, max salary)

**Table Columns:**
- Job ID (e.g., AD_PRES, IT_PROG, SA_REP)
- Job Title
- Min Salary
- Max Salary
- Salary Range (visual bar)
- Employees (count)
- Actions

**Mock Data:**
```javascript
[
  { jobId: 'AD_PRES', title: 'President', minSalary: 20000, maxSalary: 40000, employeeCount: 1 },
  { jobId: 'AD_VP', title: 'Administration Vice President', minSalary: 15000, maxSalary: 30000, employeeCount: 2 },
  { jobId: 'IT_PROG', title: 'Programmer', minSalary: 4000, maxSalary: 10000, employeeCount: 15 },
  { jobId: 'SA_MAN', title: 'Sales Manager', minSalary: 10000, maxSalary: 20000, employeeCount: 5 },
  { jobId: 'SA_REP', title: 'Sales Representative', minSalary: 6000, maxSalary: 12000, employeeCount: 20 },
  // ... more jobs
]
```

**Priority:** P1 (needed for hire/promote wizards)

---

## 6. Admin Module

### 6.1 Admin - Users
**Route:** `/hr/admin/users`  
**Access:** ADMIN only  
**Template:** `DataManagementTemplate`

**Purpose:** Manage user accounts and role assignments

**Components Used:**
- DataManagementTemplate
- DataTable
- Modal (create/edit user)
- Input (username, email, password)
- Select (employee - link to employee record)
- Checkbox (roles: ADMIN, HR_SPECIALIST, MANAGER, EMPLOYEE)
- Badge (active/inactive status)

**Table Columns:**
- User ID
- Username
- Linked Employee (name)
- Roles (badges)
- Status (active/inactive)
- Last Login
- Actions (Edit, Reset Password, Deactivate)

**Mock Data:**
```javascript
[
  {
    id: 1,
    username: 'admin',
    email: 'admin@hr.com',
    employeeId: null,
    employeeName: 'System Admin',
    roles: ['ADMIN'],
    status: 'active',
    lastLogin: '2026-03-26T10:30:00'
  },
  {
    id: 2,
    username: 'hr.specialist',
    email: 'susan@hr.com',
    employeeId: 205,
    employeeName: 'Susan Mavris',
    roles: ['HR_SPECIALIST'],
    status: 'active',
    lastLogin: '2026-03-26T09:15:00'
  },
  {
    id: 3,
    username: 'manager',
    email: 'neena@hr.com',
    employeeId: 101,
    employeeName: 'Neena Kochhar',
    roles: ['MANAGER'],
    status: 'active',
    lastLogin: '2026-03-25T16:45:00'
  },
  // ... more users
]
```

**Create User Modal:**
```tsx
<Modal isOpen={isCreateModalOpen} onClose={closeModal} title="Create User">
  <form onSubmit={handleCreateUser}>
    <Input
      label="Username"
      value={formData.username}
      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      required
    />
    <Input
      type="email"
      label="Email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      required
    />
    <Input
      type="password"
      label="Password"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      required
      helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special"
    />
    <Select
      label="Link to Employee (optional)"
      options={employeeOptions}
      value={formData.employeeId}
      onChange={(value) => setFormData({ ...formData, employeeId: value })}
      searchable
    />
    <div>
      <label className="block text-sm font-medium mb-2">Roles</label>
      <div className="space-y-2">
        <Checkbox
          label="System Admin"
          checked={formData.roles.includes('ADMIN')}
          onChange={(checked) => handleRoleChange('ADMIN', checked)}
        />
        <Checkbox
          label="HR Specialist"
          checked={formData.roles.includes('HR_SPECIALIST')}
          onChange={(checked) => handleRoleChange('HR_SPECIALIST', checked)}
        />
        <Checkbox
          label="Manager"
          checked={formData.roles.includes('MANAGER')}
          onChange={(checked) => handleRoleChange('MANAGER', checked)}
        />
        <Checkbox
          label="Employee"
          checked={formData.roles.includes('EMPLOYEE')}
          onChange={(checked) => handleRoleChange('EMPLOYEE', checked)}
        />
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="secondary" onClick={closeModal}>
        Cancel
      </Button>
      <Button type="submit" loading={isSubmitting}>
        Create User
      </Button>
    </div>
  </form>
</Modal>
```

**Priority:** P1 (needed for access control)

---

### 6.2 Admin - Audit Logs
**Route:** `/hr/admin/audit-logs`  
**Access:** ADMIN only  
**Template:** `DataManagementTemplate`

**Purpose:** View all system changes with JSON diffs

**Components Used:**
- DataManagementTemplate
- DatePicker (date range filter)
- Select (table, action, employee filters)
- DataTable
- HrAuditLogRow (expandable rows with JSON diff)
- Button (Export CSV)

**Table Columns:**
- Timestamp
- Table (employees, departments, jobs, etc.)
- Action (INSERT, UPDATE, DELETE)
- Record ID
- Changed By
- Expand/Collapse (show JSON diff)

**Layout:**
```tsx
<DataManagementTemplate
  breadcrumbs={[
    { label: 'Home', href: '/hr/dashboard' },
    { label: 'Admin', href: '/hr/admin' },
    { label: 'Audit Logs' }
  ]}
  title="Audit Logs"
  subtitle={`${filteredCount} log entries`}
  actions={
    <Button variant="secondary" leftIcon={<Download />}>
      Export CSV
    </Button>
  }
  filters={
    <div className="flex flex-col md:flex-row gap-4">
      <DatePicker
        label="Date From"
        value={dateFrom}
        onChange={setDateFrom}
      />
      <DatePicker
        label="Date To"
        value={dateTo}
        onChange={setDateTo}
      />
      <Select
        label="Table"
        options={tableOptions}
        value={tableFilter}
        onChange={setTableFilter}
        placeholder="All Tables"
      />
      <Select
        label="Action"
        options={[
          { value: 'INSERT', label: 'Insert' },
          { value: 'UPDATE', label: 'Update' },
          { value: 'DELETE', label: 'Delete' }
        ]}
        value={actionFilter}
        onChange={setActionFilter}
        placeholder="All Actions"
      />
      <Select
        label="Changed By"
        options={userOptions}
        value={userFilter}
        onChange={setUserFilter}
        placeholder="All Users"
        searchable
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  }
  table={
    <div className="space-y-1">
      {auditLogs.map(log => (
        <HrAuditLogRow
          key={log.id}
          log={log}
          isExpanded={expandedLogId === log.id}
          onToggle={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
        />
      ))}
    </div>
  }
/>
```

**Mock Data:**
```javascript
[
  {
    id: 1,
    timestamp: '2026-03-15T17:00:00',
    table: 'employees',
    action: 'UPDATE',
    recordId: 312,
    changedBy: 'Susan Mavris',
    oldValue: {
      employment_status: 'ACTIVE',
      department_id: 60
    },
    newValue: {
      employment_status: 'TERMINATED',
      termination_date: '2026-03-15',
      termination_reason: 'Contract End'
    }
  },
  {
    id: 2,
    timestamp: '2026-03-01T09:00:00',
    table: 'employees',
    action: 'INSERT',
    recordId: 322,
    changedBy: 'Susan Mavris',
    oldValue: null,
    newValue: {
      employee_id: 322,
      first_name: 'Varun',
      last_name: 'Bhatt',
      email: 'varun.bhatt@company.com',
      hire_date: '2026-03-01',
      job_id: 'IT_PROG',
      salary: 5000
    }
  },
  {
    id: 3,
    timestamp: '2026-01-01T00:00:00',
    table: 'employees',
    action: 'UPDATE',
    recordId: 103,
    changedBy: 'Neena Kochhar',
    oldValue: {
      salary: 8500
    },
    newValue: {
      salary: 9000,
      salary_change_reason: 'Annual Increase'
    }
  }
]
```

**HrAuditLogRow expanded view:**
- Show formatted JSON with syntax highlighting
- Highlight changed fields
- Color-coded: Green (new fields), Yellow (modified), Red (deleted)

**Priority:** P2 (useful for compliance but not MVP)

---

## 7. Settings & Utilities Module

### 7.1 User Settings / Preferences
**Route:** `/hr/settings`  
**Access:** ALL  
**Template:** `HrSettingsTemplate`

**Purpose:** User preferences for localization and notifications

**Components Used:**
- HrSettingsTemplate
- Select (language, timezone, dateFormat, currency, numberFormat)
- Checkbox (notification preferences)
- Card (live preview)
- Button (Save, Cancel)

**Layout:**
```tsx
<HrSettingsTemplate
  sections={[
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your language, timezone, and display formats',
      content: (
        <div className="space-y-4">
          <Select
            label="Language"
            options={[
              { value: 'en-US', label: 'English (United States)' },
              { value: 'es-ES', label: 'Spanish (Spain)' },
              { value: 'fr-FR', label: 'French (France)' },
              { value: 'de-DE', label: 'German (Germany)' }
            ]}
            value={preferences.language}
            onChange={(value) => setPreferences({ ...preferences, language: value })}
          />
          <Select
            label="Timezone"
            options={timezoneOptions}
            value={preferences.timezone}
            onChange={(value) => setPreferences({ ...preferences, timezone: value })}
            searchable
          />
          <Select
            label="Date Format"
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
            ]}
            value={preferences.dateFormat}
            onChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
          />
          <Select
            label="Currency"
            options={[
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GBP', label: 'GBP - British Pound' },
              { value: 'INR', label: 'INR - Indian Rupee' }
            ]}
            value={preferences.currency}
            onChange={(value) => setPreferences({ ...preferences, currency: value })}
          />
          <Select
            label="Number Format"
            options={[
              { value: '1,000.00', label: '1,000.00 (US)' },
              { value: '1.000,00', label: '1.000,00 (Europe)' },
              { value: '1 000,00', label: '1 000,00 (France)' }
            ]}
            value={preferences.numberFormat}
            onChange={(value) => setPreferences({ ...preferences, numberFormat: value })}
          />
          
          <Card title="Preview" className="mt-6 bg-neutral-5">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-neutral-60">Date</dt>
                <dd className="font-medium">{formatDatePreview(new Date(), preferences.dateFormat)}</dd>
              </div>
              <div>
                <dt className="text-neutral-60">Salary</dt>
                <dd className="font-medium">{formatCurrencyPreview(24000, preferences.currency, preferences.numberFormat)}</dd>
              </div>
              <div>
                <dt className="text-neutral-60">Number</dt>
                <dd className="font-medium">{formatNumberPreview(1234567.89, preferences.numberFormat)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Choose which notifications you want to receive',
      content: (
        <div className="space-y-3">
          <Checkbox
            label="Email me about probation alerts"
            checked={notificationPrefs.probationAlerts}
            onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, probationAlerts: checked })}
          />
          <Checkbox
            label="Email me about contract expiries"
            checked={notificationPrefs.contractExpiries}
            onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, contractExpiries: checked })}
          />
          <Checkbox
            label="Email me about salary changes"
            checked={notificationPrefs.salaryChanges}
            onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, salaryChanges: checked })}
          />
          <Checkbox
            label="Email me about team changes (Manager only)"
            checked={notificationPrefs.teamChanges}
            onChange={(checked) => setNotificationPrefs({ ...notificationPrefs, teamChanges: checked })}
          />
        </div>
      )
    }
  ]}
  onSave={handleSave}
  onCancel={handleCancel}
  hasChanges={hasUnsavedChanges}
  loading={isSaving}
/>
```

**Mock Data:**
- Default preferences based on user's browser locale
- Live preview updates as user changes dropdowns

**Success:**
- Toast: "Settings saved successfully"
- Page refresh to apply new locale

**Priority:** P2 (nice to have but not MVP)

---

### 7.2 Notification Center
**Route:** `/hr/notifications`  
**Access:** ALL  
**Template:** `HrNotificationCenterTemplate`

**Purpose:** View all notifications with filtering

**Components Used:**
- HrNotificationCenterTemplate
- HrNotificationItem (individual notifications)
- Select (filter by type)
- Button (Mark All Read)
- Badge (unread count)

**Layout:**
```tsx
<HrNotificationCenterTemplate
  filters={
    <Select
      options={[
        { value: 'all', label: 'All Notifications' },
        { value: 'probation', label: 'Probation Alerts' },
        { value: 'contract', label: 'Contract Expiry' },
        { value: 'action', label: 'Action Complete' },
        { value: 'system', label: 'System' }
      ]}
      value={filterType}
      onChange={setFilterType}
    />
  }
  actions={
    <Button
      variant="secondary"
      onClick={handleMarkAllRead}
      disabled={unreadCount === 0}
    >
      Mark All Read
    </Button>
  }
>
  {groupedNotifications.map(group => (
    <div key={group.label} className="mb-6">
      <h3 className="text-sm font-medium text-neutral-60 uppercase mb-3">
        {group.label}
      </h3>
      <div className="space-y-2">
        {group.items.map(notification => (
          <HrNotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={handleMarkRead}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>
    </div>
  ))}
</HrNotificationCenterTemplate>
```

**Mock Data:**
```javascript
[
  {
    id: 1,
    type: 'probation',
    title: 'Probation ending: Diana Lorentz',
    message: 'IT Department — probation ends Apr 7, 2026',
    date: new Date('2026-03-26T12:00:00'),
    isRead: false,
    actionUrl: '/hr/employees/192',
    actionLabel: 'View Employee'
  },
  {
    id: 2,
    type: 'contract',
    title: 'Contract expiring: Guy Himuro',
    message: 'Purchasing — contract expires Jun 30, 2026',
    date: new Date('2026-03-26T12:00:00'),
    isRead: false,
    actionUrl: '/hr/employees/198',
    actionLabel: 'View Employee'
  },
  {
    id: 3,
    type: 'action',
    title: 'Salary adjustment processed',
    message: 'Alexander Hunold — $8,500 → $9,000',
    date: new Date('2026-01-01T00:00:00'),
    isRead: true,
    actionUrl: '/hr/employees/103',
    actionLabel: 'View Employee'
  },
  {
    id: 4,
    type: 'system',
    title: 'Annual compensation review window open',
    message: 'All manager salary proposals due by Apr 15, 2026',
    date: new Date('2026-03-20T09:00:00'),
    isRead: false
  }
]
```

**Grouping:**
- Today
- Earlier This Week
- This Month
- Older

**Priority:** P1 (important for alerts)

---

### 7.3 Global Search Results
**Route:** `/hr/search?q={query}`  
**Access:** ALL  
**Template:** `DataManagementTemplate`

**Purpose:** Search results across all entities (employees, departments, jobs)

**Components Used:**
- DataManagementTemplate
- SearchInput (pre-filled with query)
- Tabs (filter by entity type: All, Employees, Departments, Jobs)
- Card (result items)

**Layout:**
```tsx
<DataManagementTemplate
  title={`Search Results for "${query}"`}
  subtitle={`${totalResults} results found`}
  filters={
    <Tabs
      tabs={[
        { id: 'all', label: `All (${totalResults})` },
        { id: 'employees', label: `Employees (${employeeResults.length})` },
        { id: 'departments', label: `Departments (${deptResults.length})` },
        { id: 'jobs', label: `Jobs (${jobResults.length})` }
      ]}
      activeTab={activeTab}
      onChange={setActiveTab}
    />
  }
  table={null}
>
  <div className="space-y-4">
    {activeTab === 'all' && (
      <>
        {employeeResults.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Employees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employeeResults.map(employee => (
                <Card
                  key={employee.id}
                  onClick={() => navigate(`/hr/employees/${employee.id}`)}
                  hoverable
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={employee.avatar} size="md" />
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-neutral-60">{employee.jobTitle}</div>
                      <div className="text-sm text-neutral-60">{employee.department}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {deptResults.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Departments</h3>
            {/* Similar card grid */}
          </div>
        )}
        {jobResults.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Jobs</h3>
            {/* Similar card grid */}
          </div>
        )}
      </>
    )}
    
    {activeTab === 'employees' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employeeResults.map(employee => (
          <EmployeeResultCard key={employee.id} employee={employee} />
        ))}
      </div>
    )}
    
    {/* Similar for other tabs */}
  </div>
</DataManagementTemplate>
```

**Empty State:**
- No results found for "{query}"
- Try different keywords or check spelling

**Priority:** P1 (important for navigation)

---

### 7.4 Bulk Import/Export
**Route:** `/hr/bulk-import`  
**Access:** ADMIN, HR_SPECIALIST  
**Template:** `HrBulkImportTemplate`

**Purpose:** Import employees from CSV/Excel

**Steps:**
1. Upload File
2. Map Columns
3. Review & Validate
4. Import

**Components Used:**
- HrBulkImportTemplate
- HrFileUpload (CSV/Excel)
- DataTable (column mapping, preview)
- Badge (validation errors)
- Button (Import, Cancel)

**Step 1: Upload File**
```tsx
<Card>
  <HrFileUpload
    value={uploadedFile ? [uploadedFile] : []}
    onChange={handleFileUpload}
    accept=".csv,.xlsx,.xls"
    maxFiles={1}
    category="import"
  />
  <p className="text-sm text-neutral-60 mt-4">
    Supported formats: CSV, Excel (.xlsx, .xls)
  </p>
  <p className="text-sm text-neutral-60">
    Maximum file size: 10MB
  </p>
</Card>
```

**Step 2: Map Columns**
```tsx
<Card title="Map Columns">
  <p className="text-sm text-neutral-60 mb-4">
    Map your file columns to HR system fields
  </p>
  <DataTable
    columns={[
      { header: 'Your Column', accessorKey: 'sourceColumn' },
      {
        header: 'HR System Field',
        cell: ({ row }) => (
          <Select
            options={hrFieldOptions}
            value={columnMapping[row.sourceColumn]}
            onChange={(value) => handleColumnMap(row.sourceColumn, value)}
            placeholder="Select field..."
          />
        )
      },
      {
        header: 'Sample Data',
        cell: ({ row }) => (
          <span className="text-sm text-neutral-60">
            {row.sampleData}
          </span>
        )
      }
    ]}
    data={csvColumns}
  />
</Card>
```

**Step 3: Review & Validate**
```tsx
<Card title="Review Import Data">
  <div className="mb-4">
    <div className="flex items-center gap-2">
      {validRows.length > 0 && (
        <Badge variant="success">
          {validRows.length} valid rows
        </Badge>
      )}
      {invalidRows.length > 0 && (
        <Badge variant="danger">
          {invalidRows.length} errors
        </Badge>
      )}
    </div>
  </div>
  
  <Tabs
    tabs={[
      { id: 'valid', label: `Valid (${validRows.length})` },
      { id: 'invalid', label: `Errors (${invalidRows.length})` }
    ]}
    activeTab={activeTab}
    onChange={setActiveTab}
  />
  
  {activeTab === 'valid' && (
    <DataTable
      columns={previewColumns}
      data={validRows}
    />
  )}
  
  {activeTab === 'invalid' && (
    <DataTable
      columns={[
        { header: 'Row', accessorKey: 'rowNumber' },
        { header: 'Error', accessorKey: 'error' },
        { header: 'Data', accessorKey: 'data' }
      ]}
      data={invalidRows}
    />
  )}
</Card>
```

**Step 4: Import**
- Show progress bar
- Success/error summary
- Option to download error log

**Priority:** P2 (useful but not MVP)

---

## 8. Error & System Pages

### 8.1 404 - Not Found
**Route:** `/hr/*` (catch-all)  
**Access:** ALL  
**Template:** `HrEmptyStateTemplate`

**Purpose:** Handle unknown routes

**Layout:**
```tsx
<HrEmptyStateTemplate
  title="404 - Page Not Found"
  message="The page you're looking for doesn't exist or has been moved."
  icon={AlertCircle}
  actions={
    <>
      <Button onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <Button variant="secondary" onClick={() => navigate('/hr/dashboard')}>
        Go to Dashboard
      </Button>
    </>
  }
/>
```

**Priority:** P0 (essential)

---

### 8.2 Unauthorized / Access Denied
**Route:** `/hr/unauthorized`  
**Access:** ALL  
**Template:** `HrEmptyStateTemplate`

**Purpose:** Show when user tries to access restricted page

**Layout:**
```tsx
<HrEmptyStateTemplate
  title="Access Denied"
  message="You don't have permission to access this page. Please contact your administrator if you believe this is an error."
  icon={ShieldOff}
  actions={
    <Button onClick={() => navigate('/hr/dashboard')}>
      Go to Dashboard
    </Button>
  }
/>
```

**Priority:** P1 (needed for RBAC)

---

## 9. Routing Structure

### 9.1 Route Configuration
```typescript
// frontend/src/routes/router.tsx

import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

export const hrRouter = createBrowserRouter([
  {
    path: '/hr',
    children: [
      // Public routes
      {
        path: 'login',
        element: <LoginPage />
      },
      
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />
          },
          {
            path: 'employees',
            children: [
              { index: true, element: <EmployeeDirectoryPage /> },
              { path: ':id', element: <EmployeeDetailPage /> }
            ]
          },
          {
            path: 'org-chart',
            element: <OrgChartPage />
          },
          {
            path: 'actions',
            element: <ProtectedRoute roles={['ADMIN', 'HR_SPECIALIST', 'MANAGER']} />,
            children: [
              { path: 'hire', element: <HireWizardPage /> },
              { path: 'promote', element: <PromotePage /> },
              { path: 'transfer', element: <TransferPage /> },
              {
                path: 'terminate',
                element: <ProtectedRoute roles={['ADMIN', 'HR_SPECIALIST']} />,
                children: [
                  { index: true, element: <TerminatePage /> }
                ]
              }
            ]
          },
          {
            path: 'organization',
            element: <ProtectedRoute roles={['ADMIN', 'HR_SPECIALIST']} />,
            children: [
              { path: 'regions', element: <RegionsPage /> },
              { path: 'countries', element: <CountriesPage /> },
              { path: 'locations', element: <LocationsPage /> },
              { path: 'departments', element: <DepartmentsPage /> },
              { path: 'jobs', element: <JobsPage /> }
            ]
          },
          {
            path: 'admin',
            element: <ProtectedRoute roles={['ADMIN']} />,
            children: [
              { path: 'users', element: <UsersPage /> },
              { path: 'audit-logs', element: <AuditLogPage /> }
            ]
          },
          {
            path: 'settings',
            element: <SettingsPage />
          },
          {
            path: 'notifications',
            element: <NotificationsPage />
          },
          {
            path: 'search',
            element: <SearchResultsPage />
          },
          {
            path: 'bulk-import',
            element: <ProtectedRoute roles={['ADMIN', 'HR_SPECIALIST']} />,
            children: [
              { index: true, element: <BulkImportPage /> }
            ]
          },
          {
            path: 'unauthorized',
            element: <UnauthorizedPage />
          },
          {
            path: '*',
            element: <NotFoundPage />
          }
        ]
      }
    ]
  }
])
```

### 9.2 URL Structure Summary

| Screen | URL | Access |
|---|---|---|
| Login | `/hr/login` | Public |
| Dashboard | `/hr/dashboard` | ALL |
| Employee Directory | `/hr/employees` | ALL |
| Employee Detail | `/hr/employees/:id` | ALL |
| Org Chart | `/hr/org-chart` | ALL |
| Hire Wizard | `/hr/actions/hire` | ADMIN, HR_SPECIALIST |
| Promote Wizard | `/hr/actions/promote` | ADMIN, HR_SPECIALIST, MANAGER |
| Transfer Wizard | `/hr/actions/transfer` | ADMIN, HR_SPECIALIST, MANAGER |
| Terminate Wizard | `/hr/actions/terminate` | ADMIN, HR_SPECIALIST |
| Regions | `/hr/organization/regions` | ADMIN, HR_SPECIALIST |
| Countries | `/hr/organization/countries` | ADMIN, HR_SPECIALIST |
| Locations | `/hr/organization/locations` | ADMIN, HR_SPECIALIST |
| Departments | `/hr/organization/departments` | ADMIN, HR_SPECIALIST |
| Jobs | `/hr/organization/jobs` | ADMIN, HR_SPECIALIST |
| Users | `/hr/admin/users` | ADMIN |
| Audit Logs | `/hr/admin/audit-logs` | ADMIN |
| Settings | `/hr/settings` | ALL |
| Notifications | `/hr/notifications` | ALL |
| Search Results | `/hr/search?q={query}` | ALL |
| Bulk Import | `/hr/bulk-import` | ADMIN, HR_SPECIALIST |
| Unauthorized | `/hr/unauthorized` | ALL |
| 404 | `/hr/*` | ALL |

---

## 10. Screen Priority Matrix

### Priority 0 (MVP - Must Have)
1. ✅ Login Page
2. ✅ Dashboard (Admin/HR View)
3. ✅ Employee Directory
4. ✅ Employee 360 View
5. ✅ 404 Page

### Priority 1 (Core Features)
6. ✅ Hire Employee Wizard
7. ✅ Dashboard (Manager View)
8. ✅ Dashboard (Employee View)
9. ✅ Org Chart
10. ✅ Departments (Split View)
11. ✅ Jobs
12. ✅ Users
13. ✅ Notification Center
14. ✅ Unauthorized Page
15. ✅ Global Search Results

### Priority 2 (Enhanced Features)
16. ⏸ Promotion Wizard
17. ⏸ Transfer Wizard
18. ⏸ Termination Wizard
19. ⏸ Regions
20. ⏸ Countries
21. ⏸ Locations
22. ⏸ Audit Logs
23. ⏸ Settings / Preferences
24. ⏸ Bulk Import/Export

---

## 11. Build Phases Recommendation

### Phase 1: Foundation (Week 1-2)
- Login Page
- Dashboard Template + Admin/HR View
- Employee Directory
- Employee 360 View (Profile tab only)
- 404 Page

### Phase 2: Core Actions (Week 3-4)
- Hire Employee Wizard (all 4 steps)
- Employee 360 View (all 4 tabs)
- Org Chart
- Notification Center

### Phase 3: Organization Management (Week 5-6)
- Departments (split view with tree)
- Jobs
- Dashboard (Manager & Employee views)
- Global Search Results

### Phase 4: Admin & Advanced (Week 7-8)
- Users Management
- Promotion/Transfer/Termination Wizards
- Regions/Countries/Locations
- Audit Logs
- Settings
- Bulk Import

---

## 12. Data Strategy

All screens should use realistic training data aligned to the current repo baseline:

**Employees:** 212 total
- Steven King (President)
- Neena Kochhar, Lex De Haan (VPs)
- Rajesh Kumar, Carlos Garcia, Diana Lorentz (various roles)
- Mix of USA, India, Mexico, UK locations
- Various statuses: ACTIVE (190), PROBATION (10), ON_LEAVE (8), TERMINATED (4)

**Departments:** 17 total
- Executive, IT, Sales, Finance, Shipping, Marketing, HR, etc.
- IT has sub-departments: IT Dev India, IT QA India, IT Infra India

**Jobs:** 19 total
- AD_PRES, AD_VP, IT_PROG, SA_MAN, SA_REP, FI_MGR, etc.

**Current repo file equivalents:**
- `frontend/src/data/mockEmployees.ts`
- `frontend/src/api/departments.ts`
- `frontend/src/data/mockJobs.ts`
- `frontend/src/contexts/AuthContext.tsx` (current user/session handling)
- `frontend/src/pages/admin/NotificationsPage.tsx` (notifications are currently mocked inline)
- `frontend/src/api/auditLogs.ts`

---

**Total Screens:** 22 screens
**Total Routes:** 24 routes (including error pages)
**Estimated Build Time:** 6-8 weeks (with components already built)

This completes the comprehensive screens specification! 🎉

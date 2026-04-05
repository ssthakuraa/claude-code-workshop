---
name: build-page
description: Build a new HR admin page following the enterprise page pattern from EmployeeDirectoryPage
user-invocable: true
---

## Build Page Pattern

When invoked, generate a new React page component that matches the enterprise patterns
used in EmployeeDirectoryPage and other existing pages in this HR platform.

## How to Build a Page

### 1. Study the Reference Page

Before building, read `src/pages/employees/EmployeeDirectoryPage.tsx` to understand
the enterprise page structure, filter bar pattern, table layout, and state handling.

### 2. Create the Page Component

**Location:** `src/pages/{category}/{PageName}Page.tsx`

Categories: `employees`, `actions`, `organization`, `admin`

**Required elements (matching EmployeeDirectoryPage pattern):**

```tsx
export function DepartmentsPage() {
  const { user } = useAuth()              // auth context for permissions
  const navigate = useNavigate()           // react-router navigation

  const [search, setSearch] = useState('')
  const [filterVal, setFilterVal] = useState('')

  const { data: pagedResult, isLoading, isError } = useDepartments({
    // filters as query params
  })

  const items = pagedResult?.data ?? []

  return (
    <div className="space-y-4">
      {/* Header: title + action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Page Title</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{isLoading ? '…' : `${items.length} items`}</p>
        </div>
        {/* Optional action buttons */}
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* search input with Search icon */}
          {/* filter selects */}
        </div>
      </div>

      {/* Content container */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {isError ? (
          <div className="px-4 py-12 text-center text-sm text-red-500">
            Failed to load. Please refresh.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {/* column headers */}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Skeleton rows: Array.from({ length: 5 }).map(...)
                  // Use HrSkeleton for each cell
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={N} className="px-4 py-12 text-center text-sm text-neutral-500">
                      No items match the current filters.
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr
                      key={item.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/hr/.../${item.id}`)}
                    >
                      {/* table cells */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Footer count: Showing X of Y */}
      </div>
    </div>
  )
}
```

### 3. Add to Router

In `src/routes/router.tsx`:

```tsx
// 1. Add lazy import at top section
const DepartmentsPage = lazy(() => import('@/pages/organization/DepartmentsPage').then(m => ({ default: m.DepartmentsPage })))

// 2. Add route
{ path: 'organization/departments', element: <S><DepartmentsPage /></S> },
```

### 4. Add Navigation to Sidebar

In `src/components/hr/layout/HrPageLayout.tsx`:
Add the nav item to the appropriate sidebar group.

## Conventions

| Element | What to Use |
|---------|-------------|
| Page wrapper | `<div className="space-y-4">` |
| Page header | `<h1 className="text-xl font-semibold text-neutral-900">` |
| Subtitle | `<p className="text-sm text-neutral-500 mt-0.5">` |
| Filter bar | `<div className="bg-white rounded-lg border border-neutral-200 p-4">` |
| Table container | `<div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">` |
| Header row | `border-b border-neutral-200 bg-neutral-50` |
| Data rows | `border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer` |
| Loading | `Array.from({ length: N }).map(...)` with `<HrSkeleton>` |
| Error | `<div className="px-4 py-12 text-center text-sm text-red-500">` |
| Empty | `colSpan={N}` empty state message |
| Loading skeletons | `import { HrSkeleton } from '@/components/hr/HrSkeleton'` |
| Status badges | `import { HrStatusBadge } from '@/components/hr/HrStatusBadge'` |
| API calls | Use existing hooks from `@/api/` (never raw fetch) |
| Auth | `import { useAuth } from '@/contexts/AuthContext'` |

## Simple Page Pattern

For pages without filters/tables (like JobsPage):

```tsx
export function JobsPage() {
  const { data: jobs, isLoading, isError } = useJobs()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-neutral-900">Jobs</h1>
      {isError && <p className="text-sm text-red-500">Failed to load jobs.</p>}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {/* table or grid */}
      </div>
    </div>
  )
}
```

## Grid Card Pattern

For summary cards (like DepartmentsPage):

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {isLoading
    ? Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
          <HrSkeleton className="h-4 w-32 mb-3" />
        </div>
      ))
    : items.map(item => (
        <div key={item.id} className="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-sm transition-shadow">
          {/* card content */}
        </div>
      ))
  }
</div>
```

## Gotchas

- Always use `HrSkeleton` for loading states — never "Loading..." text
- Always handle `isError` state — don't crash on API failure
- Always provide empty state when data array is empty
- Use `HrStatusBadge` / `HrEmploymentTypeBadge` for status/type columns
- Follow the filter → table → footer pattern from EmployeeDirectoryPage
- Action buttons should check `user?.role` for permissions
- Navigation uses `useNavigate()` from react-router
- Lazy imports use `<S><PageComponent /></S>` Suspense wrapper
- When working in a git worktree (Lab 7), uncomment the router imports and routes

## Usage Example

```
/build-page
Build a new page: DepartmentsPage
Category: organization
Pattern: grid cards (employee count per department)
API hook: useDepartments() from @/api/departments
Filters: none needed
```

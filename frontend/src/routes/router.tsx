import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
)

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
}

// Auth & Errors
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })))
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

// Layout
const HrPageLayout = lazy(() => import('@/components/hr/layout/HrPageLayout').then(m => ({ default: m.HrPageLayout })))

// Pages
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const EmployeeDirectoryPage = lazy(() => import('@/pages/employees/EmployeeDirectoryPage').then(m => ({ default: m.EmployeeDirectoryPage })))
const EmployeeDetailPage = lazy(() => import('@/pages/employees/EmployeeDetailPage').then(m => ({ default: m.EmployeeDetailPage })))
const HireWizardPage = lazy(() => import('@/pages/actions/HireWizardPage').then(m => ({ default: m.HireWizardPage })))
const TerminatePage = lazy(() => import('@/pages/actions/TerminatePage').then(m => ({ default: m.TerminatePage })))
const PromotePage = lazy(() => import('@/pages/actions/PromotePage').then(m => ({ default: m.PromotePage })))
const TransferPage = lazy(() => import('@/pages/actions/TransferPage').then(m => ({ default: m.TransferPage })))
const OrgChartPage = lazy(() => import('@/pages/organization/OrgChartPage').then(m => ({ default: m.OrgChartPage })))
// NOTE: DepartmentsPage and JobsPage are intentionally NOT imported here.
// Lab 7 students build these from scratch in git worktrees.
// Uncomment after completing Lab 7:
// const DepartmentsPage = lazy(() => import('@/pages/organization/DepartmentsPage').then(m => ({ default: m.DepartmentsPage })))
// const JobsPage = lazy(() => import('@/pages/organization/JobsPage').then(m => ({ default: m.JobsPage })))
const AuditLogPage = lazy(() => import('@/pages/admin/AuditLogPage').then(m => ({ default: m.AuditLogPage })))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })))
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage').then(m => ({ default: m.NotificationsPage })))
const LocationsPage = lazy(() => import('@/pages/organization/LocationsPage').then(m => ({ default: m.LocationsPage })))
const CountriesPage = lazy(() => import('@/pages/organization/CountriesPage').then(m => ({ default: m.CountriesPage })))

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/hr/dashboard" replace /> },
  { path: '/hr/login', element: <S><LoginPage /></S> },
  { path: '/hr/unauthorized', element: <S><UnauthorizedPage /></S> },
  {
    path: '/hr',
    element: <ProtectedRoute />,
    children: [
      {
        element: <S><HrPageLayout /></S>,
        children: [
          { index: true, element: <Navigate to="/hr/dashboard" replace /> },
          { path: 'dashboard', element: <S><DashboardPage /></S> },
          { path: 'employees', element: <S><EmployeeDirectoryPage /></S> },
          { path: 'employees/:id', element: <S><EmployeeDetailPage /></S> },
          { path: 'organization/chart', element: <S><OrgChartPage /></S> },
          // NOTE: Department and Jobs routes created by Lab 7 students in worktrees
          // Uncomment after completing Lab 7:
          // { path: 'organization/departments', element: <S><DepartmentsPage /></S> },
          // { path: 'organization/jobs', element: <S><JobsPage /></S> },
          { path: 'organization/locations', element: <S><LocationsPage /></S> },
          { path: 'organization/countries', element: <S><CountriesPage /></S> },
          { path: 'notifications', element: <S><NotificationsPage /></S> },
          { path: 'settings', element: <S><SettingsPage /></S> },
          // HR Specialist / Admin only
          {
            element: <ProtectedRoute roles={['ADMIN', 'HR_SPECIALIST']} />,
            children: [
              { path: 'actions/hire', element: <S><HireWizardPage /></S> },
              { path: 'actions/terminate', element: <Navigate to="/hr/employees" replace /> },
              { path: 'actions/terminate/:id', element: <S><TerminatePage /></S> },
              { path: 'actions/promote', element: <Navigate to="/hr/employees" replace /> },
              { path: 'actions/promote/:id', element: <S><PromotePage /></S> },
              { path: 'actions/transfer', element: <Navigate to="/hr/employees" replace /> },
              { path: 'actions/transfer/:id', element: <S><TransferPage /></S> },
              { path: 'admin', element: <S><AuditLogPage /></S> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <S><NotFoundPage /></S> },
])

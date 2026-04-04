import { useParams, useNavigate, Link } from 'react-router-dom'
import { TrendingUp, ArrowLeftRight, UserX, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { HrStatusBadge } from '@/components/hr/HrStatusBadge'
import { HrEmploymentTypeBadge } from '@/components/hr/HrEmploymentTypeBadge'
import { HrActivityFeed, type ActivityItem } from '@/components/hr/HrActivityFeed'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { useEmployee, useEmployees } from '@/api/employees'

type Tab = 'profile' | 'timeline' | 'compensation'

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const employeeId = Number(id)
  const { data: employee, isLoading, isError } = useEmployee(employeeId)
  const { data: allEmployees } = useEmployees()
  const canAction = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST'
  const canViewSalary = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST' || user?.employeeId === employeeId

  if (isLoading) {
    return (
      <div className="space-y-4">
        <HrSkeleton className="h-4 w-48" />
        <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
          <HrSkeleton className="h-16 w-16 rounded-full" />
          <HrSkeleton className="h-6 w-48" />
          <HrSkeleton className="h-4 w-72" />
        </div>
      </div>
    )
  }

  if (isError || !employee) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 mb-4">Employee not found.</p>
        <Link to="/hr/employees" className="text-blue-600 hover:underline text-sm">Back to Directory</Link>
      </div>
    )
  }

  const directReports = (allEmployees?.data ?? []).filter(e => e.managerId === employee.employeeId)

  const careerTimeline: ActivityItem[] = [
    {
      id: '1',
      type: 'hire',
      title: `Hired as ${employee.jobTitle}`,
      description: `Joined ${employee.departmentName}`,
      date: new Date(employee.hireDate),
    },
    ...(employee.jobHistory ?? []).map((jh, i) => ({
      id: `jh-${i}`,
      type: 'transfer' as const,
      title: `Moved to ${jh.jobTitle}`,
      description: jh.departmentName,
      date: new Date(jh.startDate),
    })),
    ...(employee.employmentStatus === 'TERMINATED' ? [{
      id: '99',
      type: 'termination' as const,
      title: 'Employment ended',
      date: new Date(),
    }] : []),
  ]

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/hr/dashboard" className="hover:text-neutral-800">Home</Link>
        <ChevronRight size={12} />
        <Link to="/hr/employees" className="hover:text-neutral-800">Employees</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-medium">{employee.fullName}</span>
      </nav>

      {/* Header card */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 flex-shrink-0">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 justify-between">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900">{employee.fullName}</h1>
                <p className="text-sm text-neutral-600 mt-0.5">{employee.jobTitle} · {employee.departmentName}</p>
              </div>
              <div className="flex items-center gap-2">
                {canAction && (
                  <>
                    <button
                      onClick={() => navigate(`/hr/actions/promote/${employee.employeeId}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      <TrendingUp size={13} /> Promote
                    </button>
                    <button
                      onClick={() => navigate(`/hr/actions/transfer/${employee.employeeId}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      <ArrowLeftRight size={13} /> Transfer
                    </button>
                    {employee.employmentStatus !== 'TERMINATED' && (
                      <button
                        onClick={() => navigate(`/hr/actions/terminate/${employee.employeeId}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        <UserX size={13} /> Terminate
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <HrStatusBadge status={employee.employmentStatus} />
              <HrEmploymentTypeBadge type={employee.employmentType} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-6">
          {(['profile', 'timeline', 'compensation'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-800">Contact</h3>
            <InfoRow label="Email" value={employee.email} />
            <InfoRow label="Phone" value={employee.phoneNumber ?? '—'} />
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-800">Employment</h3>
            <InfoRow label="Hire Date" value={String(employee.hireDate)} />
            <InfoRow label="Manager" value={employee.managerName ?? '—'} />
            <InfoRow label="Location" value={employee.locationCity ?? '—'} />
          </div>
          {directReports.length > 0 && (
            <div className="bg-white rounded-lg border border-neutral-200 p-5 md:col-span-2">
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">Direct Reports ({directReports.length})</h3>
              <div className="flex flex-wrap gap-2">
                {directReports.map(r => (
                  <button
                    key={r.employeeId}
                    onClick={() => navigate(`/hr/employees/${r.employeeId}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                      {r.firstName.charAt(0)}{r.lastName.charAt(0)}
                    </div>
                    <span className="text-neutral-800">{r.fullName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg border border-neutral-200 p-5">
          <HrActivityFeed items={careerTimeline} groupBy="none" />
        </div>
      )}

      {activeTab === 'compensation' && (
        <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-neutral-800">Compensation</h3>
          {canViewSalary ? (
            <>
              <InfoRow label="Annual Salary" value={employee.salary != null ? `$${Number(employee.salary).toLocaleString()}` : '—'} />
              <InfoRow label="Commission %" value={employee.commissionPct != null ? `${employee.commissionPct}%` : '—'} />
            </>
          ) : (
            <p className="text-sm text-neutral-500">You do not have permission to view salary information.</p>
          )}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-800 font-medium">{value}</span>
    </div>
  )
}

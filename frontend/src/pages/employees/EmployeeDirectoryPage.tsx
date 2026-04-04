import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Download, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { HrStatusBadge } from '@/components/hr/HrStatusBadge'
import { HrEmploymentTypeBadge } from '@/components/hr/HrEmploymentTypeBadge'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { useEmployees } from '@/api/employees'
import { useDepartments } from '@/api/departments'

const STATUS_OPTIONS = ['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION']
const TYPE_OPTIONS = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']

export function EmployeeDirectoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canHire = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST'

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const { data: pagedResult, isLoading, isError } = useEmployees({
    search: search || undefined,
    status: (statusFilter as any) || undefined,
    departmentId: deptFilter ? Number(deptFilter) : undefined,
  })
  const { data: departments } = useDepartments()

  const employees = pagedResult?.data ?? []
  const filtered = typeFilter ? employees.filter(e => e.employmentType === typeFilter) : employees

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Employees</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{isLoading ? '…' : `${filtered.length} employees`}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Download size={15} /> Export CSV
          </button>
          {canHire && (
            <button
              type="button"
              onClick={() => navigate('/hr/actions/hire')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={15} /> Hire Employee
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Departments</option>
            {(departments ?? []).map(d => (
              <option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>
            ))}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Types</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          {(statusFilter || deptFilter || typeFilter || search) && (
            <button type="button"
              onClick={() => { setSearch(''); setStatusFilter(''); setDeptFilter(''); setTypeFilter('') }}
              className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 underline">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {isError ? (
          <div className="px-4 py-12 text-center text-sm text-red-500">Failed to load employees. Please refresh.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Employee</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Department</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Job Title</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Hire Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-4 py-3"><HrSkeleton className="h-4 w-40" /></td>
                      <td className="px-4 py-3"><HrSkeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><HrSkeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><HrSkeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><HrSkeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><HrSkeleton className="h-4 w-20" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-500">
                      No employees match the current filters.
                    </td>
                  </tr>
                ) : filtered.map(emp => (
                  <tr
                    key={emp.employeeId}
                    className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/hr/employees/${emp.employeeId}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700 flex-shrink-0">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-800">{emp.fullName}</div>
                          <div className="text-xs text-neutral-500">ID: {emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{emp.departmentName}</td>
                    <td className="px-4 py-3 text-neutral-700">{emp.jobTitle}</td>
                    <td className="px-4 py-3">
                      <HrStatusBadge status={emp.employmentStatus} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <HrEmploymentTypeBadge type={emp.employmentType} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{String(emp.hireDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-neutral-100 text-xs text-neutral-500">
            Showing {filtered.length} of {pagedResult?.totalElements ?? filtered.length} employees
          </div>
        )}
      </div>
    </div>
  )
}

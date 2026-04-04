import { useDepartments } from '@/api/departments'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

export function DepartmentsPage() {
  const { data: departments, isLoading, isError } = useDepartments()

  const sorted = (departments ?? []).slice().sort((a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0))
  const maxCount = sorted[0]?.employeeCount ?? 1

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-neutral-900">Departments</h1>
      {isError && <p className="text-sm text-red-500">Failed to load departments.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
                <HrSkeleton className="h-4 w-32 mb-3" />
                <HrSkeleton className="h-8 w-12 mb-2" />
                <HrSkeleton className="h-1.5 w-full" />
              </div>
            ))
          : sorted.map(dept => (
              <div key={dept.departmentId} className="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-800">{dept.departmentName}</h3>
                  <span className="text-2xl font-bold text-blue-600">{dept.employeeCount ?? 0}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {dept.employeeCount === 1 ? '1 employee' : `${dept.employeeCount ?? 0} employees`}
                </p>
                {dept.managerName && (
                  <p className="text-xs text-neutral-400 mt-0.5">Manager: {dept.managerName}</p>
                )}
                <div className="mt-2 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${Math.min(100, ((dept.employeeCount ?? 0) / maxCount) * 100)}%` }} />
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

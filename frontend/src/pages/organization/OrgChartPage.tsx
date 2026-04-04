import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmployees } from '@/api/employees'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import type { EmployeeSummary } from '@/types/employee'

interface OrgNode {
  employeeId: number
  name: string
  title: string
  department: string
  children: OrgNode[]
}

function buildTree(employees: EmployeeSummary[], managerId: number | null | undefined): OrgNode[] {
  return employees
    .filter(e =>
      (managerId == null ? !e.managerId : e.managerId === managerId) &&
      e.employmentStatus !== 'TERMINATED'
    )
    .map(e => ({
      employeeId: e.employeeId,
      name: e.fullName,
      title: e.jobTitle,
      department: e.departmentName,
      children: buildTree(employees, e.employeeId),
    }))
}

function OrgCard({ node, navigate, depth = 0 }: { node: OrgNode; navigate: (path: string) => void; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => navigate(`/hr/employees/${node.employeeId}`)}
        className="w-44 p-3 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer hover:border-blue-300 transition-all text-center"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 mx-auto mb-2">
          {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="text-xs font-semibold text-neutral-800 truncate">{node.name}</div>
        <div className="text-[10px] text-neutral-500 truncate">{node.title}</div>
        <div className="text-[10px] text-blue-600 mt-0.5">{node.department}</div>
      </div>
      {node.children.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-neutral-300" />
          <button type="button" onClick={() => setExpanded(v => !v)}
            className="text-[10px] text-neutral-400 hover:text-neutral-600 mb-1">
            {expanded ? `▲ hide ${node.children.length}` : `▼ show ${node.children.length}`}
          </button>
          {expanded && (
            <div className="flex gap-4 items-start">
              {node.children.map(child => (
                <div key={child.employeeId} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-neutral-300" />
                  <OrgCard node={child} navigate={navigate} depth={depth + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function OrgChartPage() {
  const navigate = useNavigate()
  const { data: pagedResult, isLoading, isError } = useEmployees({ size: 300 })
  const employees = pagedResult?.data ?? []
  const roots = buildTree(employees, null)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Org Chart</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Click any card to view employee details</p>
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 p-6 overflow-auto">
        {isError ? (
          <p className="text-sm text-red-500 text-center py-8">Failed to load org chart.</p>
        ) : isLoading ? (
          <div className="flex gap-8 justify-center py-4">
            {Array.from({ length: 3 }).map((_, i) => <HrSkeleton key={i} className="h-24 w-44" />)}
          </div>
        ) : (
          <div className="flex gap-8 justify-center min-w-max py-4">
            {roots.map(node => <OrgCard key={node.employeeId} node={node} navigate={navigate} />)}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEmployees } from '@/api/employees'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { PageHeader } from '@/components/ui/PageHeader'
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
  const { t } = useTranslation(['common'])
  const [expanded, setExpanded] = useState(depth < 2)
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => navigate(`/hr/employees/${node.employeeId}`)}
        className="w-36 cursor-pointer rounded-lg border border-neutral-200 bg-white px-2 py-2 text-center shadow-sm transition-all hover:border-[color:var(--hr-shell-accent)]/40 hover:shadow-md"
      >
        <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--hr-shell-accent-soft)] text-[11px] font-bold text-[color:var(--hr-shell-accent-strong)]">
          {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="truncate text-[11px] font-semibold leading-4 text-neutral-800">{node.name}</div>
        <div className="truncate text-[10px] leading-4 text-neutral-500">{node.title}</div>
        <div className="mt-0.5 truncate text-[10px] leading-4 text-[color:var(--hr-shell-accent)]">{node.department}</div>
      </div>
      {node.children.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="h-2.5 w-px bg-neutral-300" />
          <button type="button" onClick={() => setExpanded(v => !v)}
            className="mb-0.5 text-[9px] text-neutral-400 hover:text-neutral-600">
            {expanded
              ? `▲ ${t('ui.hideChildren', { ns: 'common', count: node.children.length })}`
              : `▼ ${t('ui.showChildren', { ns: 'common', count: node.children.length })}`}
          </button>
          {expanded && (
            <div className="flex items-start gap-2.5">
              {node.children.map(child => (
                <div key={child.employeeId} className="flex flex-col items-center">
                  <div className="h-2.5 w-px bg-neutral-300" />
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
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()
  const { data: pagedResult, isLoading, isError } = useEmployees({ size: 500, sort: 'lastName' })
  const employees = pagedResult?.data ?? []
  const roots = buildTree(employees, null)

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('orgChart', { ns: 'common' })}
        subtitle={t('organizationPages.orgChart.subtitle', { ns: 'common' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('orgChart', { ns: 'common' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
      />
      <div className="min-h-0 flex-1 overflow-hidden rounded-[1rem] border border-neutral-200 bg-white p-2.5">
        <div className="h-full overflow-auto">
          {isError ? (
            <p className="py-8 text-center text-sm text-red-500">{t('organizationPages.orgChart.loadError', { ns: 'common' })}</p>
          ) : isLoading ? (
            <div className="flex justify-center gap-4 py-2">
              {Array.from({ length: 3 }).map((_, i) => <HrSkeleton key={i} className="h-18 w-36" />)}
            </div>
          ) : (
            <div className="flex min-w-max justify-center gap-4 py-2">
              {roots.map(node => <OrgCard key={node.employeeId} node={node} navigate={navigate} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

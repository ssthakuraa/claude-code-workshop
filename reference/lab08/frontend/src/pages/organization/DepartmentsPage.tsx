import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartments } from '@/api/departments'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useSearchParams } from 'react-router-dom'

function parseMultiParam(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function DepartmentsPage() {
  const { t } = useTranslation(['common'])
  const { data: departments, isLoading, isError } = useDepartments()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const selectedDepartments = parseMultiParam(searchParams.get('departmentId'))
  const selectedManagers = parseMultiParam(searchParams.get('managerId'))

  function updateSearch(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) {
      next.set('search', value)
    } else {
      next.delete('search')
    }
    setSearchParams(next, { replace: true })
  }

  function updateMultiFilterParam(key: string, values: string[]) {
    const next = new URLSearchParams(searchParams)
    if (values.length > 0) {
      next.set(key, values.join(','))
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  const sorted = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    const filtered = (departments ?? []).filter((department) => {
      const haystack = [department.departmentName, department.managerName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return (!normalized || haystack.includes(normalized))
        && (selectedDepartments.length === 0 || selectedDepartments.includes(String(department.departmentId)))
        && (selectedManagers.length === 0 || selectedManagers.includes(String(department.managerId)))
    })

    return filtered.sort((a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0))
  }, [departments, search, selectedDepartments, selectedManagers])

  const maxCount = sorted[0]?.employeeCount ?? 1
  const interactiveFilters = (() => {
    const departmentOptions = Array.from(new Map(
      (departments ?? [])
        .map(department => [String(department.departmentId), {
          value: String(department.departmentId),
          label: department.departmentName,
        }]),
    ).values())
    const managerOptions = Array.from(new Map(
      (departments ?? [])
        .filter(department => department.managerId !== undefined && department.managerName)
        .map(department => [String(department.managerId), {
          value: String(department.managerId),
          label: department.managerName!,
        }]),
    ).values())

    return [
      {
        key: 'departmentId',
        label: t('organizationPages.departments.departmentFilterLabel', { ns: 'common' }),
        mode: 'multi' as const,
        values: selectedDepartments,
        searchable: true,
        emptyLabel: t('organizationPages.departments.departmentFilterSearchPlaceholder', { ns: 'common' }),
        options: departmentOptions,
        onChange: (values: string[]) => updateMultiFilterParam('departmentId', values),
      },
      {
        key: 'managerId',
        label: t('organizationPages.departments.filterLabel', { ns: 'common' }),
        mode: 'multi' as const,
        values: selectedManagers,
        searchable: true,
        emptyLabel: t('organizationPages.departments.filterSearchPlaceholder', { ns: 'common' }),
        options: managerOptions,
        onChange: (values: string[]) => updateMultiFilterParam('managerId', values),
      },
    ]
  })()

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('departments', { ns: 'common' })}
        subtitle={t('organizationPages.departments.subtitle', { ns: 'common' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('departments', { ns: 'common' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        searchBar={(
          <div className="space-y-1.5">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={event => updateSearch(event.target.value)}
                placeholder={t('organizationPages.departments.searchPlaceholder', { ns: 'common' })}
                className="hr-app-input w-full pl-10 pr-3"
              />
            </div>
            <HrInteractiveFilterBar
              filters={interactiveFilters}
              onClearAll={selectedDepartments.length > 0 || selectedManagers.length > 0
                ? () => {
                    updateMultiFilterParam('departmentId', [])
                    updateMultiFilterParam('managerId', [])
                  }
                : undefined}
            />
          </div>
        )}
      />
      {isError && <p className="text-sm text-red-500">{t('organizationPages.departments.loadError', { ns: 'common' })}</p>}
      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-2.5 pt-2">
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-neutral-200 p-3">
                    <HrSkeleton className="mb-2 h-4 w-32" />
                    <HrSkeleton className="mb-1.5 h-7 w-12" />
                    <HrSkeleton className="h-1.5 w-full" />
                  </div>
                ))
              : sorted.map(dept => (
                  <div key={dept.departmentId} className="bg-white rounded-lg border border-neutral-200 p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-neutral-800">{dept.departmentName}</h3>
                      <span className="text-xl font-bold text-[color:var(--hr-shell-accent)]">{dept.employeeCount ?? 0}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {t('organizationPages.departments.employeeCount', { ns: 'common', count: dept.employeeCount ?? 0 })}
                    </p>
                    {dept.managerName && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-400">{t('organizationPages.departments.managerPrefix', { ns: 'common', name: dept.managerName })}</p>
                    )}
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--hr-shell-accent),rgba(44,105,117,0.4))]"
                        style={{ width: `${Math.min(100, ((dept.employeeCount ?? 0) / maxCount) * 100)}%` }} />
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

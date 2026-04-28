import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { HrEmploymentTypeBadge } from '@/components/hr/HrEmploymentTypeBadge'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { HrStatusBadge } from '@/components/hr/HrStatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EnhancedDataTable, type EnhancedColumn } from '@/components/ui/EnhancedDataTable'
import type { SortDirection } from '@/components/ui/DataTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDepartments } from '@/api/departments'
import { useEmployees } from '@/api/employees'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { useLocalSavedViews } from '@/hooks/useLocalSavedViews'
import type { EmployeeSummary } from '@/types/employee'
import { formatDate } from '@/utils/formatters'

const STATUS_OPTIONS = ['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION']
const TYPE_OPTIONS = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']
const LIST_RESULT_LIMIT = 100
const EMPTY_EMPLOYEES: EmployeeSummary[] = []

function formatLabel(value: string, labels: Record<string, string>) {
  return labels[value] ?? value.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function formatDateLabel(value: string, locale: string) {
  return formatDate(value, locale, 'medium')
}

function parseMultiParam(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function downloadCsv(filename: string, header: string[], rows: Array<Array<string | number | null | undefined>>) {
  const csv = [
    header.join(','),
    ...rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function EmployeeDirectoryPage() {
  const { t } = useTranslation(['employees', 'common', 'errors'])
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortKey, setSortKey] = useState('employee')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedEmployeeKeys, setSelectedEmployeeKeys] = useState<Set<string | number>>(new Set())
  const { savedViews, saveView, deleteView } = useLocalSavedViews('employee-directory')
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
  const search = searchParams.get('search') ?? ''
  const statusFilters = parseMultiParam(searchParams.get('status'))
  const deptFilters = parseMultiParam(searchParams.get('departmentId'))
  const typeFilters = parseMultiParam(searchParams.get('type'))
  const hireDateFrom = searchParams.get('hireDateFrom') ?? ''
  const hireDateTo = searchParams.get('hireDateTo') ?? ''
  const [searchDraft, setSearchDraft] = useState(search)

  useEffect(() => {
    setSearchDraft(search)
  }, [search])

  const updateFilterParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const updateMultiFilterParam = useCallback((key: string, values: string[]) => {
    const next = new URLSearchParams(searchParams)
    if (values.length > 0) {
      next.set(key, values.join(','))
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    const normalizedDraft = searchDraft.trim()
    if (normalizedDraft === search) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      updateFilterParam('search', normalizedDraft)
    }, 260)

    return () => window.clearTimeout(timeoutId)
  }, [search, searchDraft, updateFilterParam])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateFilterParam('search', searchDraft.trim())
  }

  function clearSearch() {
    setSearchDraft('')
    updateFilterParam('search', '')
  }

  const applySavedView = useCallback((filters: Record<string, unknown>) => {
    const next = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim()) {
        next.set(key, String(value))
      }
    })

    setSearchParams(next, { replace: true })
  }, [setSearchParams])

  const { data: pagedResult, isLoading, isError } = useEmployees({
    search: search || undefined,
    hireDateFrom: hireDateFrom || undefined,
    hireDateTo: hireDateTo || undefined,
  })
  const { data: departments } = useDepartments()

  const employees = pagedResult?.data ?? EMPTY_EMPLOYEES
  const filteredEmployees = useMemo(
    () => employees.filter(employee => {
      if (statusFilters.length > 0 && !statusFilters.includes(employee.employmentStatus)) {
        return false
      }

      if (deptFilters.length > 0 && !deptFilters.includes(String(employee.departmentId))) {
        return false
      }

      if (typeFilters.length > 0 && !typeFilters.includes(employee.employmentType)) {
        return false
      }

      return true
    }),
    [deptFilters, employees, statusFilters, typeFilters],
  )

  const sortedEmployees = useMemo(() => {
    const rows = filteredEmployees.slice()
    const direction = sortDirection === 'asc' ? 1 : -1

    function getSortableValue(employee: EmployeeSummary) {
      switch (sortKey) {
        case 'department':
          return employee.departmentName
        case 'jobTitle':
          return employee.jobTitle
        case 'status':
          return employee.employmentStatus
        case 'employmentType':
          return employee.employmentType
        case 'hireDate':
          return employee.hireDate
        case 'employee':
        default:
          return employee.fullName
      }
    }

    rows.sort((left, right) => {
      const leftValue = getSortableValue(left)
      const rightValue = getSortableValue(right)

      if (typeof leftValue === 'string' && typeof rightValue === 'string') {
        return leftValue.localeCompare(rightValue) * direction
      }

      return 0
    })

    return rows
  }, [filteredEmployees, sortDirection, sortKey])

  const visibleEmployees = sortedEmployees.slice(0, LIST_RESULT_LIMIT)
  const currentFilters = useMemo(
    () => ({
      search,
      status: statusFilters.join(','),
      departmentId: deptFilters.join(','),
      type: typeFilters.join(','),
      hireDateFrom,
      hireDateTo,
    }),
    [deptFilters, hireDateFrom, hireDateTo, search, statusFilters, typeFilters],
  )

  const interactiveFilters = useMemo(() => [
    {
      key: 'status',
      label: t('directory.filters.status', { ns: 'employees' }),
      mode: 'single' as const,
      values: statusFilters,
      options: STATUS_OPTIONS.map(status => ({
        value: status,
        label: formatLabel(status, {
          ACTIVE: t('employmentStatus.ACTIVE', { ns: 'common' }),
          ON_LEAVE: t('employmentStatus.ON_LEAVE', { ns: 'common' }),
          TERMINATED: t('employmentStatus.TERMINATED', { ns: 'common' }),
          PROBATION: t('employmentStatus.PROBATION', { ns: 'common' }),
        }),
      })),
      onChange: (values: string[]) => updateMultiFilterParam('status', values),
    },
    {
      key: 'departmentId',
      label: t('directory.filters.department', { ns: 'employees' }),
      mode: 'multi' as const,
      values: deptFilters,
      searchable: true,
      emptyLabel: t('directory.filters.departmentSearch', { ns: 'employees' }),
      options: (departments ?? []).map(department => ({
        value: String(department.departmentId),
        label: department.departmentName,
      })),
      onChange: (values: string[]) => updateMultiFilterParam('departmentId', values),
    },
    {
      key: 'type',
      label: t('directory.filters.employmentType', { ns: 'employees' }),
      mode: 'multi' as const,
      values: typeFilters,
      options: TYPE_OPTIONS.map(type => ({
        value: type,
        label: formatLabel(type, {
          FULL_TIME: t('employmentType.FULL_TIME', { ns: 'common' }),
          PART_TIME: t('employmentType.PART_TIME', { ns: 'common' }),
          CONTRACT: t('employmentType.CONTRACT', { ns: 'common' }),
          INTERN: t('employmentType.INTERN', { ns: 'common' }),
        }),
      })),
      onChange: (values: string[]) => updateMultiFilterParam('type', values),
    },
  ], [departments, deptFilters, statusFilters, t, typeFilters, updateMultiFilterParam])

  const columns = useMemo<EnhancedColumn<EmployeeSummary>[]>(() => [
    {
      key: 'employee',
      header: t('directory.columns.employee', { ns: 'employees' }),
      sortable: true,
      width: '28rem',
      accessor: employee => (
        <div className="flex items-center gap-3">
          <Avatar name={employee.fullName} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-medium text-neutral-800">{employee.fullName}</div>
            <div className="truncate text-xs text-neutral-500">
              {t('directory.employeeMeta', { ns: 'employees', id: employee.employeeId })}
              {employee.managerName ? ` • ${t('directory.managerMeta', { ns: 'employees', name: employee.managerName })}` : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: t('directory.columns.department', { ns: 'employees' }),
      sortable: true,
      accessor: employee => <span className="text-neutral-700">{employee.departmentName}</span>,
    },
    {
      key: 'jobTitle',
      header: t('directory.columns.jobTitle', { ns: 'employees' }),
      sortable: true,
      accessor: employee => <span className="text-neutral-700">{employee.jobTitle}</span>,
    },
    {
      key: 'status',
      header: t('directory.columns.status', { ns: 'employees' }),
      sortable: true,
      accessor: employee => <HrStatusBadge status={employee.employmentStatus} size="sm" />,
    },
    {
      key: 'employmentType',
      header: t('directory.columns.type', { ns: 'employees' }),
      sortable: true,
      accessor: employee => <HrEmploymentTypeBadge type={employee.employmentType} size="sm" />,
    },
    {
      key: 'hireDate',
      header: t('directory.columns.hireDate', { ns: 'employees' }),
      sortable: true,
      accessor: employee => (
        <span className="text-xs font-medium text-neutral-500">{formatDateLabel(employee.hireDate, locale)}</span>
      ),
    },
  ], [locale, t])

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('directory.title', { ns: 'employees' })}
        titleClassName="text-[clamp(1.35rem,2vw,1.8rem)]"
        subtitle={t('directory.subtitle', { ns: 'employees' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('directory.title', { ns: 'employees' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        searchBar={(
          <div className="space-y-1.5">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1.5 xl:flex-row xl:items-center">
              <div className="relative min-w-[240px] flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t('directory.searchPlaceholder', { ns: 'employees' })}
                  value={searchDraft}
                  onChange={event => setSearchDraft(event.target.value)}
                  className="hr-app-input h-10 w-full pl-10 pr-10"
                />
                {searchDraft && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--hr-text-subtle)] transition-colors hover:bg-[color:var(--hr-surface-muted)] hover:text-[color:var(--hr-text)]"
                    aria-label={t('common:ui.clear')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <Button type="submit" size="sm" variant="secondary" className="px-3">
                {t('common:ui.search')}
              </Button>
            </form>
            {search && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hr-shell-accent)] bg-white px-3 py-1 text-[color:var(--hr-shell-accent-strong)] shadow-[var(--shadow-xs)]">
                  <Search size={13} />
                  {t('directory.activeSearch', { ns: 'employees', query: search })}
                </span>
                <span className="text-[color:var(--hr-text-subtle)]">
                  {t('directory.activeSearchCount', { ns: 'employees', count: sortedEmployees.length })}
                </span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm font-medium text-[color:var(--hr-shell-accent)] transition-colors hover:text-[color:var(--hr-shell-accent-strong)]"
                >
                  {t('common:ui.clear')}
                </button>
              </div>
            )}
            <HrInteractiveFilterBar filters={interactiveFilters} onClearAll={clearFilters} />
          </div>
        )}
      />

      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-2.5 pt-2">
        <EnhancedDataTable
          columns={columns}
          data={visibleEmployees}
          rowKey={employee => employee.employeeId}
          loading={isLoading}
          selectable
          selectedKeys={selectedEmployeeKeys}
          onSelectionChange={setSelectedEmployeeKeys}
          onRowClick={employee => navigate(`/hr/employees/${employee.employeeId}`)}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={(nextSortKey, nextSortDirection) => {
            setSortKey(nextSortKey)
            setSortDirection(nextSortDirection)
          }}
          stickyHeader
          fillHeight
          density="compact"
          compactToolbar
          paginationMode="summary"
          summaryContent={(
            <>
              <span>
                {sortedEmployees.length > LIST_RESULT_LIMIT
                  ? t('directory.summaryShowingOverflow', { ns: 'employees', limit: LIST_RESULT_LIMIT, count: sortedEmployees.length })
                  : t('directory.summaryShowingDefault', { ns: 'employees', count: visibleEmployees.length })}
              </span>
              <span>
                {sortedEmployees.length > LIST_RESULT_LIMIT
                  ? t('directory.summaryLimited', { ns: 'employees' })
                  : t('directory.summaryTotal', { ns: 'employees', count: pagedResult?.totalElements ?? sortedEmployees.length })}
              </span>
            </>
          )}
          tableClassName="min-w-[960px]"
          bottomActions={(selectedRows, selectedCount) => selectedCount > 0 ? (
            <>
              <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedEmployeeKeys(new Set())}>
                {t('directory.actions.clearSelection', { ns: 'employees' })}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => navigate(`/hr/employees/${selectedRows[0]?.employeeId}`)}
              >
                {t('directory.actions.openFirstSelected', { ns: 'employees' })}
              </Button>
            </>
          ) : null}
          emptyTitle={t('directory.emptyTitle', { ns: 'employees' })}
          emptyDescription={t('directory.emptyDescription', { ns: 'employees' })}
          emptyIcon={<Search size={18} />}
          currentFilters={currentFilters}
          savedSearches={savedViews}
          onApplySavedSearch={applySavedView}
          onSaveSearch={saveView}
          onDeleteSearch={deleteView}
          exportFilename="employees-directory"
          onExport={() => downloadCsv(
            'employees-directory.csv',
            [
              t('directory.csvHeaders.employeeId', { ns: 'employees' }),
              t('directory.csvHeaders.fullName', { ns: 'employees' }),
              t('directory.csvHeaders.email', { ns: 'employees' }),
              t('directory.csvHeaders.department', { ns: 'employees' }),
              t('directory.csvHeaders.jobTitle', { ns: 'employees' }),
              t('directory.csvHeaders.status', { ns: 'employees' }),
              t('directory.csvHeaders.type', { ns: 'employees' }),
              t('directory.csvHeaders.manager', { ns: 'employees' }),
              t('directory.csvHeaders.hireDate', { ns: 'employees' }),
            ],
            sortedEmployees.map((employee) => [
              employee.employeeId,
              employee.fullName,
              employee.email,
              employee.departmentName,
              employee.jobTitle,
              employee.employmentStatus,
              employee.employmentType,
              employee.managerName ?? '',
              employee.hireDate,
            ]),
          )}
        />

        {isError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {t('messages.DB_ACCESS_ERROR', { ns: 'errors' })}
          </div>
        )}
      </div>
    </div>
  )
}

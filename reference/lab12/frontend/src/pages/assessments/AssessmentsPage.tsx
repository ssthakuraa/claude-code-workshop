import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { FileText, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useAssessmentsDirectory, type AssessmentDirectoryRow } from '@/api/assessments'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { EnhancedDataTable, type EnhancedColumn } from '@/components/ui/EnhancedDataTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { useLocalSavedViews } from '@/hooks/useLocalSavedViews'
import { formatDateTime } from '@/utils/formatters'

const LIST_PAGE_SIZE = 25

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'FINAL':
      return 'bg-emerald-100 text-emerald-700'
    case 'SUBMITTED':
      return 'bg-amber-100 text-amber-800'
    case 'DRAFT':
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function getStatusLabel(status: string, t: ReturnType<typeof useTranslation>['t']) {
  switch (status) {
    case 'FINAL':
      return t('statuses.FINAL', { ns: 'assessments' })
    case 'SUBMITTED':
      return t('statuses.SUBMITTED', { ns: 'assessments' })
    case 'DRAFT':
    default:
      return t('statuses.DRAFT', { ns: 'assessments' })
  }
}

function formatPercent(value: number | null | undefined) {
  if (value == null) {
    return '—'
  }
  return `${Number(value).toFixed(0)}%`
}

function formatScore(value: number | null | undefined) {
  if (value == null) {
    return '—'
  }
  return Number(value).toFixed(1)
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

export function AssessmentsPage() {
  const { t } = useTranslation(['assessments', 'common', 'errors'])
  const [searchParams, setSearchParams] = useSearchParams()
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
  const { savedViews, saveView, deleteView } = useLocalSavedViews('assessments-directory')

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const search = searchParams.get('search') ?? ''
  const cycleCode = searchParams.get('cycleCode') ?? ''
  const [searchDraft, setSearchDraft] = useState(search)

  useEffect(() => {
    setSearchDraft(search)
  }, [search])

  const updateParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') {
      next.delete('page')
    }
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateParam('search', searchDraft.trim())
  }

  function clearSearch() {
    setSearchDraft('')
    updateParam('search', '')
  }

  const filters = useMemo(() => ({
    page,
    size: LIST_PAGE_SIZE,
    search: search || undefined,
    cycleCode: cycleCode || undefined,
  }), [cycleCode, page, search])

  const { data, isLoading, isError } = useAssessmentsDirectory(filters)

  const rows = data?.data ?? []
  const cycleOptions = useMemo(
    () =>
      Array.from(new Map(rows.map(row => [row.cycleCode, row.cycleLabel])).entries()).map(([value, label]) => ({
        value,
        label,
      })),
    [rows],
  )

  const interactiveFilters = useMemo(() => [
    {
      key: 'cycleCode',
      label: t('directory.filters.cycle', { ns: 'assessments' }),
      mode: 'single' as const,
      values: cycleCode ? [cycleCode] : [],
      searchable: true,
      emptyLabel: t('directory.filters.cycleSearch', { ns: 'assessments' }),
      options: cycleOptions,
      onChange: (values: string[]) => updateParam('cycleCode', values[0] ?? ''),
    },
  ], [cycleCode, cycleOptions, t, updateParam])

  const columns = useMemo<EnhancedColumn<AssessmentDirectoryRow>[]>(() => [
    {
      key: 'employee',
      header: t('directory.columns.employee', { ns: 'assessments' }),
      width: '20rem',
      accessor: row => (
        <div className="min-w-0">
          <div className="truncate font-medium text-neutral-800">{row.employeeName}</div>
          <div className="truncate text-xs text-neutral-500">
            {t('directory.employeeMeta', { ns: 'assessments', id: row.employeeId })}
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: t('directory.columns.department', { ns: 'assessments' }),
      accessor: row => row.departmentName ?? '—',
    },
    {
      key: 'cycle',
      header: t('directory.columns.cycle', { ns: 'assessments' }),
      accessor: row => (
        <div className="min-w-0">
          <div className="truncate font-medium text-neutral-800">{row.cycleLabel}</div>
          <div className="truncate text-xs text-neutral-500">{row.cycleCode}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('directory.columns.status', { ns: 'assessments' }),
      accessor: row => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(row.reviewStatus)}`}>
          {getStatusLabel(row.reviewStatus, t)}
        </span>
      ),
    },
    {
      key: 'reviewer',
      header: t('directory.columns.reviewer', { ns: 'assessments' }),
      accessor: row => row.reviewerName ?? t('directory.unassignedReviewer', { ns: 'assessments' }),
    },
    {
      key: 'goalCompletionPct',
      header: t('directory.columns.goalCompletionPct', { ns: 'assessments' }),
      align: 'right',
      accessor: row => <span className="font-medium text-neutral-700">{formatPercent(row.goalCompletionPct)}</span>,
    },
    {
      key: 'competencyScore',
      header: t('directory.columns.competencyScore', { ns: 'assessments' }),
      align: 'right',
      accessor: row => <span className="font-medium text-neutral-700">{formatScore(row.competencyScore)}</span>,
    },
    {
      key: 'updatedAt',
      header: t('directory.columns.updatedAt', { ns: 'assessments' }),
      accessor: row => <span className="text-xs text-neutral-500">{formatDateTime(row.updatedAt, locale, 'medium', preferences.timezone)}</span>,
    },
  ], [locale, preferences.timezone, t])

  const currentFilters = useMemo(
    () => ({
      search,
      cycleCode,
    }),
    [cycleCode, search],
  )

  const applySavedView = useCallback((savedFilters: Record<string, unknown>) => {
    const next = new URLSearchParams()
    Object.entries(savedFilters).forEach(([key, value]) => {
      if (value != null && String(value).trim()) {
        next.set(key, String(value))
      }
    })
    setSearchParams(next, { replace: true })
  }, [setSearchParams])

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        eyebrow={t('directory.eyebrow', { ns: 'assessments' })}
        title={t('directory.title', { ns: 'assessments' })}
        subtitle={t('directory.subtitle', { ns: 'assessments' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('directory.title', { ns: 'assessments' }) },
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
                  placeholder={t('directory.searchEmployeePlaceholder', { ns: 'assessments' })}
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
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 text-sm font-medium text-[color:var(--hr-text)] shadow-[var(--shadow-xs)] transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]"
              >
                {t('common:ui.search')}
              </button>
            </form>
            {search && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hr-shell-accent)] bg-white px-3 py-1 text-[color:var(--hr-shell-accent-strong)] shadow-[var(--shadow-xs)]">
                  <Search size={13} />
                  {t('directory.activeEmployeeSearch', { ns: 'assessments', query: search })}
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
            <HrInteractiveFilterBar filters={interactiveFilters} onClearAll={clearAllFilters} />
          </div>
        )}
      />

      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-2.5 pt-2">
        <EnhancedDataTable
          columns={columns}
          data={rows}
          rowKey={row => row.assessmentId}
          loading={isLoading}
          stickyHeader
          fillHeight
          density="compact"
          compactToolbar
          tableClassName="min-w-[1100px]"
          page={page}
          pageSize={LIST_PAGE_SIZE}
          total={data?.totalElements ?? 0}
          onPageChange={(nextPage) => updateParam('page', String(nextPage))}
          currentFilters={currentFilters}
          savedSearches={savedViews}
          onApplySavedSearch={applySavedView}
          onSaveSearch={saveView}
          onDeleteSearch={deleteView}
          exportFilename="assessments-directory"
          onExport={() => downloadCsv(
            'assessments-directory.csv',
            [
              t('directory.columns.employee', { ns: 'assessments' }),
              t('directory.csvHeaders.employeeId', { ns: 'assessments' }),
              t('directory.columns.department', { ns: 'assessments' }),
              t('directory.columns.cycle', { ns: 'assessments' }),
              t('directory.columns.status', { ns: 'assessments' }),
              t('directory.columns.reviewer', { ns: 'assessments' }),
              t('directory.columns.goalCompletionPct', { ns: 'assessments' }),
              t('directory.columns.competencyScore', { ns: 'assessments' }),
              t('directory.columns.updatedAt', { ns: 'assessments' }),
            ],
            rows.map((row) => [
              row.employeeName,
              row.employeeId,
              row.departmentName ?? '',
              row.cycleLabel,
              row.reviewStatus,
              row.reviewerName ?? '',
              row.goalCompletionPct,
              row.competencyScore,
              row.updatedAt,
            ]),
          )}
          emptyTitle={t('directory.emptyTitle', { ns: 'assessments' })}
          emptyDescription={t('directory.emptyDescription', { ns: 'assessments' })}
          emptyIcon={<FileText size={18} />}
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

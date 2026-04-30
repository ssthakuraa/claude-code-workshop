import { useMemo, useState } from 'react'
import { Briefcase, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useJobs } from '@/api/jobs'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { EnhancedDataTable, type EnhancedColumn } from '@/components/ui/EnhancedDataTable'
import type { SortDirection } from '@/components/ui/DataTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { useLocalSavedViews } from '@/hooks/useLocalSavedViews'
import { formatCurrency } from '@/utils/formatters'

function downloadCsv(filename: string, header: string[], rows: Array<Array<string | number>>) {
  const csv = [
    header.join(','),
    ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function parseMultiParam(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function JobsPage() {
  const { t } = useTranslation(['common'])
  const LIST_RESULT_LIMIT = 100
  const { data: jobs, isLoading, isError } = useJobs()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortKey, setSortKey] = useState('jobTitle')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const search = searchParams.get('search') ?? ''
  const selectedJobIds = parseMultiParam(searchParams.get('jobId'))
  const { savedViews, saveView, deleteView } = useLocalSavedViews('jobs-page')
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale

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

  const filteredJobs = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    const rows = (jobs ?? []).filter(job =>
      (!normalized
        || job.jobTitle.toLowerCase().includes(normalized)
        || job.jobId.toLowerCase().includes(normalized))
      && (selectedJobIds.length === 0 || selectedJobIds.includes(job.jobId)),
    )

    rows.sort((left, right) => {
      const direction = sortDirection === 'asc' ? 1 : -1

      switch (sortKey) {
        case 'jobId':
          return left.jobId.localeCompare(right.jobId) * direction
        case 'minSalary':
          return (left.minSalary - right.minSalary) * direction
        case 'maxSalary':
          return (left.maxSalary - right.maxSalary) * direction
        case 'jobTitle':
        default:
          return left.jobTitle.localeCompare(right.jobTitle) * direction
      }
    })

    return rows
  }, [jobs, search, selectedJobIds, sortDirection, sortKey])

  const visibleJobs = filteredJobs.slice(0, LIST_RESULT_LIMIT)

  function applySavedView(filters: Record<string, unknown>) {
    const next = new URLSearchParams()
    if (filters.search) {
      next.set('search', String(filters.search))
    }
    if (filters.jobId) {
      next.set('jobId', String(filters.jobId))
    }
    setSearchParams(next, { replace: true })
  }

  const interactiveFilters = [
    {
      key: 'jobId',
      label: t('organizationPages.jobs.filterLabel', { ns: 'common' }),
      mode: 'multi' as const,
      values: selectedJobIds,
      searchable: true,
      emptyLabel: t('organizationPages.jobs.filterSearchPlaceholder', { ns: 'common' }),
      options: (jobs ?? []).map(job => ({
        value: job.jobId,
        label: job.jobTitle,
        keywords: job.jobId,
      })),
      onChange: (values: string[]) => updateMultiFilterParam('jobId', values),
    },
  ]

  const columns = useMemo<EnhancedColumn<(typeof filteredJobs)[number]>[]>(() => [
    {
      key: 'jobId',
      header: t('organizationPages.jobs.tableHeaders.jobId', { ns: 'common' }),
      sortable: true,
      accessor: job => <span className="font-mono text-xs text-neutral-600">{job.jobId}</span>,
    },
    {
      key: 'jobTitle',
      header: t('organizationPages.jobs.tableHeaders.jobTitle', { ns: 'common' }),
      sortable: true,
      accessor: job => <span className="font-medium text-neutral-800">{job.jobTitle}</span>,
    },
    {
      key: 'minSalary',
      header: t('organizationPages.jobs.tableHeaders.minSalary', { ns: 'common' }),
      sortable: true,
      align: 'right',
      accessor: job => <span className="text-neutral-700">{formatCurrency(job.minSalary, preferences.currency, locale, 0)}</span>,
    },
    {
      key: 'maxSalary',
      header: t('organizationPages.jobs.tableHeaders.maxSalary', { ns: 'common' }),
      sortable: true,
      align: 'right',
      accessor: job => <span className="text-neutral-700">{formatCurrency(job.maxSalary, preferences.currency, locale, 0)}</span>,
    },
  ], [locale, preferences.currency, t])

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('jobs', { ns: 'common' })}
        subtitle={t('organizationPages.jobs.subtitle', { ns: 'common' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('jobs', { ns: 'common' }) },
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
                onChange={event => {
                  updateSearch(event.target.value)
                }}
                placeholder={t('organizationPages.jobs.searchPlaceholder', { ns: 'common' })}
                className="hr-app-input w-full pl-10 pr-3"
              />
            </div>
            <HrInteractiveFilterBar
              filters={interactiveFilters}
              onClearAll={selectedJobIds.length > 0 ? () => updateMultiFilterParam('jobId', []) : undefined}
            />
          </div>
        )}
      />

      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-2.5 pt-2">
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {t('organizationPages.jobs.loadError', { ns: 'common' })}
          </div>
        ) : (
          <EnhancedDataTable
            columns={columns}
            data={visibleJobs}
            rowKey={job => job.jobId}
            loading={isLoading}
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
                  {filteredJobs.length > LIST_RESULT_LIMIT
                    ? t('organizationPages.jobs.summaryOverflow', { ns: 'common', limit: LIST_RESULT_LIMIT, count: filteredJobs.length })
                    : t('organizationPages.jobs.summaryDefault', { ns: 'common', count: visibleJobs.length })}
                </span>
                <span>{filteredJobs.length > LIST_RESULT_LIMIT
                  ? t('organizationPages.jobs.summaryHintOverflow', { ns: 'common' })
                  : t('organizationPages.jobs.summaryHintDefault', { ns: 'common' })}
                </span>
              </>
            )}
            emptyTitle={t('organizationPages.jobs.emptyTitle', { ns: 'common' })}
            emptyDescription={t('organizationPages.jobs.emptyDescription', { ns: 'common' })}
            emptyIcon={<Briefcase size={18} />}
            currentFilters={{ search, jobId: selectedJobIds.join(',') }}
            savedSearches={savedViews}
            onApplySavedSearch={applySavedView}
            onSaveSearch={saveView}
            onDeleteSearch={deleteView}
            exportFilename="jobs-catalog"
            onExport={() => downloadCsv(
              'jobs-catalog.csv',
              [
                t('organizationPages.jobs.tableHeaders.jobId', { ns: 'common' }),
                t('organizationPages.jobs.tableHeaders.jobTitle', { ns: 'common' }),
                t('organizationPages.jobs.tableHeaders.minSalary', { ns: 'common' }),
                t('organizationPages.jobs.tableHeaders.maxSalary', { ns: 'common' }),
              ],
              filteredJobs.map((job) => [job.jobId, job.jobTitle, job.minSalary, job.maxSalary]),
            )}
          />
        )}
      </div>
    </div>
  )
}

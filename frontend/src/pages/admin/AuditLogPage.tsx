import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuditLogs } from '@/api/auditLogs'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { EnhancedDataTable, type EnhancedColumn } from '@/components/ui/EnhancedDataTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { useLocalSavedViews } from '@/hooks/useLocalSavedViews'
import { formatDateTime } from '@/utils/formatters'

const ACTION_COLORS: Record<string, string> = {
  INSERT: 'bg-green-100 text-green-700',
  UPDATE: 'bg-[color:var(--hr-shell-accent-soft)] text-[color:var(--hr-shell-accent-strong)]',
  DELETE: 'bg-red-100 text-red-700',
}

const TABLE_LABELS = {
  employees: 'audit.tabs.employees',
  departments: 'audit.tabs.departments',
  jobs: 'audit.tabs.jobs',
  users: 'audit.tabs.users',
  job_history: 'audit.tabs.jobHistory',
} as const

function formatAuditPayload(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

function getAuditTableLabel(tableName: string) {
  return TABLE_LABELS[tableName as keyof typeof TABLE_LABELS] ?? null
}

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

export function AuditLogPage() {
  const { t } = useTranslation(['admin', 'common'])
  const LIST_RESULT_LIMIT = 100
  const [tableFilter, setTableFilter] = useState('')
  const { data, isLoading, isError } = useAuditLogs(0, tableFilter || undefined, LIST_RESULT_LIMIT)
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
  const { savedViews, saveView, deleteView } = useLocalSavedViews('audit-log')

  const entries = data?.data ?? []
  const interactiveFilters = useMemo(() => [
    {
      key: 'tableName',
      label: t('audit.meta.filter', { ns: 'admin' }),
      mode: 'single' as const,
      values: tableFilter ? [tableFilter] : [],
      options: Object.keys(TABLE_LABELS).map((value) => {
        const labelKey = getAuditTableLabel(value)
        return {
          value,
          label: labelKey ? t(labelKey, { ns: 'admin' }) : value,
        }
      }),
      onChange: (values: string[]) => setTableFilter(values[0] ?? ''),
    },
  ], [t, tableFilter])
  function applySavedView(filters: Record<string, unknown>) {
    setTableFilter(String(filters.tableName ?? ''))
  }

  const columns = useMemo<EnhancedColumn<(typeof entries)[number]>[]>(() => [
    {
      key: 'action',
      header: t('audit.columns.action', { ns: 'admin' }),
      accessor: entry => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] ?? 'bg-neutral-100 text-neutral-600'}`}>
          {entry.action}
        </span>
      ),
    },
    {
      key: 'tableName',
      header: t('audit.columns.entity', { ns: 'admin' }),
      accessor: entry => {
        const labelKey = getAuditTableLabel(entry.tableName)
        return <span className="font-medium text-neutral-800">{labelKey ? t(labelKey, { ns: 'admin' }) : entry.tableName}</span>
      },
    },
    {
      key: 'recordId',
      header: t('audit.columns.record', { ns: 'admin' }),
      accessor: entry => <span className="font-mono text-xs text-neutral-600">#{entry.recordId}</span>,
    },
    {
      key: 'changedAt',
      header: t('audit.columns.changedAt', { ns: 'admin' }),
      accessor: entry => <span className="text-xs text-neutral-500">{formatDateTime(entry.changedAt, locale, 'medium', preferences.timezone)}</span>,
    },
  ], [locale, preferences.timezone, t])

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('audit.title', { ns: 'admin' })}
        subtitle={t('audit.subtitle', { ns: 'admin' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('audit.title', { ns: 'admin' }) },
        ]}
        surface="plain"
        className="mb-2 gap-1.5"
        searchBar={(
          <HrInteractiveFilterBar
            filters={interactiveFilters}
            onClearAll={tableFilter ? () => setTableFilter('') : undefined}
          />
        )}
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {t('audit.states.loadFailed', { ns: 'admin' })}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden">
          <EnhancedDataTable
            columns={columns}
            data={entries}
            rowKey={entry => entry.auditId}
            loading={isLoading}
            expandable
            renderExpanded={entry => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {entry.oldValue && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-neutral-500">{t('audit.states.before', { ns: 'admin' })}</p>
                    <pre className="max-h-56 overflow-auto rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-neutral-700">
                      {formatAuditPayload(entry.oldValue)}
                    </pre>
                  </div>
                )}
                {entry.newValue && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-neutral-500">{t('audit.states.after', { ns: 'admin' })}</p>
                    <pre className="max-h-56 overflow-auto rounded-lg border border-green-100 bg-green-50 p-3 text-xs text-neutral-700">
                      {formatAuditPayload(entry.newValue)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            stickyHeader
            fillHeight
            density="compact"
            currentFilters={{ tableName: tableFilter }}
            savedSearches={savedViews}
            onApplySavedSearch={applySavedView}
            onSaveSearch={saveView}
            onDeleteSearch={deleteView}
            exportFilename="audit-log"
            onExport={() => downloadCsv(
              'audit-log.csv',
              [
                t('audit.columns.action', { ns: 'admin' }),
                t('audit.columns.entity', { ns: 'admin' }),
                t('audit.columns.record', { ns: 'admin' }),
                t('audit.columns.changedAt', { ns: 'admin' }),
              ],
              entries.map((entry) => [
                entry.action,
                getAuditTableLabel(entry.tableName) ? t(getAuditTableLabel(entry.tableName)!, { ns: 'admin' }) : entry.tableName,
                entry.recordId,
                formatDateTime(entry.changedAt, locale, 'medium', preferences.timezone),
              ]),
            )}
            paginationMode="summary"
            summaryContent={(
              <>
                <span>
                  {Number(data?.totalElements ?? 0) > LIST_RESULT_LIMIT
                    ? t('audit.states.showingFirst', { ns: 'admin', limit: LIST_RESULT_LIMIT, total: data?.totalElements ?? 0 })
                    : t('audit.states.showingMatched', { ns: 'admin', count: entries.length })}
                </span>
                <span>{Number(data?.totalElements ?? 0) > LIST_RESULT_LIMIT ? t('audit.states.refineFilter', { ns: 'admin' }) : t('audit.states.expandRow', { ns: 'admin' })}</span>
              </>
            )}
            emptyTitle={t('audit.states.emptyTitle', { ns: 'admin' })}
            emptyDescription={t('audit.states.emptyDescription', { ns: 'admin' })}
            emptyIcon={<FileText size={18} />}
          />
        </div>
      )}
    </div>
  )
}

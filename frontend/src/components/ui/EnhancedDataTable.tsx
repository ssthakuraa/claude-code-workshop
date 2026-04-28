/**
 * EnhancedDataTable — DataTable + ColumnManager + SavedSearch + CSV export.
 * The main table component used across 40+ list pages.
 */
import { cn } from '@/utils/cn'
import { Download } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnManager, type ColumnConfig } from './ColumnManager'
import { DataTable, type ColumnDef, type DataTableProps } from './DataTable'
import { SavedSearch, type SavedSearchItem } from './SavedSearch'

export interface EnhancedColumn<T> extends ColumnDef<T> {
  defaultVisible?: boolean
  locked?: boolean
}

export interface EnhancedDataTableProps<T> extends Omit<DataTableProps<T>, 'columns'> {
  columns: EnhancedColumn<T>[]
  // SavedSearch
  savedSearches?: SavedSearchItem[]
  currentFilters?: Record<string, unknown>
  onApplySavedSearch?: (filters: Record<string, unknown>) => void
  onSaveSearch?: (name: string, filters: Record<string, unknown>) => void
  onDeleteSearch?: (id: string | number) => void
  // Export
  exportFilename?: string
  onExport?: () => void
  // Toolbar extra
  toolbar?: ReactNode
  className?: string
  compactToolbar?: boolean
}

function exportCsv<T>(columns: EnhancedColumn<T>[], data: T[], filename: string) {
  const visible = columns.filter(c => c.defaultVisible !== false)
  const header = visible.map(c => (typeof c.header === 'string' ? c.header : c.key)).join(',')
  const rows = data.map(row =>
    visible.map(c => {
      const val = c.accessor(row)
      if (typeof val === 'string' || typeof val === 'number') return `"${String(val).replace(/"/g, '""')}"`
      return ''
    }).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename + '.csv'; a.click()
  URL.revokeObjectURL(url)
}

export function EnhancedDataTable<T>({
  columns: initialColumns,
  savedSearches = [], currentFilters = {}, onApplySavedSearch, onSaveSearch, onDeleteSearch,
  exportFilename = 'export', onExport,
  toolbar, className, compactToolbar = true,
  ...tableProps
}: EnhancedDataTableProps<T>) {
  const { t } = useTranslation(['common'])
  const [colConfigs, setColConfigs] = useState<ColumnConfig[]>(
    initialColumns.map(c => ({ key: c.key, label: typeof c.header === 'string' ? c.header : c.key, visible: c.defaultVisible !== false, locked: c.locked }))
  )

  const visibleColumns = useMemo(() => {
    const order = colConfigs.map(c => c.key)
    return order
      .filter(k => colConfigs.find(c => c.key === k)?.visible)
      .map(k => initialColumns.find(c => c.key === k)!)
      .filter(Boolean)
  }, [colConfigs, initialColumns])

  const compactToolbarButtonClassName = compactToolbar
    ? 'rounded-lg px-2.5 py-1.5 text-xs'
    : undefined

  return (
    <div className={cn('flex flex-col gap-2', tableProps.fillHeight && 'min-h-0 flex-1', className)}>
      {/* Toolbar row */}
      <div className={cn('flex items-center justify-between flex-wrap', compactToolbar ? 'gap-1.5' : 'gap-2')}>
        <div className="flex items-center gap-2 flex-wrap flex-1">{toolbar}</div>
        <div className={cn('flex items-center shrink-0', compactToolbar ? 'gap-1.5' : 'gap-2')}>
          {onSaveSearch && (
            <SavedSearch
              saved={savedSearches}
              currentFilters={currentFilters}
              onApply={onApplySavedSearch ?? (() => {})}
              onSave={onSaveSearch}
              onDelete={onDeleteSearch ?? (() => {})}
              triggerClassName={compactToolbarButtonClassName}
            />
          )}
          <ColumnManager columns={colConfigs} onChange={setColConfigs} triggerClassName={compactToolbarButtonClassName} />
          <button
            type="button"
            onClick={onExport ?? (() => exportCsv(initialColumns, tableProps.data, exportFilename))}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 py-2 text-sm font-medium text-[color:var(--hr-text)] shadow-[var(--shadow-xs)] transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]',
              compactToolbarButtonClassName,
            )}
          >
            <Download size={compactToolbar ? 14 : 15} />
            {t('ui.export', { ns: 'common' })}
          </button>
        </div>
      </div>
      <DataTable {...tableProps} columns={visibleColumns} />
    </div>
  )
}

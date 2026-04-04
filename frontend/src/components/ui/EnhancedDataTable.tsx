/**
 * EnhancedDataTable — DataTable + ColumnManager + SavedSearch + CSV export.
 * The main table component used across 40+ list pages.
 */
import { cn } from '@/utils/cn'
import { Download } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
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
  toolbar, className,
  ...tableProps
}: EnhancedDataTableProps<T>) {
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

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">{toolbar}</div>
        <div className="flex items-center gap-2 shrink-0">
          {onSaveSearch && (
            <SavedSearch
              saved={savedSearches}
              currentFilters={currentFilters}
              onApply={onApplySavedSearch ?? (() => {})}
              onSave={onSaveSearch}
              onDelete={onDeleteSearch ?? (() => {})}
            />
          )}
          <ColumnManager columns={colConfigs} onChange={setColConfigs} />
          <button
            type="button"
            onClick={onExport ?? (() => exportCsv(initialColumns, tableProps.data, exportFilename))}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
      <DataTable {...tableProps} columns={visibleColumns} />
    </div>
  )
}

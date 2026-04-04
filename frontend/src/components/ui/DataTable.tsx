import { cn } from '@/utils/cn'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import React, { useState, type ReactNode } from 'react'
import { Checkbox } from './Checkbox'
import { EmptyState } from './EmptyState'
import { Pagination } from './Pagination'
import { Spinner } from './Spinner'

export type SortDirection = 'asc' | 'desc'

export interface ColumnDef<T> {
  key: string
  header: string | ReactNode
  accessor: (row: T) => ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  // Selection
  selectable?: boolean
  selectedKeys?: Set<string | number>
  onSelectionChange?: (keys: Set<string | number>) => void
  // Sorting (controlled)
  sortKey?: string
  sortDirection?: SortDirection
  onSort?: (key: string, direction: SortDirection) => void
  // Pagination
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  // Expandable rows
  expandable?: boolean
  renderExpanded?: (row: T) => ReactNode
  // Row click
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T>({
  columns, data, rowKey, loading,
  emptyTitle = 'No results', emptyDescription, emptyIcon,
  selectable, selectedKeys, onSelectionChange,
  sortKey, sortDirection, onSort,
  page, pageSize, total, onPageChange, onPageSizeChange,
  expandable, renderExpanded,
  onRowClick, className,
}: DataTableProps<T>) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(new Set())

  function toggleExpand(key: string | number) {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function handleSort(key: string) {
    if (!onSort) return
    if (sortKey === key) {
      onSort(key, sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      onSort(key, 'asc')
    }
  }

  const allKeys = data.map(rowKey)
  const isAllSelected = selectedKeys != null && allKeys.length > 0 && allKeys.every(k => selectedKeys.has(k))
  const isSomeSelected = selectedKeys != null && allKeys.some(k => selectedKeys.has(k))

  function toggleAll() {
    if (!onSelectionChange) return
    if (isAllSelected) {
      const next = new Set(selectedKeys ?? [])
      allKeys.forEach(k => next.delete(k))
      onSelectionChange(next)
    } else {
      const next = new Set(selectedKeys ?? [])
      allKeys.forEach(k => next.add(k))
      onSelectionChange(next)
    }
  }

  function toggleRow(key: string | number) {
    if (!onSelectionChange) return
    const next = new Set(selectedKeys ?? [])
    next.has(key) ? next.delete(key) : next.add(key)
    onSelectionChange(next)
  }

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {selectable && (
                <th className="w-10 px-3 py-3" scope="col" aria-label="Select rows">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {expandable && <th className="w-8" scope="col" aria-label="Expand row" />}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn('px-3 py-3 font-semibold text-neutral-600', alignClass[col.align ?? 'left'], col.className)}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : (
                        <ChevronsUpDown size={14} className="text-neutral-400" />
                      )}
                    </button>
                  ) : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} className="py-16 text-center">
                  <Spinner size="lg" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}>
                  <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
                </td>
              </tr>
            ) : data.map(row => {
              const key = rowKey(row)
              const isSelected = selectedKeys?.has(key)
              const isExpanded = expandedKeys.has(key)
              return (
                <React.Fragment key={key}>
                  <tr
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'border-b border-neutral-100 last:border-0 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-neutral-50',
                      isSelected && 'bg-primary-50',
                    )}
                  >
                    {selectable && (
                      <td className="w-10 px-3 py-3" onClick={e => { e.stopPropagation(); toggleRow(key) }}>
                        <Checkbox checked={!!isSelected} onChange={() => toggleRow(key)} aria-label={`Select row ${key}`} />
                      </td>
                    )}
                    {expandable && (
                      <td className="w-8 px-2 py-3" onClick={e => { e.stopPropagation(); toggleExpand(key) }}>
                        <button type="button" className="p-0.5 text-neutral-400 hover:text-neutral-700">
                          <ChevronDown size={14} className={cn('transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={cn('px-3 py-3 text-neutral-700', alignClass[col.align ?? 'left'], col.className)}>
                        {col.accessor(row)}
                      </td>
                    ))}
                  </tr>
                  {expandable && isExpanded && renderExpanded && (
                    <tr key={`${key}-expanded`} className="bg-neutral-50 border-b border-neutral-100">
                      <td colSpan={columns.length + (selectable ? 1 : 0) + 1} className="px-6 py-4">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      {page !== undefined && pageSize !== undefined && total !== undefined && onPageChange && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}

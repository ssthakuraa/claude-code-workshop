import { cn } from '@/utils/cn'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import React, { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
  rowClassName?: (row: T) => string
  stickyHeader?: boolean
  maxHeight?: string
  tableClassName?: string
  viewportClassName?: string
  emptyStateClassName?: string
  selectionActions?: ReactNode | ((selectedRows: T[], selectedCount: number) => ReactNode)
  tabs?: Array<{
    id: string
    label: string
    count?: number
  }>
  activeTab?: string
  onTabChange?: (tabId: string) => void
  bottomActions?: ReactNode | ((selectedRows: T[], selectedCount: number) => ReactNode)
  density?: 'cozy' | 'compact'
  fillHeight?: boolean
  paginationMode?: 'pages' | 'summary'
  summaryContent?: ReactNode
  className?: string
}

export function DataTable<T>({
  columns, data, rowKey, loading,
  emptyTitle, emptyDescription, emptyIcon,
  selectable, selectedKeys, onSelectionChange,
  sortKey, sortDirection, onSort,
  page, pageSize, total, onPageChange, onPageSizeChange,
  expandable, renderExpanded,
  onRowClick, className,
  rowClassName,
  stickyHeader = false,
  maxHeight,
  tableClassName,
  viewportClassName,
  emptyStateClassName,
  selectionActions,
  tabs,
  activeTab,
  onTabChange,
  bottomActions,
  density = 'cozy',
  fillHeight = false,
  paginationMode = 'pages',
  summaryContent,
}: DataTableProps<T>) {
  const { t } = useTranslation(['common'])
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(new Set())
  const resolvedEmptyTitle = emptyTitle ?? t('ui.noResults', { ns: 'common' })

  function toggleExpand(key: string | number) {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
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
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    onSelectionChange(next)
  }

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }
  const headerCellPadding = density === 'compact' ? 'px-3 py-2' : 'px-3 py-3'
  const rowCellPadding = density === 'compact' ? 'px-3 py-2' : 'px-3 py-3'
  const checkboxCellPadding = density === 'compact' ? 'w-10 px-3 py-2' : 'w-10 px-3 py-3'
  const expandCellPadding = density === 'compact' ? 'w-8 px-2 py-2' : 'w-8 px-2 py-3'
  const selectedCount = selectedKeys?.size ?? 0
  const selectedRows = selectedKeys ? data.filter(row => selectedKeys.has(rowKey(row))) : []
  const resolvedSelectionActions =
    typeof selectionActions === 'function'
      ? selectionActions(selectedRows, selectedCount)
      : selectionActions
  const resolvedBottomActions =
    typeof bottomActions === 'function'
      ? bottomActions(selectedRows, selectedCount)
      : bottomActions
  const activeBottomBar = selectedCount > 0
    ? resolvedBottomActions ?? resolvedSelectionActions
    : resolvedBottomActions

  return (
    <div className={cn('flex flex-col gap-3', fillHeight && 'min-h-0 flex-1', className)}>
      <div className={cn('overflow-hidden rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-white shadow-[var(--shadow-sm)]', fillHeight && 'flex min-h-0 flex-1 flex-col')}>
        {tabs && tabs.length > 0 && (
          <div className="border-b border-[rgba(255,255,255,0.12)] bg-[color:var(--hr-shell-accent-strong)] px-3 pt-2">
            <div className="flex flex-wrap items-end gap-2">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange?.(tab.id)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-t-xl border border-b-0 px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-white/20 bg-white text-[color:var(--hr-shell-accent-strong)]'
                        : 'border-transparent bg-transparent text-white/72 hover:text-white',
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={cn(
                        'rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                        isActive ? 'bg-[color:var(--hr-shell-accent-soft)] text-[color:var(--hr-shell-accent-strong)]' : 'bg-white/12 text-white',
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div
          className={cn('overflow-auto', fillHeight && 'min-h-0 flex-1', viewportClassName)}
          style={{
            ...(maxHeight ? { maxHeight } : {}),
            ...(fillHeight ? { height: '100%' } : {}),
          }}
        >
          <table className={cn(density === 'compact' ? 'w-full text-xs' : 'w-full text-sm', tableClassName)}>
            <thead className="bg-[color:var(--hr-shell-accent-strong)]">
              <tr className="border-b border-black/10 bg-[color:var(--hr-shell-accent-strong)]">
                {selectable && (
                  <th
                    className={cn(
                      checkboxCellPadding,
                      'text-white',
                      stickyHeader && 'sticky top-0 z-10 bg-[color:var(--hr-shell-accent-strong)]',
                    )}
                    scope="col"
                    aria-label={t('ui.selectRows', { ns: 'common' })}
                  >
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={toggleAll}
                      aria-label={t('ui.selectAllRows', { ns: 'common' })}
                    />
                  </th>
                )}
                {expandable && (
                  <th
                    className={cn(
                      expandCellPadding,
                      stickyHeader && 'sticky top-0 z-10 bg-[color:var(--hr-shell-accent-strong)]',
                    )}
                    scope="col"
                    aria-label={t('ui.expandRow', { ns: 'common' })}
                  />
                )}
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={cn(
                      headerCellPadding,
                      'font-semibold text-white',
                      stickyHeader && 'sticky top-0 z-10 bg-[color:var(--hr-shell-accent-strong)]',
                      alignClass[col.align ?? 'left'],
                      col.className,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 transition-colors hover:text-white/85"
                      >
                        {col.header}
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ChevronsUpDown size={14} className="text-white/55" />
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
                  <EmptyState
                    title={resolvedEmptyTitle}
                    description={emptyDescription}
                    icon={emptyIcon}
                    className={emptyStateClassName}
                    />
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
                        rowClassName?.(row),
                      )}
                    >
                      {selectable && (
                        <td className={checkboxCellPadding} onClick={e => { e.stopPropagation(); toggleRow(key) }}>
                          <Checkbox checked={!!isSelected} onChange={() => toggleRow(key)} aria-label={`Select row ${key}`} />
                        </td>
                      )}
                      {expandable && (
                        <td className={expandCellPadding} onClick={e => { e.stopPropagation(); toggleExpand(key) }}>
                          <button type="button" className="p-0.5 text-neutral-400 hover:text-neutral-700">
                            <ChevronDown size={14} className={cn('transition-transform', isExpanded && 'rotate-180')} />
                          </button>
                        </td>
                      )}
                      {columns.map(col => (
                        <td key={col.key} className={cn(rowCellPadding, 'text-neutral-700', alignClass[col.align ?? 'left'], col.className)}>
                          {col.accessor(row)}
                        </td>
                      ))}
                    </tr>
                    {expandable && isExpanded && renderExpanded && (
                      <tr key={`${key}-expanded`} className="bg-neutral-50 border-b border-neutral-100">
                        <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} className="px-6 py-4">
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
        {activeBottomBar && (
          <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-[color:var(--hr-border-subtle)] bg-white/96 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            {selectable && selectedCount > 0 ? (
              <p className="text-sm font-medium text-[color:var(--hr-text)]">
                {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
              </p>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap items-center gap-2">{activeBottomBar}</div>
          </div>
        )}
      </div>
      {paginationMode === 'pages' && page !== undefined && pageSize !== undefined && total !== undefined && onPageChange && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
      {paginationMode === 'summary' && summaryContent && (
        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--hr-border-subtle)] px-1 pt-3 text-xs text-[color:var(--hr-text-subtle)]">
          {summaryContent}
        </div>
      )}
    </div>
  )
}

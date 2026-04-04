import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50, 100], className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  // Build visible page numbers with ellipsis
  function getPages(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) pages.push(p)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const btnBase = 'inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors'

  return (
    <div className={cn('flex items-center justify-between gap-4 flex-wrap', className)}>
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        {total > 0 ? `${start}–${end} of ${total}` : 'No results'}
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1) }}
            aria-label="Rows per page"
            className="ml-2 text-sm border border-neutral-300 rounded-md px-2 py-0.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {pageSizeOptions.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={cn(btnBase, 'text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed')}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="w-8 text-center text-neutral-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={cn(btnBase, p === page ? 'bg-primary-600 text-white' : 'text-neutral-700 hover:bg-neutral-100')}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={cn(btnBase, 'text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed')}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

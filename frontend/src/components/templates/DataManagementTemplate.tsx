/**
 * DataManagementTemplate — standard list/table page (~40 screens).
 * Provides: PageHeader, optional filter bar, DataTable slot, action bar.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderProps } from '../ui/PageHeader'

export interface DataManagementTemplateProps extends PageHeaderProps {
  filters?: ReactNode
  toolbar?: ReactNode          // buttons above table (Create, Export, etc.)
  table: ReactNode
  belowTable?: ReactNode
  className?: string
}

export function DataManagementTemplate({ filters, toolbar, table, belowTable, className, ...headerProps }: DataManagementTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <PageHeader {...headerProps} />
      {(filters || toolbar) && (
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap flex-1">{filters}</div>
          {toolbar && <div className="flex items-center gap-2 shrink-0">{toolbar}</div>}
        </div>
      )}
      {table}
      {belowTable}
    </div>
  )
}

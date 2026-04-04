/**
 * SplitViewTemplate — inbox-style layout (list on left, detail on right).
 * Used for: Communications, Documents, Notifications.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

export interface SplitViewTemplateProps {
  list: ReactNode
  detail: ReactNode
  listWidth?: string
  emptyDetail?: ReactNode
  showDetail?: boolean
  className?: string
}

export function SplitViewTemplate({ list, detail, listWidth = 'w-80', emptyDetail, showDetail = true, className }: SplitViewTemplateProps) {
  return (
    <div className={cn('flex h-full gap-0 overflow-hidden rounded-lg border border-neutral-200 bg-white', className)}>
      {/* List panel */}
      <div className={cn('flex flex-col border-r border-neutral-200 overflow-y-auto shrink-0', listWidth)}>
        {list}
      </div>
      {/* Detail panel */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {showDetail ? detail : (emptyDetail ?? (
          <div className="flex items-center justify-center h-full text-sm text-neutral-400">
            Select an item to view details
          </div>
        ))}
      </div>
    </div>
  )
}

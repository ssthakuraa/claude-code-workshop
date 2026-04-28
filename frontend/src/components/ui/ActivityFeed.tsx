import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { formatRelativeTime } from '@/utils/formatters'

export interface ActivityItem {
  id: string | number
  icon?: ReactNode
  iconColor?: string
  title: ReactNode
  description?: string
  timestamp: string | Date
  user?: {
    name: string
    avatarUrl?: string
  }
  extra?: ReactNode
}

export interface ActivityFeedProps {
  items: ActivityItem[]
  className?: string
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <ol className={cn('relative', className)}>
      {items.map((item, idx) => (
        <li key={item.id} className="flex gap-3 pb-6 last:pb-0 relative">
          {/* Vertical connector line */}
          {idx < items.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-neutral-200" aria-hidden="true" />
          )}
          {/* Icon */}
          <span className={cn(
            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-sm z-10',
            item.iconColor ?? 'bg-neutral-400',
          )}>
            {item.icon ?? <span className="w-2 h-2 rounded-full bg-white" />}
          </span>
          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="text-sm text-neutral-800">{item.title}</div>
              <time className="text-xs text-neutral-400 shrink-0">
                {formatRelativeTime(typeof item.timestamp === 'string' ? item.timestamp : item.timestamp.toISOString())}
              </time>
            </div>
            {item.description && (
              <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
            )}
            {item.extra && <div className="mt-1">{item.extra}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}

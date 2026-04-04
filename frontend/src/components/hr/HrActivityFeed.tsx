/**
 * HrActivityFeed
 *
 * Purpose: Chronological activity timeline for career history, audit trail, recent actions.
 * Used in Employee 360 Career Timeline tab and Dashboard Recent Activity.
 */
import { HrDateDisplay } from '@/components/hr/i18n/HrDateDisplay'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

export type ActivityItemType =
  | 'job_change' | 'salary' | 'transfer' | 'hire' | 'termination' | 'document'

export interface ActivityItem {
  id: string
  type: ActivityItemType
  title: string
  description?: string
  date: Date | string
  user?: { name: string; avatar?: string }
  metadata?: Record<string, any>
}

interface HrActivityFeedProps {
  items: ActivityItem[]
  variant?: 'default' | 'compact'
  groupBy?: 'date' | 'none'
  loading?: boolean
  emptyMessage?: string
}

const TYPE_CONFIG: Record<ActivityItemType, { icon: string; color: string; bg: string }> = {
  hire:        { icon: '👤', color: 'text-green-700',  bg: 'bg-green-100' },
  job_change:  { icon: '📋', color: 'text-purple-700', bg: 'bg-purple-100' },
  salary:      { icon: '💰', color: 'text-blue-700',   bg: 'bg-blue-100' },
  transfer:    { icon: '↔️', color: 'text-orange-700', bg: 'bg-orange-100' },
  termination: { icon: '🔴', color: 'text-red-700',    bg: 'bg-red-100' },
  document:    { icon: '📄', color: 'text-neutral-700', bg: 'bg-neutral-100' },
}

function groupItemsByDate(items: ActivityItem[]): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {}
  const now = new Date()

  for (const item of items) {
    const d = item.date instanceof Date ? item.date : new Date(item.date)
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000)

    let label: string
    if (diffDays === 0) label = 'Today'
    else if (diffDays === 1) label = 'Yesterday'
    else if (diffDays < 7) label = 'This Week'
    else if (diffDays < 30) label = 'This Month'
    else {
      label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  }

  return groups
}

function ActivityRow({ item, compact }: { item: ActivityItem; compact: boolean }) {
  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.document

  return (
    <div className={`flex gap-3 ${compact ? 'py-2' : 'py-3'}`}>
      {/* Timeline icon */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${cfg.bg}`}>
          {cfg.icon}
        </div>
        <div className="w-px flex-1 bg-neutral-200 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <p className={`font-medium text-neutral-800 ${compact ? 'text-xs' : 'text-sm'}`}>{item.title}</p>
        {item.description && (
          <p className={`text-neutral-500 mt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>{item.description}</p>
        )}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            {Object.entries(item.metadata).map(([k, v]) => (
              <span key={k} className="text-xs text-neutral-400">
                {k}: <span className="text-neutral-600">{String(v)}</span>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          {item.user && (
            <span className="text-xs text-neutral-400">by {item.user.name} ·</span>
          )}
          <span className="text-xs text-neutral-400">
            <HrDateDisplay value={item.date} relative />
          </span>
        </div>
      </div>
    </div>
  )
}

export function HrActivityFeed({
  items,
  variant = 'default',
  groupBy = 'date',
  loading = false,
  emptyMessage = 'No activity yet.',
}: HrActivityFeedProps) {
  const compact = variant === 'compact'

  if (loading) return <HrSkeleton variant="table" count={4} />

  if (!items.length) {
    return (
      <div className="py-8 text-center text-sm text-neutral-400">{emptyMessage}</div>
    )
  }

  if (groupBy === 'none') {
    return (
      <div className="divide-y divide-neutral-100">
        {items.map(item => <ActivityRow key={item.id} item={item} compact={compact} />)}
      </div>
    )
  }

  const groups = groupItemsByDate(items)

  return (
    <div>
      {Object.entries(groups).map(([label, groupItems]) => (
        <div key={label}>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide px-1 py-2 sticky top-0 bg-white">
            {label}
          </p>
          {groupItems.map(item => <ActivityRow key={item.id} item={item} compact={compact} />)}
        </div>
      ))}
    </div>
  )
}

import { cn } from '@/utils/cn'
import { Clock } from 'lucide-react'

export interface AuditLogEntry {
  id: number
  entityType: string
  entityId: string
  action: string
  performedBy: string
  performedAt: string
  details?: string
  changes?: Record<string, { from: unknown; to: unknown }>
}

interface HrAuditLogRowProps {
  entry: AuditLogEntry
  expanded?: boolean
  onToggle?: () => void
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  HIRE: 'bg-emerald-100 text-emerald-700',
  TERMINATE: 'bg-red-100 text-red-700',
  PROMOTE: 'bg-purple-100 text-purple-700',
  TRANSFER: 'bg-indigo-100 text-indigo-700',
}

export function HrAuditLogRow({ entry, expanded, onToggle }: HrAuditLogRowProps) {
  const colorCls = ACTION_COLORS[entry.action] ?? 'bg-neutral-100 text-neutral-700'
  const hasDetails = entry.details || entry.changes

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <div
        className={cn('flex items-center gap-4 py-3 px-4', hasDetails && onToggle && 'cursor-pointer hover:bg-neutral-50')}
        onClick={hasDetails ? onToggle : undefined}
      >
        <div className="flex-shrink-0">
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', colorCls)}>
            {entry.action}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-neutral-800">
            <span className="font-medium">{entry.entityType}</span>
            <span className="text-neutral-500 ml-1">#{entry.entityId}</span>
          </div>
          <div className="text-xs text-neutral-500">by {entry.performedBy}</div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-xs text-neutral-400">
          <Clock size={11} />
          {new Date(entry.performedAt).toLocaleString()}
        </div>
      </div>

      {expanded && hasDetails && (
        <div className="px-4 pb-3 bg-neutral-50 border-t border-neutral-100">
          {entry.details && <p className="text-xs text-neutral-600 mb-2">{entry.details}</p>}
          {entry.changes && (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-neutral-500">
                  <th className="text-left py-1 pr-4 font-medium">Field</th>
                  <th className="text-left py-1 pr-4 font-medium">From</th>
                  <th className="text-left py-1 font-medium">To</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(entry.changes).map(([field, { from, to }]) => (
                  <tr key={field} className="border-t border-neutral-200">
                    <td className="py-1 pr-4 text-neutral-600 font-medium">{field}</td>
                    <td className="py-1 pr-4 text-red-600">{String(from ?? '—')}</td>
                    <td className="py-1 text-green-600">{String(to ?? '—')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

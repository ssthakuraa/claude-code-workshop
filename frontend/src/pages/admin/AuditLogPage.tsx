import { useState } from 'react'
import { useAuditLogs } from '@/api/auditLogs'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

const ACTION_COLORS: Record<string, string> = {
  INSERT: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
}

const TABLE_LABELS: Record<string, string> = {
  employees: 'Employee',
  departments: 'Department',
  jobs: 'Job',
  hr_users: 'User',
  job_history: 'Job History',
}

export function AuditLogPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [tableFilter, setTableFilter] = useState('')
  const { data, isLoading, isError } = useAuditLogs(0, tableFilter || undefined)

  const entries = data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Audit Log</h1>
          <p className="text-sm text-neutral-500 mt-0.5">All system changes and actions</p>
        </div>
        <select
          value={tableFilter}
          onChange={e => setTableFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Tables</option>
          {Object.entries(TABLE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {isError && (
          <div className="px-4 py-8 text-center text-sm text-red-500">Failed to load audit logs.</div>
        )}
        {isLoading && (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-neutral-100">
              <HrSkeleton className="h-4 w-14" />
              <HrSkeleton className="h-4 w-20" />
              <HrSkeleton className="h-4 w-48 flex-1" />
              <HrSkeleton className="h-4 w-28" />
            </div>
          ))
        )}
        {!isLoading && !isError && entries.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-neutral-500">No audit log entries found.</div>
        )}
        {!isLoading && entries.map(entry => {
          const isExpanded = expandedId === entry.auditId
          return (
            <div key={entry.auditId} className="border-b border-neutral-100 last:border-0">
              <button
                type="button"
                onClick={() => setExpandedId(id => id === entry.auditId ? null : entry.auditId)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left"
              >
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${ACTION_COLORS[entry.action] ?? 'bg-neutral-100 text-neutral-600'}`}>
                  {entry.action}
                </span>
                <span className="text-xs font-medium text-neutral-700 w-24 flex-shrink-0">
                  {TABLE_LABELS[entry.tableName] ?? entry.tableName}
                </span>
                <span className="text-xs text-neutral-500 flex-shrink-0">#{entry.recordId}</span>
                <span className="flex-1" />
                <span className="text-xs text-neutral-400">
                  {new Date(entry.changedAt).toLocaleString()}
                </span>
                <span className="text-neutral-400 text-xs ml-2">{isExpanded ? '▲' : '▼'}</span>
              </button>
              {isExpanded && (entry.oldValue || entry.newValue) && (
                <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entry.oldValue && (
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1">Before</p>
                      <pre className="text-xs bg-red-50 border border-red-100 rounded p-2 overflow-auto max-h-40 text-neutral-700">
                        {JSON.stringify(JSON.parse(entry.oldValue), null, 2)}
                      </pre>
                    </div>
                  )}
                  {entry.newValue && (
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1">After</p>
                      <pre className="text-xs bg-green-50 border border-green-100 rounded p-2 overflow-auto max-h-40 text-neutral-700">
                        {JSON.stringify(JSON.parse(entry.newValue), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {data && data.totalElements > 0 && (
        <p className="text-xs text-neutral-500 text-right">
          Showing {entries.length} of {data.totalElements} entries
        </p>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrPagedResponse } from '@/types/api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export interface AuditLogEntry {
  auditId: number
  tableName: string
  recordId: string
  action: string
  oldValue?: string
  newValue?: string
  changedBy?: number
  changedAt: string
}

const MOCK_ENTRIES: AuditLogEntry[] = [
  { auditId: 1, tableName: 'employees', recordId: '305', action: 'INSERT', changedAt: '2026-03-30T10:00:00Z', newValue: '{"firstName":"Alex","lastName":"Johnson"}' },
  { auditId: 2, tableName: 'employees', recordId: '202', action: 'UPDATE', changedAt: '2026-03-29T14:00:00Z', oldValue: '{"jobTitle":"Marketing Rep"}', newValue: '{"jobTitle":"Senior Marketing Analyst"}' },
  { auditId: 3, tableName: 'employees', recordId: '176', action: 'UPDATE', changedAt: '2026-03-28T11:30:00Z', oldValue: '{"employmentStatus":"ACTIVE"}', newValue: '{"employmentStatus":"ON_LEAVE"}' },
  { auditId: 4, tableName: 'departments', recordId: '60', action: 'UPDATE', changedAt: '2026-03-27T09:00:00Z', oldValue: '{"managerId":103}', newValue: '{"managerId":104}' },
  { auditId: 5, tableName: 'employees', recordId: '108', action: 'UPDATE', changedAt: '2026-03-26T15:00:00Z', oldValue: '{"departmentId":10}', newValue: '{"departmentId":20}' },
]

export function useAuditLogs(page = 0, tableName?: string) {
  return useQuery({
    queryKey: ['audit-logs', page, tableName],
    queryFn: async (): Promise<HrPagedResponse<AuditLogEntry>> => {
      if (USE_MOCK) {
        const filtered = tableName ? MOCK_ENTRIES.filter(e => e.tableName === tableName) : MOCK_ENTRIES
        return { timestamp: '', status: 200, data: filtered, totalElements: filtered.length, totalPages: 1, currentPage: 0, pageSize: 20 }
      }
      const resp = await hrApi.get<HrPagedResponse<AuditLogEntry>>('/audit-logs', { page, size: 20, tableName })
      return resp
    },
  })
}

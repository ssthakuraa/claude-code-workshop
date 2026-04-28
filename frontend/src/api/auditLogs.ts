import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrPagedResponse } from '@/types/api'

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

export function useAuditLogs(page = 0, tableName?: string, size = 20) {
  return useQuery({
    queryKey: ['audit-logs', page, tableName, size],
    queryFn: async (): Promise<HrPagedResponse<AuditLogEntry>> => {
      const resp = await hrApi.get<HrPagedResponse<AuditLogEntry>>('/audit-logs', { page, size, tableName })
      return resp
    },
  })
}

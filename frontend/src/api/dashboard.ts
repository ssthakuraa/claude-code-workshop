import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import { mockKpis, mockHeadcountByDepartment } from '@/data/mockDashboard'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export interface DashboardSummary {
  totalHeadcount: number
  activeCount: number
  onLeaveCount: number
  probationCount: number
  newHiresThisMonth: number
  terminationsThisMonth: number
  headcountByDepartment: { departmentName: string; count: number }[]
  headcountByStatus: { status: string; count: number }[]
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      if (USE_MOCK) {
        return {
          totalHeadcount: mockKpis.totalHeadcount,
          activeCount: mockKpis.totalHeadcount - mockKpis.openProbations,
          onLeaveCount: 0,
          probationCount: mockKpis.openProbations,
          newHiresThisMonth: mockKpis.newHiresThisMonth,
          terminationsThisMonth: 0,
          headcountByDepartment: mockHeadcountByDepartment.map(d => ({
            departmentName: d.name,
            count: d.value,
          })),
          headcountByStatus: [
            { status: 'ACTIVE', count: mockKpis.totalHeadcount - mockKpis.openProbations },
            { status: 'ON_LEAVE', count: 0 },
            { status: 'PROBATION', count: mockKpis.openProbations },
          ],
        }
      }
      const resp = await hrApi.get<HrApiResponse<DashboardSummary>>('/dashboard/summary')
      return resp.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

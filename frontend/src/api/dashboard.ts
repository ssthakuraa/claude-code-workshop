import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export interface DashboardSummary {
  totalHeadcount: number
  activeCount: number
  onLeaveCount: number
  probationCount: number
  newHiresThisMonth: number
  terminationsThisMonth: number
  headcountByDepartment: { departmentName: string; count: number }[]
  headcountByStatus: { status: string; count: number }[]
  headcountByCountry: { countryName: string; count: number }[]
  attritionTrend: { month: string; terminated: number }[]
  recentActivity: { type: string; text: string; time: string }[]
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      const resp = await hrApi.get<HrApiResponse<DashboardSummary>>('/dashboard/summary')
      return resp.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

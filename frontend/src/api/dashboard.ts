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

export interface CountryCount {
  countryName: string
  count: number
}

export function useHeadcountByCountry() {
  return useQuery({
    queryKey: ['dashboard', 'headcount-by-country'],
    queryFn: async (): Promise<CountryCount[]> => {
      const resp = await hrApi.get<HrApiResponse<CountryCount[]>>('/dashboard/headcount-by-country')
      return resp.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

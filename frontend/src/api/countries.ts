import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export interface CountrySummary {
  countryId: string
  countryName: string
  regionId?: number
  regionName?: string
  employeeCount?: number
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<CountrySummary[]> => {
      const resp = await hrApi.get<HrApiResponse<CountrySummary[]>>('/countries')
      return resp.data
    },
  })
}

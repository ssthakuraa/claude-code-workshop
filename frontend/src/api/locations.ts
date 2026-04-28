import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export interface LocationSummary {
  locationId: number
  city: string
  stateProvince?: string
  countryId: string
  countryName: string
  employeeCount?: number
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<LocationSummary[]> => {
      const resp = await hrApi.get<HrApiResponse<LocationSummary[]>>('/locations')
      return resp.data
    },
  })
}

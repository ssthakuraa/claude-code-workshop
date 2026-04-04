import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import { mockJobs } from '@/data/mockJobs'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export interface Job {
  jobId: string
  jobTitle: string
  minSalary: number
  maxSalary: number
}

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<Job[]> => {
      if (USE_MOCK) return mockJobs
      const resp = await hrApi.get<HrApiResponse<Job[]>>('/jobs')
      return resp.data
    },
  })
}

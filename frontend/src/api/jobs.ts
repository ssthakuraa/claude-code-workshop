import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

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
      const resp = await hrApi.get<HrApiResponse<Job[]>>('/jobs')
      return resp.data
    },
  })
}

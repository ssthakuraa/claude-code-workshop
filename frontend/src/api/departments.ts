import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export interface Department {
  departmentId: number
  departmentName: string
  managerId?: number
  managerName?: string
  employeeCount?: number
  children?: Department[]
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async (): Promise<Department[]> => {
      const resp = await hrApi.get<HrApiResponse<Department[]>>('/departments')
      return resp.data
    },
  })
}

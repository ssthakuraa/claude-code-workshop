import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import { mockDepartments } from '@/data/mockEmployees'
import { mockEmployees } from '@/data/mockEmployees'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

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
      if (USE_MOCK) {
        return mockDepartments.map(d => ({
          departmentId: d.id,
          departmentName: d.name,
          employeeCount: mockEmployees.filter(e => e.department === d.name && e.status !== 'TERMINATED').length,
        }))
      }
      const resp = await hrApi.get<HrApiResponse<Department[]>>('/departments')
      return resp.data
    },
  })
}

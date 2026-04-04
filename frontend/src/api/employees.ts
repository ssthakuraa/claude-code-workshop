import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse, HrPagedResponse } from '@/types/api'
import type { EmployeeSummary, EmployeeDetail, HireRequest, TerminateRequest, PromoteRequest, TransferRequest, EmployeeFilter } from '@/types/employee'
import { mockEmployees } from '@/data/mockEmployees'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Adapt mock data shape to EmployeeSummary interface
function adaptMockToSummary(e: typeof mockEmployees[0]): EmployeeSummary {
  return {
    employeeId: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    fullName: e.fullName,
    email: e.email,
    jobId: e.jobId,
    jobTitle: e.jobTitle,
    departmentId: e.departmentId,
    departmentName: e.department,
    employmentStatus: e.status,
    employmentType: e.employmentType,
    salary: e.salary,
    managerName: e.managerName,
    hireDate: e.hireDate,
  }
}

function adaptMockToDetail(e: typeof mockEmployees[0]): EmployeeDetail {
  return {
    ...adaptMockToSummary(e),
    managerId: e.managerId,
    jobHistory: [],
  }
}

export function useEmployees(filters?: EmployeeFilter) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async (): Promise<HrPagedResponse<EmployeeSummary>> => {
      if (USE_MOCK) {
        let data = mockEmployees.map(adaptMockToSummary)
        if (filters?.status) data = data.filter(e => e.employmentStatus === filters.status)
        if (filters?.departmentId) data = data.filter(e => e.departmentId === filters.departmentId)
        if (filters?.search) {
          const q = filters.search.toLowerCase()
          data = data.filter(e =>
            e.fullName.toLowerCase().includes(q) ||
            e.jobTitle.toLowerCase().includes(q) ||
            String(e.employeeId).includes(q)
          )
        }
        return { timestamp: '', status: 200, data, totalElements: data.length, totalPages: 1, currentPage: 0, pageSize: data.length }
      }
      const resp = await hrApi.get<HrPagedResponse<EmployeeSummary>>('/employees', filters)
      return resp
    },
  })
}

export function useEmployee(id: number | undefined) {
  return useQuery({
    queryKey: ['employee', id],
    enabled: !!id,
    queryFn: async (): Promise<EmployeeDetail> => {
      if (USE_MOCK) {
        const emp = mockEmployees.find(e => e.id === id)
        if (!emp) throw { status: 404, message: 'Employee not found' }
        return adaptMockToDetail(emp)
      }
      const resp = await hrApi.get<HrApiResponse<EmployeeDetail>>(`/employees/${id}`)
      return resp.data
    },
  })
}

export function useHireEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: HireRequest) => {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 800))
        return { employeeId: Math.floor(Math.random() * 1000) + 500 }
      }
      const resp = await hrApi.post<HrApiResponse<EmployeeDetail>>('/employees', data)
      return resp.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useTerminateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: TerminateRequest) => {
      if (USE_MOCK) { await new Promise(r => setTimeout(r, 800)); return }
      const resp = await hrApi.post<HrApiResponse<EmployeeDetail>>('/employees/terminate', data)
      return resp.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employee', vars.employeeId] })
    },
  })
}

export function usePromoteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: PromoteRequest) => {
      if (USE_MOCK) { await new Promise(r => setTimeout(r, 800)); return }
      const resp = await hrApi.post<HrApiResponse<EmployeeDetail>>('/employees/promote', data)
      return resp.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employee', vars.employeeId] })
    },
  })
}

export function useTransferEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: TransferRequest) => {
      if (USE_MOCK) { await new Promise(r => setTimeout(r, 800)); return }
      const resp = await hrApi.post<HrApiResponse<EmployeeDetail>>('/employees/transfer', data)
      return resp.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employee', vars.employeeId] })
    },
  })
}

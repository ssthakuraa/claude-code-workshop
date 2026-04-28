import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse, HrPagedResponse } from '@/types/api'
import type { EmployeeSummary, EmployeeDetail, HireRequest, TerminateRequest, PromoteRequest, TransferRequest, EmployeeFilter } from '@/types/employee'

export function useEmployees(filters?: EmployeeFilter) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async (): Promise<HrPagedResponse<EmployeeSummary>> => {
      const params = {
        page: 0,
        size: 500,
        sort: 'lastName',
        ...filters,
      }
      const resp = await hrApi.get<HrPagedResponse<EmployeeSummary>>('/employees', params)
      return resp
    },
  })
}

export function useEmployee(id: number | undefined) {
  return useQuery({
    queryKey: ['employee', id],
    enabled: !!id,
    queryFn: async (): Promise<EmployeeDetail> => {
      const resp = await hrApi.get<HrApiResponse<EmployeeDetail>>(`/employees/${id}`)
      return resp.data
    },
  })
}

export function useHireEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: HireRequest) => {
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
      const resp = await hrApi.post<HrApiResponse<EmployeeDetail>>('/employees/transfer', data)
      return resp.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employee', vars.employeeId] })
    },
  })
}

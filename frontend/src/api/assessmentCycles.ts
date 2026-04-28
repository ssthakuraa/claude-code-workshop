import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export type AssessmentCyclePeriodType = 'ANNUAL' | 'HALF' | 'QUARTER'
export type AssessmentCycleStatus = 'PLANNED' | 'OPEN' | 'CLOSED'

export interface AssessmentCycle {
  cycleCode: string
  defaultLabel: string
  localizedLabel?: string
  periodType: AssessmentCyclePeriodType
  startDate: string
  endDate: string
  cycleStatus: AssessmentCycleStatus
  displayOrder: number
  active: boolean
  translations: Record<string, string>
}

export interface AssessmentCyclePayload {
  cycleCode: string
  defaultLabel: string
  periodType: AssessmentCyclePeriodType
  startDate: string
  endDate: string
  cycleStatus: AssessmentCycleStatus
  displayOrder: number
  active: boolean
  translations: Record<string, string>
}

export function useAssessmentCycles() {
  return useQuery({
    queryKey: ['assessment-cycles'],
    queryFn: async (): Promise<AssessmentCycle[]> => {
      const resp = await hrApi.get<HrApiResponse<AssessmentCycle[]>>('/assessment-cycles')
      return resp.data
    },
  })
}

export function useCreateAssessmentCycle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: AssessmentCyclePayload) => {
      const resp = await hrApi.post<HrApiResponse<AssessmentCycle>>('/assessment-cycles', data)
      return resp.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assessment-cycles'] })
    },
  })
}

export function useUpdateAssessmentCycle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ cycleCode, data }: { cycleCode: string; data: AssessmentCyclePayload }) => {
      const resp = await hrApi.put<HrApiResponse<AssessmentCycle>>(`/assessment-cycles/${cycleCode}`, data)
      return resp.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assessment-cycles'] })
    },
  })
}

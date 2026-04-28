import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export type AssessmentStatus = 'DRAFT' | 'SUBMITTED' | 'FINAL'
export type AssessmentPeriodType = 'QUARTER' | 'HALF' | 'ANNUAL'

export interface EmployeeAssessmentSummary {
  assessmentId: number
  cycleCode: string
  cycleLabel: string
  reviewStatus: AssessmentStatus
  reviewerName?: string | null
  reviewerJobTitle?: string | null
  updatedAt: string
  submittedAt?: string | null
}

export interface EmployeeAssessmentAvailableCycle {
  cycleCode: string
  cycleLabel: string
  periodType: AssessmentPeriodType
  startDate: string
  endDate: string
}

export interface EmployeeAssessmentDetail extends EmployeeAssessmentSummary {
  periodType: AssessmentPeriodType
  cycleStartDate: string
  cycleEndDate: string
  goalCompletionPct?: number | null
  competencyScore?: number | null
  employeeReflection?: string | null
  nextCyclePlan?: string | null
  managerFeedback?: string | null
  reviewerUserId?: number | null
}

export interface EmployeeAssessmentPayload {
  cycleCode?: string
  goalCompletionPct?: number | null
  competencyScore?: number | null
  employeeReflection?: string
  nextCyclePlan?: string
}

export function useMyAssessments() {
  return useQuery({
    queryKey: ['employee-assessments', 'mine'],
    queryFn: async (): Promise<EmployeeAssessmentSummary[]> => {
      const resp = await hrApi.get<HrApiResponse<EmployeeAssessmentSummary[]>>('/assessments/mine')
      return resp.data
    },
  })
}

export function useAvailableAssessmentCycles() {
  return useQuery({
    queryKey: ['employee-assessments', 'available-cycles'],
    queryFn: async (): Promise<EmployeeAssessmentAvailableCycle[]> => {
      const resp = await hrApi.get<HrApiResponse<EmployeeAssessmentAvailableCycle[]>>('/assessments/mine/available-cycles')
      return resp.data
    },
  })
}

export function useMyAssessment(assessmentId?: number) {
  return useQuery({
    queryKey: ['employee-assessments', 'mine', assessmentId],
    enabled: Number.isFinite(assessmentId),
    queryFn: async (): Promise<EmployeeAssessmentDetail> => {
      const resp = await hrApi.get<HrApiResponse<EmployeeAssessmentDetail>>(`/assessments/mine/${assessmentId}`)
      return resp.data
    },
  })
}

function invalidateAssessments(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['employee-assessments', 'mine'] })
  qc.invalidateQueries({ queryKey: ['employee-assessments', 'available-cycles'] })
}

export function useCreateAssessmentDraft() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: EmployeeAssessmentPayload) => {
      const resp = await hrApi.post<HrApiResponse<EmployeeAssessmentDetail>>('/assessments/mine', payload)
      return resp.data
    },
    onSuccess: (data) => {
      invalidateAssessments(qc)
      qc.invalidateQueries({ queryKey: ['employee-assessments', 'mine', data.assessmentId] })
    },
  })
}

export function useUpdateAssessmentDraft() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ assessmentId, payload }: { assessmentId: number; payload: EmployeeAssessmentPayload }) => {
      const resp = await hrApi.put<HrApiResponse<EmployeeAssessmentDetail>>(`/assessments/mine/${assessmentId}`, payload)
      return resp.data
    },
    onSuccess: (data) => {
      invalidateAssessments(qc)
      qc.invalidateQueries({ queryKey: ['employee-assessments', 'mine', data.assessmentId] })
    },
  })
}

export function useSubmitAssessmentDraft() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ assessmentId, payload }: { assessmentId: number; payload: EmployeeAssessmentPayload }) => {
      const resp = await hrApi.post<HrApiResponse<EmployeeAssessmentDetail>>(`/assessments/mine/${assessmentId}/submit`, payload)
      return resp.data
    },
    onSuccess: (data) => {
      invalidateAssessments(qc)
      qc.invalidateQueries({ queryKey: ['employee-assessments', 'mine', data.assessmentId] })
    },
  })
}

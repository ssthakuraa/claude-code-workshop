import { useQuery } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrPagedResponse } from '@/types/api'

export type AssessmentReviewStatus = 'DRAFT' | 'SUBMITTED' | 'FINAL'

export interface AssessmentDirectoryRow {
  assessmentId: number
  employeeId: number
  employeeName: string
  departmentId?: number | null
  departmentName?: string | null
  cycleCode: string
  cycleLabel: string
  reviewStatus: AssessmentReviewStatus
  goalCompletionPct?: number | null
  competencyScore?: number | null
  reviewerUserId?: number | null
  reviewerName?: string | null
  submittedAt?: string | null
  updatedAt: string
}

export interface AssessmentDirectoryFilters {
  page: number
  size: number
  search?: string
  status?: string
  cycleCode?: string
  departmentId?: number
  reviewerUserId?: number
}

export function useAssessmentsDirectory(filters: AssessmentDirectoryFilters) {
  return useQuery({
    queryKey: ['assessments-directory', filters],
    queryFn: async (): Promise<HrPagedResponse<AssessmentDirectoryRow>> => {
      const resp = await hrApi.get<HrPagedResponse<AssessmentDirectoryRow>>('/assessments', {
        page: Math.max(0, filters.page - 1),
        size: filters.size,
        search: filters.search || undefined,
        status: filters.status || undefined,
        cycleCode: filters.cycleCode || undefined,
        departmentId: filters.departmentId,
        reviewerUserId: filters.reviewerUserId,
      })
      return resp
    },
  })
}

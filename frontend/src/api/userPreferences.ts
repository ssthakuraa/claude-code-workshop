import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

export interface UserPreferences {
  language: string
  timezone: string
  dateFormat: 'short' | 'medium' | 'long'
  currency: string
}

export function useUserPreferences(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['user-preferences'],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<UserPreferences> => {
      const resp = await hrApi.get<HrApiResponse<UserPreferences>>('/users/me/preferences')
      return resp.data
    },
  })
}

export function useSaveUserPreferences() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: UserPreferences) => {
      const resp = await hrApi.patch<HrApiResponse<UserPreferences>>('/users/me/preferences', data)
      return resp.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-preferences'] })
    },
  })
}

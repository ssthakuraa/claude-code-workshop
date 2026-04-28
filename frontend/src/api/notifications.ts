import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import type { NotificationItem } from '@/components/hr/HrNotificationItem'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationItem[]> => {
      const resp = await hrApi.get<HrApiResponse<NotificationItem[]>>('/notifications')
      return resp.data
    },
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const resp = await hrApi.post<HrApiResponse<NotificationItem[]>>(`/notifications/${id}/read`)
      return resp.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const resp = await hrApi.post<HrApiResponse<NotificationItem[]>>('/notifications/read-all')
      return resp.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

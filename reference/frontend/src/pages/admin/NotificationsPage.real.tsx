// NotificationsPage — API-wired version (reference for Lab 3, Exercise 3)
// Students wire this to the real backend API after scaffolding the Notification entity

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import { HrNotificationItem } from '@/components/hr/HrNotificationItem'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const TYPES = {
  INFO: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  SUCCESS: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  WARNING: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  ALERT: { icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
}

interface HrNotificationDTO {
  notificationId: number
  notificationType: string
  title: string
  message: string | null
  isRead: boolean
  createdAt: string
}

function adapt(dto: HrNotificationDTO) {
  return {
    id: dto.notificationId,
    type: dto.notificationType as keyof typeof TYPES,
    title: dto.title,
    message: dto.message ?? '',
    read: dto.isRead,
    createdAt: dto.createdAt,
  }
}

export function NotificationsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<HrNotificationDTO[]> => {
      const resp = await hrApi.get<HrApiResponse<HrNotificationDTO[]>>('/notifications')
      return resp.data
    },
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await hrApi.put<HrApiResponse<null>>(`/notifications/${id}/mark-read`, {})
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await hrApi.put<HrApiResponse<null>>('/notifications/mark-all-read', {})
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const notifications = (data ?? []).map(adapt)
  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) {
    return (
      <div className="space-y-4">
        <HrSkeleton />
        <HrSkeleton />
        <HrSkeleton />
      </div>
    )
  }

  if (!notifications.length) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
        <p className="text-sm text-neutral-500">No notifications yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button type="button"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
        )}
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {notifications.map(n => (
          <HrNotificationItem
            key={n.id}
            notification={n}
            onMarkRead={() => markReadMutation.mutate(n.id)}
          />
        ))}
      </div>
    </div>
  )
}

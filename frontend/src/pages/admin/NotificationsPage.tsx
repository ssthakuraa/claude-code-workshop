import { useState } from 'react'
import { HrNotificationItem, type NotificationItem } from '@/components/hr/HrNotificationItem'

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, type: 'INFO', title: 'New hire onboarding', message: 'Alex Johnson has been hired as Software Developer. Please complete onboarding tasks.', createdAt: '2026-03-30T10:00:00', read: false },
  { id: 2, type: 'WARNING', title: '4 contracts expiring soon', message: 'There are 4 contract employees whose contracts expire within 30 days. Review and take action.', createdAt: '2026-03-29T14:30:00', read: false },
  { id: 3, type: 'SUCCESS', title: 'Promotion approved', message: 'Maria Garcia\'s promotion to Senior Analyst has been processed successfully.', createdAt: '2026-03-29T09:00:00', read: true },
  { id: 4, type: 'ALERT', title: 'Salary band exceeded', message: 'A recent salary update for employee #304 exceeds the job grade maximum by 15%.', createdAt: '2026-03-28T16:00:00', read: false },
  { id: 5, type: 'INFO', title: '19 employees on probation', message: 'Monthly reminder: 19 employees are currently on probation. Review performance.', createdAt: '2026-03-27T08:00:00', read: true },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead}
            className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
        )}
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {notifications.map(n => (
          <HrNotificationItem key={n.id} notification={n} onMarkRead={markRead} />
        ))}
      </div>
    </div>
  )
}

import { cn } from '@/utils/cn'
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export interface NotificationItem {
  id: number
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT'
  title: string
  message: string
  createdAt: string
  read: boolean
}

interface HrNotificationItemProps {
  notification: NotificationItem
  onMarkRead?: (id: number) => void
  onClick?: (id: number) => void
}

const TYPE_CONFIG = {
  INFO: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  SUCCESS: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  WARNING: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  ALERT: { icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
}

export function HrNotificationItem({ notification, onMarkRead, onClick }: HrNotificationItemProps) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.INFO
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 border-b border-neutral-100 transition-colors cursor-pointer',
        notification.read ? 'bg-white hover:bg-neutral-50' : 'bg-blue-50/40 hover:bg-blue-50/60',
      )}
      onClick={() => onClick?.(notification.id)}
    >
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', config.bg)}>
        <Icon size={15} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className={cn('text-sm font-medium text-neutral-800', !notification.read && 'font-semibold')}>
            {notification.title}
          </div>
          {!notification.read && onMarkRead && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onMarkRead(notification.id) }}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex-shrink-0 whitespace-nowrap"
            >
              Mark read
            </button>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notification.message}</p>
        <div className="text-[10px] text-neutral-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</div>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
      )}
    </div>
  )
}

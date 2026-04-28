import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { formatDateTime } from '@/utils/formatters'

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
  INFO: { icon: Info, color: 'text-[color:var(--hr-shell-accent)]', bg: 'bg-[color:var(--hr-shell-accent-soft)]' },
  SUCCESS: { icon: CheckCircle, color: 'text-[color:var(--color-success-600)]', bg: 'bg-[color:var(--color-success-50)]' },
  WARNING: { icon: AlertTriangle, color: 'text-[color:var(--color-warning-600)]', bg: 'bg-[color:var(--color-warning-50)]' },
  ALERT: { icon: Bell, color: 'text-[color:var(--color-error-600)]', bg: 'bg-[color:var(--color-error-50)]' },
}

export function HrNotificationItem({ notification, onMarkRead, onClick }: HrNotificationItemProps) {
  const { t } = useTranslation(['common'])
  const preferences = useHrDisplayPreferences()
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.INFO
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex cursor-pointer items-start gap-3 border-b border-[color:var(--hr-border-subtle)] px-4 py-4 transition-colors',
        notification.read
          ? 'bg-white hover:bg-[color:var(--hr-surface-muted)]'
          : 'bg-[linear-gradient(90deg,rgba(44,105,117,0.08),rgba(44,105,117,0.03)_55%,rgba(255,255,255,1))] hover:bg-[color:var(--hr-shell-accent-soft)]/70',
      )}
      onClick={() => onClick?.(notification.id)}
    >
      <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-black/5', config.bg)}>
        <Icon size={15} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className={cn('text-sm font-medium text-[color:var(--hr-text)]', !notification.read && 'font-semibold')}>
            {notification.title}
          </div>
          {!notification.read && onMarkRead && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={e => { e.stopPropagation(); onMarkRead(notification.id) }}
              className="h-auto min-h-0 flex-shrink-0 whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
            >
              {t('markRead', { ns: 'common' })}
            </Button>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[color:var(--hr-text-muted)]">{notification.message}</p>
        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[color:var(--hr-text-subtle)]">
          {formatDateTime(notification.createdAt, preferences.formattingLocale, 'medium', preferences.timezone)}
        </div>
      </div>
      {!notification.read && (
        <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[color:var(--hr-shell-accent)] shadow-[0_0_0_4px_rgba(44,105,117,0.12)]" />
      )}
    </div>
  )
}

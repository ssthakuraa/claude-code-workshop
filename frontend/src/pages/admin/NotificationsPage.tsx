import { useTranslation } from 'react-i18next'
import { HrNotificationItem } from '@/components/hr/HrNotificationItem'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/api/notifications'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

export function NotificationsPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { data: notifications, isLoading, isError } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const entries = notifications ?? []

  const unreadCount = entries.filter(n => !n.read).length

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('notifications.title', { ns: 'admin' })}
        subtitle={t('notifications.subtitle', { ns: 'admin' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('notifications.title', { ns: 'admin' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        actions={unreadCount > 0 ? (
          <Button type="button" variant="secondary" size="sm" onClick={() => markAllRead.mutate()} loading={markAllRead.isPending}>
            {t('notifications.markAllRead', { ns: 'admin' })}
          </Button>
        ) : undefined}
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="hr-app-surface-elevated h-full overflow-auto rounded-[1.15rem]">
          {isError && <div className="p-4 text-sm text-[color:var(--color-error-600)]">{t('notifications.loadFailed', { ns: 'admin' })}</div>}
          {isLoading && <div className="p-4 text-sm text-[color:var(--hr-text-subtle)]">{t('loading', { ns: 'common' })}</div>}
          {!isLoading && !isError && entries.length === 0 && (
            <div className="p-6 text-sm text-[color:var(--hr-text-subtle)]">{t('notifications.empty', { ns: 'admin' })}</div>
          )}
          {entries.map(n => (
            <HrNotificationItem key={n.id} notification={n} onMarkRead={(id) => markRead.mutate(id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

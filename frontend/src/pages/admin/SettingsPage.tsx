import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { HrLanguageSelector, DEFAULT_LANGUAGES } from '@/components/hr/i18n/HrLanguageSelector'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { useUserPreferences, useSaveUserPreferences, type UserPreferences } from '@/api/userPreferences'
import { useNotifications } from '@/api/notifications'
import { PageHeader } from '@/components/ui/PageHeader'
import { translateApiError } from '@/i18n/errorMessages'

const DEFAULT_PREFS: UserPreferences = {
  language: 'en-US',
  timezone: 'America/Los_Angeles',
  dateFormat: 'medium',
  currency: 'USD',
}

function SelectField({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[color:var(--hr-text-muted)]">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="hr-app-select w-full px-3 text-sm"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function SettingsPage() {
  const { t, i18n } = useTranslation(['common', 'settings', 'errors'])
  const { user } = useAuth()
  const { data: savedPrefs, isLoading } = useUserPreferences()
  const savePreferences = useSaveUserPreferences()
  const { data: notifications } = useNotifications()
  const basePrefs = savedPrefs ?? DEFAULT_PREFS
  const [draftPrefs, setDraftPrefs] = useState<UserPreferences | null>(null)
  const prefs = draftPrefs ?? basePrefs
  const dirty = useMemo(() => {
    if (!draftPrefs) {
      return false
    }
    return JSON.stringify(draftPrefs) !== JSON.stringify(basePrefs)
  }, [basePrefs, draftPrefs])

  const set = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setDraftPrefs(current => ({
      ...(current ?? basePrefs),
      [key]: value,
    }))
  }

  const handleSave = async () => {
    try {
      await savePreferences.mutateAsync(prefs)
      setDraftPrefs(null)
      void i18n.changeLanguage(prefs.language)
      toast.success(t('common:saveChanges'))
    } catch (error) {
      toast.error(translateApiError(error as { message?: string; errorCode?: string }, i18n.resolvedLanguage ?? 'en-US').message)
    }
  }

  const handleCancel = () => {
    setDraftPrefs(null)
  }

  const unreadCount = (notifications ?? []).filter(n => !n.read).length
  const latestNotification = notifications?.[0]
  const timezones = [
    { value: 'America/Los_Angeles', label: t('settings:options.timezones.America_Los_Angeles') },
    { value: 'America/Chicago', label: t('settings:options.timezones.America_Chicago') },
    { value: 'America/New_York', label: t('settings:options.timezones.America_New_York') },
    { value: 'America/Mexico_City', label: t('settings:options.timezones.America_Mexico_City') },
    { value: 'America/Toronto', label: t('settings:options.timezones.America_Toronto') },
    { value: 'Europe/London', label: t('settings:options.timezones.Europe_London') },
    { value: 'Europe/Dublin', label: t('settings:options.timezones.Europe_Dublin') },
    { value: 'Europe/Paris', label: t('settings:options.timezones.Europe_Paris') },
    { value: 'Europe/Berlin', label: t('settings:options.timezones.Europe_Berlin') },
    { value: 'Europe/Amsterdam', label: t('settings:options.timezones.Europe_Amsterdam') },
    { value: 'Asia/Kolkata', label: t('settings:options.timezones.Asia_Kolkata') },
    { value: 'Asia/Singapore', label: t('settings:options.timezones.Asia_Singapore') },
  ]
  const dateFormats = [
    { value: 'medium', label: t('settings:options.dateFormats.medium') },
    { value: 'short', label: t('settings:options.dateFormats.short') },
    { value: 'long', label: t('settings:options.dateFormats.long') },
  ]
  const currencies = [
    { value: 'USD', label: t('settings:options.currencies.USD') },
    { value: 'EUR', label: t('settings:options.currencies.EUR') },
    { value: 'GBP', label: t('settings:options.currencies.GBP') },
    { value: 'INR', label: t('settings:options.currencies.INR') },
    { value: 'MXN', label: t('settings:options.currencies.MXN') },
    { value: 'CAD', label: t('settings:options.currencies.CAD') },
    { value: 'AUD', label: t('settings:options.currencies.AUD') },
    { value: 'BRL', label: t('settings:options.currencies.BRL') },
    { value: 'CHF', label: t('settings:options.currencies.CHF') },
    { value: 'DKK', label: t('settings:options.currencies.DKK') },
    { value: 'JPY', label: t('settings:options.currencies.JPY') },
    { value: 'SGD', label: t('settings:options.currencies.SGD') },
  ]

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('settings:title')}
        subtitle={t('settings:subtitle')}
        breadcrumbs={[
          { label: t('settings:dashboardCrumb'), href: '/hr/dashboard' },
          { label: t('settings:title') },
        ]}
        surface="plain"
        className="mb-3 gap-2"
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="space-y-3">
          {isLoading && <p className="text-sm text-neutral-500">{t('common:loadingPreferences')}</p>}

          <Card variant="elevated">
            <CardHeader><CardTitle>{t('common:profile')}</CardTitle></CardHeader>
            <CardContent>
              <div className="hr-entity-banner">
                <Avatar name={user?.fullName ?? user?.username} size="xl" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-[color:var(--hr-text)]">{user?.fullName}</span>
                    <span className="text-sm text-[color:var(--hr-text-muted)]">@{user?.username}</span>
                    {user?.role && (
                      <span className="rounded-full border border-[color:var(--hr-border-subtle)] bg-white px-2 py-0.5 text-xs font-medium capitalize text-[color:var(--hr-text-subtle)]">
                        {t(`common:roles.${user.role}`)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader><CardTitle>{t('common:preferences')}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[color:var(--hr-text-muted)]">{t('common:language')}</label>
                  <div className="w-full">
                    <HrLanguageSelector
                      currentLanguage={prefs.language}
                      languages={DEFAULT_LANGUAGES}
                      onChange={v => set('language', v)}
                      className="w-full"
                    />
                  </div>
                </div>

                <SelectField label={t('common:timezone')} value={prefs.timezone}
                  onChange={v => set('timezone', v)} options={timezones} />
                <SelectField label={t('common:dateFormat')} value={prefs.dateFormat}
                  onChange={v => set('dateFormat', v as UserPreferences['dateFormat'])} options={dateFormats} />
                <SelectField label={t('common:currency')} value={prefs.currency}
                  onChange={v => set('currency', v)} options={currencies} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader><CardTitle>{t('common:notificationSummary')}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[color:var(--hr-text-muted)]">{t('common:unreadNotifications')}</span>
                  <span className="font-medium text-[color:var(--hr-text)]">{unreadCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[color:var(--hr-text-muted)]">{t('common:totalNotifications')}</span>
                  <span className="font-medium text-[color:var(--hr-text)]">{notifications?.length ?? 0}</span>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-[color:var(--hr-text)]">{t('common:latestNotification')}</p>
                  <p className="text-[color:var(--hr-text)]">{latestNotification?.title ?? t('common:noNotificationsAvailable')}</p>
                  {latestNotification?.message && (
                    <p className="mt-0.5 text-[color:var(--hr-text-subtle)]">{latestNotification.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={!dirty}>
              {t('common:cancel')}
            </Button>
            <Button type="button" onClick={handleSave} disabled={!dirty} loading={savePreferences.isPending}>
              {t('common:saveChanges')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

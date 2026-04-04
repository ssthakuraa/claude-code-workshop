import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { HrLanguageSelector, DEFAULT_LANGUAGES } from '@/components/hr/i18n/HrLanguageSelector'
import { HrCurrencyDisplay } from '@/components/hr/i18n/HrCurrencyDisplay'
import { HrDateDisplay } from '@/components/hr/i18n/HrDateDisplay'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
]

const DATE_FORMATS = [
  { value: 'medium', label: 'Mar 30, 2026' },
  { value: 'short', label: '3/30/26' },
  { value: 'long', label: 'March 30, 2026' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD – US Dollar' },
  { value: 'EUR', label: 'EUR – Euro' },
  { value: 'GBP', label: 'GBP – British Pound' },
  { value: 'INR', label: 'INR – Indian Rupee' },
  { value: 'MXN', label: 'MXN – Mexican Peso' },
]

interface Prefs {
  language: string
  timezone: string
  dateFormat: 'short' | 'medium' | 'long'
  currency: string
  emailProbation: boolean
  emailContracts: boolean
}

const DEFAULT_PREFS: Prefs = {
  language: 'en-US',
  timezone: 'America/Los_Angeles',
  dateFormat: 'medium',
  currency: 'USD',
  emailProbation: true,
  emailContracts: true,
}

const PREFS_KEY = 'hr_user_prefs'

function loadPrefs(): Prefs {
  try {
    const stored = localStorage.getItem(PREFS_KEY)
    if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) }
  } catch { /* ignore */ }
  return DEFAULT_PREFS
}

function SelectField({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-neutral-600 min-w-[140px]">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 max-w-xs rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function SettingsPage() {
  const { user } = useAuth()
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs)
  const [dirty, setDirty] = useState(false)

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs(p => ({ ...p, [key]: value }))
    setDirty(true)
  }

  const handleSave = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    // TODO: PATCH /app/hr/api/v1/users/me/preferences when backend endpoint exists
    setDirty(false)
    toast.success('Preferences saved')
  }

  const handleCancel = () => {
    setPrefs(loadPrefs())
    setDirty(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700 flex-shrink-0">
              {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'U'}
            </div>
            <div>
              <div className="font-semibold text-neutral-800">{user?.fullName}</div>
              <div className="text-sm text-neutral-500">@{user?.username}</div>
              <div className="text-xs text-neutral-400 mt-0.5 capitalize">
                {user?.role?.replace(/_/g, ' ').toLowerCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-neutral-600 min-w-[140px]">Language</span>
              <div className="flex-1 max-w-xs">
                <HrLanguageSelector
                  currentLanguage={prefs.language}
                  languages={DEFAULT_LANGUAGES}
                  onChange={v => set('language', v)}
                />
              </div>
            </div>

            <SelectField label="Timezone" value={prefs.timezone}
              onChange={v => set('timezone', v)} options={TIMEZONES} />
            <SelectField label="Date Format" value={prefs.dateFormat}
              onChange={v => set('dateFormat', v as Prefs['dateFormat'])} options={DATE_FORMATS} />
            <SelectField label="Currency" value={prefs.currency}
              onChange={v => set('currency', v)} options={CURRENCIES} />

            {/* Live preview — updates in real-time as dropdowns change */}
            <div className="mt-2 rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Live Preview</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-700">
                <span>Date: <strong>
                  <HrDateDisplay value={new Date()} format={prefs.dateFormat} locale={prefs.language} />
                </strong></span>
                <span>Salary: <strong>
                  <HrCurrencyDisplay value={24000} currency={prefs.currency} locale={prefs.language} />
                </strong></span>
                <span>Number: <strong>
                  {new Intl.NumberFormat(prefs.language).format(1234567.89)}
                </strong></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {([
              { key: 'emailProbation', label: 'Email me about probation ending alerts' },
              { key: 'emailContracts', label: 'Email me about contract expiry alerts' },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={e => set(key, e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-neutral-700">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={handleCancel} disabled={!dirty}
          className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={!dirty}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

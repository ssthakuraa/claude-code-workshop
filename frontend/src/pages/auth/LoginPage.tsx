import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { translateApiError } from '@/i18n/errorMessages'

export function LoginPage() {
  const { t, i18n } = useTranslation(['auth', 'common', 'errors'])
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) return <Navigate to="/hr/dashboard" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ username, password })
      navigate('/hr/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(translateApiError(err as { message?: string; errorCode?: string }, i18n.resolvedLanguage ?? 'en-US').message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(44,105,117,0.15),transparent_26%),linear-gradient(180deg,#fcfbf9_0%,#f5f4f1_48%,#ece8e1_100%)] p-4">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden rounded-[1.75rem] border border-white/60 bg-[linear-gradient(160deg,rgba(44,105,117,0.95),rgba(30,84,97,0.94)_40%,rgba(31,29,27,0.96)_100%)] p-8 text-white shadow-[0_28px_70px_rgba(31,29,27,0.2)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/88">
              <ShieldCheck size={15} />
              {t('auth:panelBadge')}
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-[-0.03em] text-white">{t('auth:panelTitle')}</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/72">
              {t('auth:panelSubtitle')}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">{t('common:trainingEnvironment')}</p>
              <p className="mt-2 text-lg font-semibold">{t('auth:environmentTitle')}</p>
              <p className="mt-1 text-sm text-white/70">{t('auth:environmentBody')}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">{t('common:workflows')}</p>
              <p className="mt-2 text-lg font-semibold">{t('auth:focusTitle')}</p>
              <p className="mt-1 text-sm text-white/70">{t('auth:focusBody')}</p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[1.75rem] border border-[color:var(--hr-border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,249,0.96))] p-6 shadow-[0_24px_60px_rgba(31,29,27,0.12)] sm:p-8">
          <div className="mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(180deg,var(--hr-shell-accent),var(--hr-shell-accent-strong))] text-xl font-bold text-white shadow-[0_14px_28px_rgba(44,105,117,0.22)]">
              HR
            </div>
            <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-shell-accent)]">
              <Sparkles size={14} />
              {t('auth:eyebrow')}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--hr-text)]">{t('auth:title')}</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--hr-text-muted)]">{t('auth:subtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 rounded-[0.9rem] border border-[color:var(--color-error-200)] bg-[color:var(--color-error-50)] px-4 py-3 text-sm text-[color:var(--color-error-700)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="hr-field-label">
                {t('auth:username')}
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={t('auth:usernamePlaceholder')}
                className="hr-app-input w-full px-3"
              />
            </div>

            <div>
              <label htmlFor="password" className="hr-field-label">
                {t('auth:password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('auth:passwordPlaceholder')}
                  className="hr-app-input w-full px-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[color:var(--hr-text-subtle)] transition-colors hover:bg-[color:var(--hr-surface-emphasis)] hover:text-[color:var(--hr-text)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !username || !password}
              loading={loading}
              fullWidth
              className="justify-center"
            >
              {t('auth:eyebrow')}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[color:var(--hr-border-subtle)] pt-4 text-xs text-[color:var(--hr-text-subtle)]">
            <span>{t('common:trainingEnvironment')}</span>
            <button type="button" className="font-semibold text-[color:var(--hr-shell-accent)] transition-colors hover:text-[color:var(--hr-shell-accent-strong)]">
              {t('common:forgotPassword')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

export function UnauthorizedPage() {
  const { t } = useTranslation(['errors', 'common'])
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.08),transparent_24%),linear-gradient(180deg,#fcfbf9_0%,#f5f4f1_58%,#ece8e1_100%)] p-4">
      <div className="w-full max-w-lg rounded-[1.6rem] border border-[color:var(--hr-border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,249,0.96))] p-8 text-center shadow-[0_24px_60px_rgba(31,29,27,0.12)]">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[1.3rem] border border-[color:var(--color-error-100)] bg-[color:var(--color-error-50)]">
          <ShieldX size={28} className="text-[color:var(--color-error-600)]" />
        </div>
        <p className="hr-form-eyebrow">{t('errors:unauthorizedEyebrow')}</p>
        <h1 className="mb-2 mt-3 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--hr-text)]">{t('errors:unauthorizedTitle')}</h1>
        <p className="mb-6 text-sm leading-6 text-[color:var(--hr-text-muted)]">{t('errors:unauthorizedBody')}</p>
        <Button onClick={() => navigate('/hr/dashboard')}>
          {t('common:goToDashboard')}
        </Button>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const { t } = useTranslation(['errors', 'common'])
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(44,105,117,0.08),transparent_24%),linear-gradient(180deg,#fcfbf9_0%,#f5f4f1_58%,#ece8e1_100%)] p-4">
      <div className="w-full max-w-lg rounded-[1.6rem] border border-[color:var(--hr-border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,249,0.96))] p-8 text-center shadow-[0_24px_60px_rgba(31,29,27,0.12)]">
        <div className="mb-4 text-7xl font-semibold tracking-[-0.05em] text-[color:var(--hr-border-strong)]">404</div>
        <p className="hr-form-eyebrow">{t('errors:notFoundEyebrow')}</p>
        <h1 className="mb-2 mt-3 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--hr-text)]">{t('errors:notFoundTitle')}</h1>
        <p className="mb-6 text-sm leading-6 text-[color:var(--hr-text-muted)]">{t('errors:notFoundBody')}</p>
        <Button onClick={() => navigate('/hr/dashboard')}>
          {t('common:goToDashboard')}
        </Button>
      </div>
    </div>
  )
}

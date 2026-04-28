import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'

export interface WizardStep {
  id: string
  label: string
  description?: string
}

interface HrWizardProps {
  steps: WizardStep[]
  currentStep: number
  children: React.ReactNode
  onNext?: () => void
  onBack?: () => void
  onSubmit?: () => void
  nextLabel?: string
  submitLabel?: string
  loading?: boolean
  nextDisabled?: boolean
}

export function HrWizard({
  steps,
  currentStep,
  children,
  onNext,
  onBack,
  onSubmit,
  nextLabel,
  submitLabel,
  loading,
  nextDisabled,
}: HrWizardProps) {
  const { t } = useTranslation(['common'])
  const isLast = currentStep === steps.length - 1
  const isFirst = currentStep === 0

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="mb-3 rounded-[0.8rem] border border-[color:var(--hr-border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(237,246,247,0.58))] px-2.5 py-2 sm:px-3">
        <div className="flex items-start justify-between gap-2 overflow-x-auto">
        {steps.map((step, i) => {
          const isDone = i < currentStep
          const isActive = i === currentStep
          return (
            <div key={step.id} className="flex min-w-[6rem] flex-1 items-start">
              <div className="flex flex-col items-center text-center">
                <div className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-all',
                  isDone && 'border-[color:var(--hr-shell-accent)] bg-[color:var(--hr-shell-accent)] text-white shadow-[0_8px_18px_rgba(44,105,117,0.16)]',
                  isActive && 'border-[color:var(--hr-shell-accent)] bg-white text-[color:var(--hr-shell-accent)] shadow-[0_0_0_3px_rgba(44,105,117,0.08)]',
                  !isDone && !isActive && 'border-[color:var(--hr-border-strong)] bg-white text-[color:var(--hr-text-subtle)]',
                )}>
                  {isDone ? <Check size={13} /> : i + 1}
                </div>
                <div className="mt-0.5 text-center">
                  <div className={cn(
                    'text-[10px] font-semibold uppercase tracking-[0.16em] leading-tight',
                    isActive ? 'text-[color:var(--hr-shell-accent-strong)]' : isDone ? 'text-[color:var(--hr-text)]' : 'text-[color:var(--hr-text-subtle)]',
                  )}>
                    {step.label}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'mx-1.5 mt-3.5 h-px flex-1 transition-colors',
                  i < currentStep ? 'bg-[color:var(--hr-shell-accent)]' : 'bg-[color:var(--hr-border-subtle)]',
                )} />
              )}
            </div>
          )
        })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-3.5 flex items-center justify-between border-t border-[color:var(--hr-border-subtle)] pt-3.5">
        <Button variant="secondary" onClick={onBack} disabled={isFirst || loading}>
          {t('back', { ns: 'common' })}
        </Button>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-[color:var(--hr-text-subtle)] sm:inline">
            {t('stepOf', { ns: 'common', current: currentStep + 1, total: steps.length })}
          </span>
          {isLast ? (
            <Button variant="primary" onClick={onSubmit} loading={loading} disabled={nextDisabled}>
              {submitLabel ?? t('submit', { ns: 'common' })}
            </Button>
          ) : (
            <Button variant="primary" onClick={onNext} disabled={nextDisabled || loading}>
              {nextLabel ?? t('next', { ns: 'common' })}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

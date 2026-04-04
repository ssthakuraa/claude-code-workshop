/**
 * WizardTemplate — multi-step guided process.
 * Used for: Lease creation, onboarding, work order submission.
 */
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../ui/Button'

export interface WizardStep {
  id: string
  label: string
  description?: string
  content: ReactNode
}

export interface WizardTemplateProps {
  steps: WizardStep[]
  activeStep: number         // 0-indexed
  onNext?: () => void
  onBack?: () => void
  onFinish?: () => void
  onCancel?: () => void
  nextLabel?: string
  finishLabel?: string
  loading?: boolean
  title?: string
  className?: string
}

export function WizardTemplate({ steps, activeStep, onNext, onBack, onFinish, onCancel, nextLabel = 'Next', finishLabel = 'Finish', loading, title, className }: WizardTemplateProps) {
  const isFirst = activeStep === 0
  const isLast = activeStep === steps.length - 1
  const current = steps[activeStep]

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {title && <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>}

      {/* Step indicators */}
      <div className="flex items-center gap-0">
        {steps.map((step, idx) => {
          const isDone = idx < activeStep
          const isActive = idx === activeStep
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2 shrink-0">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                  isDone ? 'bg-primary-600 border-primary-600 text-white' :
                  isActive ? 'border-primary-600 text-primary-600 bg-white' :
                  'border-neutral-300 text-neutral-400 bg-white',
                )}>
                  {isDone ? <Check size={14} /> : <span>{idx + 1}</span>}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className={cn('text-xs font-semibold', isActive ? 'text-primary-700' : isDone ? 'text-neutral-600' : 'text-neutral-400')}>{step.label}</span>
                  {step.description && <span className="text-xs text-neutral-400">{step.description}</span>}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={cn('flex-1 h-px mx-3', idx < activeStep ? 'bg-primary-500' : 'bg-neutral-200')} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="flex-1">{current?.content}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
        <div>
          {onCancel && <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>}
        </div>
        <div className="flex items-center gap-2">
          {!isFirst && <Button variant="secondary" onClick={onBack} disabled={loading}>Back</Button>}
          {isLast
            ? <Button variant="primary" onClick={onFinish} loading={loading}>{finishLabel}</Button>
            : <Button variant="primary" onClick={onNext} loading={loading}>{nextLabel}</Button>
          }
        </div>
      </div>
    </div>
  )
}

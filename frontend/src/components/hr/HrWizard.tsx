import { Check } from 'lucide-react'
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
  nextLabel = 'Next',
  submitLabel = 'Submit',
  loading,
  nextDisabled,
}: HrWizardProps) {
  const isLast = currentStep === steps.length - 1
  const isFirst = currentStep === 0

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-1">
        {steps.map((step, i) => {
          const isDone = i < currentStep
          const isActive = i === currentStep
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors text-sm font-medium',
                  isDone && 'bg-blue-600 border-blue-600 text-white',
                  isActive && 'border-blue-600 text-blue-600 bg-white',
                  !isDone && !isActive && 'border-neutral-300 text-neutral-400 bg-white',
                )}>
                  {isDone ? <Check size={14} /> : i + 1}
                </div>
                <div className="mt-1.5 text-center">
                  <div className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-blue-600' : isDone ? 'text-neutral-700' : 'text-neutral-400',
                  )}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-[10px] text-neutral-400 hidden sm:block">{step.description}</div>
                  )}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-3 mb-6 transition-colors',
                  i < currentStep ? 'bg-blue-600' : 'bg-neutral-200',
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-200 mt-6">
        <Button variant="secondary" onClick={onBack} disabled={isFirst || loading}>
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Step {currentStep + 1} of {steps.length}</span>
          {isLast ? (
            <Button variant="primary" onClick={onSubmit} loading={loading} disabled={nextDisabled}>
              {submitLabel}
            </Button>
          ) : (
            <Button variant="primary" onClick={onNext} disabled={nextDisabled || loading}>
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

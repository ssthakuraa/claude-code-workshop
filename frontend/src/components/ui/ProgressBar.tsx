import { cn } from '@/utils/cn'

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral'

export interface ProgressBarProps {
  value: number         // 0–100
  max?: number
  variant?: ProgressBarVariant
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showValue?: boolean
  className?: string
  animated?: boolean
}

const trackHeight = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
const fillColor: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error:   'bg-error-500',
  neutral: 'bg-neutral-400',
}

export function ProgressBar({ value, max = 100, variant = 'primary', size = 'md', label, showValue, className, animated }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-neutral-700 font-medium">{label}</span>}
          {showValue && <span className="text-neutral-500">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-neutral-100 overflow-hidden', trackHeight[size])}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{ width: `${pct}%` }}
          className={cn('h-full rounded-full transition-all duration-500', fillColor[variant], animated && 'animate-pulse')}
        />
      </div>
    </div>
  )
}

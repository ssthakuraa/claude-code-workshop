import { cn } from '@/utils/cn'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  dismissible?: boolean
  className?: string
}

const configs: Record<AlertVariant, { icon: ReactNode; container: string; title: string }> = {
  info:    { icon: <Info size={16} />,          container: 'bg-info-50 border-info-200 text-info-700',       title: 'font-semibold text-info-800' },
  success: { icon: <CheckCircle size={16} />,   container: 'bg-success-50 border-success-200 text-success-700', title: 'font-semibold text-success-800' },
  warning: { icon: <AlertTriangle size={16} />, container: 'bg-warning-50 border-warning-200 text-warning-700', title: 'font-semibold text-warning-800' },
  error:   { icon: <AlertCircle size={16} />,   container: 'bg-error-50 border-error-200 text-error-700',    title: 'font-semibold text-error-800' },
}

export function Alert({ variant = 'info', title, children, dismissible, className }: AlertProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  const cfg = configs[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-lg border p-3 text-sm',
        cfg.container,
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <p className={cn('mb-0.5', cfg.title)}>{title}</p>}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

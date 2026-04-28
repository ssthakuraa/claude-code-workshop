import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface HrAnalyticsPanelProps {
  title: string
  subtitle?: string
  eyebrow?: string
  action?: ReactNode
  emphasis?: 'default' | 'accent'
  children: ReactNode
  className?: string
  contentClassName?: string
  compact?: boolean
}

export function HrAnalyticsPanel({
  title,
  subtitle,
  eyebrow,
  action,
  emphasis = 'default',
  children,
  className,
  contentClassName,
  compact = false,
}: HrAnalyticsPanelProps) {
  return (
    <section
      className={cn(
        'rounded-[1.15rem] border shadow-[var(--shadow-sm)]',
        compact ? 'p-3 sm:p-3.5' : 'p-4 sm:p-5',
        emphasis === 'accent'
          ? 'border-[color:var(--hr-border-subtle)] bg-[linear-gradient(180deg,rgba(237,246,247,0.9),rgba(255,255,255,0.98))]'
          : 'border-[color:var(--hr-border-subtle)] bg-white',
        className,
      )}
    >
      <div className={cn('flex flex-col sm:flex-row sm:items-start sm:justify-between', compact ? 'mb-3 gap-2' : 'mb-4 gap-3')}>
        <div className={cn(compact ? 'space-y-0.5' : 'space-y-1')}>
          {eyebrow && (
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[color:var(--hr-shell-accent)]">
              {eyebrow}
            </p>
          )}
          <h2 className={cn('font-semibold text-[color:var(--hr-text)]', compact ? 'text-[15px]' : 'text-base')}>{title}</h2>
          {subtitle && <p className={cn('text-[color:var(--hr-text-muted)]', compact ? 'text-[12px] leading-4' : 'text-sm')}>{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      <div className={cn(contentClassName)}>{children}</div>
    </section>
  )
}

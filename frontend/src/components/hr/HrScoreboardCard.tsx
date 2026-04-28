import type { ComponentType, KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface HrScoreboardCardProps {
  title: string
  value: string | number
  eyebrow?: string
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    variant: 'success' | 'danger' | 'warning' | 'info'
  }
  detail?: string
  icon?: ComponentType<{ size?: number; className?: string }>
  loading?: boolean
  onClick?: () => void
  status?: {
    label: string
    variant: 'warning' | 'danger' | 'info' | 'success'
  }
  compact?: boolean
}

function handleKeyboardActivate(event: KeyboardEvent<HTMLDivElement>, onClick?: () => void) {
  if (!onClick) {
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick()
  }
}

const TREND_COLORS: Record<string, string> = {
  success: 'text-green-600 bg-green-50',
  danger: 'text-red-600 bg-red-50',
  warning: 'text-amber-600 bg-amber-50',
  info: 'text-[color:var(--hr-shell-accent-strong)] bg-[color:var(--hr-shell-accent-soft)]',
}

const STATUS_STYLES: Record<NonNullable<HrScoreboardCardProps['status']>['variant'], { icon: ComponentType<{ size?: number; className?: string }>; classes: string }> = {
  success: {
    icon: CheckCircle2,
    classes: 'border border-green-200 bg-green-50 text-green-700',
  },
  danger: {
    icon: AlertCircle,
    classes: 'border border-red-200 bg-red-50 text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border border-amber-200 bg-amber-50 text-amber-700',
  },
  info: {
    icon: Info,
    classes: 'border border-[color:var(--hr-shell-accent)]/20 bg-[color:var(--hr-shell-accent-soft)] text-[color:var(--hr-shell-accent-strong)]',
  },
}

export function HrScoreboardCard({ title, value, eyebrow, subtitle, trend, detail, icon: Icon, loading, onClick, status, compact = false }: HrScoreboardCardProps) {
  const { t } = useTranslation(['common'])
  if (loading) {
    return (
      <div className={cn('animate-pulse rounded-[1.15rem] border border-[color:var(--hr-border-subtle)] bg-white shadow-[var(--shadow-sm)]', compact ? 'p-3' : 'p-4')}>
        <div className={cn('h-3 w-24 rounded bg-neutral-200', compact ? 'mb-2' : 'mb-3')} />
        <div className={cn('h-4 w-3/4 rounded bg-neutral-200', compact ? 'mb-2' : 'mb-3')} />
        <div className={cn('w-1/2 rounded bg-neutral-200', compact ? 'mb-2 h-8' : 'mb-3 h-9')} />
        <div className="h-3 w-1/3 rounded bg-neutral-200" />
      </div>
    )
  }

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus
  const StatusIcon = status ? STATUS_STYLES[status.variant].icon : null

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[1.15rem] border border-[color:var(--hr-border-subtle)] bg-white shadow-[var(--shadow-sm)] transition-all',
        compact ? 'p-2.5' : 'p-4',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:border-[color:var(--hr-shell-accent)] hover:shadow-[var(--shadow-md)]',
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? title : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={event => handleKeyboardActivate(event, onClick)}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--hr-shell-accent),rgba(44,105,117,0.18))]" />

      <div className={cn('flex items-start justify-between gap-3', compact ? 'mb-2.5' : 'mb-4')}>
        <div className={cn(compact ? 'space-y-0' : 'space-y-1')}>
          {eyebrow && (
            <p className={cn('font-semibold tracking-[0.08em] text-[color:var(--hr-text-subtle)]', compact ? 'text-[10px]' : 'text-[11px]')}>
              {eyebrow}
            </p>
          )}
          <span className={cn('block font-medium leading-tight text-neutral-600', compact ? 'text-[13px]' : 'text-sm')}>{title}</span>
        </div>
        {Icon && (
          <div className={cn(
            'flex flex-shrink-0 items-center justify-center rounded-xl bg-[color:var(--hr-shell-accent-soft)] text-[color:var(--hr-shell-accent)]',
            compact ? 'h-7.5 w-7.5' : 'h-10 w-10',
          )}>
            <Icon size={compact ? 14 : 18} className="text-[color:var(--hr-shell-accent)]" />
          </div>
        )}
      </div>

      <div className={cn('flex items-end justify-between gap-3', compact ? 'mb-1.5' : 'mb-3')}>
        <div>
          <div className={cn('font-semibold leading-none tracking-[-0.03em] text-neutral-900', compact ? 'text-[1.55rem]' : 'text-[2rem]')}>{value}</div>
          {subtitle && <span className={cn('block text-neutral-500', compact ? 'mt-0.5 text-[10px]' : 'mt-1 text-xs')}>{subtitle}</span>}
        </div>
        {detail && <div className={cn('text-right font-medium tracking-[0.08em] text-[color:var(--hr-text-subtle)]', compact ? 'text-[9px]' : 'text-[11px]')}>{detail}</div>}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {trend && (
            <span className={cn('inline-flex items-center gap-1 rounded-full font-medium', TREND_COLORS[trend.variant], compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs')}>
              <TrendIcon size={compact ? 9 : 11} />
              {trend.value}
            </span>
          )}
          {status && StatusIcon && (
            <span className={cn('inline-flex items-center gap-1 rounded-md font-medium', STATUS_STYLES[status.variant].classes, compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs')}>
              <StatusIcon size={compact ? 10 : 12} />
              {status.label}
            </span>
          )}
        </div>
        {onClick && (
          <span className={cn('inline-flex items-center gap-1 font-medium text-[color:var(--hr-shell-accent)]', compact ? 'text-[11px]' : 'text-xs')}>
            {t('ui.viewDetails', { ns: 'common' })}
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </div>
  )
}

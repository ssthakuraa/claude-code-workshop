import type { ComponentType } from 'react'
import { cn } from '@/utils/cn'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface HrScoreboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    variant: 'success' | 'danger' | 'warning' | 'info'
  }
  icon?: ComponentType<{ size?: number; className?: string }>
  loading?: boolean
  onClick?: () => void
}

const TREND_COLORS: Record<string, string> = {
  success: 'text-green-600 bg-green-50',
  danger: 'text-red-600 bg-red-50',
  warning: 'text-amber-600 bg-amber-50',
  info: 'text-blue-600 bg-blue-50',
}

export function HrScoreboardCard({ title, value, subtitle, trend, icon: Icon, loading, onClick }: HrScoreboardCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
        <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-1/3" />
      </div>
    )
  }

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-neutral-200 p-4 transition-shadow',
        onClick && 'cursor-pointer hover:shadow-md',
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-neutral-600 leading-tight">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-blue-600" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-neutral-900 mb-1">{value}</div>
      <div className="flex items-center gap-2 flex-wrap">
        {subtitle && <span className="text-xs text-neutral-500">{subtitle}</span>}
        {trend && (
          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded', TREND_COLORS[trend.variant])}>
            <TrendIcon size={11} />
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}

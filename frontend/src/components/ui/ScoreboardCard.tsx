import { cn } from '@/utils/cn'
import { TrendingDown, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'

export interface ScoreboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number        // percentage change, positive = up, negative = down
  trendLabel?: string
  icon?: ReactNode
  iconColor?: string
  className?: string
}

export function ScoreboardCard({ title, value, subtitle, trend, trendLabel, icon, iconColor, className }: ScoreboardCardProps) {
  const trendPositive = trend !== undefined && trend >= 0

  return (
    <div className={cn('bg-white rounded-lg border border-neutral-200 p-4 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        {icon && (
          <span className={cn('p-2 rounded-md', iconColor ?? 'bg-primary-50 text-primary-600')}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', trendPositive ? 'text-success-600' : 'text-error-600')}>
          {trendPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trendPositive ? '+' : ''}{trend}%</span>
          {trendLabel && <span className="text-neutral-400 font-normal ml-0.5">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}

export interface StatGroupProps {
  stats: ScoreboardCardProps[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatGroup({ stats, columns = 4, className }: StatGroupProps) {
  const colMap = { 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3', 4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }
  return (
    <div className={cn('grid gap-4', colMap[columns], className)}>
      {stats.map((s, i) => <ScoreboardCard key={i} {...s} />)}
    </div>
  )
}

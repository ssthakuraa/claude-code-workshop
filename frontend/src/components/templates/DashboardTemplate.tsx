/**
 * DashboardTemplate — KPI stats + charts + activity feed layout.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderProps } from '../ui/PageHeader'

export interface DashboardTemplateProps extends PageHeaderProps {
  statRow?: ReactNode           // StatGroup or individual ScoreboardCards
  primaryChart?: ReactNode
  secondaryCharts?: ReactNode[]
  activityFeed?: ReactNode
  sideWidgets?: ReactNode[]
  className?: string
}

export function DashboardTemplate({ statRow, primaryChart, secondaryCharts = [], activityFeed, sideWidgets = [], className, ...headerProps }: DashboardTemplateProps) {
  const hasSide = activityFeed || sideWidgets.length > 0

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <PageHeader {...headerProps} />
      {statRow && <div>{statRow}</div>}

      <div className={cn('flex gap-6 items-start', hasSide ? 'flex-row' : 'flex-col')}>
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {primaryChart && <div className="bg-white rounded-lg border border-neutral-200 p-4">{primaryChart}</div>}
          {secondaryCharts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {secondaryCharts.map((c, i) => (
                <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">{c}</div>
              ))}
            </div>
          )}
        </div>
        {hasSide && (
          <div className="w-80 shrink-0 flex flex-col gap-4">
            {activityFeed && (
              <div className="bg-white rounded-lg border border-neutral-200 p-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Recent Activity</h3>
                {activityFeed}
              </div>
            )}
            {sideWidgets.map((w, i) => <div key={i}>{w}</div>)}
          </div>
        )}
      </div>
    </div>
  )
}

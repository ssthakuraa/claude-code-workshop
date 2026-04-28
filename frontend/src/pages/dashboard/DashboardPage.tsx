import { useNavigate } from 'react-router-dom'
import {
  Users, UserPlus, TrendingDown, Clock, AlertCircle,
  ArrowLeftRight, GitBranch,
  ChevronRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { HrAnalyticsPanel } from '@/components/hr/HrAnalyticsPanel'
import { HrScoreboardCard } from '@/components/hr/HrScoreboardCard'
import { HrDonutChart } from '@/components/hr/charts/HrDonutChart'
import { HrLineChart } from '@/components/hr/charts/HrLineChart'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDashboardSummary } from '@/api/dashboard'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { formatDateTime } from '@/utils/formatters'

const ACTIVITY_COLORS: Record<string, string> = {
  HIRE: 'bg-green-100 text-green-700',
  PROMOTE: 'bg-purple-100 text-purple-700',
  TRANSFER: 'bg-[color:var(--hr-shell-accent-soft)] text-[color:var(--hr-shell-accent-strong)]',
  TERMINATE: 'bg-red-100 text-red-700',
  SYSTEM: 'bg-neutral-100 text-neutral-700',
}

function compactCountryLabel(label: string) {
  const replacements: Record<string, string> = {
    'United States of America': 'United States',
    'United Kingdom': 'UK',
    Netherlands: 'Neth.',
  }

  return replacements[label] ?? label
}

function compactDepartmentLabel(label: string) {
  if (label.length <= 24) {
    return label
  }

  return `${label.slice(0, 21).trimEnd()}...`
}

function translateActivityType(value: string, translate: (key: string, options?: Record<string, unknown>) => string) {
  return translate(`activityTypes.${value}`, {
    ns: 'dashboard',
    defaultValue: translate('activityTypes.SYSTEM', { ns: 'dashboard', defaultValue: value }),
  })
}

export function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common'])
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboardSummary()
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale

  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST'

  const topDepartments = (summary?.headcountByDepartment ?? []).slice(0, 5).map(d => ({
    label: d.departmentName,
    compactLabel: compactDepartmentLabel(d.departmentName),
    value: d.count,
  }))
  const countryChartData = (summary?.headcountByCountry ?? []).map(d => ({
    label: d.countryName,
    legendLabel: compactCountryLabel(d.countryName),
    value: d.count,
    percentage: summary?.totalHeadcount ? Math.round((d.count / summary.totalHeadcount) * 100) : 0,
  }))
  const attritionChartData = (summary?.attritionTrend ?? []).map(d => ({
    x: d.month,
    y: d.terminated,
  }))
  const recentActivity = (summary?.recentActivity ?? []).slice(0, 4)
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

  function formatDateParam(value: Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function goToEmployeeDirectory(params?: Record<string, string>) {
    const query = new URLSearchParams(params ?? {})
    const suffix = query.toString()
    navigate(suffix ? `/hr/employees?${suffix}` : '/hr/employees')
  }

  const newHireStatus = !summary
    ? undefined
    : summary.newHiresThisMonth > 0
      ? { label: t('cards.newHires.statusActive', { ns: 'dashboard' }), variant: 'success' as const }
      : { label: t('cards.newHires.statusIdle', { ns: 'dashboard' }), variant: 'info' as const }
  const activeStatus = !summary
    ? undefined
    : summary.totalHeadcount > summary.activeCount
      ? { label: t('cards.activeEmployees.statusUnavailable', { ns: 'dashboard', count: summary.totalHeadcount - summary.activeCount }), variant: 'info' as const }
      : { label: t('cards.activeEmployees.statusCoverage', { ns: 'dashboard' }), variant: 'success' as const }
  const leaveStatus = !summary
    ? undefined
    : summary.onLeaveCount > 0
      ? { label: t('cards.onLeave.statusWatch', { ns: 'dashboard' }), variant: 'info' as const }
      : { label: t('cards.onLeave.statusClear', { ns: 'dashboard' }), variant: 'success' as const }
  const probationStatus = !summary
    ? undefined
    : summary.probationCount > 0
      ? { label: t('cards.probation.statusReview', { ns: 'dashboard' }), variant: 'warning' as const }
      : { label: t('cards.probation.statusClear', { ns: 'dashboard' }), variant: 'success' as const }
  const headcountStatus = !summary
    ? undefined
    : summary.terminationsThisMonth > 0
      ? { label: t('cards.totalHeadcount.statusExits', { ns: 'dashboard', count: summary.terminationsThisMonth }), variant: 'danger' as const }
      : { label: t('cards.totalHeadcount.statusStable', { ns: 'dashboard' }), variant: 'success' as const }
  return (
    <div className="flex min-w-0 flex-col gap-3 pb-2">
      <PageHeader
        eyebrow={t('eyebrow', { ns: 'dashboard' })}
        title={t(user?.fullName ? 'title' : 'titleFallback', { ns: 'dashboard', name: user?.fullName?.split(' ')[0] ?? 'User' })}
        subtitle={t('subtitle', { ns: 'dashboard' })}
        subtitleClassName="max-w-none truncate whitespace-nowrap"
        compact
      />

      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
          <HrScoreboardCard
            eyebrow={t('cards.totalHeadcount.eyebrow', { ns: 'dashboard' })}
            title={t('cards.totalHeadcount.title', { ns: 'dashboard' })}
            value={summary?.totalHeadcount ?? '—'}
            subtitle={t('cards.totalHeadcount.subtitle', { ns: 'dashboard' })}
            trend={{ value: t('cards.totalHeadcount.trend', { ns: 'dashboard', count: summary?.newHiresThisMonth ?? 0 }), direction: 'up', variant: 'success' }}
            detail={t('cards.totalHeadcount.detail', { ns: 'dashboard' })}
            icon={Users}
            status={headcountStatus}
            loading={isLoading}
            compact
            onClick={isAdminOrHr ? () => goToEmployeeDirectory() : undefined}
          />
          <HrScoreboardCard
            eyebrow={t('cards.newHires.eyebrow', { ns: 'dashboard' })}
            title={t('cards.newHires.title', { ns: 'dashboard' })}
            value={summary?.newHiresThisMonth ?? '—'}
            subtitle={t('cards.newHires.subtitle', { ns: 'dashboard' })}
            trend={{ value: t('cards.newHires.trend', { ns: 'dashboard' }), direction: 'up', variant: 'info' }}
            detail={t('cards.newHires.detail', { ns: 'dashboard' })}
            icon={UserPlus}
            status={newHireStatus}
            loading={isLoading}
            compact
            onClick={isAdminOrHr
              ? () => goToEmployeeDirectory({
                hireDateFrom: formatDateParam(currentMonthStart),
                hireDateTo: formatDateParam(currentMonthEnd),
              })
              : undefined}
          />
          <HrScoreboardCard
            eyebrow={t('cards.activeEmployees.eyebrow', { ns: 'dashboard' })}
            title={t('cards.activeEmployees.title', { ns: 'dashboard' })}
            value={summary?.activeCount ?? '—'}
            subtitle={t('cards.activeEmployees.subtitle', { ns: 'dashboard' })}
            detail={t('cards.activeEmployees.detail', { ns: 'dashboard' })}
            icon={TrendingDown}
            status={activeStatus}
            loading={isLoading}
            compact
            onClick={isAdminOrHr ? () => goToEmployeeDirectory({ status: 'ACTIVE' }) : undefined}
          />
          <HrScoreboardCard
            eyebrow={t('cards.onLeave.eyebrow', { ns: 'dashboard' })}
            title={t('cards.onLeave.title', { ns: 'dashboard' })}
            value={summary?.onLeaveCount ?? '—'}
            subtitle={t('cards.onLeave.subtitle', { ns: 'dashboard' })}
            detail={t('cards.onLeave.detail', { ns: 'dashboard' })}
            icon={Clock}
            status={leaveStatus}
            loading={isLoading}
            compact
            onClick={isAdminOrHr ? () => goToEmployeeDirectory({ status: 'ON_LEAVE' }) : undefined}
          />
          <HrScoreboardCard
            eyebrow={t('cards.probation.eyebrow', { ns: 'dashboard' })}
            title={t('cards.probation.title', { ns: 'dashboard' })}
            value={summary?.probationCount ?? '—'}
            subtitle={t('cards.probation.subtitle', { ns: 'dashboard' })}
            trend={{ value: t('cards.probation.trend', { ns: 'dashboard' }), direction: 'neutral', variant: 'warning' }}
            detail={t('cards.probation.detail', { ns: 'dashboard' })}
            icon={AlertCircle}
            status={probationStatus}
            loading={isLoading}
            compact
            onClick={isAdminOrHr ? () => goToEmployeeDirectory({ status: 'PROBATION' }) : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <HrAnalyticsPanel
            title={t('panels.headcountByCountry.title', { ns: 'dashboard' })}
            subtitle={t('panels.headcountByCountry.subtitle', { ns: 'dashboard' })}
            eyebrow={t('panels.headcountByCountry.eyebrow', { ns: 'dashboard' })}
            compact
          >
            <HrDonutChart
              data={countryChartData}
              centerLabel={t('panels.headcountByCountry.centerLabel', { ns: 'dashboard', count: summary?.totalHeadcount ?? '…' })}
              height={134}
            />
          </HrAnalyticsPanel>

          <HrAnalyticsPanel
            title={t('panels.topDepartments.title', { ns: 'dashboard' })}
            subtitle={t('panels.topDepartments.subtitle', { ns: 'dashboard' })}
            eyebrow={t('panels.topDepartments.eyebrow', { ns: 'dashboard' })}
            compact
          >
            <div className="space-y-1">
              {topDepartments.length === 0 && (
                <div className="rounded-xl border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-3 py-5 text-sm text-[color:var(--hr-text-subtle)]">
                  {t('common:ui.noDataAvailable')}
                </div>
              )}
              {topDepartments.map((department, index) => {
                const maxValue = topDepartments[0]?.value ?? 1
                const widthPercent = maxValue > 0 ? Math.max(16, Math.round((department.value / maxValue) * 100)) : 16

                return (
                  <div key={`${department.label}-${index}`} className="rounded-lg border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-2.5 py-1.25">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 truncate text-[12px] font-semibold leading-4 text-[color:var(--hr-text)]" title={department.label}>
                        {department.compactLabel}
                      </div>
                      <div className="shrink-0 text-[12px] font-semibold text-[color:var(--hr-shell-accent-strong)]">
                        {department.value}
                      </div>
                    </div>
                    <div className="mt-0.75 h-0.75 overflow-hidden rounded-full bg-white/90">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--hr-shell-accent),rgba(44,105,117,0.35))]"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </HrAnalyticsPanel>

          {isAdminOrHr && (
            <HrAnalyticsPanel
              title={t('panels.quickActions.title', { ns: 'dashboard' })}
              subtitle={t('panels.quickActions.subtitle', { ns: 'dashboard' })}
              eyebrow={t('panels.quickActions.eyebrow', { ns: 'dashboard' })}
              compact
            >
              <div className="space-y-1.5">
                <button
                  onClick={() => navigate('/hr/actions/hire')}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]"
                >
                  <span className="flex items-center gap-2"><UserPlus size={15} /> {t('panels.quickActions.hireEmployee', { ns: 'dashboard' })}</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/hr/actions/transfer')}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]"
                >
                  <span className="flex items-center gap-2"><ArrowLeftRight size={15} /> {t('panels.quickActions.transferEmployee', { ns: 'dashboard' })}</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/hr/organization/chart')}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[color:var(--hr-border-subtle)] bg-white px-3 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]"
                >
                  <span className="flex items-center gap-2"><GitBranch size={15} /> {t('panels.quickActions.viewOrgChart', { ns: 'dashboard' })}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </HrAnalyticsPanel>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12">
          <HrAnalyticsPanel
            className="lg:col-span-7"
            title={t('panels.attritionTrend.title', { ns: 'dashboard' })}
            subtitle={t('panels.attritionTrend.subtitle', { ns: 'dashboard' })}
            eyebrow={t('panels.attritionTrend.eyebrow', { ns: 'dashboard' })}
            compact
          >
            <HrLineChart
              data={attritionChartData}
              color="var(--color-error-500)"
              height={128}
              showGrid
              showDots
            />
          </HrAnalyticsPanel>

          <HrAnalyticsPanel
            className="lg:col-span-5"
            title={t('panels.recentActivity.title', { ns: 'dashboard' })}
            subtitle={t('panels.recentActivity.subtitle', { ns: 'dashboard' })}
            eyebrow={t('panels.recentActivity.eyebrow', { ns: 'dashboard' })}
            compact
            contentClassName="overflow-hidden rounded-xl border border-[color:var(--hr-border-subtle)] bg-white"
          >
            <div className="max-h-[10.5rem] overflow-y-auto divide-y divide-neutral-100">
              {recentActivity.length === 0 && (
                <div className="px-3 py-4 text-xs text-neutral-500">{t('panels.recentActivity.empty', { ns: 'dashboard' })}</div>
              )}
              {recentActivity.map((item, index) => (
                <div key={`${item.type}-${item.time}-${index}`} className="flex items-start gap-2.5 px-3 py-2">
                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium leading-none flex-shrink-0 ${ACTIVITY_COLORS[item.type] ?? 'bg-neutral-100 text-neutral-600'}`}>
                    {translateActivityType(item.type, t)}
                  </span>
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                    <p className="truncate text-[11px] leading-snug text-neutral-700">{item.text}</p>
                    <p className="shrink-0 text-[10px] text-neutral-400">{formatDateTime(item.time, locale, 'short', preferences.timezone)}</p>
                  </div>
                </div>
              ))}
            </div>
          </HrAnalyticsPanel>
        </div>
      </div>
    </div>
  )
}

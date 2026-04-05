import { useNavigate } from 'react-router-dom'
import {
  Users, UserPlus, TrendingDown, Clock, AlertCircle,
  ArrowLeftRight, GitBranch,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { HrScoreboardCard } from '@/components/hr/HrScoreboardCard'
import { HrDonutChart } from '@/components/hr/charts/HrDonutChart'
import { HrHorizontalBarChart } from '@/components/hr/charts/HrHorizontalBarChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useDashboardSummary, useHeadcountByCountry } from '@/api/dashboard'
import { useAuditLogs } from '@/api/auditLogs'

const ACTIVITY_COLORS: Record<string, string> = {
  HIRE: 'bg-green-100 text-green-700',
  INSERT: 'bg-green-100 text-green-700',
  PROMOTE: 'bg-purple-100 text-purple-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  TRANSFER: 'bg-blue-100 text-blue-700',
  TERMINATE: 'bg-red-100 text-red-700',
  DELETE: 'bg-red-100 text-red-700',
}

const ACTION_LABELS: Record<string, string> = {
  INSERT: 'HIRE',
  UPDATE: 'CHANGE',
  DELETE: 'TERMINATE',
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboardSummary()
  const { data: countries } = useHeadcountByCountry()
  const { data: auditLogs } = useAuditLogs(0)

  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST'

  const countryChartData = (countries ?? []).slice(0, 5).map(d => ({
    label: d.countryName,
    value: d.count,
    percentage: Math.round(
      (d.count / (summary?.totalHeadcount || 1)) * 100
    ),
  }))

  const deptChartData = (summary?.headcountByDepartment ?? [])
    .slice(0, 10)
    .map(d => ({ label: d.departmentName, value: d.count }))

  const activityItems = (auditLogs?.data ?? []).slice(0, 5).map(a => ({
    id: a.auditId,
    type: ACTION_LABELS[a.action] ?? a.action,
    text: `${a.action} on ${a.tableName}${a.recordId ? ` (#${a.recordId})` : ''}`,
    time: timeAgo(a.changedAt),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Welcome back, {user?.fullName?.split(' ')[0] ?? 'User'}
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <HrScoreboardCard
          title="Total Headcount"
          value={summary?.totalHeadcount ?? '—'}
          subtitle="All employees"
          trend={{
            value: `+${summary?.newHiresThisMonth ?? 0} this month`,
            direction: 'up',
            variant: 'success',
          }}
          icon={Users}
          loading={isLoading}
        />
        <HrScoreboardCard
          title="New Hires (Month)"
          value={summary?.newHiresThisMonth ?? '—'}
          subtitle="This month"
          trend={{ value: 'Current month', direction: 'up', variant: 'info' }}
          icon={UserPlus}
          loading={isLoading}
        />
        <HrScoreboardCard
          title="Active Employees"
          value={summary?.activeCount ?? '—'}
          subtitle="Currently active"
          icon={TrendingDown}
          loading={isLoading}
        />
        <HrScoreboardCard
          title="On Leave"
          value={summary?.onLeaveCount ?? '—'}
          subtitle="Currently on leave"
          icon={Clock}
          loading={isLoading}
        />
        <HrScoreboardCard
          title="On Probation"
          value={summary?.probationCount ?? '—'}
          subtitle="Need review"
          trend={{
            value: 'Action needed',
            direction: 'neutral',
            variant: 'warning',
          }}
          icon={AlertCircle}
          loading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <CardHeader>
            <CardTitle>Headcount by Country</CardTitle>
          </CardHeader>
          <CardContent>
            {countryChartData.length > 0 ? (
              <HrDonutChart data={countryChartData} height={220} />
            ) : (
              <p className="text-xs text-neutral-400 py-8 text-center">
                No country data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card padding="md">
          <CardHeader>
            <CardTitle>Top Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <HrHorizontalBarChart
              data={deptChartData}
              height={220}
              showValues
              loading={isLoading}
            />
          </CardContent>
        </Card>

        {isAdminOrHr ? (
          <Card padding="md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/hr/actions/hire')}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <UserPlus size={15} /> Hire Employee
                </button>
                <button
                  onClick={() => navigate('/hr/actions/transfer')}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <ArrowLeftRight size={15} /> Transfer Employee
                </button>
                <button
                  onClick={() => navigate('/hr/organization/chart')}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <GitBranch size={15} /> View Org Chart
                </button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Bottom row: Activity Feed only */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card
          className="lg:col-span-12 overflow-hidden"
          padding="none"
          header={null}
        >
          <div className="px-4 py-3 border-b border-neutral-100">
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <div className="divide-y divide-neutral-100">
            {activityItems.length > 0 ? (
              activityItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3"
                >
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                      ACTIVITY_COLORS[item.type] ??
                      'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-700 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-xs text-neutral-400">
                No recent activity
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

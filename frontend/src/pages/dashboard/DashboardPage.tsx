import { useNavigate } from 'react-router-dom'
import {
  Users, UserPlus, TrendingDown, Clock, AlertCircle,
  ArrowLeftRight, GitBranch,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { HrScoreboardCard } from '@/components/hr/HrScoreboardCard'
import { HrDonutChart } from '@/components/hr/charts/HrDonutChart'
import { HrHorizontalBarChart } from '@/components/hr/charts/HrHorizontalBarChart'
import { HrLineChart } from '@/components/hr/charts/HrLineChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useDashboardSummary } from '@/api/dashboard'
import {
  mockHeadcountByCountry,
  mockAttritionTrend,
  mockRecentActivity,
  mockKpis,
} from '@/data/mockDashboard'

const ACTIVITY_COLORS: Record<string, string> = {
  HIRE: 'bg-green-100 text-green-700',
  PROMOTE: 'bg-purple-100 text-purple-700',
  TRANSFER: 'bg-blue-100 text-blue-700',
  TERMINATE: 'bg-red-100 text-red-700',
}

// Country chart and attrition trend remain mock-only (no backend source)
const countryChartData = mockHeadcountByCountry.map(d => ({
  label: d.name,
  value: d.value,
  percentage: Math.round((d.value / mockKpis.totalHeadcount) * 100),
  color: d.color,
}))

const attritionChartData = mockAttritionTrend.map(d => ({
  x: d.month,
  y: d.terminated,
}))

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboardSummary()

  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST'

  const deptChartData = (summary?.headcountByDepartment ?? []).slice(0, 10).map(d => ({
    label: d.departmentName,
    value: d.count,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Welcome back, {user?.fullName?.split(' ')[0] ?? 'User'}
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <HrScoreboardCard
          title="Total Headcount"
          value={summary?.totalHeadcount ?? '—'}
          subtitle="All employees"
          trend={{ value: `+${summary?.newHiresThisMonth ?? 0} this month`, direction: 'up', variant: 'success' }}
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
          trend={{ value: 'Action needed', direction: 'neutral', variant: 'warning' }}
          icon={AlertCircle}
          loading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <CardHeader><CardTitle>Headcount by Country</CardTitle></CardHeader>
          <CardContent>
            <HrDonutChart
              data={countryChartData}
              centerLabel={`${summary?.totalHeadcount ?? '…'} Total`}
              height={220}
            />
          </CardContent>
        </Card>

        <Card padding="md">
          <CardHeader><CardTitle>Top Departments</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
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

      {/* Bottom row: Attrition Trend + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7" padding="md">
          <CardHeader><CardTitle>Attrition Trend (12 months)</CardTitle></CardHeader>
          <CardContent>
            <HrLineChart
              data={attritionChartData}
              color="#E53E3E"
              height={200}
              showGrid
              showDots
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 overflow-hidden" padding="none">
          <div className="px-4 py-3 border-b border-neutral-100">
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <div className="divide-y divide-neutral-100">
            {mockRecentActivity.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${ACTIVITY_COLORS[item.type] ?? 'bg-neutral-100 text-neutral-600'}`}>
                  {item.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-700 leading-snug">{item.text}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

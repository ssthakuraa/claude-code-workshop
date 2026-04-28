import { useParams, useNavigate, Link } from 'react-router-dom'
import { TrendingUp, ArrowLeftRight, UserX, Mail, Building2, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { HrStatusBadge } from '@/components/hr/HrStatusBadge'
import { HrEmploymentTypeBadge } from '@/components/hr/HrEmploymentTypeBadge'
import { HrActivityFeed, type ActivityItem } from '@/components/hr/HrActivityFeed'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { PageHeader, PageHeaderMetaItem } from '@/components/ui/PageHeader'
import { useEmployee, useEmployees } from '@/api/employees'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { canViewEmployeeSalary } from '@/utils/employeePermissions'
import { formatCurrency, formatDate, formatDecimalPercent } from '@/utils/formatters'

type Tab = 'profile' | 'timeline' | 'compensation'

export function EmployeeDetailPage() {
  const { t } = useTranslation(['employees', 'common'])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale

  const employeeId = Number(id)
  const { data: employee, isLoading, isError } = useEmployee(employeeId)
  const { data: allEmployees } = useEmployees({ size: 500, sort: 'lastName' })
  const canAction = user?.role === 'ADMIN' || user?.role === 'HR_SPECIALIST'

  if (isLoading) {
    return (
      <div className="space-y-3">
        <HrSkeleton className="h-4 w-48" />
        <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3">
          <HrSkeleton className="h-16 w-16 rounded-full" />
          <HrSkeleton className="h-6 w-48" />
          <HrSkeleton className="h-4 w-72" />
        </div>
      </div>
    )
  }

  if (isError || !employee) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 mb-4">{t('detail.notFound', { ns: 'employees' })}</p>
        <Link to="/hr/employees" className="text-[color:var(--hr-shell-accent)] hover:underline text-sm">{t('detail.backToDirectory', { ns: 'employees' })}</Link>
      </div>
    )
  }

  const directReports = (allEmployees?.data ?? []).filter(e => e.managerId === employee.employeeId)
  const canViewSalary = canViewEmployeeSalary(user, employee)

  const careerTimeline: ActivityItem[] = [
    {
      id: '1',
      type: 'hire',
      title: t('detail.timeline.hiredAs', { ns: 'employees', jobTitle: employee.jobTitle }),
      description: t('detail.timeline.joined', { ns: 'employees', departmentName: employee.departmentName }),
      date: new Date(employee.hireDate),
    },
    ...(employee.jobHistory ?? []).map((jh, i) => ({
      id: `jh-${i}`,
      type: 'transfer' as const,
      title: t('detail.timeline.movedTo', { ns: 'employees', jobTitle: jh.jobTitle }),
      description: jh.departmentName,
      date: new Date(jh.startDate),
    })),
    ...(employee.employmentStatus === 'TERMINATED' ? [{
      id: '99',
      type: 'termination' as const,
      title: t('detail.timeline.employmentEnded', { ns: 'employees' }),
      date: new Date(),
    }] : []),
  ]
  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={employee.fullName}
        subtitle={`${employee.jobTitle} · ${employee.departmentName}`}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
          { label: employee.fullName },
        ]}
        badges={(
          <>
            <HrStatusBadge status={employee.employmentStatus} />
            <HrEmploymentTypeBadge type={employee.employmentType} />
          </>
        )}
        meta={(
          <>
            <PageHeaderMetaItem label={t('detail.fields.email', { ns: 'employees' })} value={employee.email} icon={<Mail size={15} />} />
            <PageHeaderMetaItem label={t('detail.fields.department', { ns: 'employees' })} value={employee.departmentName} icon={<Building2 size={15} />} />
            <PageHeaderMetaItem label={t('detail.fields.location', { ns: 'employees' })} value={employee.locationCity ?? t('na', { ns: 'common' })} icon={<MapPin size={15} />} />
          </>
        )}
        actions={canAction ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<TrendingUp size={16} />}
              onClick={() => navigate(`/hr/actions/promote/${employee.employeeId}`)}
            >
              {t('detail.relatedActions.promote.label', { ns: 'employees' })}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<ArrowLeftRight size={16} />}
              onClick={() => navigate(`/hr/actions/transfer/${employee.employeeId}`)}
            >
              {t('detail.relatedActions.transfer.label', { ns: 'employees' })}
            </Button>
            {employee.employmentStatus !== 'TERMINATED' && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={<UserX size={16} />}
                onClick={() => navigate(`/hr/actions/terminate/${employee.employeeId}`)}
              >
                {t('detail.relatedActions.terminate.label', { ns: 'employees' })}
              </Button>
            )}
          </>
        ) : undefined}
      >
        <div className="flex items-center gap-4">
          <Avatar name={employee.fullName} size="xl" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-700">{employee.jobTitle}</p>
            <p className="text-sm text-neutral-500">{employee.departmentName}</p>
          </div>
        </div>
      </PageHeader>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="space-y-3">
          <div className="border-b border-neutral-200">
            <nav className="flex gap-6">
              {(['profile', 'timeline', 'compensation'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[color:var(--hr-shell-accent)] text-[color:var(--hr-shell-accent-strong)]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {t(`detail.tabs.${tab}`, { ns: 'employees' })}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">{t('detail.sections.contact', { ns: 'employees' })}</h3>
                <InfoRow label={t('detail.fields.email', { ns: 'employees' })} value={employee.email} />
                <InfoRow label={t('detail.fields.phone', { ns: 'employees' })} value={employee.phoneNumber ?? '—'} />
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">{t('detail.sections.employment', { ns: 'employees' })}</h3>
                <InfoRow label={t('detail.fields.hireDate', { ns: 'employees' })} value={formatDate(employee.hireDate, locale, 'medium', preferences.timezone)} />
                <InfoRow label={t('detail.fields.manager', { ns: 'employees' })} value={employee.managerName ?? '—'} />
                <InfoRow label={t('detail.fields.location', { ns: 'employees' })} value={employee.locationCity ?? '—'} />
              </div>
              {directReports.length > 0 && (
                <div className="bg-white rounded-lg border border-neutral-200 p-5 md:col-span-2">
                  <h3 className="mb-3 text-sm font-semibold text-neutral-800">{t('detail.sections.directReports', { ns: 'employees', count: directReports.length })}</h3>
                  <div className="flex flex-wrap gap-2">
                    {directReports.map(r => (
                      <button
                        key={r.employeeId}
                        onClick={() => navigate(`/hr/employees/${r.employeeId}`)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-sm"
                      >
                        <Avatar name={r.fullName} size="xs" />
                        <span className="text-neutral-800">{r.fullName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="bg-white rounded-lg border border-neutral-200 p-5">
              <HrActivityFeed items={careerTimeline} groupBy="none" />
            </div>
          )}

          {activeTab === 'compensation' && (
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-800">{t('detail.sections.compensation', { ns: 'employees' })}</h3>
              {canViewSalary ? (
                <>
                  <InfoRow label={t('detail.fields.annualSalary', { ns: 'employees' })} value={employee.salary != null ? formatCurrency(Number(employee.salary), preferences.currency, locale, 0) : '—'} />
                  <InfoRow label={t('detail.fields.commissionPct', { ns: 'employees' })} value={employee.commissionPct != null ? formatDecimalPercent(employee.commissionPct, locale) : '—'} />
                </>
              ) : (
                <p className="text-sm text-neutral-500">{t('detail.salaryHidden', { ns: 'employees' })}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-800 font-medium">{value}</span>
    </div>
  )
}

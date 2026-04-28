import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { Briefcase, CalendarDays, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { HrSalaryRangeInput } from '@/components/hr/HrSalaryRangeInput'
import { Button } from '@/components/ui/Button'
import { PageHeader, PageHeaderMetaItem } from '@/components/ui/PageHeader'
import { useEmployee, usePromoteEmployee } from '@/api/employees'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { useJobs } from '@/api/jobs'
import { formatCurrency } from '@/utils/formatters'

export function PromotePage() {
  const { t } = useTranslation(['actions', 'common', 'employees'])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newJobId, setNewJobId] = useState('')
  const [newSalary, setNewSalary] = useState<number | undefined>()
  const [effectiveDate, setEffectiveDate] = useState('')

  const employeeId = Number(id)
  const { data: employee, isLoading } = useEmployee(employeeId)
  const { data: jobs } = useJobs()
  const promote = usePromoteEmployee()
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale

  const selectedJob = (jobs ?? []).find(j => j.jobId === newJobId)

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">{t('loading', { ns: 'common' })}</div>
  if (!employee) return <div className="p-8 text-sm text-neutral-500">{t('detail.notFound', { ns: 'employees', defaultValue: 'Employee not found.' })}</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await promote.mutateAsync({
        employeeId,
        newJobId,
        newSalary,
        effectiveDate: effectiveDate || undefined,
        idempotencyKey: uuidv4(),
      })
      toast.success(t('promote.toasts.success', { ns: 'actions', name: employee.fullName, jobTitle: selectedJob?.jobTitle ?? newJobId }))
      navigate(`/hr/employees/${employeeId}`)
    } catch {
      toast.error(t('promote.toasts.error', { ns: 'actions' }))
    }
  }

  return (
    <div className="hr-list-page-shell">
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="hr-app-surface-elevated rounded-[1.25rem] p-4 sm:p-5">
        <PageHeader
          eyebrow={t('promote.eyebrow', { ns: 'actions' })}
          title={t('promote.title', { ns: 'actions' })}
          subtitle={t('promote.subtitle', { ns: 'actions', jobTitle: employee.jobTitle, departmentName: employee.departmentName })}
          surface="plain"
          breadcrumbs={[
            { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
            { label: employee.fullName, href: `/hr/employees/${employeeId}` },
            { label: t('detail.relatedActions.promote.label', { ns: 'employees' }) },
          ]}
          meta={(
            <>
              <PageHeaderMetaItem label={t('promote.meta.employee', { ns: 'actions' })} value={employee.fullName} icon={<TrendingUp size={15} />} />
              <PageHeaderMetaItem label={t('promote.meta.availableRoles', { ns: 'actions' })} value={String((jobs ?? []).filter(j => j.jobId !== employee.jobId).length)} icon={<Briefcase size={15} />} />
              <PageHeaderMetaItem label={t('promote.meta.effective', { ns: 'actions' })} value={effectiveDate || t('pending', { ns: 'common' })} icon={<CalendarDays size={15} />} />
            </>
          )}
          className="mb-3 gap-2"
        />

          <form onSubmit={handleSubmit} className="space-y-5">
          <div className="hr-form-section">
            <div className="hr-form-section-header">
              <div>
                <p className="hr-form-eyebrow">{t('promote.sectionEyebrow', { ns: 'actions' })}</p>
                <h3 className="mt-1 text-base font-semibold text-[color:var(--hr-text)]">{t('promote.sectionTitle', { ns: 'actions' })}</h3>
              </div>
            </div>
            <div className="hr-form-section-body space-y-4">
          <div>
            <label className="hr-field-label">{t('promote.fields.newJobTitle', { ns: 'actions' })} <span className="text-red-500">*</span></label>
            <select value={newJobId} onChange={e => setNewJobId(e.target.value)} required
              className="hr-app-select w-full px-3 text-sm">
              <option value="">{t('promote.placeholders.selectNewJob', { ns: 'actions' })}</option>
              {(jobs ?? []).filter(j => j.jobId !== employee.jobId).map(j => (
                <option key={j.jobId} value={j.jobId}>{j.jobTitle}</option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <>
              <div className="hr-inline-note px-3 py-2 text-xs font-medium">
                {t('promote.salaryBand', {
                  ns: 'actions',
                  min: formatCurrency(Number(selectedJob.minSalary), preferences.currency, locale, 0),
                  max: formatCurrency(Number(selectedJob.maxSalary), preferences.currency, locale, 0),
                })}
              </div>
              <HrSalaryRangeInput
                label={t('promote.fields.newSalary', { ns: 'actions' })}
                value={newSalary}
                onChange={setNewSalary}
                min={Number(selectedJob.minSalary)}
                max={Number(selectedJob.maxSalary)}
              />
            </>
          )}

          <div>
            <label className="hr-field-label">{t('promote.fields.effectiveDate', { ns: 'actions' })} <span className="text-red-500">*</span></label>
            <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} required
              className="hr-app-input w-full px-3" />
          </div>
          </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button type="submit" disabled={promote.isPending || !newJobId || !effectiveDate} loading={promote.isPending}>
              {t('promote.buttons.confirm', { ns: 'actions' })}
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

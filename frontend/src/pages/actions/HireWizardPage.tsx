import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { HrWizard, type WizardStep } from '@/components/hr/HrWizard'
import { HrSalaryRangeInput } from '@/components/hr/HrSalaryRangeInput'
import { PageHeader } from '@/components/ui/PageHeader'
import { useHireEmployee, useEmployees } from '@/api/employees'
import { useDepartments } from '@/api/departments'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { useJobs, type Job } from '@/api/jobs'
import { formatCurrency } from '@/utils/formatters'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  hireDate: string
  jobId: string
  departmentId: string
  managerId: string
  salary: number | undefined
  commissionPct: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
  contractEndDate: string
  initialPassword: string
}

const INITIAL: FormData = {
  firstName: '', lastName: '', email: '', phone: '', hireDate: '',
  jobId: '', departmentId: '', managerId: '',
  salary: undefined, commissionPct: '',
  employmentType: 'FULL_TIME', contractEndDate: '',
  initialPassword: '',
}

function FieldRow({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="hr-field-label">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="hr-field-error">{error}</p>}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder, disabled }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="hr-app-input w-full px-3 disabled:bg-neutral-50 disabled:opacity-60"
    />
  )
}

function ReviewRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="rounded-[0.9rem] border border-[color:var(--hr-border-subtle)] bg-white px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--hr-text-subtle)]">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-[color:var(--hr-text)]">{value || '—'}</dd>
    </div>
  )
}

export function HireWizardPage() {
  const { t } = useTranslation(['actions', 'common'])
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
  const steps: WizardStep[] = [
    { id: 'personal', label: t('hire.steps.personal.label', { ns: 'actions' }), description: t('hire.steps.personal.description', { ns: 'actions' }) },
    { id: 'job', label: t('hire.steps.job.label', { ns: 'actions' }), description: t('hire.steps.job.description', { ns: 'actions' }) },
    { id: 'compensation', label: t('hire.steps.compensation.label', { ns: 'actions' }), description: t('hire.steps.compensation.description', { ns: 'actions' }) },
    { id: 'review', label: t('hire.steps.review.label', { ns: 'actions' }), description: t('hire.steps.review.description', { ns: 'actions' }) },
  ]

  const hire = useHireEmployee()
  const { data: jobs } = useJobs()
  const { data: departments } = useDepartments()
  const { data: pagedEmployees } = useEmployees({ size: 500, sort: 'lastName' })

  const activeEmployees = (pagedEmployees?.data ?? []).filter(e => e.employmentStatus === 'ACTIVE')
  const set = (key: keyof FormData, value: string | number | undefined) =>
    setForm(f => ({ ...f, [key]: value }))

  const selectedJob: Job | undefined = (jobs ?? []).find(j => j.jobId === form.jobId)
  const selectedDept = (departments ?? []).find(d => String(d.departmentId) === form.departmentId)

  function validateStep(s: number): boolean {
    const e: typeof errors = {}
    if (s === 0) {
      if (!form.firstName) e.firstName = t('hire.validation.required', { ns: 'actions' })
      if (!form.lastName) e.lastName = t('hire.validation.required', { ns: 'actions' })
      if (!form.email) e.email = t('hire.validation.required', { ns: 'actions' })
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('hire.validation.invalidEmail', { ns: 'actions' })
      if (!form.hireDate) e.hireDate = t('hire.validation.required', { ns: 'actions' })
      if (!form.initialPassword) e.initialPassword = t('hire.validation.required', { ns: 'actions' })
      else if (form.initialPassword.length < 8) e.initialPassword = t('hire.validation.passwordMin', { ns: 'actions' })
    }
    if (s === 1) {
      if (!form.jobId) e.jobId = t('hire.validation.required', { ns: 'actions' })
      if (!form.departmentId) e.departmentId = t('hire.validation.required', { ns: 'actions' })
    }
    if (s === 2) {
      if (!form.salary) e.salary = t('hire.validation.required', { ns: 'actions' })
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validateStep(step)) setStep(s => s + 1)
  }

  async function handleSubmit() {
    try {
      await hire.mutateAsync({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phone || undefined,
        hireDate: form.hireDate,
        jobId: form.jobId,
        salary: form.salary,
        commissionPct: form.commissionPct ? Number(form.commissionPct) : undefined,
        managerId: form.managerId ? Number(form.managerId) : undefined,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        employmentType: form.employmentType,
        contractEndDate: form.contractEndDate || undefined,
        initialPassword: form.initialPassword,
        idempotencyKey: uuidv4(),
      })
      toast.success(t('hire.toasts.success', { ns: 'actions', name: `${form.firstName} ${form.lastName}` }))
      navigate('/hr/employees')
    } catch {
      toast.error(t('hire.toasts.error', { ns: 'actions' }))
    }
  }

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        eyebrow={t('hire.eyebrow', { ns: 'actions' })}
        title={t('hire.title', { ns: 'actions' })}
        subtitle={t('hire.subtitle', { ns: 'actions' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
          { label: t('hire.title', { ns: 'actions' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="hr-app-surface-elevated rounded-[1.1rem] p-3.5 sm:p-4">
          <HrWizard
            steps={steps}
            currentStep={step}
            onNext={handleNext}
            onBack={() => setStep(s => s - 1)}
            onSubmit={handleSubmit}
            submitLabel={t('hire.submit', { ns: 'actions' })}
            loading={hire.isPending}
          >
          {step === 0 && (
            <div className="hr-form-section">
              <div className="hr-form-section-header">
                <p className="hr-form-eyebrow">{t('hire.sections.personalEyebrow', { ns: 'actions' })}</p>
              </div>
              <div className="hr-form-section-body">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FieldRow label={t('hire.fields.firstName', { ns: 'actions' })} required error={errors.firstName}>
                  <Input value={form.firstName} onChange={v => set('firstName', v)} placeholder={t('hire.placeholders.firstName', { ns: 'actions' })} />
                </FieldRow>
                <FieldRow label={t('hire.fields.lastName', { ns: 'actions' })} required error={errors.lastName}>
                  <Input value={form.lastName} onChange={v => set('lastName', v)} placeholder={t('hire.placeholders.lastName', { ns: 'actions' })} />
                </FieldRow>
                <FieldRow label={t('hire.fields.email', { ns: 'actions' })} required error={errors.email}>
                  <Input type="email" value={form.email} onChange={v => set('email', v)} placeholder={t('hire.placeholders.email', { ns: 'actions' })} />
                </FieldRow>
                <FieldRow label={t('hire.fields.phone', { ns: 'actions' })} error={errors.phone}>
                  <Input value={form.phone} onChange={v => set('phone', v)} placeholder={t('hire.placeholders.phone', { ns: 'actions' })} />
                </FieldRow>
                <FieldRow label={t('hire.fields.hireDate', { ns: 'actions' })} required error={errors.hireDate}>
                  <Input type="date" value={form.hireDate} onChange={v => set('hireDate', v)} />
                </FieldRow>
                <FieldRow label={t('hire.fields.initialPassword', { ns: 'actions' })} required error={errors.initialPassword}>
                  <Input type="password" value={form.initialPassword} onChange={v => set('initialPassword', v)} placeholder={t('hire.placeholders.initialPassword', { ns: 'actions' })} />
                </FieldRow>
              </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="hr-form-section">
              <div className="hr-form-section-header">
                <p className="hr-form-eyebrow">{t('hire.sections.jobEyebrow', { ns: 'actions' })}</p>
              </div>
              <div className="hr-form-section-body">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FieldRow label={t('hire.fields.jobTitle', { ns: 'actions' })} required error={errors.jobId}>
                  <select value={form.jobId} onChange={e => set('jobId', e.target.value)}
                    className="hr-app-select w-full px-3 text-sm">
                    <option value="">{t('hire.placeholders.selectJob', { ns: 'actions' })}</option>
                    {(jobs ?? []).map(j => <option key={j.jobId} value={j.jobId}>{j.jobTitle} ({j.jobId})</option>)}
                  </select>
                  {selectedJob && (
                    <div className="hr-inline-note mt-2 px-3 py-2 text-xs font-medium">
                      {t('hire.salaryBand', {
                        ns: 'actions',
                        min: formatCurrency(Number(selectedJob.minSalary), preferences.currency, locale, 0),
                        max: formatCurrency(Number(selectedJob.maxSalary), preferences.currency, locale, 0),
                      })}
                    </div>
                  )}
                </FieldRow>
                <FieldRow label={t('hire.fields.department', { ns: 'actions' })} required error={errors.departmentId}>
                  <select value={form.departmentId} onChange={e => set('departmentId', e.target.value)}
                    className="hr-app-select w-full px-3 text-sm">
                    <option value="">{t('hire.placeholders.selectDepartment', { ns: 'actions' })}</option>
                    {(departments ?? []).map(d => (
                      <option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>
                    ))}
                  </select>
                </FieldRow>
                <FieldRow label={t('hire.fields.manager', { ns: 'actions' })}>
                  <select value={form.managerId} onChange={e => set('managerId', e.target.value)}
                    className="hr-app-select w-full px-3 text-sm">
                    <option value="">{t('hire.placeholders.noManager', { ns: 'actions' })}</option>
                    {activeEmployees.map(e => (
                      <option key={e.employeeId} value={String(e.employeeId)}>{e.fullName} ({e.jobTitle})</option>
                    ))}
                  </select>
                </FieldRow>
              </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="hr-form-section">
              <div className="hr-form-section-header">
                <p className="hr-form-eyebrow">{t('hire.sections.compensationEyebrow', { ns: 'actions' })}</p>
              </div>
              <div className="hr-form-section-body">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <HrSalaryRangeInput
                  label={t('hire.fields.annualSalary', { ns: 'actions' })}
                  value={form.salary}
                  onChange={v => set('salary', v)}
                  min={selectedJob ? Number(selectedJob.minSalary) : undefined}
                  max={selectedJob ? Number(selectedJob.maxSalary) : undefined}
                  showRange={!!selectedJob}
                  error={errors.salary}
                />
                <FieldRow label={t('hire.fields.commissionPct', { ns: 'actions' })}>
                  <Input type="number" value={form.commissionPct} onChange={v => set('commissionPct', v)} placeholder={t('hire.placeholders.commissionPct', { ns: 'actions' })} />
                  <p className="hr-field-hint">{t('hire.hints.commissionPct', { ns: 'actions' })}</p>
                </FieldRow>
                <div className="md:col-span-2">
                  <FieldRow label={t('hire.fields.employmentType', { ns: 'actions' })} required>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'] as const).map(type => (
                        <label key={type} className="cursor-pointer">
                          <input type="radio" name="empType" value={type} checked={form.employmentType === type}
                            onChange={() => set('employmentType', type)} className="sr-only" />
                          <span className="hr-selection-tile" data-selected={form.employmentType === type}>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--hr-border-strong)] bg-white text-[11px] font-semibold text-[color:var(--hr-text-subtle)]">
                              {type.slice(0, 1)}
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-[color:var(--hr-text)]">{t(`employmentType.${type}`, { ns: 'common' })}</span>
                              <span className="block text-xs text-[color:var(--hr-text-subtle)]">
                                {t(`hire.employmentTypeDescriptions.${type}`, { ns: 'actions' })}
                              </span>
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </FieldRow>
                </div>
                {form.employmentType === 'CONTRACT' && (
                  <FieldRow label={t('hire.fields.contractEndDate', { ns: 'actions' })}>
                    <Input type="date" value={form.contractEndDate} onChange={v => set('contractEndDate', v)} />
                  </FieldRow>
                )}
              </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="hr-form-section">
              <div className="hr-form-section-header">
                <p className="hr-form-eyebrow">{t('hire.sections.reviewEyebrow', { ns: 'actions' })}</p>
              </div>
              <div className="hr-form-section-body">
              <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ReviewRow label={t('hire.reviewLabels.name', { ns: 'actions' })} value={`${form.firstName} ${form.lastName}`} />
                <ReviewRow label={t('hire.fields.email', { ns: 'actions' })} value={form.email} />
                <ReviewRow label={t('hire.fields.phone', { ns: 'actions' })} value={form.phone} />
                <ReviewRow label={t('hire.fields.hireDate', { ns: 'actions' })} value={form.hireDate} />
                <ReviewRow label={t('hire.reviewLabels.job', { ns: 'actions' })} value={selectedJob?.jobTitle} />
                <ReviewRow label={t('hire.reviewLabels.department', { ns: 'actions' })} value={selectedDept?.departmentName} />
                <ReviewRow label={t('hire.reviewLabels.salary', { ns: 'actions' })} value={form.salary ? formatCurrency(form.salary, preferences.currency, locale, 0) : undefined} />
                <ReviewRow label={t('hire.reviewLabels.employmentType', { ns: 'actions' })} value={t(`employmentType.${form.employmentType}`, { ns: 'common' })} />
                {form.contractEndDate && <ReviewRow label={t('hire.reviewLabels.contractEndDate', { ns: 'actions' })} value={form.contractEndDate} />}
              </dl>
              <div className="mt-4 rounded-[0.9rem] border border-[color:var(--color-warning-200)] bg-[color:var(--color-warning-50)] px-4 py-3 text-xs font-medium text-[color:var(--color-warning-700)]">
                {t('hire.reviewConfirmation', { ns: 'actions', label: t('hire.submit', { ns: 'actions' }) })}
              </div>
              </div>
            </div>
          )}
          </HrWizard>
        </div>
      </div>
    </div>
  )
}

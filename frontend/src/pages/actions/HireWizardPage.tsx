import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { HrWizard, type WizardStep } from '@/components/hr/HrWizard'
import { HrSalaryRangeInput } from '@/components/hr/HrSalaryRangeInput'
import { useHireEmployee, useEmployees } from '@/api/employees'
import { useDepartments } from '@/api/departments'
import { useJobs, type Job } from '@/api/jobs'

const STEPS: WizardStep[] = [
  { id: 'personal', label: 'Personal', description: 'Basic info' },
  { id: 'job', label: 'Job', description: 'Role & location' },
  { id: 'compensation', label: 'Compensation', description: 'Salary & type' },
  { id: 'review', label: 'Review', description: 'Confirm & hire' },
]

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
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder, disabled }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-neutral-50 disabled:opacity-60" />
  )
}

export function HireWizardPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const hire = useHireEmployee()
  const { data: jobs } = useJobs()
  const { data: departments } = useDepartments()
  const { data: pagedEmployees } = useEmployees()

  const activeEmployees = (pagedEmployees?.data ?? []).filter(e => e.employmentStatus === 'ACTIVE')
  const set = (key: keyof FormData, value: string | number | undefined) =>
    setForm(f => ({ ...f, [key]: value }))

  const selectedJob: Job | undefined = (jobs ?? []).find(j => j.jobId === form.jobId)
  const selectedDept = (departments ?? []).find(d => String(d.departmentId) === form.departmentId)

  function validateStep(s: number): boolean {
    const e: typeof errors = {}
    if (s === 0) {
      if (!form.firstName) e.firstName = 'Required'
      if (!form.lastName) e.lastName = 'Required'
      if (!form.email) e.email = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
      if (!form.hireDate) e.hireDate = 'Required'
      if (!form.initialPassword) e.initialPassword = 'Required'
      else if (form.initialPassword.length < 8) e.initialPassword = 'Min 8 characters'
    }
    if (s === 1) {
      if (!form.jobId) e.jobId = 'Required'
      if (!form.departmentId) e.departmentId = 'Required'
    }
    if (s === 2) {
      if (!form.salary) e.salary = 'Required'
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
      toast.success(`${form.firstName} ${form.lastName} has been hired successfully!`)
      navigate('/hr/employees')
    } catch {
      toast.error('Failed to hire employee. Please try again.')
    }
  }

  function ReviewRow({ label, value }: { label: string; value: string | undefined }) {
    return (
      <div className="flex gap-4 text-sm py-2 border-b border-neutral-100 last:border-0">
        <dt className="w-40 text-neutral-500 flex-shrink-0">{label}</dt>
        <dd className="text-neutral-800 font-medium">{value || '—'}</dd>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Hire Employee</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Complete all steps to onboard a new employee</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <HrWizard
          steps={STEPS}
          currentStep={step}
          onNext={handleNext}
          onBack={() => setStep(s => s - 1)}
          onSubmit={handleSubmit}
          submitLabel="Hire Employee"
          loading={hire.isPending}
        >
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="First Name" required error={errors.firstName}>
                  <Input value={form.firstName} onChange={v => set('firstName', v)} placeholder="Jane" />
                </FieldRow>
                <FieldRow label="Last Name" required error={errors.lastName}>
                  <Input value={form.lastName} onChange={v => set('lastName', v)} placeholder="Smith" />
                </FieldRow>
              </div>
              <FieldRow label="Email" required error={errors.email}>
                <Input type="email" value={form.email} onChange={v => set('email', v)} placeholder="jane.smith@company.com" />
              </FieldRow>
              <FieldRow label="Phone" error={errors.phone}>
                <Input value={form.phone} onChange={v => set('phone', v)} placeholder="+1 555-0100" />
              </FieldRow>
              <FieldRow label="Hire Date" required error={errors.hireDate}>
                <Input type="date" value={form.hireDate} onChange={v => set('hireDate', v)} />
              </FieldRow>
              <FieldRow label="Initial Password" required error={errors.initialPassword}>
                <Input type="password" value={form.initialPassword} onChange={v => set('initialPassword', v)} placeholder="Min 8 characters" />
              </FieldRow>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <FieldRow label="Job Title" required error={errors.jobId}>
                <select value={form.jobId} onChange={e => set('jobId', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select job...</option>
                  {(jobs ?? []).map(j => <option key={j.jobId} value={j.jobId}>{j.jobTitle} ({j.jobId})</option>)}
                </select>
              </FieldRow>
              {selectedJob && (
                <div className="px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                  Salary band: ${Number(selectedJob.minSalary).toLocaleString()} – ${Number(selectedJob.maxSalary).toLocaleString()}
                </div>
              )}
              <FieldRow label="Department" required error={errors.departmentId}>
                <select value={form.departmentId} onChange={e => set('departmentId', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select department...</option>
                  {(departments ?? []).map(d => (
                    <option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Manager">
                <select value={form.managerId} onChange={e => set('managerId', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">No manager</option>
                  {activeEmployees.map(e => (
                    <option key={e.employeeId} value={String(e.employeeId)}>{e.fullName} ({e.jobTitle})</option>
                  ))}
                </select>
              </FieldRow>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <HrSalaryRangeInput
                label="Annual Salary"
                value={form.salary}
                onChange={v => set('salary', v)}
                min={selectedJob ? Number(selectedJob.minSalary) : undefined}
                max={selectedJob ? Number(selectedJob.maxSalary) : undefined}
                showRange={!!selectedJob}
                error={errors.salary}
              />
              <FieldRow label="Commission %">
                <Input type="number" value={form.commissionPct} onChange={v => set('commissionPct', v)} placeholder="0.20" />
                <p className="mt-1 text-xs text-neutral-500">Enter as decimal: 0.20 = 20%</p>
              </FieldRow>
              <FieldRow label="Employment Type" required>
                <div className="grid grid-cols-2 gap-2">
                  {(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'] as const).map(t => (
                    <label key={t} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                      form.employmentType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-neutral-200 hover:bg-neutral-50'
                    }`}>
                      <input type="radio" name="empType" value={t} checked={form.employmentType === t}
                        onChange={() => set('employmentType', t)} className="sr-only" />
                      {t.replace('_', ' ')}
                    </label>
                  ))}
                </div>
              </FieldRow>
              {form.employmentType === 'CONTRACT' && (
                <FieldRow label="Contract End Date">
                  <Input type="date" value={form.contractEndDate} onChange={v => set('contractEndDate', v)} />
                </FieldRow>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Review Hire Details</h3>
              <dl>
                <ReviewRow label="Full Name" value={`${form.firstName} ${form.lastName}`} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Phone" value={form.phone} />
                <ReviewRow label="Hire Date" value={form.hireDate} />
                <ReviewRow label="Job" value={selectedJob?.jobTitle} />
                <ReviewRow label="Department" value={selectedDept?.departmentName} />
                <ReviewRow label="Salary" value={form.salary ? `$${form.salary.toLocaleString()}` : undefined} />
                <ReviewRow label="Employment Type" value={form.employmentType.replace('_', ' ')} />
                {form.contractEndDate && <ReviewRow label="Contract End" value={form.contractEndDate} />}
              </dl>
              <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                By clicking "Hire Employee", you confirm all details are accurate. An account will be created for this employee.
              </div>
            </div>
          )}
        </HrWizard>
      </div>
    </div>
  )
}

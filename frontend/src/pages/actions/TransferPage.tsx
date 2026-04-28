import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Building2, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/Button'
import { PageHeader, PageHeaderMetaItem } from '@/components/ui/PageHeader'
import { useEmployee, useEmployees, useTransferEmployee } from '@/api/employees'
import { useDepartments } from '@/api/departments'

export function TransferPage() {
  const { t } = useTranslation(['actions', 'common', 'employees'])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newDeptId, setNewDeptId] = useState('')
  const [newManagerId, setNewManagerId] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')

  const employeeId = Number(id)
  const { data: employee, isLoading } = useEmployee(employeeId)
  const { data: pagedEmployees } = useEmployees({ size: 500, sort: 'lastName' })
  const { data: departments } = useDepartments()
  const transfer = useTransferEmployee()

  const activeEmployees = (pagedEmployees?.data ?? []).filter(e => e.employmentStatus === 'ACTIVE' && e.employeeId !== employeeId)

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">{t('loading', { ns: 'common' })}</div>
  if (!employee) return <div className="p-8 text-sm text-neutral-500">{t('detail.notFound', { ns: 'employees' })}</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dept = (departments ?? []).find(d => String(d.departmentId) === newDeptId)
      await transfer.mutateAsync({
        employeeId,
        newDepartmentId: Number(newDeptId),
        newManagerId: newManagerId ? Number(newManagerId) : undefined,
        effectiveDate: effectiveDate || undefined,
        idempotencyKey: uuidv4(),
      })
      toast.success(t('transfer.toasts.success', { ns: 'actions', name: employee.fullName, department: dept?.departmentName ?? t('transfer.toasts.fallbackDepartment', { ns: 'actions' }) }))
      navigate(`/hr/employees/${employeeId}`)
    } catch {
      toast.error(t('transfer.toasts.error', { ns: 'actions' }))
    }
  }

  return (
    <div className="hr-list-page-shell">
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="hr-app-surface-elevated rounded-[1.25rem] p-4 sm:p-5">
        <PageHeader
          eyebrow={t('transfer.eyebrow', { ns: 'actions' })}
          title={t('transfer.title', { ns: 'actions' })}
          subtitle={t('transfer.subtitle', { ns: 'actions', departmentName: employee.departmentName })}
          surface="plain"
          breadcrumbs={[
            { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
            { label: employee.fullName, href: `/hr/employees/${employeeId}` },
            { label: t('detail.relatedActions.transfer.label', { ns: 'employees' }) },
          ]}
          meta={(
            <>
              <PageHeaderMetaItem label={t('transfer.meta.employee', { ns: 'actions' })} value={employee.fullName} icon={<ArrowLeftRight size={15} />} />
              <PageHeaderMetaItem label={t('transfer.meta.departments', { ns: 'actions' })} value={String(departments?.length ?? 0)} icon={<Building2 size={15} />} />
              <PageHeaderMetaItem label={t('transfer.meta.effective', { ns: 'actions' })} value={effectiveDate || t('pending', { ns: 'common' })} icon={<CalendarDays size={15} />} />
            </>
          )}
          className="mb-3 gap-2"
        />

          <form onSubmit={handleSubmit} className="space-y-5">
          <div className="hr-form-section">
            <div className="hr-form-section-header">
              <div>
                <p className="hr-form-eyebrow">{t('transfer.sectionEyebrow', { ns: 'actions' })}</p>
                <h3 className="mt-1 text-base font-semibold text-[color:var(--hr-text)]">{t('transfer.sectionTitle', { ns: 'actions' })}</h3>
              </div>
            </div>
            <div className="hr-form-section-body space-y-4">
          <div>
            <label className="hr-field-label">{t('transfer.fields.newDepartment', { ns: 'actions' })} <span className="text-red-500">*</span></label>
            <select value={newDeptId} onChange={e => setNewDeptId(e.target.value)} required
              className="hr-app-select w-full px-3 text-sm">
              <option value="">{t('transfer.placeholders.selectDepartment', { ns: 'actions' })}</option>
              {(departments ?? []).map(d => (
                <option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="hr-field-label">{t('transfer.fields.newManager', { ns: 'actions' })}</label>
            <select value={newManagerId} onChange={e => setNewManagerId(e.target.value)}
              className="hr-app-select w-full px-3 text-sm">
              <option value="">{t('transfer.placeholders.noChange', { ns: 'actions' })}</option>
              {activeEmployees.map(e => (
                <option key={e.employeeId} value={String(e.employeeId)}>{e.fullName} ({e.jobTitle})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="hr-field-label">{t('transfer.fields.effectiveDate', { ns: 'actions' })} <span className="text-red-500">*</span></label>
            <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} required
              className="hr-app-input w-full px-3" />
          </div>
          </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button type="submit" disabled={transfer.isPending || !newDeptId || !effectiveDate} loading={transfer.isPending}>
              {t('transfer.buttons.confirm', { ns: 'actions' })}
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

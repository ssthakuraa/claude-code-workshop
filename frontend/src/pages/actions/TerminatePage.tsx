import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { CalendarDays, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { HrConfirmDialog } from '@/components/hr/HrConfirmDialog'
import { HrStatusBadge } from '@/components/hr/HrStatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { PageHeader, PageHeaderMetaItem } from '@/components/ui/PageHeader'
import { useEmployee, useTerminateEmployee } from '@/api/employees'

export function TerminatePage() {
  const { t } = useTranslation(['actions', 'common', 'employees'])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const employeeId = Number(id)
  const { data: employee, isLoading } = useEmployee(employeeId)
  const terminate = useTerminateEmployee()

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">{t('loading', { ns: 'common' })}</div>
  if (!employee) return <div className="p-8 text-sm text-neutral-500">{t('detail.notFound', { ns: 'employees' })}</div>

  const handleTerminate = async () => {
    try {
      await terminate.mutateAsync({
        employeeId,
        reason,
        effectiveDate: effectiveDate || undefined,
        idempotencyKey: uuidv4(),
      })
      toast.success(t('terminate.toasts.success', { ns: 'actions', name: employee.fullName }))
      navigate(`/hr/employees/${employeeId}`)
    } catch {
      toast.error(t('terminate.toasts.error', { ns: 'actions' }))
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <div className="hr-list-page-shell">
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="hr-app-surface-elevated space-y-4 rounded-[1.25rem] p-4 sm:p-5">
        <PageHeader
          eyebrow={t('terminate.eyebrow', { ns: 'actions' })}
          title={t('terminate.title', { ns: 'actions' })}
          subtitle={t('terminate.subtitle', { ns: 'actions' })}
          surface="plain"
          breadcrumbs={[
            { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
            { label: employee.fullName, href: `/hr/employees/${employeeId}` },
            { label: t('detail.relatedActions.terminate.label', { ns: 'employees' }) },
          ]}
          meta={(
            <>
              <PageHeaderMetaItem label={t('terminate.meta.employee', { ns: 'actions' })} value={employee.fullName} icon={<UserX size={15} />} />
              <PageHeaderMetaItem label={t('terminate.meta.currentStatus', { ns: 'actions' })} value={t(`employmentStatus.${employee.employmentStatus}`, { ns: 'common' })} icon={<UserX size={15} />} />
              <PageHeaderMetaItem label={t('terminate.meta.effective', { ns: 'actions' })} value={effectiveDate || t('pending', { ns: 'common' })} icon={<CalendarDays size={15} />} />
            </>
          )}
          className="mb-3 gap-2"
        />

        <div className="hr-entity-banner">
          <Avatar name={employee.fullName} size="md" />
          <div>
            <div className="font-medium text-[color:var(--hr-text)]">{employee.fullName}</div>
            <div className="text-xs text-[color:var(--hr-text-subtle)]">{employee.jobTitle} · {employee.departmentName}</div>
          </div>
          <div className="ml-auto"><HrStatusBadge status={employee.employmentStatus} size="sm" /></div>
        </div>

        <div className="hr-form-section">
          <div className="hr-form-section-header">
            <div>
              <p className="hr-form-eyebrow">{t('terminate.sectionEyebrow', { ns: 'actions' })}</p>
              <h3 className="mt-1 text-base font-semibold text-[color:var(--hr-text)]">{t('terminate.sectionTitle', { ns: 'actions' })}</h3>
            </div>
          </div>
          <div className="hr-form-section-body space-y-4">
          <div>
            <label className="hr-field-label">{t('terminate.fields.effectiveDate', { ns: 'actions' })} <span className="text-red-500">*</span></label>
            <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)}
              className="hr-app-input w-full px-3" />
          </div>
          <div>
            <label className="hr-field-label">{t('terminate.fields.reason', { ns: 'actions' })} <span className="text-red-500">*</span></label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder={t('terminate.placeholders.reason', { ns: 'actions' })}
              className="hr-app-textarea w-full px-3" />
            <p className="hr-field-hint">{t('terminate.hint', { ns: 'actions' })}</p>
          </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button type="button" variant="danger" onClick={() => setConfirmOpen(true)} disabled={!effectiveDate || !reason.trim()}>
            {t('terminate.buttons.terminate', { ns: 'actions' })}
          </Button>
        </div>
        </div>
      </div>

      <HrConfirmDialog
        open={confirmOpen}
        title={t('terminate.dialog.title', { ns: 'actions' })}
        description={t('terminate.dialog.description', { ns: 'actions', name: employee.fullName })}
        confirmLabel={t('terminate.buttons.confirm', { ns: 'actions' })}
        variant="danger"
        loading={terminate.isPending}
        onConfirm={handleTerminate}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

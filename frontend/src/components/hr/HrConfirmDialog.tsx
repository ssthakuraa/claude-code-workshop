import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface HrConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function HrConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  loading,
  onConfirm,
  onCancel,
}: HrConfirmDialogProps) {
  const { t } = useTranslation(['common'])
  const iconColor = variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-amber-500' : 'text-[color:var(--hr-shell-accent)]'
  const iconBg = variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-[color:var(--hr-shell-accent-soft)]'
  const confirmVariant = variant === 'danger' ? 'danger' : 'primary'
  const resolvedConfirmLabel = confirmLabel ?? t('confirm', { ns: 'common' })
  const resolvedCancelLabel = cancelLabel ?? t('cancel', { ns: 'common' })

  return (
    <Modal open={open} onClose={onCancel} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-black/5 ${iconBg}`}>
            <AlertTriangle size={20} className={iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 text-base font-semibold tracking-[-0.01em] text-[color:var(--hr-text)]">{title}</h3>
            <p className="text-sm leading-6 text-[color:var(--hr-text-muted)]">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {resolvedCancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

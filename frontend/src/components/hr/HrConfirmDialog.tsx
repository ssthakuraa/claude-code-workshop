import { AlertTriangle } from 'lucide-react'
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
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading,
  onConfirm,
  onCancel,
}: HrConfirmDialogProps) {
  const iconColor = variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-amber-500' : 'text-blue-500'
  const iconBg = variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
  const confirmVariant = variant === 'danger' ? 'danger' : 'primary'

  return (
    <Modal open={open} onClose={onCancel} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <AlertTriangle size={20} className={iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

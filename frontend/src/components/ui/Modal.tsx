import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: ReactNode
  footer?: ReactNode
  closeOnOverlay?: boolean
}

const sizeClasses = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
}

export function Modal({ open, onClose, title, description, size = 'md', children, footer, closeOnOverlay = true }: ModalProps) {
  const { t } = useTranslation(['common'])
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-label={!title ? t('ui.dialog', { ns: 'common' }) : undefined}
        className={cn(
          'relative z-10 w-full rounded-[1.25rem] border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface)] shadow-[var(--shadow-lg)]',
          'flex flex-col max-h-[90vh]',
          sizeClasses[size],
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-6 pb-4 pt-5">
            <div>
              {title && <h2 id="modal-title" className="text-lg font-semibold tracking-[-0.01em] text-[color:var(--hr-text)]">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-[color:var(--hr-text-subtle)]">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('ui.close', { ns: 'common' })}
              className="ml-4 rounded-lg p-1.5 text-[color:var(--hr-text-subtle)] transition-colors hover:bg-white hover:text-[color:var(--hr-text)] focus-visible:ring-2 focus-visible:ring-[color:var(--hr-focus-line)]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 border-t border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/** Convenience: standard confirm dialog */
export interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel, cancelLabel, danger, loading }: ConfirmModalProps) {
  const { t } = useTranslation(['common'])
  const resolvedConfirmLabel = confirmLabel ?? t('confirm', { ns: 'common' })
  const resolvedCancelLabel = cancelLabel ?? t('cancel', { ns: 'common' })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>{resolvedCancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{resolvedConfirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-neutral-600">{message}</p>
    </Modal>
  )
}

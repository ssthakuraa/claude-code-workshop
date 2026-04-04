import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
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
        aria-label={!title ? 'Dialog' : undefined}
        className={cn(
          'relative z-10 w-full bg-white rounded-xl shadow-xl',
          'flex flex-col max-h-[90vh]',
          sizeClasses[size],
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100">
            <div>
              {title && <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">{title}</h2>}
              {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-4 p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-2">
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

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, loading }: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-neutral-600">{message}</p>
    </Modal>
  )
}

/**
 * CreateDrawerTemplate — side drawer with sectioned form layout.
 * Slides in from the right; good for longer forms that don't warrant a full page.
 */
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Button } from '../ui/Button'

export interface CreateDrawerTemplateProps {
  open: boolean
  onClose: () => void
  onSubmit?: () => void
  title: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  width?: string
  children: ReactNode
}

export function CreateDrawerTemplate({ open, onClose, onSubmit, title, description, submitLabel = 'Save', cancelLabel = 'Cancel', loading, width = 'w-[480px]', children }: CreateDrawerTemplateProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, loading, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} aria-hidden="true" />
      {/* Drawer */}
      <div className={cn('relative z-10 flex flex-col h-full bg-white shadow-2xl', width)}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
            {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="ml-4 p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">{children}</div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-2 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          {onSubmit && <Button variant="primary" onClick={onSubmit} loading={loading}>{submitLabel}</Button>}
        </div>
      </div>
    </div>
  )
}

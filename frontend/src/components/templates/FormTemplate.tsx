/**
 * FormTemplate — full-page create/edit form layout.
 * Two-column (main + sidebar) or single-column depending on hasSidebar.
 */
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import { PageHeader, type PageHeaderProps } from '../ui/PageHeader'

export interface FormTemplateProps extends PageHeaderProps {
  children: ReactNode
  sidebar?: ReactNode
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  className?: string
}

export function FormTemplate({ children, sidebar, onSubmit, onCancel, submitLabel = 'Save', cancelLabel = 'Cancel', loading, className, ...headerProps }: FormTemplateProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <PageHeader {...headerProps} />
      <div className={cn('flex gap-6 items-start', sidebar ? 'flex-row' : 'flex-col')}>
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {children}
          {(onSubmit || onCancel) && (
            <div className="flex items-center gap-2 pt-2">
              {onCancel && <Button variant="ghost" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>}
              {onSubmit && <Button variant="primary" onClick={onSubmit} loading={loading}>{submitLabel}</Button>}
            </div>
          )}
        </div>
        {sidebar && <div className="w-72 shrink-0">{sidebar}</div>}
      </div>
    </div>
  )
}

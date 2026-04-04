/**
 * CreateSimpleTemplate — modal-based quick-create (single-screen forms).
 */
import type { ReactNode } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export interface CreateSimpleTemplateProps {
  open: boolean
  onClose: () => void
  onSubmit?: () => void
  title: string
  description?: string
  submitLabel?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

export function CreateSimpleTemplate({ open, onClose, onSubmit, title, description, submitLabel = 'Create', loading, size = 'md', children }: CreateSimpleTemplateProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      closeOnOverlay={!loading}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          {onSubmit && <Button variant="primary" onClick={onSubmit} loading={loading}>{submitLabel}</Button>}
        </>
      }
    >
      {children}
    </Modal>
  )
}

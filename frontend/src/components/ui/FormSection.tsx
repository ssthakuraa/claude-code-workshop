import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

export function FormSection({ title, description, children, collapsible, defaultOpen = true, className }: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn('rounded-lg border border-neutral-200 bg-white overflow-hidden', className)}>
      <div
        className={cn(
          'flex items-center justify-between px-5 py-4 border-b border-neutral-100',
          collapsible && 'cursor-pointer select-none hover:bg-neutral-50 transition-colors',
        )}
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
      >
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
        </div>
        {collapsible && (
          <ChevronDown size={16} className={cn('text-neutral-400 transition-transform', open && 'rotate-180')} />
        )}
      </div>
      {(!collapsible || open) && (
        <div className="px-5 py-5">{children}</div>
      )}
    </div>
  )
}

export interface ContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
}

const maxWidthMap = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
}

export function Container({ children, maxWidth = 'xl', className }: ContainerProps) {
  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6', maxWidthMap[maxWidth], className)}>
      {children}
    </div>
  )
}

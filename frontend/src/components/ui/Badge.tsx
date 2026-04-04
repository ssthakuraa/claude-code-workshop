import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-neutral-100 text-neutral-700',
  primary:  'bg-primary-50  text-primary-700',
  success:  'bg-success-50  text-success-700',
  warning:  'bg-warning-50  text-warning-700',
  error:    'bg-error-50    text-error-700',
  info:     'bg-info-50     text-info-700',
  neutral:  'bg-neutral-200 text-neutral-600',
}

const dotClasses: Record<BadgeVariant, string> = {
  default:  'bg-neutral-400',
  primary:  'bg-primary-500',
  success:  'bg-success-500',
  warning:  'bg-warning-500',
  error:    'bg-error-500',
  info:     'bg-info-500',
  neutral:  'bg-neutral-500',
}

/**
 * Map DB ENUM values to badge variants — single source of truth for status colors
 */
export const statusVariant: Record<string, BadgeVariant> = {
  // Lease
  draft: 'neutral', active: 'success', expired: 'error', terminated: 'error',
  pending_signature: 'warning', renewed: 'info', evicted: 'error',
  // Payment
  completed: 'success', failed: 'error', returned: 'error', refunded: 'info',
  pending: 'warning', processing: 'info', chargeback: 'error',
  // Work order / Maintenance
  open: 'warning', assigned: 'primary', in_progress: 'info', on_hold: 'neutral',
  closed: 'neutral', canceled: 'neutral',
  submitted: 'warning', acknowledged: 'info', work_order_created: 'primary',
  // Tenant / Resident
  applicant: 'neutral', approved: 'success', notice_given: 'warning',
  past: 'neutral', evicted_r: 'error',
  // Unit
  occupied: 'success', vacant: 'warning', under_renovation: 'neutral', offline: 'error',
  // Lead
  inquiry: 'neutral', contacted: 'info', tour_scheduled: 'primary', toured: 'primary',
  applied: 'warning', leased: 'success', lost: 'error',
  // Vendor
  suspended: 'error', inactive: 'neutral',
  // Priority
  emergency: 'error', urgent: 'warning', routine: 'primary', low: 'neutral',
  scheduled: 'info',
}

export function Badge({ variant = 'default', size = 'md', dot, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClasses[variant])} />}
      {children}
    </span>
  )
}

/** Convenience: render a status badge from any DB ENUM string */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = statusVariant[status] ?? 'neutral'
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return <Badge variant={variant} dot className={className}>{label}</Badge>
}

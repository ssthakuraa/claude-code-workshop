import { cn } from '@/utils/cn'

type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'PROBATION'

interface HrStatusBadgeProps {
  status: EmploymentStatus
  size?: 'sm' | 'md'
  showDot?: boolean
}

const STATUS_CONFIG: Record<EmploymentStatus, { label: string; dot: string; text: string; bg: string }> = {
  ACTIVE: { label: 'Active', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  PROBATION: { label: 'Probation', dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  ON_LEAVE: { label: 'On Leave', dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
  TERMINATED: { label: 'Terminated', dot: 'bg-neutral-400', text: 'text-neutral-600', bg: 'bg-neutral-100' },
}

export function HrStatusBadge({ status, size = 'md', showDot = true }: HrStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.TERMINATED
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      config.bg,
      config.text,
    )}>
      {showDot && <span className={cn('rounded-full flex-shrink-0', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />}
      {config.label}
    </span>
  )
}

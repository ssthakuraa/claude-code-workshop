import { cn } from '@/utils/cn'

type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'

interface HrEmploymentTypeBadgeProps {
  type: EmploymentType
  size?: 'sm' | 'md'
}

const TYPE_CONFIG: Record<EmploymentType, { label: string; classes: string }> = {
  FULL_TIME: { label: 'Full-Time', classes: 'border-blue-300 text-blue-700 bg-blue-50' },
  PART_TIME: { label: 'Part-Time', classes: 'border-purple-300 text-purple-700 bg-purple-50' },
  CONTRACT: { label: 'Contract', classes: 'border-amber-300 text-amber-700 bg-amber-50' },
  INTERN: { label: 'Intern', classes: 'border-neutral-300 text-neutral-600 bg-neutral-50' },
}

export function HrEmploymentTypeBadge({ type, size = 'md' }: HrEmploymentTypeBadgeProps) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.FULL_TIME
  return (
    <span className={cn(
      'inline-flex items-center rounded border font-medium',
      size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs',
      config.classes,
    )}>
      {config.label}
    </span>
  )
}

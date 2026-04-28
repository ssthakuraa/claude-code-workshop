import { cn } from '@/utils/cn'
import { useTranslation } from 'react-i18next'

type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'PROBATION'

interface HrStatusBadgeProps {
  status: EmploymentStatus
  size?: 'sm' | 'md'
  showDot?: boolean
}

const STATUS_CONFIG: Record<EmploymentStatus, { fallbackKey: `employmentStatus.${EmploymentStatus}`; dot: string; text: string; bg: string; border: string }> = {
  ACTIVE: { fallbackKey: 'employmentStatus.ACTIVE', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  PROBATION: { fallbackKey: 'employmentStatus.PROBATION', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  ON_LEAVE: { fallbackKey: 'employmentStatus.ON_LEAVE', dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  TERMINATED: { fallbackKey: 'employmentStatus.TERMINATED', dot: 'bg-neutral-400', text: 'text-neutral-600', bg: 'bg-neutral-100', border: 'border-neutral-200' },
}

export function HrStatusBadge({ status, size = 'md', showDot = true }: HrStatusBadgeProps) {
  const { t } = useTranslation(['common'])
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.TERMINATED
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-md border font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      config.bg,
      config.text,
      config.border,
    )}>
      {showDot && <span className={cn('rounded-full flex-shrink-0', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />}
      {t(`employmentStatus.${status}`, {
        ns: 'common',
        defaultValue: t(config.fallbackKey, { ns: 'common', defaultValue: status }),
      })}
    </span>
  )
}

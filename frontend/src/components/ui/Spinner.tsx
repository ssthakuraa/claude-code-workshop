import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeMap: Record<SpinnerSize, number> = { xs: 12, sm: 16, md: 24, lg: 32, xl: 48 }

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2', className)}>
      <Loader2 size={sizeMap[size]} className="animate-spin text-primary-600" />
      {label && <span className="text-sm text-neutral-500">{label}</span>}
    </span>
  )
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[240px] gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  )
}

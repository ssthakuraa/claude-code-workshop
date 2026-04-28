import { cn } from '@/utils/cn'

interface HrSkeletonProps {
  variant?: 'text' | 'card' | 'table' | 'chart' | 'avatar'
  count?: number
  width?: string | number
  height?: string | number
  className?: string
}

function SkeletonBlock({ width, height, className }: { width?: string | number; height?: string | number; className?: string }) {
  return (
    <div
      className={cn('animate-pulse bg-neutral-200 rounded', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

export function HrSkeleton({ variant = 'text', count = 1, width, height, className }: HrSkeletonProps) {
  const items = Array.from({ length: count })

  if (variant === 'avatar') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="w-10 h-10 rounded-full animate-pulse bg-neutral-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock height={14} width="60%" />
          <SkeletonBlock height={12} width="40%" />
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('bg-white rounded-lg border border-neutral-200 p-4 animate-pulse', className)}>
        <SkeletonBlock height={16} width="50%" className="mb-3" />
        <SkeletonBlock height={32} width="40%" className="mb-2" />
        <SkeletonBlock height={12} width="30%" />
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-2', className)}>
        {items.map((_, i) => (
          <div key={i} className="flex gap-4 items-center py-2 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-full animate-pulse bg-neutral-200" />
            <SkeletonBlock height={14} width="20%" />
            <SkeletonBlock height={14} width="15%" />
            <SkeletonBlock height={14} width="15%" />
            <SkeletonBlock height={20} width="10%" className="rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div className={cn('bg-white rounded-lg border border-neutral-200 p-4 animate-pulse', className)}>
        <SkeletonBlock height={16} width="40%" className="mb-4" />
        <SkeletonBlock height={height ?? 200} />
      </div>
    )
  }

  // text (default)
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((_, i) => (
        <SkeletonBlock key={i} height={height ?? 14} width={width ?? (i % 3 === 2 ? '60%' : '100%')} />
      ))}
    </div>
  )
}

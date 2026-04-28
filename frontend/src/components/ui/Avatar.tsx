import { cn } from '@/utils/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Deterministic color from name
const colors = [
  'bg-primary-100 text-primary-700',
  'bg-success-100 text-success-700',
  'bg-warning-100 text-warning-700',
  'bg-error-100 text-error-700',
  'bg-info-100 text-info-700',
  'bg-neutral-200 text-neutral-700',
]

function getColor(name?: string): string {
  if (!name) return colors[5]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full font-semibold shrink-0', sizeClasses[size], !src && getColor(name), className)}>
      {src ? (
        <img src={src} alt={name ?? ''} className="w-full h-full rounded-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}

export interface AvatarGroupProps {
  avatars: AvatarProps[]
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max
  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((a, i) => (
        <span key={i} className="ring-2 ring-white rounded-full">
          <Avatar {...a} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span className={cn('inline-flex items-center justify-center rounded-full ring-2 ring-white bg-neutral-200 text-neutral-700 font-semibold text-xs shrink-0', sizeClasses[size])}>
          +{overflow}
        </span>
      )}
    </div>
  )
}

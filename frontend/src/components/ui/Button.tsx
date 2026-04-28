import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  children?: ReactNode
}

const variantClasses = {
  primary: [
    'border border-[color:var(--hr-shell-accent)]',
    'bg-[linear-gradient(180deg,var(--hr-shell-accent),var(--hr-shell-accent-strong))]',
    'text-white shadow-[0_8px_20px_rgba(44,105,117,0.18)]',
    'hover:-translate-y-px hover:shadow-[0_12px_24px_rgba(44,105,117,0.2)]',
    'active:translate-y-0 active:shadow-[0_6px_14px_rgba(44,105,117,0.16)]',
    'disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none',
  ].join(' '),
  secondary: [
    'border border-[color:var(--hr-border-strong)] bg-white text-[color:var(--hr-text)] shadow-[var(--shadow-xs)]',
    'hover:-translate-y-px hover:border-[color:var(--hr-shell-accent)] hover:bg-[color:var(--hr-shell-accent-soft)] hover:text-[color:var(--hr-shell-accent-strong)]',
    'active:translate-y-0 active:bg-[color:var(--hr-surface-emphasis)]',
    'disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none',
  ].join(' '),
  ghost: [
    'border border-transparent bg-transparent text-[color:var(--hr-text-muted)]',
    'hover:bg-[color:var(--hr-surface-emphasis)] hover:text-[color:var(--hr-text)]',
    'active:bg-[color:var(--hr-border-subtle)] disabled:text-neutral-400',
  ].join(' '),
  danger: [
    'border border-[color:var(--color-error-600)] bg-[linear-gradient(180deg,var(--color-error-500),var(--color-error-600))]',
    'text-white shadow-[0_10px_22px_rgba(185,28,28,0.16)]',
    'hover:-translate-y-px hover:shadow-[0_14px_26px_rgba(185,28,28,0.18)]',
    'active:translate-y-0 active:shadow-[0_6px_14px_rgba(185,28,28,0.14)]',
    'disabled:border-red-200 disabled:bg-red-200 disabled:text-white/80 disabled:shadow-none',
  ].join(' '),
}

const sizeClasses = {
  sm: 'min-h-9 px-3.5 text-sm gap-1.5',
  md: 'min-h-10 px-4.5 text-sm gap-2',
  lg: 'min-h-12 px-5.5 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hr-focus-line)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--hr-shell-bg)]',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading && <Loader2 className="animate-spin shrink-0" size={size === 'lg' ? 18 : 16} />}
      {!loading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  )
}

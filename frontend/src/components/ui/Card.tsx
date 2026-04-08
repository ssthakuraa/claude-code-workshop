import { cn } from '@/utils/cn'
import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  header?: ReactNode
  children: ReactNode
}

const variantClasses = {
  default:  'bg-white border border-neutral-200',
  elevated: 'bg-white shadow-md border border-neutral-100',
  outlined: 'bg-transparent border-2 border-neutral-200',
}

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export function Card({ variant = 'default', padding = 'md', className, header, children, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-lg', variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    >
      {header && <div className="mb-4">{header}</div>}
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-neutral-900', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}

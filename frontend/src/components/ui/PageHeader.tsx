import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'

export interface PageHeaderProps {
  title: string
  eyebrow?: string
  subtitle?: string
  titleClassName?: string
  subtitleClassName?: string
  breadcrumbs?: BreadcrumbItem[]
  meta?: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  searchBar?: ReactNode
  bookmark?: {
    id: string
    label?: string
  }
  children?: ReactNode
  surface?: 'default' | 'plain'
  compact?: boolean
  className?: string
}

export interface PageHeaderMetaItemProps {
  label: string
  value?: string
  icon?: ReactNode
  className?: string
}

export function PageHeaderMetaItem({ label, value, icon, className }: PageHeaderMetaItemProps) {
  return (
    <div className={cn('hr-page-header-meta', className)}>
      {icon && <span className="shrink-0 text-[color:var(--hr-shell-accent)]">{icon}</span>}
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">
        {label}
      </span>
      {value && <span className="text-sm font-semibold text-[color:var(--hr-text)]">{value}</span>}
    </div>
  )
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  titleClassName,
  subtitleClassName,
  breadcrumbs,
  meta,
  badges,
  actions,
  searchBar,
  children,
  surface = 'default',
  compact = false,
  className,
}: PageHeaderProps) {
  const contentSpacingClass = compact
    ? 'space-y-1.5'
    : surface === 'plain'
      ? 'space-y-1.5'
      : 'space-y-2.5'
  const titleBlockSpacingClass = compact
    ? 'space-y-1'
    : surface === 'plain'
      ? 'space-y-1'
      : 'space-y-1.5'
  const titleSizeClass = compact
    ? 'text-[clamp(1.45rem,2.1vw,1.9rem)]'
    : surface === 'plain'
      ? 'text-[clamp(1.2rem,1.7vw,1.55rem)]'
      : 'text-[clamp(1.6rem,2.4vw,2.15rem)]'
  const subtitleSizeClass = compact || surface === 'plain'
    ? 'text-[13px] leading-4.5'
    : 'text-sm leading-5'
  const showMeta = Boolean(meta) && surface !== 'plain'

  return (
    <section
      className={cn(
        'mb-4 flex flex-col',
        compact ? 'gap-2' : 'gap-3',
        surface === 'default'
          ? cn('hr-page-header rounded-[1.2rem] px-4 sm:px-5', compact ? 'py-3 sm:py-3.5' : 'py-4')
          : 'bg-transparent px-0 py-0',
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="text-xs" />
      )}

      <div className={cn('flex flex-col lg:flex-row lg:items-start lg:justify-between', compact ? 'gap-3' : 'gap-4')}>
        <div className={cn('min-w-0 flex-1', contentSpacingClass)}>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--hr-shell-accent)]">
              {eyebrow}
            </p>
          )}

            <div className={cn(titleBlockSpacingClass)}>
              <div className="flex flex-wrap items-start gap-3">
                <h1 className={cn('hr-app-heading font-semibold leading-tight', titleSizeClass, titleClassName)}>
                  {title}
                </h1>
              </div>
              {subtitle && (
              <p className={cn('max-w-3xl text-[color:var(--hr-text-muted)]', subtitleSizeClass, subtitleClassName)}>{subtitle}</p>
              )}
            </div>

          {searchBar && <div className="max-w-3xl">{searchBar}</div>}
          {showMeta && <div className="flex flex-wrap items-center gap-2.5">{meta}</div>}
        </div>

        {(badges || actions) && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            {badges && (
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {badges}
              </div>
            )}
            {actions && (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>

      {children && <div className={cn('border-t border-[color:var(--hr-border-subtle)]', compact ? 'pt-3' : 'pt-4')}>{children}</div>}
    </section>
  )
}

import { cn } from '@/utils/cn'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight size={14} className="text-neutral-400 shrink-0" />}
            {isLast || !item.href ? (
              <span className={cn(isLast ? 'text-neutral-900 font-medium' : 'text-neutral-500')}>
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="text-neutral-500 hover:text-primary-600 transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

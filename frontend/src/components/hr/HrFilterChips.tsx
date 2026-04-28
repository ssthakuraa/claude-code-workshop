import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface HrFilterChipItem {
  key: string
  label: string
  onRemove?: () => void
}

interface HrFilterChipsProps {
  items: HrFilterChipItem[]
  onClearAll?: () => void
  onAddFilter?: () => void
  className?: string
  label?: string
}

export function HrFilterChips({ items, onClearAll, onAddFilter, className, label }: HrFilterChipsProps) {
  const { t } = useTranslation(['common'])
  const resolvedLabel = label ?? t('ui.filters', { ns: 'common' })
  if (items.length === 0 && !onAddFilter) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2 rounded-xl border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-3 py-2.5', className)}>
      {items.length > 0 && (
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--hr-text-subtle)]">
          {resolvedLabel}
        </span>
      )}
      {items.map(item => (
        <span
          key={item.key}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[color:var(--hr-border-subtle)] bg-white px-3 text-sm text-[color:var(--hr-text-muted)] shadow-[var(--shadow-xs)]"
        >
          <span>{item.label}</span>
          {item.onRemove && (
            <button
              type="button"
              onClick={item.onRemove}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[color:var(--hr-text-subtle)] transition-colors hover:bg-white hover:text-[color:var(--hr-text)]"
              aria-label={t('ui.removeFilterAria', { ns: 'common', label: item.label })}
            >
              <X size={13} />
            </button>
          )}
        </span>
      ))}

      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-medium text-[color:var(--hr-shell-accent)] transition-colors hover:text-[color:var(--hr-shell-accent-strong)]"
        >
          {t('ui.clearAll', { ns: 'common' })}
        </button>
      )}

      {onAddFilter && (
        <button
          type="button"
          onClick={onAddFilter}
          className="inline-flex min-h-9 items-center rounded-md border border-[color:var(--hr-shell-accent)] bg-white px-3 text-sm font-medium text-[color:var(--hr-shell-accent-strong)] transition-colors hover:bg-[color:var(--hr-shell-accent-soft)]"
        >
          + {t('ui.addFilter', { ns: 'common' })}
        </button>
      )}
    </div>
  )
}

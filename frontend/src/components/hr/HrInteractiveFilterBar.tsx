import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'

export interface HrInteractiveFilterOption {
  value: string
  label: string
  keywords?: string
}

export interface HrInteractiveFilterDefinition {
  key: string
  label: string
  mode: 'single' | 'multi'
  values: string[]
  options: HrInteractiveFilterOption[]
  searchable?: boolean
  emptyLabel?: string
  onChange: (values: string[]) => void
}

interface HrInteractiveFilterBarProps {
  filters: HrInteractiveFilterDefinition[]
  onClearAll?: () => void
  className?: string
}

export function HrInteractiveFilterBar({ filters, onClearAll, className }: HrInteractiveFilterBarProps) {
  const { t } = useTranslation(['common'])
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 220 })
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRef = useRef<HTMLDivElement>(null)

  const openFilter = filters.find(filter => filter.key === openKey) ?? null

  function setTriggerRef(key: string, element: HTMLButtonElement | null) {
    triggerRefs.current[key] = element
  }

  function positionPanel(key: string) {
    const trigger = triggerRefs.current[key]
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    setCoords({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 240),
    })
  }

  function toggleFilter(key: string) {
    if (openKey === key) {
      setOpenKey(null)
      setQuery('')
      return
    }
    positionPanel(key)
    setOpenKey(key)
    setQuery('')
  }

  useEffect(() => {
    if (!openKey) return
    const activeKey = openKey

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      const trigger = triggerRefs.current[activeKey]
      if (trigger?.contains(target) || panelRef.current?.contains(target)) {
        return
      }
      setOpenKey(null)
      setQuery('')
    }

    function handleResize() {
      positionPanel(activeKey)
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [openKey])

  const filteredOptions = useMemo(() => {
    if (!openFilter) return []
    const normalized = query.trim().toLowerCase()
    if (!normalized) return openFilter.options

    return openFilter.options.filter(option => {
      const haystack = `${option.label} ${option.keywords ?? ''}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [openFilter, query])

  function updateSelection(filter: HrInteractiveFilterDefinition, value: string) {
    if (filter.mode === 'single') {
      const nextValues = filter.values[0] === value ? [] : [value]
      filter.onChange(nextValues)
      setOpenKey(null)
      setQuery('')
      return
    }

    if (filter.values.includes(value)) {
      filter.onChange(filter.values.filter(item => item !== value))
    } else {
      filter.onChange([...filter.values, value])
    }
  }

  function clearFilter(filter: HrInteractiveFilterDefinition) {
    filter.onChange([])
    setQuery('')
  }

  function getChipLabel(filter: HrInteractiveFilterDefinition) {
    if (filter.values.length === 0) return filter.label
    if (filter.mode === 'single') {
      const selected = filter.options.find(option => option.value === filter.values[0])
      return selected ? `${filter.label}: ${selected.label}` : filter.label
    }

    return `${filter.label} ${filter.values.length}`
  }

  const hasSelections = filters.some(filter => filter.values.length > 0)

  return (
    <>
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {filters.map(filter => {
          const active = filter.values.length > 0
          return (
            <button
              key={filter.key}
              ref={element => setTriggerRef(filter.key, element)}
              type="button"
              onClick={() => toggleFilter(filter.key)}
              className={cn(
                'inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors',
                active
                  ? 'border-[color:var(--hr-shell-accent)] bg-white text-[color:var(--hr-shell-accent-strong)] shadow-[var(--shadow-xs)]'
                  : 'border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] text-[color:var(--hr-text-muted)] hover:border-[color:var(--hr-border-strong)] hover:bg-white',
                openKey === filter.key && 'border-[color:var(--hr-shell-accent)] bg-white text-[color:var(--hr-shell-accent-strong)]',
              )}
            >
              <span>{getChipLabel(filter)}</span>
              {active && (
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(event) => {
                    event.stopPropagation()
                    clearFilter(filter)
                  }}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[color:var(--hr-text-subtle)] transition-colors hover:bg-[color:var(--hr-surface-muted)] hover:text-[color:var(--hr-text)]"
                  aria-label={t('ui.clearFilterAria', { ns: 'common', label: filter.label })}
                >
                  <X size={11} />
                </span>
              )}
              {!active && <ChevronDown size={13} className="text-[color:var(--hr-text-subtle)]" />}
            </button>
          )
        })}

        {hasSelections && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[color:var(--hr-shell-accent)] transition-colors hover:text-[color:var(--hr-shell-accent-strong)]"
          >
            {t('ui.clearAll', { ns: 'common' })}
          </button>
        )}
      </div>

      {openFilter && createPortal(
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: coords.top,
            left: Math.max(12, Math.min(coords.left, window.innerWidth - coords.width - 12)),
            width: coords.width,
            zIndex: 9999,
          }}
          className="rounded-xl border border-[color:var(--hr-border-subtle)] bg-white p-2 shadow-[var(--shadow-lg)]"
          onMouseDown={event => event.stopPropagation()}
        >
          <div className="mb-1 flex items-center justify-between gap-2 px-1 py-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--hr-text-subtle)]">
              {openFilter.label}
            </span>
            {openFilter.values.length > 0 && (
              <button
                type="button"
                onClick={() => clearFilter(openFilter)}
                className="text-xs font-medium text-[color:var(--hr-shell-accent)] transition-colors hover:text-[color:var(--hr-shell-accent-strong)]"
              >
                {t('ui.clear', { ns: 'common' })}
              </button>
            )}
          </div>

          {openFilter.searchable && (
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--hr-text-subtle)]" />
              <input
                type="text"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={openFilter.emptyLabel ?? t('ui.searchFilter', { ns: 'common', label: openFilter.label.toLowerCase() })}
                className="hr-app-input h-9 w-full pl-9 pr-3 text-sm"
                autoFocus
              />
            </div>
          )}

          <div className="max-h-72 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-3 text-sm text-[color:var(--hr-text-subtle)]">
                {t('ui.noMatchingValues', { ns: 'common' })}
              </div>
            ) : (
              filteredOptions.map(option => {
                const selected = openFilter.values.includes(option.value)

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateSelection(openFilter, option.value)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors',
                      selected
                        ? 'bg-[color:var(--hr-shell-accent-soft)] text-[color:var(--hr-shell-accent-strong)]'
                        : 'text-[color:var(--hr-text)] hover:bg-[color:var(--hr-surface-muted)]',
                    )}
                  >
                    <span className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      openFilter.mode === 'single' ? 'rounded-full' : 'rounded-[0.2rem]',
                      selected
                        ? 'border-[color:var(--hr-shell-accent)] bg-[color:var(--hr-shell-accent)] text-white'
                        : 'border-[color:var(--hr-border-strong)] bg-white text-transparent',
                    )}>
                      <Check size={11} />
                    </span>
                    <span className="min-w-0 truncate">{option.label}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

import { cn } from '@/utils/cn'
import { ChevronDown, X } from 'lucide-react'
import { forwardRef, useRef, useState, type KeyboardEvent } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  searchable?: boolean
  multi?: boolean
  className?: string
  id?: string
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ label, options, value, onChange, placeholder = 'Select…', error, hint,
     required, disabled, searchable, multi, className, id }, ref) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    const selected = multi
      ? (value as string[] | undefined) ?? []
      : value as string | undefined

    const displayOptions = searchable && query
      ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
      : options

    const getLabel = (v: string) => options.find(o => o.value === v)?.label ?? v

    const toggle = (optValue: string) => {
      if (multi) {
        const arr = selected as string[]
        const next = arr.includes(optValue)
          ? arr.filter(v => v !== optValue)
          : [...arr, optValue]
        onChange?.(next)
      } else {
        onChange?.(optValue)
        setOpen(false)
        setQuery('')
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setQuery('') }
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="ml-0.5 text-error-500">*</span>}
          </label>
        )}
        <div className="relative" onKeyDown={handleKeyDown}>
          <button
            type="button"
            id={inputId}
            disabled={disabled}
            onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 0) }}
            className={cn(
              'w-full flex items-center justify-between gap-2 rounded-md border bg-white',
              'px-3 py-2 h-10 text-sm text-left transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
              error ? 'border-error-500' : 'border-neutral-300 hover:border-neutral-400',
              open && 'ring-2 ring-primary-500 border-transparent',
            )}
          >
            <span className={cn('truncate', !selected?.length && 'text-neutral-400')}>
              {multi
                ? (selected as string[]).length
                  ? (selected as string[]).map(v => getLabel(v)).join(', ')
                  : placeholder
                : selected ? getLabel(selected as string) : placeholder}
            </span>
            <ChevronDown size={16} className={cn('shrink-0 text-neutral-400 transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-md">
              {searchable && (
                <div className="p-2 border-b border-neutral-100">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-full text-sm px-2 py-1 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              )}
              <ul className="max-h-60 overflow-auto py-1" role="listbox">
                {displayOptions.length === 0 && (
                  <li className="px-3 py-2 text-sm text-neutral-400">No options</li>
                )}
                {displayOptions.map(opt => {
                  const isSelected = multi
                    ? (selected as string[]).includes(opt.value)
                    : selected === opt.value
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => !opt.disabled && toggle(opt.value)}
                      className={cn(
                        'px-3 py-2 text-sm cursor-pointer flex items-center justify-between',
                        isSelected ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-neutral-50',
                        opt.disabled && 'opacity-40 cursor-not-allowed',
                      )}
                    >
                      {opt.label}
                      {multi && isSelected && <X size={14} />}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
        {error && <p className="text-xs text-error-500">{error}</p>}
        {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

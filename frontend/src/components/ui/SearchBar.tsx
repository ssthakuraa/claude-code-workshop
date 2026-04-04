import { cn } from '@/utils/cn'
import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface SearchSuggestion {
  id: string | number
  label: string
  sublabel?: string
  icon?: ReactNode
  category?: string
  href?: string
  onSelect?: () => void
}

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  suggestions?: SearchSuggestion[]
  loading?: boolean
  className?: string
}

export function SearchBar({ value = '', onChange, onSearch, placeholder = 'Search…', suggestions = [], loading, className }: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const query = onChange ? value : internal
  const setQuery = (v: string) => { onChange ? onChange(v) : setInternal(v) }

  const showSuggestions = focused && (suggestions.length > 0 || loading)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  // Group by category
  const groups: Record<string, SearchSuggestion[]> = {}
  for (const s of suggestions) {
    const key = s.category ?? ''
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-neutral-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={e => { if (e.key === 'Enter') { onSearch?.(query); setFocused(false) } if (e.key === 'Escape') setFocused(false) }}
          className={cn(
            'w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-neutral-300 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'placeholder:text-neutral-400',
          )}
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus() }} className="absolute right-2.5 p-0.5 rounded text-neutral-400 hover:text-neutral-600">
            <X size={14} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 max-h-72 overflow-y-auto">
          {loading && <div className="px-3 py-3 text-sm text-neutral-400 text-center">Searching…</div>}
          {!loading && Object.entries(groups).map(([cat, items]) => (
            <div key={cat}>
              {cat && <div className="px-3 pt-2 pb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wide">{cat}</div>}
              {items.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-neutral-50 transition-colors"
                  onClick={() => { s.onSelect?.(); setFocused(false) }}
                >
                  {s.icon && <span className="shrink-0 text-neutral-400">{s.icon}</span>}
                  <span className="flex-1 min-w-0">
                    <span className="text-neutral-900">{s.label}</span>
                    {s.sublabel && <span className="block text-xs text-neutral-400 truncate">{s.sublabel}</span>}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

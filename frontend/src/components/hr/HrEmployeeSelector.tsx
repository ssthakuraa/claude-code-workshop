import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface EmployeeOption {
  id: number
  fullName: string
  jobTitle?: string
  department?: string
  avatar?: string
}

interface HrEmployeeSelectorProps {
  value?: EmployeeOption | null
  onChange: (employee: EmployeeOption | null) => void
  options: EmployeeOption[]
  loading?: boolean
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  onSearch?: (query: string) => void
}

export function HrEmployeeSelector({
  value,
  onChange,
  options,
  loading,
  placeholder = 'Search employee...',
  label,
  error,
  disabled,
  onSearch,
}: HrEmployeeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = query
    ? options.filter(o => o.fullName.toLowerCase().includes(query.toLowerCase()))
    : options

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>}

      {value ? (
        <div className={cn(
          'flex items-center gap-3 px-3 py-2 border rounded-md bg-white',
          error ? 'border-red-400' : 'border-neutral-300',
          disabled && 'opacity-60',
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 flex-shrink-0">
            {value.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-800 truncate">{value.fullName}</div>
            {value.jobTitle && <div className="text-xs text-neutral-500 truncate">{value.jobTitle}</div>}
          </div>
          {!disabled && (
            <button type="button" onClick={() => onChange(null)} className="text-neutral-400 hover:text-neutral-600">
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); onSearch?.(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              error ? 'border-red-400' : 'border-neutral-300',
              disabled && 'bg-neutral-50 opacity-60',
            )}
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md border border-neutral-200 shadow-lg max-h-52 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-6 text-center text-sm text-neutral-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-neutral-500">No employees found</div>
          ) : (
            filtered.map(emp => (
              <button
                key={emp.id}
                type="button"
                onClick={() => { onChange(emp); setQuery(''); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 flex-shrink-0">
                  {emp.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-neutral-800 truncate">{emp.fullName}</div>
                  <div className="text-xs text-neutral-500 truncate">{[emp.jobTitle, emp.department].filter(Boolean).join(' · ')}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

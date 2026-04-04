import { cn } from '@/utils/cn'
import { CalendarDays, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { createPortal } from 'react-dom'
import 'react-day-picker/style.css'

export interface DatePickerProps {
  value?: string        // ISO date string YYYY-MM-DD
  onChange?: (value: string | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({ value, onChange, label, placeholder = 'Select date', error, hint, required, disabled, minDate, maxDate, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)

  const selected = value ? new Date(value + 'T00:00:00') : undefined

  function openPicker() {
    if (disabled) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setCoords({ top: rect.bottom + 4, left: rect.left })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function handleSelect(day: Date | undefined) {
    if (!day) { onChange?.(undefined); setOpen(false); return }
    const iso = day.toISOString().split('T')[0]
    onChange?.(iso)
    setOpen(false)
  }

  const displayValue = selected
    ? selected.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}{required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={openPicker}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-white transition-colors text-left',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-error-500 ring-1 ring-error-300' : 'border-neutral-300 hover:border-neutral-400',
            !displayValue && 'text-neutral-400',
          )}
        >
          <CalendarDays size={16} className="text-neutral-400 shrink-0" />
          <span className="flex-1">{displayValue || placeholder}</span>
          {value && (
            <span
              className="p-0.5 rounded hover:bg-neutral-100"
              onClick={e => { e.stopPropagation(); onChange?.(undefined) }}
            >
              <X size={12} className="text-neutral-400" />
            </span>
          )}
        </button>
      </div>
      {error && <p className="text-xs text-error-600">{error}</p>}
      {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}

      {open && createPortal(
        <div
          style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
          className="bg-white rounded-xl shadow-xl border border-neutral-200 p-3"
          onMouseDown={e => e.stopPropagation()}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
          />
        </div>,
        document.body,
      )}
    </div>
  )
}

// ─── Currency Input ───────────────────────────────────────────────────────────

export interface CurrencyInputProps {
  value?: number
  onChange?: (value: number | undefined) => void
  currency?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function CurrencyInput({ value, onChange, currency = 'USD', label, placeholder = '0.00', error, hint, required, disabled, className }: CurrencyInputProps) {
  const symbol = new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0).find(p => p.type === 'currency')?.value ?? '$'

  function handleChange(raw: string) {
    const clean = raw.replace(/[^0-9.]/g, '')
    const num = parseFloat(clean)
    onChange?.(isNaN(num) ? undefined : num)
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}{required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-sm text-neutral-500 pointer-events-none">{symbol}</span>
        <input
          type="text"
          inputMode="decimal"
          value={value !== undefined ? value.toString() : ''}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-error-500 ring-1 ring-error-300' : 'border-neutral-300',
          )}
        />
      </div>
      {error && <p className="text-xs text-error-600">{error}</p>}
      {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  )
}

// ─── Phone Input ─────────────────────────────────────────────────────────────

export interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function PhoneInput({ value, onChange, label, error, hint, required, disabled, className }: PhoneInputProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}{required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type="tel"
        value={value ? formatPhone(value) : ''}
        onChange={e => onChange?.(e.target.value.replace(/\D/g, ''))}
        placeholder="(555) 000-0000"
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-lg border bg-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-error-500 ring-1 ring-error-300' : 'border-neutral-300',
        )}
      />
      {error && <p className="text-xs text-error-600">{error}</p>}
      {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  )
}

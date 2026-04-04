import { cn } from '@/utils/cn'

interface HrSalaryRangeInputProps {
  value?: number
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
  label?: string
  error?: string
  disabled?: boolean
  currency?: string
  showRange?: boolean
}

export function HrSalaryRangeInput({
  value,
  onChange,
  min,
  max,
  label,
  error,
  disabled,
  currency = 'USD',
  showRange = true,
}: HrSalaryRangeInputProps) {
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v)

  const withinRange = value !== undefined && min !== undefined && max !== undefined
    ? value >= min && value <= max
    : null

  return (
    <div>
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-medium">$</span>
        <input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(e.target.value ? Number(e.target.value) : undefined)}
          min={min}
          max={max}
          disabled={disabled}
          className={cn(
            'w-full pl-7 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-400 focus:ring-red-400' : 'border-neutral-300',
            withinRange === false && !error && 'border-amber-400',
            disabled && 'bg-neutral-50 opacity-60',
          )}
          placeholder="0"
        />
      </div>
      {showRange && min !== undefined && max !== undefined && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-neutral-500">Range: {formatCurrency(min)} – {formatCurrency(max)}</span>
          {withinRange === false && (
            <span className="text-xs text-amber-600">Outside band</span>
          )}
          {withinRange === true && (
            <span className="text-xs text-green-600">Within band</span>
          )}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

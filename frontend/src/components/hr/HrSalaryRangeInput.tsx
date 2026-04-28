import { cn } from '@/utils/cn'
import { useTranslation } from 'react-i18next'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'

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
  currency,
  showRange = true,
}: HrSalaryRangeInputProps) {
  const { t } = useTranslation(['common'])
  const preferences = useHrDisplayPreferences()
  const resolvedCurrency = currency ?? preferences.currency
  const locale = preferences.formattingLocale
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: resolvedCurrency, maximumFractionDigits: 0 }).format(v)
  const symbol = new Intl.NumberFormat(locale, { style: 'currency', currency: resolvedCurrency }).formatToParts(0).find(part => part.type === 'currency')?.value ?? '$'

  const withinRange = value !== undefined && min !== undefined && max !== undefined
    ? value >= min && value <= max
    : null

  return (
    <div>
      {label && <label className="hr-field-label">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[color:var(--hr-text-subtle)]">{symbol}</span>
        <input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(e.target.value ? Number(e.target.value) : undefined)}
          min={min}
          max={max}
          disabled={disabled}
          className={cn(
            'hr-app-input w-full pl-7 pr-3',
            error && 'border-[color:var(--color-error-400)] focus:border-[color:var(--color-error-500)] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.16)]',
            withinRange === false && !error && 'border-[color:var(--color-warning-400)]',
            disabled && 'bg-neutral-50 opacity-60',
          )}
          placeholder={t('ui.currencyAmount', { ns: 'common' })}
        />
      </div>
      {showRange && min !== undefined && max !== undefined && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-[color:var(--hr-text-subtle)]">{t('ui.range', { ns: 'common' })}: {formatCurrency(min)} – {formatCurrency(max)}</span>
          {withinRange === false && (
            <span className="text-xs text-[color:var(--color-warning-600)]">{t('ui.outsideBand', { ns: 'common' })}</span>
          )}
          {withinRange === true && (
            <span className="text-xs text-[color:var(--color-success-600)]">{t('ui.withinBand', { ns: 'common' })}</span>
          )}
        </div>
      )}
      {error && <p className="hr-field-error">{error}</p>}
    </div>
  )
}

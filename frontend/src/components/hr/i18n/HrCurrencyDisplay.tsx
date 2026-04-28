import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'

interface HrCurrencyDisplayProps {
  value: number
  currency?: string
  locale?: string
  compact?: boolean
}

/**
 * HrCurrencyDisplay
 *
 * Purpose: Format a currency value according to the user's locale and currency preference.
 * Falls back to USD / en-US when not specified.
 */
export function HrCurrencyDisplay({
  value,
  currency,
  locale,
  compact = false,
}: HrCurrencyDisplayProps) {
  const preferences = useHrDisplayPreferences()
  const resolvedCurrency = currency ?? preferences.currency
  const resolvedLocale = locale ?? preferences.formattingLocale
  const formatted = new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency: resolvedCurrency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value)

  return <span>{formatted}</span>
}

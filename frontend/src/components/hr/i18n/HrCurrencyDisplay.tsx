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
  currency = 'USD',
  locale = 'en-US',
  compact = false,
}: HrCurrencyDisplayProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value)

  return <span>{formatted}</span>
}

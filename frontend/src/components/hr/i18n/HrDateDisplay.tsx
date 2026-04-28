import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'

interface HrDateDisplayProps {
  value: Date | string
  format?: 'short' | 'medium' | 'long' | 'full'
  locale?: string
  timeZone?: string
  relative?: boolean
}

function toRelative(date: Date, locale: string): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (diffSecs < 60) return formatter.format(0, 'second')
  if (diffMins < 60) return formatter.format(-diffMins, 'minute')
  if (diffHours < 24) return formatter.format(-diffHours, 'hour')
  if (diffDays < 7) return formatter.format(-diffDays, 'day')
  if (diffWeeks < 5) return formatter.format(-diffWeeks, 'week')
  if (diffMonths < 12) return formatter.format(-diffMonths, 'month')
  return formatter.format(-Math.floor(diffMonths / 12), 'year')
}

const FORMAT_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { month: 'numeric', day: 'numeric', year: '2-digit' },
  medium: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { month: 'long', day: 'numeric', year: 'numeric' },
  full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
}

/**
 * HrDateDisplay
 *
 * Purpose: Format a date value according to the user's locale preference.
 * Supports relative mode ("2 hours ago") for activity feeds.
 */
export function HrDateDisplay({
  value,
  format = 'medium',
  locale,
  timeZone,
  relative = false,
}: HrDateDisplayProps) {
  const preferences = useHrDisplayPreferences()
  const resolvedLocale = locale ?? preferences.formattingLocale
  const resolvedTimeZone = timeZone ?? preferences.timezone
  const date = value instanceof Date ? value : new Date(value)

  if (relative) {
    return <time dateTime={date.toISOString()}>{toRelative(date, resolvedLocale)}</time>
  }

  const formatted = new Intl.DateTimeFormat(resolvedLocale, { ...FORMAT_OPTIONS[format], timeZone: resolvedTimeZone }).format(date)
  return <time dateTime={date.toISOString()}>{formatted}</time>
}

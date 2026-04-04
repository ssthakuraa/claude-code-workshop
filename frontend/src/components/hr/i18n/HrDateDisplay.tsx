interface HrDateDisplayProps {
  value: Date | string
  format?: 'short' | 'medium' | 'long' | 'full'
  locale?: string
  relative?: boolean
}

function toRelative(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
  return `${Math.floor(diffMonths / 12)} year${Math.floor(diffMonths / 12) !== 1 ? 's' : ''} ago`
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
  locale = 'en-US',
  relative = false,
}: HrDateDisplayProps) {
  const date = value instanceof Date ? value : new Date(value)

  if (relative) {
    return <time dateTime={date.toISOString()}>{toRelative(date)}</time>
  }

  const formatted = new Intl.DateTimeFormat(locale, FORMAT_OPTIONS[format]).format(date)
  return <time dateTime={date.toISOString()}>{formatted}</time>
}

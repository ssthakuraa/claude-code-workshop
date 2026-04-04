/** Currency formatter */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/** Date formatter */
export function formatDate(date: string | Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' })
    .format(typeof date === 'string' ? new Date(date) : date)
}

/** Relative time formatter (e.g. "3 days ago") */
export function formatRelativeTime(date: string | Date, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const diffDays = Math.floor(diffMs / 86_400_000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (diffDays === 0) return rtf.format(-Math.floor(diffMs / 3_600_000), 'hour')
  if (diffDays < 30) return rtf.format(-diffDays, 'day')
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month')
  return rtf.format(-Math.floor(diffDays / 365), 'year')
}

/** Phone number display */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  return phone
}

/** Truncate string */
export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength - 1) + '…' : str
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

/** Convert snake_case enum to display label */
export function enumLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

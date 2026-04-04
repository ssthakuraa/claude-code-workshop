import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPhone, truncate, capitalize, enumLabel } from '../utils/formatters'

describe('formatCurrency', () => {
  it('formats USD amount', () => {
    expect(formatCurrency(8000)).toBe('$8,000.00')
  })

  it('formats with different currency', () => {
    expect(formatCurrency(1234.5, 'EUR', 'de-DE')).toContain('1.234,50')
  })
})

describe('formatPhone', () => {
  it('formats 10-digit US number', () => {
    expect(formatPhone('5551234567')).toBe('(555) 123-4567')
  })

  it('returns non-10-digit numbers as-is', () => {
    expect(formatPhone('+44 20 7946 0958')).toBe('+44 20 7946 0958')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 6)).toBe('Hello…')
  })

  it('leaves short strings unchanged', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })
})

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('active')).toBe('Active')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('enumLabel', () => {
  it('converts snake_case to title case', () => {
    expect(enumLabel('FULL_TIME')).toBe('FULL TIME')
  })

  it('handles single word', () => {
    expect(enumLabel('ACTIVE')).toBe('ACTIVE')
  })
})

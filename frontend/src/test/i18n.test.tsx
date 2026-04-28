import { describe, expect, it } from 'vitest'
import { normalizeSupportedLanguage } from '@/i18n/config'
import { translateApiError } from '@/i18n/errorMessages'

describe('frontend i18n', () => {
  it('normalizes supported locale variants', () => {
    expect(normalizeSupportedLanguage('es')).toBe('es-MX')
    expect(normalizeSupportedLanguage('fr-CA')).toBe('fr-FR')
    expect(normalizeSupportedLanguage('hi')).toBe('hi-IN')
    expect(normalizeSupportedLanguage('en-GB')).toBe('en-US')
  })

  it('maps backend error codes to localized messages', () => {
    const translated = translateApiError({
      errorCode: 'INVALID_CREDENTIALS',
      fieldErrors: {
        username: 'VALIDATION_REQUIRED',
      },
    }, 'es-MX')

    expect(translated.message).toBe('Usuario o contraseña no válidos.')
    expect(translated.fieldErrors.username).toBe('Este campo es obligatorio.')
  })
})

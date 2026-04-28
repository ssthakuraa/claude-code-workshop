import { normalizeSupportedLanguage } from '@/i18n/config'
import { i18n } from '@/i18n/i18n'

export interface ApiErrorLike {
  message?: string
  errorCode?: string
  fieldErrors?: Record<string, string>
}

function translateByCode(code?: string | null, group: 'messages' | 'fields' = 'messages', language?: string) {
  if (!code) {
    return null
  }
  const t = i18n.getFixedT(normalizeSupportedLanguage(language), 'errors')
  const key = `${group}.${code}` as const
  const translated = (t as unknown as (lookupKey: string) => string)(key)
  return translated === key ? null : translated
}

export function translateApiError(error: ApiErrorLike | null | undefined, language?: string): {
  message: string
  fieldErrors: Record<string, string>
} {
  const t = i18n.getFixedT(normalizeSupportedLanguage(language), 'errors')
  const message =
    translateByCode(error?.errorCode, 'messages', language)
    ?? error?.message
    ?? ((t as unknown as (lookupKey: string) => string)('messages.INTERNAL_ERROR'))

  const fieldErrors = Object.fromEntries(
    Object.entries(error?.fieldErrors ?? {}).map(([field, code]) => [field, translateByCode(code, 'fields', language) ?? code]),
  ) as Record<string, string>

  return { message, fieldErrors }
}

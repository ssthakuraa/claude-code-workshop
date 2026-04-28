import { useTranslation } from 'react-i18next'
import { useUserPreferences, type UserPreferences } from '@/api/userPreferences'
import { useAuth } from '@/contexts/AuthContext'
import { DEFAULT_LANGUAGE, normalizeSupportedLanguage } from '@/i18n/config'

const DEFAULT_DISPLAY_PREFERENCES: UserPreferences = {
  language: DEFAULT_LANGUAGE,
  timezone: 'America/Los_Angeles',
  dateFormat: 'medium',
  currency: 'USD',
}

function resolveFormattingLocale(preferences: UserPreferences) {
  if (preferences.language === 'es-MX' || preferences.currency === 'MXN' || preferences.timezone === 'America/Mexico_City') {
    return 'es-MX'
  }

  if (preferences.language === 'fr-FR' || preferences.timezone === 'Europe/Paris') {
    return 'fr-FR'
  }

  if (preferences.language === 'hi-IN' || preferences.currency === 'INR' || preferences.timezone === 'Asia/Kolkata') {
    return 'hi-IN'
  }

  if (preferences.currency === 'CAD' || preferences.timezone === 'America/Toronto') {
    return 'en-CA'
  }

  if (preferences.currency === 'AUD' || preferences.timezone === 'Australia/Sydney') {
    return 'en-AU'
  }

  if (preferences.currency === 'JPY' || preferences.timezone === 'Asia/Tokyo') {
    return 'ja-JP'
  }

  if (preferences.currency === 'SGD' || preferences.timezone === 'Asia/Singapore') {
    return 'en-SG'
  }

  if (preferences.currency === 'BRL' || preferences.timezone === 'America/Sao_Paulo') {
    return 'pt-BR'
  }

  if (preferences.currency === 'CHF' || preferences.timezone === 'Europe/Zurich') {
    return 'de-CH'
  }

  if (preferences.currency === 'DKK' || preferences.timezone === 'Europe/Copenhagen') {
    return 'da-DK'
  }

  if (preferences.timezone === 'Europe/London') {
    return 'en-GB'
  }

  if (preferences.timezone === 'Europe/Dublin') {
    return 'en-IE'
  }

  if (preferences.timezone === 'Europe/Berlin') {
    return 'de-DE'
  }

  if (preferences.timezone === 'Europe/Amsterdam') {
    return 'nl-NL'
  }

  if (preferences.timezone === 'Europe/Madrid') {
    return 'es-ES'
  }

  if (preferences.timezone === 'Europe/Rome') {
    return 'it-IT'
  }

  return 'en-US'
}

export function useHrDisplayPreferences() {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { data: savedPreferences } = useUserPreferences({ enabled: isAuthenticated })
  const translationLocale = normalizeSupportedLanguage(savedPreferences?.language ?? i18n.resolvedLanguage ?? DEFAULT_LANGUAGE)
  const preferences = {
    ...DEFAULT_DISPLAY_PREFERENCES,
    ...savedPreferences,
    language: translationLocale,
  }

  return {
    ...preferences,
    translationLocale,
    formattingLocale: resolveFormattingLocale(preferences),
  }
}

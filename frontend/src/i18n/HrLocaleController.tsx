import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useUserPreferences } from '@/api/userPreferences'
import { getLanguageMeta, normalizeSupportedLanguage, persistLanguage, readStoredLanguage } from '@/i18n/config'

export function HrLocaleController() {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { data: savedPreferences } = useUserPreferences({ enabled: isAuthenticated })

  useEffect(() => {
    const nextLanguage = normalizeSupportedLanguage(savedPreferences?.language ?? readStoredLanguage())
    if (i18n.resolvedLanguage !== nextLanguage) {
      void i18n.changeLanguage(nextLanguage)
    }
    persistLanguage(nextLanguage)
  }, [i18n, savedPreferences?.language])

  useEffect(() => {
    const current = normalizeSupportedLanguage(i18n.resolvedLanguage)
    const meta = getLanguageMeta(current)
    document.documentElement.lang = current
    document.documentElement.dir = meta.dir
    persistLanguage(current)
  }, [i18n.resolvedLanguage])

  return null
}

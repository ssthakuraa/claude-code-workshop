import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, DEFAULT_NAMESPACE, detectInitialLanguage, resources } from '@/i18n/config'

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: DEFAULT_NAMESPACE,
    ns: ['common', 'navigation', 'auth', 'settings', 'errors', 'dashboard', 'employees', 'actions', 'admin', 'assessments'],
    interpolation: {
      escapeValue: false,
    },
  })

export { i18n }

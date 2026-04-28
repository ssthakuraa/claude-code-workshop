import 'i18next'
import type { resources, DEFAULT_NAMESPACE } from '@/i18n/config'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE
    resources: typeof resources['en-US']
  }
}

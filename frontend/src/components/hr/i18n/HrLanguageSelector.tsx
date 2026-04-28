import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '@/i18n/config'

interface Language {
  code: string
  label: string
  flag?: string
}

interface HrLanguageSelectorProps {
  currentLanguage: string
  languages: Language[]
  onChange: (language: string) => void
  className?: string
}

const DEFAULT_LANGUAGES: Language[] = [...SUPPORTED_LANGUAGES]

/**
 * HrLanguageSelector
 *
 * Purpose: Language switcher dropdown for user settings and top bar.
 */
export function HrLanguageSelector({
  currentLanguage,
  languages = DEFAULT_LANGUAGES,
  onChange,
  className,
}: HrLanguageSelectorProps) {
  const { t } = useTranslation('common')

  return (
    <div className={className}>
      <select
        value={currentLanguage}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-[color:var(--hr-focus-line)] focus:outline-none focus:ring-1 focus:ring-[color:var(--hr-focus-line)]"
        aria-label={t('language')}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag ? `${lang.flag} ` : ''}{lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export { DEFAULT_LANGUAGES }
export type { Language }

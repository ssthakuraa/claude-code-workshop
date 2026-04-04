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

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en-US', label: 'English (United States)', flag: '🇺🇸' },
  { code: 'en-GB', label: 'English (United Kingdom)', flag: '🇬🇧' },
  { code: 'es-MX', label: 'Español (México)', flag: '🇲🇽' },
  { code: 'hi-IN', label: 'हिंदी (भारत)', flag: '🇮🇳' },
  { code: 'fr-FR', label: 'Français (France)', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch (Deutschland)', flag: '🇩🇪' },
]

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
  return (
    <div className={className}>
      <select
        value={currentLanguage}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-label="Select language"
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

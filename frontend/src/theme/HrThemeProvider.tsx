import { useEffect, type ReactNode } from 'react'

interface HrThemeProviderProps {
  children: ReactNode
  theme?: 'modern'
  density?: 'cozy'
}

/**
 * Applies the active enterprise UI theme at the document level so shared styles
 * can evolve without page-level wiring.
 */
export function HrThemeProvider({
  children,
  theme = 'modern',
  density = 'cozy',
}: HrThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.hrTheme = theme
    root.dataset.hrDensity = density

    return () => {
      delete root.dataset.hrTheme
      delete root.dataset.hrDensity
    }
  }, [density, theme])

  return <>{children}</>
}

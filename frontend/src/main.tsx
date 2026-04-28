import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import { App } from './App'
import { HrThemeProvider } from './theme/HrThemeProvider'
import '@/i18n/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HrThemeProvider>
      <App />
    </HrThemeProvider>
  </StrictMode>,
)

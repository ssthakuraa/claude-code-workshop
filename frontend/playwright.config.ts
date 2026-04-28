import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5182'
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (existsSync('/bin/google-chrome') ? '/bin/google-chrome' : undefined)
  || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined)
  || (existsSync('/bin/chromium') ? '/bin/chromium' : undefined)
  || (existsSync('/usr/bin/chromium-browser') ? '/usr/bin/chromium-browser' : undefined)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'e2e-report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: process.env.HR_UI_HEADLESS === 'true',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : undefined,
      },
    },
  ],
})

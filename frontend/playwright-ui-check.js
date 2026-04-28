import { existsSync } from 'node:fs'
import { chromium, firefox } from 'playwright'

const baseUrl = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5182'
const username = process.env.HR_UI_USERNAME || 'steven.king'
const password = process.env.HR_UI_PASSWORD || 'password123'
const headless = process.env.HR_UI_HEADLESS === 'true'
const slowMo = Number(process.env.HR_UI_SLOW_MO || '0')
const viewportWidth = Number(process.env.HR_UI_VIEWPORT_WIDTH || '1760')
const viewportHeight = Number(process.env.HR_UI_VIEWPORT_HEIGHT || '900')
const firefoxExecutablePath = process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH
  || (existsSync('/bin/firefox') ? '/bin/firefox' : undefined)
  || (existsSync('/usr/bin/firefox') ? '/usr/bin/firefox' : undefined)
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
const chromiumFallbackPaths = [
  chromiumExecutablePath,
  '/bin/google-chrome',
  '/usr/bin/google-chrome',
  '/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

async function main() {
  const browserInfo = await launchBrowser()
  const { browser, browserEngine, fallbackReason } = browserInfo
  const page = await browser.newPage({
    viewport: {
      width: viewportWidth,
      height: viewportHeight,
    },
  })

  try {
    await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
    await page.getByLabel(/username/i).fill(username)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL('**/hr/dashboard', { timeout: 15000 })
    await page.getByRole('heading', { name: /welcome back/i, level: 1 }).waitFor({ timeout: 15000 })

    await page.goto(`${baseUrl}/hr/employees`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })
    await page.locator('table tbody tr').first().waitFor({ timeout: 15000 })

    const summary = {
      loginUrl: `${baseUrl}/hr/login`,
      dashboardUrl: `${baseUrl}/hr/dashboard`,
      employeesUrl: `${baseUrl}/hr/employees`,
      browserEngine,
      fallbackReason,
      viewport: `${viewportWidth}x${viewportHeight}`,
      firstEmployeeRow: (await page.locator('table tbody tr').first().innerText()).replace(/\s+/g, ' ').trim(),
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await page.close()
    await browser.close()
  }
}

async function launchBrowser() {
  for (const fallbackPath of chromiumFallbackPaths) {
    try {
      return {
        browser: await chromium.launch({
          headless,
          slowMo,
          executablePath: fallbackPath,
        }),
        browserEngine: 'chromium',
        fallbackReason: null,
      }
    } catch {
      continue
    }
  }

  const launchErrors = []
  if (firefoxExecutablePath) {
    try {
      return {
        browser: await firefox.launch({
          headless,
          slowMo,
          executablePath: firefoxExecutablePath,
        }),
        browserEngine: 'firefox',
        fallbackReason: 'Chromium launch unavailable on this host; used Firefox fallback.',
      }
    } catch (error) {
      launchErrors.push(error.message)
    }
  }

  throw new Error(launchErrors.join('\n') || 'No compatible browser launch path was found.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

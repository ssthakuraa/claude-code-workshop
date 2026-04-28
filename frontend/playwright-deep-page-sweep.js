import { existsSync } from 'node:fs'
import { chromium, firefox } from 'playwright'

const baseUrl = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5182'
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

const PERSONAS = [
  {
    name: 'english-admin',
    locale: 'en-US',
    username: process.env.HR_UI_EN_USERNAME || 'steven.king',
    password: process.env.HR_UI_EN_PASSWORD || 'password123',
    pages: [
      { route: '/hr/employees/assessments', heading: /^my assessments$/i, text: /current cycle|draft|assessment/i },
      { route: '/hr/admin/assessment-cycles', heading: /^assessment cycles$/i, text: /cycle|status|period/i },
      { route: '/hr/organization/locations', heading: /^locations$/i, text: /location|city|country/i },
      { route: '/hr/organization/countries', heading: /^countries$/i, text: /country|region|currency/i },
    ],
  },
  {
    name: 'spanish-hr-specialist',
    locale: 'es-MX',
    username: process.env.HR_UI_MX_USERNAME || 'valeria.cruz',
    password: process.env.HR_UI_MX_PASSWORD || 'password123',
    pages: [
      { route: '/hr/employees/assessments', heading: /^mis evaluaciones$/i, text: /ciclo|borrador|evaluación|evaluacion/i },
      { route: '/hr/admin/assessment-cycles', heading: /^ciclos de evaluacion$/i, text: /ciclo|estado|periodo/i },
      { route: '/hr/organization/locations', heading: /^ubicaciones$/i, text: /ubicación|ubicacion|ciudad|país|pais/i },
      { route: '/hr/organization/countries', heading: /^países$/i, text: /país|pais|región|region|moneda/i },
    ],
  },
]

async function main() {
  const browserInfo = await launchBrowser()
  const { browser, browserEngine, fallbackReason } = browserInfo
  const summary = {
    browserEngine,
    fallbackReason,
    personas: [],
  }

  try {
    for (const persona of PERSONAS) {
      const context = await browser.newContext({
        locale: persona.locale,
        viewport: { width: viewportWidth, height: viewportHeight },
      })
      await context.addInitScript((locale) => {
        window.localStorage.setItem('hr_locale', locale)
      }, persona.locale)

      const page = await context.newPage()

      try {
        await login(page, persona.username, persona.password)
        await ensureLanguage(page, persona.locale)

        const results = []
        for (const pageCheck of persona.pages) {
          await page.goto(`${baseUrl}${pageCheck.route}`, { waitUntil: 'networkidle' })
          await page.getByRole('heading', { name: pageCheck.heading, level: 1 }).waitFor({ timeout: 15000 })
          await page.getByText(pageCheck.text, { exact: false }).first().waitFor({ timeout: 15000 })
          results.push(pageCheck.route)
        }

        summary.personas.push({
          persona: persona.name,
          locale: persona.locale,
          username: persona.username,
          verifiedRoutes: results,
        })
      } finally {
        await context.close()
      }
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await browser.close()
  }
}

async function login(page, username, password) {
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/hr/dashboard', { timeout: 20000 })
}

async function ensureLanguage(page, locale) {
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await page.locator('select').first().waitFor({ timeout: 15000 })
  const languageSelect = page.locator('select').first()
  const currentValue = await languageSelect.inputValue()
  if (currentValue !== locale) {
    await languageSelect.selectOption(locale)
    await page.locator('main button').last().click()
    await page.waitForFunction((code) => window.localStorage.getItem('hr_locale') === code, locale)
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

  if (firefoxExecutablePath) {
    return {
      browser: await firefox.launch({
        headless,
        slowMo,
        executablePath: firefoxExecutablePath,
      }),
      browserEngine: 'firefox',
      fallbackReason: 'Chromium launch unavailable on this host; used Firefox fallback.',
    }
  }

  throw new Error('No compatible browser launch path was found.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

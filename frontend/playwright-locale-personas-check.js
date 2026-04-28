import { existsSync } from 'node:fs'
import { chromium, firefox } from 'playwright'

const baseUrl = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5182'
const headless = process.env.HR_UI_HEADLESS === 'true'
const slowMo = Number(process.env.HR_UI_SLOW_MO || '0')
const viewportWidth = Number(process.env.HR_UI_VIEWPORT_WIDTH || '1600')
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
    name: 'english-us',
    locale: 'en-US',
    username: process.env.HR_UI_EN_USERNAME || 'steven.king',
    password: process.env.HR_UI_EN_PASSWORD || 'password123',
    expected: {
      dashboardHeading: /Welcome back/i,
      employeesHeading: /^Employees$/i,
      orgChartHeading: /^Org Chart$/i,
      settingsHeading: /^Settings$/i,
      language: 'en-US',
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      employeeId: 100,
      compensationTab: /^Compensation$/i,
      loginError: /Invalid username or password\./i,
    },
  },
  {
    name: 'mexico-es',
    locale: 'es-MX',
    username: process.env.HR_UI_MX_USERNAME || 'valeria.cruz',
    password: process.env.HR_UI_MX_PASSWORD || 'password123',
    expected: {
      dashboardHeading: /Bienvenido de nuevo/i,
      employeesHeading: /^Empleados$/i,
      orgChartHeading: /^Organigrama$/i,
      settingsHeading: /^Configuración$/i,
      assessmentCyclesHeading: /^Ciclos de evaluacion$/i,
      language: 'es-MX',
      currency: 'MXN',
      timezone: 'America/Mexico_City',
      employeeId: 229,
      compensationTab: /^Compensación$/i,
      loginError: /Usuario o contraseña no válidos\./i,
    },
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
        const negativeChecks = []
        await verifyInvalidLogin(page, persona.locale, persona.expected.loginError)
        negativeChecks.push('invalid-login')

        await login(page, persona.username, persona.password)
        await verifySettings(page, persona)
        await verifyKeyPages(page, persona)

        summary.personas.push({
          persona: persona.name,
          locale: persona.locale,
          username: persona.username,
          negativeChecks,
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

async function verifyInvalidLogin(page, locale, expectedError) {
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.locator('#username').fill('invalid.user')
  await page.locator('#password').fill('not-the-password')
  await page.locator('button[type="submit"]').click()
  await page.getByText(expectedError).waitFor({ timeout: 15000 })
  const storedLocale = await page.evaluate(() => window.localStorage.getItem('hr_locale'))
  if (storedLocale !== locale) {
    throw new Error(`Expected login page locale ${locale}, found ${storedLocale}`)
  }
}

async function login(page, username, password) {
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/hr/dashboard', { timeout: 20000 })
}

async function verifySettings(page, persona) {
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: persona.expected.settingsHeading, level: 1 }).waitFor({ timeout: 15000 })

  const selects = page.locator('select')
  const language = await selects.nth(0).inputValue()
  const timezone = await selects.nth(1).inputValue()
  const currency = await selects.nth(3).inputValue()

  if (language !== persona.expected.language) {
    throw new Error(`Expected ${persona.name} language ${persona.expected.language}, found ${language}`)
  }
  if (timezone !== persona.expected.timezone) {
    throw new Error(`Expected ${persona.name} timezone ${persona.expected.timezone}, found ${timezone}`)
  }
  if (currency !== persona.expected.currency) {
    throw new Error(`Expected ${persona.name} currency ${persona.expected.currency}, found ${currency}`)
  }
}

async function verifyKeyPages(page, persona) {
  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: persona.expected.dashboardHeading, level: 1 }).waitFor({ timeout: 15000 })

  await page.goto(`${baseUrl}/hr/employees`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: persona.expected.employeesHeading, level: 1 }).waitFor({ timeout: 15000 })

  await page.goto(`${baseUrl}/hr/organization/chart`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: persona.expected.orgChartHeading, level: 1 }).waitFor({ timeout: 15000 })
  await page.locator('div.cursor-pointer').first().waitFor({ timeout: 15000 })

  if (persona.expected.assessmentCyclesHeading) {
    await page.goto(`${baseUrl}/hr/admin/assessment-cycles`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: persona.expected.assessmentCyclesHeading, level: 1 }).waitFor({ timeout: 15000 })
    await page.getByText(/Evaluación|Ciclo|ciclo/i, { exact: false }).first().waitFor({ timeout: 15000 })
  }

  await verifyEmployeeDetailFormatting(page, persona)
}

async function verifyEmployeeDetailFormatting(page, persona) {
  const employee = await page.evaluate(async (employeeId) => {
    const token = window.localStorage.getItem('hr_access_token')
    const locale = window.localStorage.getItem('hr_locale') ?? 'en-US'
    const response = await fetch(`/app/hr/api/v1/employees/${employeeId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Accept-Language': locale,
      },
    })
    const payload = await response.json()
    return payload.data
  }, persona.expected.employeeId)

  if (!employee) {
    throw new Error(`Employee ${persona.expected.employeeId} was not returned by the live API.`)
  }

  const expectedSalary = new Intl.NumberFormat(persona.locale, {
    style: 'currency',
    currency: persona.expected.currency,
    maximumFractionDigits: 0,
  }).format(Number(employee.salary))
  const expectedHireDate = new Intl.DateTimeFormat(persona.locale, {
    dateStyle: 'medium',
    timeZone: persona.expected.timezone,
  }).format(new Date(employee.hireDate))

  await page.goto(`${baseUrl}/hr/employees/${persona.expected.employeeId}`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: employee.fullName, level: 1 }).waitFor({ timeout: 15000 })
  await page.getByText(expectedHireDate, { exact: false }).first().waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: persona.expected.compensationTab }).click()
  await page.getByText(expectedSalary, { exact: false }).first().waitFor({ timeout: 15000 })
}

async function launchBrowser() {
  for (const executablePath of chromiumFallbackPaths) {
    try {
      const browser = await chromium.launch({
        headless,
        slowMo,
        executablePath,
      })
      return { browser, browserEngine: 'chromium', fallbackReason: null }
    } catch {
      continue
    }
  }

  if (firefoxExecutablePath) {
    const browser = await firefox.launch({
      headless,
      slowMo,
      executablePath: firefoxExecutablePath,
    })
    return {
      browser,
      browserEngine: 'firefox',
      fallbackReason: 'Chromium launch unavailable on this host; used Firefox fallback.',
    }
  }

  const browser = await chromium.launch({ headless, slowMo })
  return { browser, browserEngine: 'chromium', fallbackReason: null }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

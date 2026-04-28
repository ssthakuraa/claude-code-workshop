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

const SAVE_BUTTON_REGEX = /Save Changes|Guardar cambios|Enregistrer les modifications|परिवर्तन सहेजें/i

const LOCALES = [
  {
    code: 'en-US',
    loginHeading: /HR Enterprise Platform/i,
    dashboardHeading: /Welcome back/i,
    settingsHeading: /^Settings$/i,
    employeesHeading: /^Employees$/i,
    orgChartHeading: /^Org Chart$/i,
  },
  {
    code: 'es-MX',
    loginHeading: /Plataforma Empresarial de RR\. HH\./i,
    dashboardHeading: /Bienvenido de nuevo/i,
    settingsHeading: /^Configuración$/i,
    employeesHeading: /^Empleados$/i,
    orgChartHeading: /^Organigrama$/i,
  },
  {
    code: 'fr-FR',
    loginHeading: /Plateforme RH d’entreprise/i,
    dashboardHeading: /Bon retour/i,
    settingsHeading: /^Paramètres$/i,
    employeesHeading: /^Employés$/i,
    orgChartHeading: /^Organigramme$/i,
  },
  {
    code: 'hi-IN',
    loginHeading: /एचआर एंटरप्राइज प्लेटफ़ॉर्म/i,
    dashboardHeading: /फिर से स्वागत है/i,
    settingsHeading: /^सेटिंग्स$/i,
    employeesHeading: /^कर्मचारी$/i,
    orgChartHeading: /^ऑर्ग चार्ट$/i,
  },
]

async function main() {
  const browserInfo = await launchBrowser()
  const { browser, browserEngine, fallbackReason } = browserInfo
  const summary = {
    browserEngine,
    fallbackReason,
    locales: [],
  }

  try {
    for (const locale of LOCALES) {
      const context = await browser.newContext({
        locale: locale.code,
        viewport: { width: viewportWidth, height: viewportHeight },
      })
      await context.addInitScript((languageCode) => {
        window.localStorage.setItem('hr_locale', languageCode)
      }, locale.code)
      const page = await context.newPage()
      try {
        await verifyLocalizedLogin(page, locale)
        await login(page)
        await setLanguage(page, locale)
        await verifyAuthenticatedLocale(page, locale)
        summary.locales.push({
          locale: locale.code,
          settingsRoute: page.url().replace(baseUrl, ''),
          orgChartRoute: '/hr/organization/chart',
        })
      } finally {
        await context.close()
      }
    }

    const workflowContext = await browser.newContext({
      locale: 'es-MX',
      viewport: { width: viewportWidth, height: viewportHeight },
    })
    await workflowContext.addInitScript(() => {
      window.localStorage.setItem('hr_locale', 'es-MX')
    })
    const workflowPage = await workflowContext.newPage()
    try {
      await login(workflowPage)
      await setLanguage(workflowPage, LOCALES[1])
      summary.workflow = await runSpanishHireWorkflow(workflowPage)
    } finally {
      await workflowContext.close()
    }

    const resetContext = await browser.newContext({
      locale: 'en-US',
      viewport: { width: viewportWidth, height: viewportHeight },
    })
    await resetContext.addInitScript(() => {
      window.localStorage.setItem('hr_locale', 'en-US')
    })
    const resetPage = await resetContext.newPage()
    try {
      await login(resetPage)
      await setLanguage(resetPage, LOCALES[0])
    } finally {
      await resetContext.close()
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await browser.close()
  }
}

async function verifyLocalizedLogin(page, locale) {
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: locale.loginHeading, level: 1 }).waitFor({ timeout: 15000 })
  await page.locator('#username').waitFor({ timeout: 15000 })
  await page.locator('#password').waitFor({ timeout: 15000 })
}

async function login(page) {
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/hr/dashboard', { timeout: 20000 })
}

async function setLanguage(page, locale) {
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await page.locator('h1').waitFor({ timeout: 15000 })
  const languageSelect = page.locator('select').first()
  const currentValue = await languageSelect.inputValue()
  if (currentValue !== locale.code) {
    await languageSelect.selectOption(locale.code)
    await page.getByRole('button', { name: SAVE_BUTTON_REGEX }).click()
    await page.waitForFunction((code) => window.localStorage.getItem('hr_locale') === code, locale.code)
  }
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: locale.settingsHeading, level: 1 }).waitFor({ timeout: 15000 })
  const selectedLanguage = await languageSelect.inputValue()
  if (selectedLanguage !== locale.code) {
    throw new Error(`Expected selected language ${locale.code}, found ${selectedLanguage}`)
  }
}

async function verifyAuthenticatedLocale(page, locale) {
  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: locale.dashboardHeading, level: 1 }).waitFor({ timeout: 15000 })

  await page.goto(`${baseUrl}/hr/employees`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: locale.employeesHeading, level: 1 }).waitFor({ timeout: 15000 })

  await page.goto(`${baseUrl}/hr/organization/chart`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: locale.orgChartHeading, level: 1 }).waitFor({ timeout: 15000 })
  await page.locator('div.cursor-pointer').first().waitFor({ timeout: 15000 })
}

async function runSpanishHireWorkflow(page) {
  const suffix = Date.now().toString().slice(-6)
  const firstName = `Prueba${suffix}`
  const lastName = 'I18N'
  const fullName = `${firstName} ${lastName}`
  const email = `prueba.${suffix}@example.com`

  await page.goto(`${baseUrl}/hr/actions/hire`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /Contratar empleado/i, level: 1 }).waitFor({ timeout: 15000 })

  const personalInputs = page.locator('.hr-form-section-body input')
  await personalInputs.nth(0).fill(firstName)
  await personalInputs.nth(1).fill(lastName)
  await personalInputs.nth(2).fill(email)
  await personalInputs.nth(3).fill('+52 55-0199')
  await personalInputs.nth(4).fill('2026-04-17')
  await personalInputs.nth(5).fill(`Clave${suffix}1`)
  await page.getByRole('button', { name: /Siguiente/i }).click()

  const jobSelect = page.locator('select').nth(0)
  const departmentSelect = page.locator('select').nth(1)
  const jobValue = await jobSelect.locator('option').nth(1).getAttribute('value')
  const departmentValue = await departmentSelect.locator('option').nth(1).getAttribute('value')
  if (!jobValue || !departmentValue) {
    throw new Error('Hire workflow could not find job/department options.')
  }
  await jobSelect.selectOption(jobValue)
  await departmentSelect.selectOption(departmentValue)
  const salaryBandText = await page.locator('.hr-inline-note').first().innerText()
  const salary = deriveSalaryFromBand(salaryBandText)
  await page.getByRole('button', { name: /Siguiente/i }).click()

  await page.locator('input[type="number"]').first().fill(String(salary))
  await page.getByRole('button', { name: /Siguiente/i }).click()

  await page.getByRole('button', { name: /Contratar empleado/i }).click()
  await page.waitForURL('**/hr/employees', { timeout: 30000 })
  const searchInput = page.locator('input[placeholder="Buscar por nombre, ID o puesto..."]')
  await searchInput.fill(email)
  const row = page.locator('table tbody tr').filter({ hasText: lastName }).first()
  await row.waitFor({ timeout: 15000 })
  await row.click()
  await page.waitForURL(/\/hr\/employees\/\d+$/, { timeout: 15000 })
  const employeeId = Number(page.url().match(/\/hr\/employees\/(\d+)$/)?.[1])
  if (!employeeId) {
    throw new Error(`Unable to determine employee id for ${fullName}`)
  }

  await terminateEmployeeViaApi(page, employeeId, 'I18N E2E cleanup termination')

  return {
    locale: 'es-MX',
    employee: fullName,
    employeeId,
    route: page.url().replace(baseUrl, ''),
  }
}

async function terminateEmployeeViaApi(page, employeeId, reason) {
  const terminated = await page.evaluate(async ({ employeeId, reason }) => {
    const token = window.localStorage.getItem('hr_access_token')
    const locale = window.localStorage.getItem('hr_locale') ?? 'en-US'
    const response = await fetch('/app/hr/api/v1/employees/terminate', {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Accept-Language': locale,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        reason,
        effectiveDate: '2026-04-18',
        idempotencyKey: `i18n-cleanup-${employeeId}-${Date.now()}`,
      }),
    })

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        body: await response.text(),
      }
    }

    return { ok: true }
  }, { employeeId, reason })

  if (!terminated.ok) {
    throw new Error(`Failed to terminate I18N test employee ${employeeId}: ${terminated.status} ${terminated.body}`)
  }
}

function deriveSalaryFromBand(text) {
  const values = [...text.matchAll(/[\d,.]+/g)]
    .map(match => Number.parseFloat(match[0].replace(/,/g, '')))
    .filter(value => Number.isFinite(value))

  if (values.length >= 2) {
    return Math.round((values[0] + values[1]) / 2)
  }

  return 75000
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

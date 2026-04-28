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
  const context = await browser.newContext({
    viewport: {
      width: viewportWidth,
      height: viewportHeight,
    },
  })
  const page = await context.newPage()
  const summary = {
    browserEngine,
    fallbackReason,
    viewport: `${viewportWidth}x${viewportHeight}`,
    checks: [],
  }

  try {
    await login(page)
    await ensureEnglishLanguage(page)
    summary.checks.push('login')

    await verifyDashboardKpis(page, summary)
    await verifyDashboardNavigation(page, summary)
    await verifyGlobalSearch(page, summary)
    await verifyOrganizationPages(page, summary)
    const selectedEmployee = await verifyDirectory(page, summary)
    await verifyEmployeeDetail(page, summary, selectedEmployee)
    await verifyNotifications(page, summary)
    await verifySettings(page, summary)
    await verifyAuditLog(page, summary)
    await runHirePromoteTransferTerminateFlow(page, summary)
    await verifyErrorPages(page, summary)

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await context.close()
    await browser.close()
  }
}

async function login(page) {
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.getByLabel(/username/i).fill(username)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('**/hr/dashboard', { timeout: 20000 })
  await page.locator('h1').first().waitFor({ timeout: 20000 })
}

async function ensureEnglishLanguage(page) {
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await waitForSettingsForm(page)

  const languageSelect = page.locator('select').first()
  const currentLanguage = await languageSelect.inputValue()
  if (currentLanguage !== 'en-US') {
    await languageSelect.selectOption('en-US')
    const saveButton = page.locator('main button').last()
    await saveButton.click()
    await expectButtonDisabled(saveButton, 10000)
  }

  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await page.locator('h1').first().waitFor({ timeout: 15000 })
}

async function verifyDirectory(page, summary) {
  await page.goto(`${baseUrl}/hr/employees`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })
  const rows = page.locator('table tbody tr')
  await rows.first().waitFor({ timeout: 15000 })
  const firstRowText = normalize(await rows.first().innerText())
  const employeeName = firstRowText.split(' ID:')[0].split(/\s+/).slice(1).join(' ')

  const searchBox = page.getByPlaceholder('Search by name, ID, or title...')
  await searchBox.fill('Steven')
  await waitForFirstRowText(page, /Steven King/i)
  const filteredText = normalize(await rows.first().innerText())

  if (!filteredText.includes('Steven King')) {
    throw new Error(`Directory search did not focus Steven King. First filtered row: ${filteredText}`)
  }

  await searchBox.fill('')
  await waitForDirectoryTable(page)

  summary.directory = {
    firstRowText,
    searchedEmployee: employeeName,
  }
  summary.checks.push('directory-search')
  return employeeName
}

async function verifyDashboardKpis(page, summary) {
  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })

  const expectedRoutes = [
    {
      title: 'Total Headcount',
      expectedPath: '/hr/employees',
      expectedParams: {},
    },
    {
      title: 'New Hires (Month)',
      expectedPath: '/hr/employees',
      expectedParams: {
        hireDateFrom: isoDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        hireDateTo: isoDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
      },
    },
    {
      title: 'Active Employees',
      expectedPath: '/hr/employees',
      expectedParams: { status: 'ACTIVE' },
    },
    {
      title: 'On Leave',
      expectedPath: '/hr/employees',
      expectedParams: { status: 'ON_LEAVE' },
    },
    {
      title: 'On Probation',
      expectedPath: '/hr/employees',
      expectedParams: { status: 'PROBATION' },
    },
  ]

  const results = []
  for (const item of expectedRoutes) {
    await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
    const card = page.locator('[role="button"]', { hasText: item.title }).first()
    await card.waitFor({ timeout: 15000 })
    const cardText = normalize(await card.innerText())
    await card.click()
    await page.waitForURL(url => url.pathname === item.expectedPath, { timeout: 15000 })
    await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })

    const currentUrl = new URL(page.url())
    for (const [key, expectedValue] of Object.entries(item.expectedParams)) {
      const actualValue = currentUrl.searchParams.get(key)
      if (actualValue !== expectedValue) {
        throw new Error(`${item.title} expected ${key}=${expectedValue}, got ${actualValue}`)
      }
    }

    results.push({
      title: item.title,
      cardText,
      route: `${currentUrl.pathname}${currentUrl.search}`,
      resultText: normalize(await page.locator('table tbody tr').first().innerText()),
    })
  }

  summary.dashboardKpis = results
  summary.checks.push('dashboard-kpi-navigation')
}

async function verifyDashboardNavigation(page, summary) {
  const navigationChecks = [
    {
      label: 'Hire Employee',
      buttonLabel: 'Hire Employee',
      expectedPath: '/hr/actions/hire',
      expectedHeading: /hire employee/i,
    },
    {
      label: 'View Org Chart',
      buttonLabel: 'View Org Chart',
      expectedPath: '/hr/organization/chart',
      expectedHeading: /org chart/i,
    },
  ]

  const results = []
  for (const item of navigationChecks) {
    await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
    const linkCard = page.getByRole('button', { name: new RegExp(item.buttonLabel, 'i') }).first()
    await linkCard.waitFor({ timeout: 15000 })
    await linkCard.click()
    await page.waitForURL(url => url.pathname === item.expectedPath, { timeout: 15000 })
    await page.getByRole('heading', { name: item.expectedHeading, level: 1 }).waitFor({ timeout: 15000 })

    results.push({
      label: item.label,
      route: page.url().replace(baseUrl, ''),
    })
  }

  summary.dashboardNavigation = results
  summary.checks.push('dashboard-navigation')
}

async function verifyOrganizationPages(page, summary) {
  const results = []

  await page.goto(`${baseUrl}/hr/organization/chart`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /org chart/i, level: 1 }).waitFor({ timeout: 15000 })
  const orgCards = page.locator('div.cursor-pointer')
  await orgCards.first().waitFor({ timeout: 15000 })
  results.push({
    page: 'org-chart',
    sample: normalize(await orgCards.first().innerText()),
  })

  summary.organizationPages = results
  summary.checks.push('organization-pages')
}

async function verifyGlobalSearch(page, summary) {
  const searchInput = page.locator('header input[placeholder*="Search employees"]').first()
  const checks = []

  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill('Steven King')
  await searchInput.press('Enter')
  await page.waitForURL(url => url.pathname === '/hr/employees' && url.searchParams.get('search') === 'Steven King', { timeout: 15000 })
  await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })
  await waitForTableText(page, /Steven King/i)
  checks.push(page.url().replace(baseUrl, ''))

  await searchInput.fill('employees Steven King')
  await searchInput.press('Enter')
  await page.waitForURL(url => url.pathname === '/hr/employees' && url.searchParams.get('search') === 'Steven King', { timeout: 15000 })
  await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })
  await waitForTableText(page, /Steven King/i)
  checks.push(page.url().replace(baseUrl, ''))

  await searchInput.fill('staff india')
  await searchInput.press('Enter')
  await page.waitForURL(url => url.pathname === '/hr/employees' && url.searchParams.get('search') === 'india', { timeout: 15000 })
  await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })
  await waitForTableText(page, /india/i)
  checks.push(page.url().replace(baseUrl, ''))

  summary.globalSearch = { checks }
  summary.checks.push('global-search')
}

async function verifyEmployeeDetail(page, summary, expectedEmployeeName) {
  if (expectedEmployeeName) {
    await page.locator('table tbody tr', { hasText: expectedEmployeeName }).first().locator('td').nth(1).click()
  } else {
    const firstRow = page.locator('table tbody tr').first()
    await firstRow.locator('td').nth(1).click()
  }
  await page.waitForURL(/\/hr\/employees\/\d+$/, { timeout: 15000 })
  if (expectedEmployeeName) {
    await page.getByRole('heading', { name: new RegExp(expectedEmployeeName, 'i'), level: 1 }).waitFor({ timeout: 15000 })
  }

  const employeeName = normalize((await page.locator('h1').allInnerTexts()).at(-1) ?? '')

  if (expectedEmployeeName && !employeeName.toLowerCase().includes(expectedEmployeeName.toLowerCase())) {
    throw new Error(`Employee detail heading mismatch. Expected ${expectedEmployeeName}, got ${employeeName || 'empty heading'}`)
  }

  await page.getByRole('button', { name: /timeline/i }).click()
  await page.getByText(/hired as/i).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /compensation/i }).click()
  await page.getByText(/annual salary|permission to view salary/i).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /profile/i }).click()
  await page.getByText(/contact/i).waitFor({ timeout: 15000 })

  summary.employeeDetail = {
    employeeName,
    detailUrl: page.url(),
  }
  summary.checks.push('employee-detail-tabs')
}

async function verifyNotifications(page, summary) {
  await page.goto(`${baseUrl}/hr/notifications`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /^notifications$/i, level: 1 }).waitFor({ timeout: 15000 })
  const markAllButton = page.getByRole('button', { name: /mark all as read/i })

  let changed = false
  if (await markAllButton.isVisible().catch(() => false)) {
    await markAllButton.click()
    await expectGone(markAllButton, 10000)
    changed = true
  } else {
    const markReadButton = page.getByRole('button', { name: /mark read/i }).first()
    if (await markReadButton.isVisible().catch(() => false)) {
      await markReadButton.click()
      changed = true
    }
  }

  summary.notifications = { changed }
  summary.checks.push('notifications')
}

async function verifySettings(page, summary) {
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await waitForSettingsForm(page)

  const languageSelect = page.locator('select').first()
  await languageSelect.selectOption('es-MX')
  const saveButton = page.locator('main button').last()
  await saveButton.click()
  await expectButtonDisabled(saveButton, 10000)

  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await waitForSettingsForm(page)
  const persisted = await languageSelect.inputValue()
  if (persisted !== 'es-MX') {
    throw new Error(`Settings language did not persist. Expected es-MX, got ${persisted}`)
  }

  await languageSelect.selectOption('en-US')
  const restoreButton = page.locator('main button').last()
  await restoreButton.click()
  await expectButtonDisabled(restoreButton, 10000)

  summary.settings = { persistedLanguage: persisted }
  summary.checks.push('settings-persistence')
}

async function verifyAuditLog(page, summary) {
  await page.goto(`${baseUrl}/hr/admin`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /audit log/i, level: 1 }).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /^filter$/i }).click()
  await page.getByRole('button', { name: /^employee$/i }).click()
  await page.waitForTimeout(600)
  const labels = await page.locator('table tbody tr td:nth-child(3)').allInnerTexts()
  if (labels.length === 0) {
    throw new Error('Audit log filter returned no rows for employees.')
  }
  if (!labels.every((label) => normalize(label) === 'Employee')) {
    throw new Error(`Audit log filter returned unexpected labels: ${labels.join(', ')}`)
  }

  summary.auditLog = { rows: labels.length }
  summary.checks.push('audit-log-filter')
}

async function runHirePromoteTransferTerminateFlow(page, summary) {
  const uniqueSuffix = Date.now()
  const hire = {
    firstName: 'Manual',
    lastName: `Qa${String(uniqueSuffix).slice(-6)}`,
    email: `manual.qa.${uniqueSuffix}@example.com`,
    phone: '+1 555-0175',
    hireDate: '2026-04-11',
    password: 'Welcome123',
  }

  await page.goto(`${baseUrl}/hr/actions/hire`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /hire employee/i, level: 1 }).waitFor({ timeout: 15000 })

  await page.getByPlaceholder('Jane', { exact: true }).fill(hire.firstName)
  await page.getByPlaceholder('Smith', { exact: true }).fill(hire.lastName)
  await page.getByPlaceholder('jane.smith@company.com').fill(hire.email)
  await page.getByPlaceholder('+1 555-0100').fill(hire.phone)
  await page.locator('input[type="date"]').first().fill(hire.hireDate)
  await page.locator('input[type="password"]').fill(hire.password)
  await page.getByRole('button', { name: /^next$/i }).click()

  const jobSelect = page.locator('select').filter({ hasText: /select job/i })
  const deptSelect = page.locator('select').filter({ hasText: /select department/i })
  await jobSelect.selectOption({ index: 1 })
  await deptSelect.selectOption({ index: 1 })
  await page.getByRole('button', { name: /^next$/i }).click()

  const salaryInput = page.locator('input[type="number"]').first()
  const min = Number(await salaryInput.getAttribute('min'))
  const max = Number(await salaryInput.getAttribute('max'))
  const salary = Number.isFinite(min) && Number.isFinite(max)
    ? Math.round((min + max) / 2)
    : 7500
  await salaryInput.fill(String(salary))
  await page.getByRole('button', { name: /^next$/i }).click()

  await page.getByRole('button', { name: /hire employee/i }).click()
  await page.getByText(/hired successfully/i).waitFor({ timeout: 15000 })
  await page.waitForURL('**/hr/employees', { timeout: 15000 })

  const searchBox = page.getByPlaceholder('Search by name, ID, or title...')
  await searchBox.fill(hire.email)
  await waitForFirstRowText(page, new RegExp(hire.lastName, 'i'))
  const newHireRow = page.locator('table tbody tr').first()
  await newHireRow.waitFor({ timeout: 15000 })
  const newHireRowText = normalize(await newHireRow.innerText())
  if (!newHireRowText.includes(hire.lastName)) {
    throw new Error(`New hire not visible after hire workflow. First row: ${newHireRowText}`)
  }
  await newHireRow.click()
  await page.waitForURL(/\/hr\/employees\/\d+$/, { timeout: 15000 })
  const detailUrl = page.url()
  const employeeId = Number(detailUrl.match(/\/hr\/employees\/(\d+)$/)?.[1])
  if (!employeeId) {
    throw new Error(`Unable to resolve employee id from detail URL ${detailUrl}`)
  }

  await page.getByRole('button', { name: /promote/i }).click()
  await page.waitForURL(`**/hr/actions/promote/${employeeId}`, { timeout: 15000 })
  const promoteJobSelect = page.locator('select').first()
  await promoteJobSelect.selectOption({ index: 1 })
  const promoteSalaryInput = page.locator('input[type="number"]').first()
  const promoteMin = Number(await promoteSalaryInput.getAttribute('min'))
  const promoteMax = Number(await promoteSalaryInput.getAttribute('max'))
  const promoteSalary = Number.isFinite(promoteMin) && Number.isFinite(promoteMax)
    ? Math.round((promoteMin + promoteMax) / 2)
    : salary + 1000
  await promoteSalaryInput.fill(String(promoteSalary))
  await page.locator('input[type="date"]').fill('2026-04-12')
  await page.getByRole('button', { name: /confirm promotion/i }).click()
  await page.waitForURL(`**/hr/employees/${employeeId}`, { timeout: 15000 })

  await page.getByRole('button', { name: /transfer/i }).click()
  await page.waitForURL(`**/hr/actions/transfer/${employeeId}`, { timeout: 15000 })
  const selects = page.locator('select')
  await selects.nth(0).selectOption({ index: 1 })
  if (await selects.count() > 1) {
    await selects.nth(1).selectOption({ index: 1 })
  }
  await page.locator('input[type="date"]').fill('2026-04-13')
  await page.getByRole('button', { name: /confirm transfer/i }).click()
  await page.waitForURL(`**/hr/employees/${employeeId}`, { timeout: 15000 })

  await page.getByRole('button', { name: /terminate/i }).click()
  await page.waitForURL(`**/hr/actions/terminate/${employeeId}`, { timeout: 15000 })
  await page.locator('input[type="date"]').fill('2026-04-14')
  await page.getByPlaceholder(/voluntary resignation/i).fill('Manual QA termination check')
  await page.getByRole('button', { name: /^terminate employee$/i }).click()
  await page.getByRole('button', { name: /yes, terminate/i }).click()
  await page.waitForURL(`**/hr/employees/${employeeId}`, { timeout: 15000 })
  await page.getByText(/terminated/i).waitFor({ timeout: 15000 })

  summary.workflow = {
    employeeId,
    email: hire.email,
    salary,
    promoteSalary,
  }
  summary.checks.push('hire-promote-transfer-terminate')
}

async function verifyErrorPages(page, summary) {
  await page.goto(`${baseUrl}/hr/unauthorized`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /access denied/i, level: 1 }).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /go to dashboard/i }).click()
  await page.waitForURL('**/hr/dashboard', { timeout: 15000 })

  await page.goto(`${baseUrl}/definitely-missing-route`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /page not found/i, level: 1 }).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /go to dashboard/i }).click()
  await page.waitForURL('**/hr/dashboard', { timeout: 15000 })

  summary.errorPages = {
    unauthorized: '/hr/unauthorized',
    notFound: '/definitely-missing-route',
  }
  summary.checks.push('error-pages')
}

async function expectGone(locator, timeoutMs) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (!(await locator.isVisible().catch(() => false))) {
      return
    }
    await locator.page().waitForTimeout(250)
  }
  throw new Error('Expected locator to disappear but it remained visible.')
}

async function expectButtonDisabled(locator, timeoutMs) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (await locator.isDisabled().catch(() => false)) {
      return
    }
    await locator.page().waitForTimeout(200)
  }
  throw new Error('Expected button to become disabled but it remained enabled.')
}

async function waitForDirectoryTable(page) {
  await page.waitForFunction(() => {
    const firstRow = document.querySelector('table tbody tr')
    return Boolean(firstRow && firstRow.textContent && firstRow.textContent.trim().length > 0)
  }, { timeout: 15000 })
}

async function waitForFirstRowText(page, pattern) {
  await page.waitForFunction((source) => {
    const firstRow = document.querySelector('table tbody tr')
    const text = firstRow?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    return new RegExp(source, 'i').test(text)
  }, pattern.source, { timeout: 15000 })
}

async function waitForTableText(page, pattern) {
  await page.waitForFunction((source) => {
    const tableBody = document.querySelector('table tbody')
    const text = tableBody?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    return new RegExp(source, 'i').test(text)
  }, pattern.source, { timeout: 15000 })
}

async function waitForSettingsForm(page) {
  await page.waitForURL(url => url.pathname === '/hr/settings', { timeout: 15000 })
  await page.locator('select').first().waitFor({ timeout: 15000 })
}

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function isoDate(value) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

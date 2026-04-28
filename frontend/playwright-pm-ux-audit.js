import { existsSync } from 'node:fs'
import { chromium, firefox } from 'playwright'

const baseUrl = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5182'
const username = process.env.HR_UI_USERNAME || 'steven.king'
const password = process.env.HR_UI_PASSWORD || 'password123'
const headless = process.env.HR_UI_HEADLESS === 'true'
const slowMo = Number(process.env.HR_UI_SLOW_MO || '0')
const viewportWidth = Number(process.env.HR_UI_VIEWPORT_WIDTH || '1760')
const viewportHeight = Number(process.env.HR_UI_VIEWPORT_HEIGHT || '920')
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
    acceptDownloads: true,
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
    await verifyActionRouteRedirects(page, summary)
    await verifyDashboardExperience(page, summary)
    await verifyGlobalSearchRouting(page, summary)
    await verifyEmployeeWorkspace(page, summary)
    await verifyEmployeeDetailDrilldowns(page, summary)
    await verifyOrgChartWorkspace(page, summary)
    await verifyNotificationsWorkspace(page, summary)
    await verifySettingsWorkspace(page, summary)
    await verifyAuditLogWorkspace(page, summary)
    await verifyStarterLifecycleGap(page, summary)
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
    const saveButton = page.locator('main button').last()
    await languageSelect.selectOption('en-US')
    await saveButton.click()
    await expectButtonDisabled(saveButton, 10000)
  }

  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await page.locator('h1').first().waitFor({ timeout: 15000 })
}

async function verifyActionRouteRedirects(page, summary) {
  const redirectRoutes = [
    '/hr/actions/promote',
    '/hr/actions/transfer',
    '/hr/actions/terminate',
  ]
  const results = []

  for (const route of redirectRoutes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
    await page.waitForURL(url => url.pathname === '/hr/employees', { timeout: 15000 })
    results.push(page.url().replace(baseUrl, ''))
  }

  summary.actionRedirects = results
  summary.checks.push('action-route-redirects')
}

async function verifyDashboardExperience(page, summary) {
  await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /welcome back/i, level: 1 }).waitFor({ timeout: 15000 })

  const navTargets = [
    { label: 'Hire Employee', expectedPath: '/hr/actions/hire' },
    { label: 'Transfer Employee', expectedPath: '/hr/employees' },
    { label: 'View Org Chart', expectedPath: '/hr/organization/chart' },
  ]

  const results = []
  for (const item of navTargets) {
    await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: new RegExp(item.label, 'i') }).first().click()
    await page.waitForURL(url => url.pathname === item.expectedPath, { timeout: 15000 })
    results.push(page.url().replace(baseUrl, ''))
  }

  summary.dashboard = { routes: results }
  summary.checks.push('dashboard-navigation')
}

async function verifyGlobalSearchRouting(page, summary) {
  const checks = [
    { term: 'Steven King', path: '/hr/employees', param: 'Steven King', matcher: /Steven King/i },
    { term: 'employees Steven King', path: '/hr/employees', param: 'Steven King', matcher: /Steven King/i },
    { term: 'staff india', path: '/hr/employees', param: 'india', matcher: /india/i },
    { term: 'india', path: '/hr/employees', param: 'india', matcher: /india/i },
  ]

  const results = []
  for (const item of checks) {
    await page.goto(`${baseUrl}/hr/dashboard`, { waitUntil: 'networkidle' })
    const searchInput = page.locator('header input[placeholder*="Search employees"]').first()
    await searchInput.fill(item.term)
    await searchInput.press('Enter')
    await page.waitForURL(url => url.pathname === item.path && url.searchParams.get('search') === item.param, { timeout: 15000 })
    await expectPageText(page, item.matcher)
    results.push(page.url().replace(baseUrl, ''))
  }

  summary.globalSearch = results
  summary.checks.push('global-search-routing')
}

async function verifyEmployeeWorkspace(page, summary) {
  const viewName = `QA Employee View ${Date.now()}`

  await page.goto(`${baseUrl}/hr/employees`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /^employees$/i, level: 1 }).waitFor({ timeout: 15000 })

  const searchBox = page.getByPlaceholder('Search by name, ID, or title...')
  await searchBox.fill('Steven')
  await waitForFirstRowText(page, /Steven King/i)

  await page.getByRole('button', { name: /^status$/i }).first().click()
  await page.getByRole('button', { name: /^active$/i }).first().click()
  await page.waitForURL(url => url.searchParams.get('status') === 'ACTIVE', { timeout: 15000 })
  await waitForFirstRowText(page, /ACTIVE/i)

  await page.getByRole('button', { name: /saved views/i }).click()
  await page.getByPlaceholder(/view name/i).fill(viewName)
  await page.getByRole('button', { name: /save changes/i }).click()
  await expectGone(page.getByPlaceholder(/view name/i), 10000)

  await searchBox.fill('')
  await page.getByRole('button', { name: /clear all/i }).click()
  await page.waitForURL(url => !url.searchParams.get('search') && !url.searchParams.get('status'), { timeout: 15000 })
  await waitForDirectoryTable(page)

  await page.getByRole('button', { name: /saved views/i }).click()
  await page.locator('li', { hasText: viewName }).getByRole('button', { name: new RegExp(viewName, 'i') }).click()
  await page.waitForURL(url => url.searchParams.get('search') === 'Steven' && url.searchParams.get('status') === 'ACTIVE', { timeout: 15000 })
  await waitForFirstRowText(page, /Steven King/i)

  await page.getByRole('button', { name: /columns/i }).click()
  await page.locator('li', { hasText: /^Type$/i }).getByRole('switch').click()
  await page.getByRole('columnheader', { name: /^Type$/i }).waitFor({ state: 'detached', timeout: 10000 })
  await page.locator('li', { hasText: /^Type$/i }).getByRole('switch').click()
  await page.getByRole('columnheader', { name: /^Type$/i }).waitFor({ timeout: 10000 })

  const firstRow = page.locator('table tbody tr').first()
  await firstRow.locator('td').first().click()
  await page.getByRole('button', { name: /open first selected/i }).waitFor({ timeout: 10000 })

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /export/i }).click()
  const download = await downloadPromise

  await page.getByRole('button', { name: /open first selected/i }).click()
  await page.waitForURL(/\/hr\/employees\/\d+$/, { timeout: 15000 })

  summary.employeeWorkspace = {
    savedView: viewName,
    exportSuggestedFile: download.suggestedFilename(),
    detailRoute: page.url().replace(baseUrl, ''),
  }
  summary.checks.push('employee-workspace')
}

async function verifyEmployeeDetailDrilldowns(page, summary) {
  const heading = page.locator('h1').last()
  await heading.waitFor({ timeout: 15000 })
  const employeeName = normalize(await heading.innerText())

  await page.getByRole('button', { name: /timeline/i }).click()
  await page.getByText(/hired as/i).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /compensation/i }).click()
  await page.getByText(/annual salary|permission to view salary/i).waitFor({ timeout: 15000 })
  await page.getByRole('button', { name: /profile/i }).click()
  await page.getByText(/contact/i).waitFor({ timeout: 15000 })

  const directReportButtons = page.locator('button', { hasText: /.+/ })
  const reportCount = await page.getByText(/Direct Reports/i).count()
  if (reportCount > 0) {
    const reportButton = page.locator('button').filter({ has: page.locator('span') }).nth(0)
    if (await reportButton.isVisible().catch(() => false)) {
      await reportButton.click()
      await page.waitForURL(/\/hr\/employees\/\d+$/, { timeout: 15000 })
      await page.goBack({ waitUntil: 'networkidle' })
      await page.locator('h1').last().waitFor({ timeout: 15000 })
      await expectPageText(page, new RegExp(employeeName, 'i'))
    }
  }

  summary.employeeDetail = { employeeName }
  summary.checks.push('employee-detail')
}

async function verifyOrgChartWorkspace(page, summary) {
  await page.goto(`${baseUrl}/hr/organization/chart`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /org chart/i, level: 1 }).waitFor({ timeout: 15000 })

  const toggle = page.getByRole('button', { name: /hide|show/i }).first()
  if (await toggle.isVisible().catch(() => false)) {
    const initialLabel = normalize(await toggle.innerText())
    await toggle.click()
    await page.waitForTimeout(300)
    await toggle.click()
    await page.waitForTimeout(300)
    summary.orgChartToggle = initialLabel
  }

  const firstCard = page.locator('div.cursor-pointer').first()
  const cardText = normalize(await firstCard.innerText())
  await firstCard.click()
  await page.waitForURL(/\/hr\/employees\/\d+$/, { timeout: 15000 })
  await page.goBack({ waitUntil: 'networkidle' })

  summary.orgChart = { firstCard: cardText }
  summary.checks.push('org-chart-workspace')
}

async function verifyNotificationsWorkspace(page, summary) {
  await page.goto(`${baseUrl}/hr/notifications`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /^notifications$/i, level: 1 }).waitFor({ timeout: 15000 })

  const unreadActionsBefore = await page.getByRole('button', { name: /mark read/i }).count()
  const markAll = page.getByRole('button', { name: /mark all as read/i })
  const markRead = page.getByRole('button', { name: /mark read/i }).first()

  let actionTaken = 'none'
  if (await markAll.isVisible().catch(() => false)) {
    await markAll.click()
    await expectGone(markAll, 10000)
    actionTaken = 'mark-all'
  } else if (await markRead.isVisible().catch(() => false)) {
    await markRead.click()
    actionTaken = 'mark-one'
  }

  summary.notifications = {
    actionTaken,
    unreadActionsBefore,
  }
  summary.checks.push('notifications-workspace')
}

async function verifySettingsWorkspace(page, summary) {
  await page.goto(`${baseUrl}/hr/settings`, { waitUntil: 'networkidle' })
  await waitForSettingsForm(page)

  const languageSelect = page.locator('select').first()
  const currencySelect = page.locator('select').filter({ has: page.locator('option[value="MXN"]') }).first()
  const timezoneSelect = page.locator('select').filter({ has: page.locator('option[value="Asia/Kolkata"]') }).first()
  const saveButton = page.locator('main button').last()

  await languageSelect.selectOption('es-MX')
  await currencySelect.selectOption('MXN')
  await timezoneSelect.selectOption('Asia/Kolkata')
  await saveButton.click()
  await expectButtonDisabled(saveButton, 10000)

  await page.reload({ waitUntil: 'networkidle' })
  await waitForSettingsForm(page)

  const persistedLanguage = await languageSelect.inputValue()
  const persistedCurrency = await currencySelect.inputValue()
  const persistedTimezone = await timezoneSelect.inputValue()
  if (persistedLanguage !== 'es-MX' || persistedCurrency !== 'MXN' || persistedTimezone !== 'Asia/Kolkata') {
    throw new Error(`Settings did not persist as expected: ${persistedLanguage}, ${persistedCurrency}, ${persistedTimezone}`)
  }

  await languageSelect.selectOption('en-US')
  await currencySelect.selectOption('USD')
  await timezoneSelect.selectOption('America/Los_Angeles')
  const restoreButton = page.locator('main button').last()
  await restoreButton.click()
  await expectButtonDisabled(restoreButton, 10000)

  summary.settings = {
    persistedLanguage,
    persistedCurrency,
    persistedTimezone,
  }
  summary.checks.push('settings-workspace')
}

async function verifyAuditLogWorkspace(page, summary) {
  await page.goto(`${baseUrl}/hr/admin`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /audit log/i, level: 1 }).waitFor({ timeout: 15000 })

  await page.getByRole('button', { name: /^filter$/i }).click()
  await page.getByRole('button', { name: /^employee$/i }).click()
  await page.waitForTimeout(600)

  const labels = await page.locator('table tbody tr td:nth-child(3)').allInnerTexts()
  if (labels.length === 0) {
    throw new Error('Audit log employee filter returned no rows.')
  }
  if (!labels.every((label) => normalize(label) === 'Employee')) {
    throw new Error(`Audit log filter returned unexpected labels: ${labels.join(', ')}`)
  }

  await page.locator('table tbody tr').first().locator('td').first().click()
  await page.getByText(/Before|After/i).first().waitFor({ timeout: 10000 })

  summary.auditLog = { filteredRows: labels.length }
  summary.checks.push('audit-log-workspace')
}

async function verifyStarterLifecycleGap(page, summary) {
  const uniqueSuffix = Date.now()
  const hire = {
    firstName: 'Manual',
    lastName: `Walk${String(uniqueSuffix).slice(-6)}`,
    email: `manual.walk.${uniqueSuffix}@example.com`,
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
  await page.waitForTimeout(1500)

  const stillOnHireRoute = page.url().includes('/hr/actions/hire')
  const visibleError = await page.locator('.hr-field-error, [role="alert"]').first().isVisible().catch(() => false)

  if (!stillOnHireRoute && !visibleError) {
    throw new Error('Expected the learner starter hire flow to remain incomplete, but it behaved like the fully implemented app.')
  }

  summary.lifecycleGap = {
    route: page.url().replace(baseUrl, ''),
    stillOnHireRoute,
    visibleError,
    sampleEmail: hire.email,
    sampleSalary: salary,
  }
  summary.checks.push('starter-lifecycle-gap')
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

  summary.errorPages = true
  summary.checks.push('error-pages')
}

async function expectPageText(page, pattern) {
  await page.waitForFunction((source) => new RegExp(source, 'i').test(document.body.innerText), pattern.source, { timeout: 15000 })
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

async function waitForSettingsForm(page) {
  await page.waitForURL(url => url.pathname === '/hr/settings', { timeout: 15000 })
  await page.locator('select').first().waitFor({ timeout: 15000 })
}

async function expectGone(locator, timeoutMs) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (!(await locator.isVisible().catch(() => false))) {
      return
    }
    await locator.page().waitForTimeout(200)
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

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim()
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

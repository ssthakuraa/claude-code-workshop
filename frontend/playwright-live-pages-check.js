import { existsSync } from 'node:fs'
import { chromium, firefox, request as playwrightRequest } from 'playwright'

const frontendBaseUrl = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5182'
const apiBaseUrl = withTrailingSlash(process.env.HR_API_BASE_URL || 'http://127.0.0.1:18082/app/hr/api/v1')
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
  const apiContext = await playwrightRequest.newContext({
    baseURL: apiBaseUrl,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  })

  try {
    const loginPayload = await apiPost(apiContext, '/auth/login', {
      username,
      password,
    })
    const token = loginPayload.data.token
    const user = loginPayload.data.user
    const authenticatedApi = await playwrightRequest.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    let originalPreferences = null
    try {
      originalPreferences = await ensureEnglishPreference(authenticatedApi)
      const liveData = await loadLiveData(authenticatedApi, user)
      const storageState = await loginThroughUi(browser)
      const checks = buildChecks(liveData)
      const results = []

      for (const check of checks) {
        results.push(await runCheck(browser, storageState, check))
      }

      console.log(JSON.stringify({
        frontendBaseUrl,
        apiBaseUrl,
        browser: headless ? 'headless' : 'headed',
        browserEngine,
        fallbackReason,
        viewport: `${viewportWidth}x${viewportHeight}`,
        username,
        verifiedPages: results,
      }, null, 2))
    } finally {
      if (originalPreferences) {
        await restorePreferences(authenticatedApi, originalPreferences)
      }
      await authenticatedApi.dispose()
    }
  } finally {
    await apiContext.dispose()
    await browser.close()
  }
}

async function loadLiveData(api, user) {
  const employeesResponse = await apiGet(api, '/employees?page=0&size=500&sort=lastName')
  const employees = employeesResponse.data ?? []
  const detailEmployee = employees.find((employee) => employee.employeeId === user.employeeId) ?? employees[0]
  const rootEmployee = employees.find((employee) => !employee.managerId && employee.employmentStatus !== 'TERMINATED') ?? detailEmployee

  const [
    detailResponse,
    dashboardResponse,
    departmentsResponse,
    jobsResponse,
    notificationsResponse,
    preferencesResponse,
    auditResponse,
  ] = await Promise.all([
    apiGet(api, `/employees/${detailEmployee.employeeId}`),
    apiGet(api, '/dashboard/summary'),
    apiGet(api, '/departments'),
    apiGet(api, '/jobs'),
    apiGet(api, '/notifications'),
    apiGet(api, '/users/me/preferences'),
    apiGet(api, '/audit-logs?page=0&size=20'),
  ])

  const departments = departmentsResponse.data ?? []
  const jobs = jobsResponse.data ?? []
  const notifications = notificationsResponse.data ?? []
  const auditEntries = auditResponse.data ?? []

  const firstDepartment = departments[0]
  const firstJob = jobs[0]
  const alternateJob = jobs.find((job) => job.jobId !== detailResponse.data.jobId) ?? firstJob
  const firstNotification = notifications[0]
  const firstAuditEntry = auditEntries[0]

  return {
    user,
    employees,
    detailEmployee: detailResponse.data,
    rootEmployee,
    dashboard: dashboardResponse.data,
    departments,
    firstDepartment,
    jobs,
    firstJob,
    alternateJob,
    notifications,
    firstNotification,
    preferences: preferencesResponse.data,
    auditEntries,
    firstAuditEntry,
  }
}

async function ensureEnglishPreference(api) {
  const preferencesResponse = await apiGet(api, '/users/me/preferences')
  const preferences = preferencesResponse.data

  if (preferences.language === 'en-US') {
    return null
  }

  const response = await api.patch(normalizeApiPath('/users/me/preferences'), {
    data: {
      ...preferences,
      language: 'en-US',
    },
  })

  if (!response.ok()) {
    throw new Error(`PATCH /users/me/preferences failed with ${response.status()}`)
  }

  return preferences
}

async function restorePreferences(api, preferences) {
  const response = await api.patch(normalizeApiPath('/users/me/preferences'), {
    data: preferences,
  })

  if (!response.ok()) {
    throw new Error(`Failed to restore /users/me/preferences with status ${response.status()}`)
  }
}

function buildChecks(liveData) {
  const firstEmployee = liveData.employees[0]

  return [
    {
      name: 'login',
      route: '/hr/login',
      allowUnauthed: true,
      expectedApis: [],
      async verify(page) {
        await page.getByRole('heading', { name: /hr enterprise platform/i }).waitFor({ timeout: 15000 })
        await page.getByLabel(/username/i).waitFor({ timeout: 15000 })
        await page.getByLabel(/password/i).waitFor({ timeout: 15000 })
      },
    },
    {
      name: 'dashboard',
      route: '/hr/dashboard',
      expectedApis: ['/dashboard/summary'],
      async verify(page) {
        await page.getByRole('heading', { name: /welcome back/i }).waitFor({ timeout: 15000 })
        await expectText(page, String(liveData.dashboard.totalHeadcount))
        if (liveData.dashboard.recentActivity[0]?.text) {
          await expectText(page, liveData.dashboard.recentActivity[0].text)
        }
      },
    },
    {
      name: 'employees',
      route: '/hr/employees',
      expectedApis: ['/employees', '/departments'],
      async verify(page) {
        await page.getByRole('heading', { name: /^employees$/i }).waitFor({ timeout: 15000 })
        await page.getByPlaceholder('Search by name, ID, or title...').waitFor({ timeout: 15000 })
        const firstRow = page.locator('table tbody tr').first()
        await firstRow.waitFor({ timeout: 15000 })
        const firstRowText = await firstRow.innerText()
        if (!normalize(firstRowText)) {
          throw new Error('Employee directory rendered an empty first row.')
        }
      },
    },
    {
      name: 'employee-detail',
      route: `/hr/employees/${liveData.detailEmployee.employeeId}`,
      expectedApis: [`/employees/${liveData.detailEmployee.employeeId}`, '/employees?'],
      async verify(page) {
        await page.getByRole('heading', { name: liveData.detailEmployee.fullName }).waitFor({ timeout: 15000 })
        await expectText(page, liveData.detailEmployee.email)
      },
    },
    {
      name: 'org-chart',
      route: '/hr/organization/chart',
      expectedApis: [],
      async verify(page) {
        await page.getByRole('heading', { name: /org chart/i }).waitFor({ timeout: 15000 })
        const firstOrgCard = page.locator('div.cursor-pointer').first()
        await firstOrgCard.waitFor({ timeout: 15000 })
        const cardText = await firstOrgCard.innerText()
        if (!normalize(cardText).includes(liveData.rootEmployee.fullName)) {
          throw new Error(`Org chart did not render the expected root employee card. Saw: ${cardText}`)
        }
      },
    },
    {
      name: 'notifications',
      route: '/hr/notifications',
      expectedApis: ['/notifications'],
      async verify(page) {
        await page.getByRole('heading', { name: /^notifications$/i }).waitFor({ timeout: 15000 })
        if (liveData.firstNotification?.title) {
          await expectText(page, liveData.firstNotification.title)
        } else {
          await expectText(page, 'No notifications found.')
        }
      },
    },
    {
      name: 'settings',
      route: '/hr/settings',
      expectedApis: ['/users/me/preferences', '/notifications'],
      async verify(page) {
        await page.getByRole('heading', { name: /^settings$/i }).waitFor({ timeout: 15000 })
        await expectText(page, liveData.user.fullName)
        if (liveData.firstNotification?.title) {
          await expectText(page, liveData.firstNotification.title)
        } else {
          await expectText(page, 'No notifications available')
        }
      },
    },
    {
      name: 'audit-log',
      route: '/hr/admin',
      expectedApis: ['/audit-logs'],
      async verify(page) {
        await page.getByRole('heading', { name: /audit log/i }).waitFor({ timeout: 15000 })
        if (liveData.firstAuditEntry) {
          await expectText(page, `#${liveData.firstAuditEntry.recordId}`)
          await expectText(page, liveData.firstAuditEntry.action)
        } else {
          await expectText(page, 'No audit log entries found.')
        }
      },
    },
    {
      name: 'hire',
      route: '/hr/actions/hire',
      expectedApis: ['/jobs', '/departments', '/employees'],
      async verify(page) {
        await page.getByRole('heading', { name: /hire employee/i }).waitFor({ timeout: 15000 })
        await page.locator('input[placeholder="Jane"]').fill('Verifier')
        await page.locator('input[placeholder="Smith"]').fill('User')
        await page.locator('input[placeholder="jane.smith@company.com"]').fill('verifier.user@example.com')
        await page.locator('input[type="date"]').first().fill('2026-04-11')
        await page.locator('input[type="password"]').fill('password123')
        await page.getByRole('button', { name: /^next$/i }).click()
        await page.locator('select').first().waitFor({ timeout: 15000 })
        await expectSelectContains(page.locator('select').nth(0), liveData.firstJob.jobTitle)
        await expectSelectContains(page.locator('select').nth(1), liveData.firstDepartment.departmentName)
      },
    },
    {
      name: 'promote',
      route: `/hr/actions/promote/${liveData.detailEmployee.employeeId}`,
      expectedApis: [`/employees/${liveData.detailEmployee.employeeId}`, '/jobs'],
      async verify(page) {
        await page.getByRole('heading', { name: /promote employee/i }).waitFor({ timeout: 15000 })
        await expectText(page, liveData.detailEmployee.fullName)
        await expectSelectContains(page.locator('select').first(), liveData.alternateJob.jobTitle)
      },
    },
    {
      name: 'transfer',
      route: `/hr/actions/transfer/${liveData.detailEmployee.employeeId}`,
      expectedApis: [`/employees/${liveData.detailEmployee.employeeId}`, '/departments', '/employees'],
      async verify(page) {
        await page.getByRole('heading', { name: /transfer employee/i }).waitFor({ timeout: 15000 })
        await expectText(page, liveData.detailEmployee.departmentName)
        await expectSelectContains(page.locator('select').first(), liveData.firstDepartment.departmentName)
      },
    },
    {
      name: 'terminate',
      route: `/hr/actions/terminate/${liveData.detailEmployee.employeeId}`,
      expectedApis: [`/employees/${liveData.detailEmployee.employeeId}`],
      async verify(page) {
        await page.getByRole('heading', { name: /terminate employee/i }).waitFor({ timeout: 15000 })
        await expectText(page, liveData.detailEmployee.fullName)
        await expectText(page, liveData.detailEmployee.jobTitle)
      },
    },
  ]
}

async function runCheck(browser, storageState, check) {
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    storageState: check.allowUnauthed ? undefined : storageState,
  })
  const page = await context.newPage()
  const apiHits = []

  page.on('response', (response) => {
    const url = response.url()
    if (url.includes('/app/hr/api/v1/')) {
      apiHits.push({
        url,
        status: response.status(),
      })
    }
  })

  try {
    await page.goto(`${frontendBaseUrl}${check.route}`, { waitUntil: 'networkidle' })
    await check.verify(page)
    assertExpectedApis(check.name, check.expectedApis, apiHits)

    return {
      page: check.name,
      route: check.route,
      apiHits: unique(apiHits.map((entry) => `${entry.status} ${stripOrigin(entry.url)}`)),
    }
  } finally {
    await page.close()
    await context.close()
  }
}

async function loginThroughUi(browser) {
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
  })
  const page = await context.newPage()

  try {
    await page.goto(`${frontendBaseUrl}/hr/login`, { waitUntil: 'networkidle' })
    await page.getByLabel(/username/i).fill(username)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL('**/hr/dashboard', { timeout: 15000 })
    await page.getByRole('heading', { name: /welcome back/i }).waitFor({ timeout: 15000 })
    return await context.storageState()
  } finally {
    await page.close()
    await context.close()
  }
}

function assertExpectedApis(checkName, expectedApis, apiHits) {
  for (const expected of expectedApis) {
    const found = apiHits.some((hit) => hit.url.includes(expected))
    if (!found) {
      throw new Error(`Expected API call not observed for ${checkName}: ${expected}. Observed: ${unique(apiHits.map((hit) => stripOrigin(hit.url))).join(', ')}`)
    }
  }
}

async function expectText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 15000 })
}

async function expectSelectContains(locator, text) {
  await locator.waitFor({ timeout: 15000 })
  const options = await locator.locator('option').allTextContents()
  if (!options.some((option) => option.includes(text))) {
    throw new Error(`Expected select options to include: ${text}`)
  }
}

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim()
}

async function apiGet(api, path) {
  const response = await api.get(normalizeApiPath(path))
  if (!response.ok()) {
    throw new Error(`GET ${path} failed with ${response.status()}`)
  }
  return response.json()
}

async function apiPost(api, path, payload) {
  const response = await api.post(normalizeApiPath(path), { data: payload })
  if (!response.ok()) {
    throw new Error(`POST ${path} failed with ${response.status()}`)
  }
  return response.json()
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

function stripOrigin(url) {
  return url.replace(/^https?:\/\/[^/]+/, '')
}

function unique(values) {
  return [...new Set(values)]
}

function normalizeApiPath(path) {
  return path.replace(/^\//, '')
}

function withTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

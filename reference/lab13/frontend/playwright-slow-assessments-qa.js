import { existsSync } from 'node:fs'
import { chromium, firefox } from 'playwright'

const baseUrl = process.env.HR_UI_BASE_URL || 'http://127.0.0.1:5181'
const headless = process.env.HR_UI_HEADLESS === 'true'
const pauseMs = Number(process.env.HR_UI_CLICK_DELAY_MS || '10000')
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

const personas = [
  {
    role: 'HR_SPECIALIST',
    username: process.env.HR_UI_HR_USERNAME || 'valeria.cruz',
    password: process.env.HR_UI_HR_PASSWORD || 'password123',
    searchValue: 'Steven',
    hiddenSearchValue: 'Marcus',
  },
  {
    role: 'MANAGER',
    username: process.env.HR_UI_MANAGER_USERNAME || 'marcus.vale',
    password: process.env.HR_UI_MANAGER_PASSWORD || 'password123',
    searchValue: 'Helena',
    hiddenSearchValue: 'Steven',
  },
]
const targetRole = process.env.HR_UI_TARGET_ROLE || ''

function stamp() {
  return new Date().toISOString()
}

function log(message) {
  console.log(`[${stamp()}] ${message}`)
}

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim()
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function clickWithDelay(locator, label) {
  log(`Click: ${label}`)
  await locator.click()
  log(`Pause ${pauseMs}ms after click: ${label}`)
  await sleep(pauseMs)
}

async function launchBrowser() {
  for (const executablePath of chromiumFallbackPaths) {
    try {
      const browser = await chromium.launch({
        headless,
        executablePath,
      })
      return { browser, engine: 'chromium', fallbackReason: null }
    } catch {
      continue
    }
  }

  if (firefoxExecutablePath) {
    const browser = await firefox.launch({
      headless,
      executablePath: firefoxExecutablePath,
    })
    return {
      browser,
      engine: 'firefox',
      fallbackReason: 'Chromium launch unavailable; used Firefox fallback.',
    }
  }

  throw new Error('No compatible browser launch path found.')
}

async function login(page, persona, summary) {
  log(`${persona.role}: open login page`)
  await page.goto(`${baseUrl}/hr/login`, { waitUntil: 'networkidle' })
  await page.locator('#username').fill(persona.username)
  await page.locator('#password').fill(persona.password)
  await clickWithDelay(page.locator('button[type="submit"]'), `${persona.role} sign in`)
  await page.waitForURL('**/hr/dashboard', { timeout: 20000 })
  const headingText = normalize(await page.locator('main h1').first().innerText())
  summary.dashboardHeading = headingText
  log(`${persona.role}: dashboard heading -> ${headingText}`)
}

async function openAssessmentsDirectory(page, persona, summary) {
  summary.visibleSidebarLinks = (await page.locator('nav a').allInnerTexts()).map((value) => normalize(value))
  const navLink = page.locator('a[href="/hr/assessments"]').first()
  await navLink.waitFor({ timeout: 15000 })
  const navLabel = normalize(await navLink.innerText())
  summary.navLabel = navLabel
  log(`${persona.role}: left-nav label -> ${navLabel}`)
  await clickWithDelay(navLink, `${persona.role} open assessments directory from sidebar`)
  await page.waitForURL('**/hr/assessments', { timeout: 15000 })
  const title = normalize(await page.locator('main h1').first().innerText())
  summary.directoryTitle = title
  log(`${persona.role}: directory title -> ${title}`)
}

async function collectVisibleRows(page) {
  const rowLocator = page.locator('table tbody tr')
  const count = await rowLocator.count()
  const rows = []
  for (let index = 0; index < Math.min(count, 5); index += 1) {
    rows.push(normalize(await rowLocator.nth(index).innerText()))
  }
  return { count, rows }
}

async function runSearchCheck(page, persona, summary) {
  const searchInput = page.locator('main form input[type="text"]').first()
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(persona.searchValue)
  await clickWithDelay(page.locator('main form button[type="submit"]').first(), `${persona.role} submit search ${persona.searchValue}`)

  const emptyState = page.locator('main').getByText(/no assessments|ninguna evaluación|aucune evaluation|कोई आकलन/i).first()
  const rowLocator = page.locator('table tbody tr')

  await Promise.race([
    rowLocator.first().waitFor({ timeout: 15000 }).catch(() => null),
    emptyState.waitFor({ timeout: 15000 }).catch(() => null),
  ])

  const rowCount = await rowLocator.count()
  const emptyVisible = await emptyState.isVisible().catch(() => false)
  summary.search = {
    query: persona.searchValue,
    rowCount,
    emptyVisible,
    rows: rowCount > 0 ? (await collectVisibleRows(page)).rows : [],
  }

  log(`${persona.role}: search ${persona.searchValue} -> rowCount=${rowCount}, emptyVisible=${emptyVisible}`)
  if (rowCount === 0) {
    throw new Error(`${persona.role}: expected search ${persona.searchValue} to return rows, but it was empty.`)
  }

  await searchInput.fill(persona.hiddenSearchValue)
  await clickWithDelay(page.locator('main form button[type="submit"]').first(), `${persona.role} submit hidden search ${persona.hiddenSearchValue}`)

  await Promise.race([
    rowLocator.first().waitFor({ timeout: 15000 }).catch(() => null),
    emptyState.waitFor({ timeout: 15000 }).catch(() => null),
  ])

  const hiddenRowCount = await rowLocator.count()
  const hiddenEmptyVisible = await emptyState.isVisible().catch(() => false)
  summary.hiddenSearch = {
    query: persona.hiddenSearchValue,
    rowCount: hiddenRowCount,
    emptyVisible: hiddenEmptyVisible,
  }
  log(`${persona.role}: hidden search ${persona.hiddenSearchValue} -> rowCount=${hiddenRowCount}, emptyVisible=${hiddenEmptyVisible}`)

  if (hiddenRowCount > 0) {
    throw new Error(`${persona.role}: expected hidden search ${persona.hiddenSearchValue} to return no rows, but rows were visible.`)
  }
}

async function main() {
  const browserInfo = await launchBrowser()
  const summary = {
    baseUrl,
    browserEngine: browserInfo.engine,
    fallbackReason: browserInfo.fallbackReason,
    headless,
    pauseMs,
    personas: [],
  }

  log(`Browser launched using ${browserInfo.engine}, headless=${headless}`)

  try {
    for (const persona of personas.filter((item) => !targetRole || item.role === targetRole)) {
      const context = await browserInfo.browser.newContext({
        viewport: { width: viewportWidth, height: viewportHeight },
      })
      const page = await context.newPage()
      const personaSummary = {
        role: persona.role,
        username: persona.username,
      }

      try {
        await login(page, persona, personaSummary)
        await openAssessmentsDirectory(page, persona, personaSummary)
        const initialRows = await collectVisibleRows(page)
        personaSummary.initialRows = initialRows
        log(`${persona.role}: initial visible rows=${initialRows.count}`)
        await runSearchCheck(page, persona, personaSummary)
        summary.personas.push(personaSummary)
      } finally {
        await context.close()
      }
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await browserInfo.browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page: Page) {
  await page.goto(`${BASE}/hr/login`)
  await page.locator('input[type="text"]').first().fill('steven.king')
  await page.locator('input[type="password"]').first().fill('password123')
  await page.keyboard.press('Enter')
  await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
}

test.describe('HR App Smoke Tests', () => {

  test('login page loads with expected form fields', async ({ page }) => {
    await page.goto(BASE)
    const usernameInput = page.locator('input[type="text"], input[name="username"], input[placeholder*="user" i]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(usernameInput).toBeVisible({ timeout: 10000 })
    await expect(passwordInput).toBeVisible()
  })

  test('login and redirect works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('input[type="text"], input[name="username"], input[placeholder*="user" i]').first().fill('steven.king')
    await page.locator('input[type="password"]').first().fill('password123')
    await page.keyboard.press('Enter')
    await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
    await expect(page.locator('body')).toContainText('Steven King', { timeout: 5000 })
  })

  test('dashboard renders real KPI data', async ({ page }) => {
    await login(page)
    await expect(page.locator('body')).toContainText('Welcome back, Steven', { timeout: 8000 })
    await expect(page.locator('body')).toContainText('Total Headcount', { timeout: 8000 })

    // Verify the headcount number is real (> 100, we have 213 in the DB)
    const bodyText = await page.locator('body').textContent() ?? ''
    expect(bodyText).toMatch(/Total Headcount\s*\n?\s*\d{3,}/,
      'Headcount should be a real number matching DB (>100)')
    expect(bodyText).toMatch(/Active Employees?\s*\n?\s*\d{3,}/,
      'Active employees should be a real number matching DB (>100)')
  })

  test('employees page renders table with real employee data', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/employees`)

    await expect(page.locator('body')).toContainText('Employees', { timeout: 8000 })

    // Must show data in an HTML table
    const tableRows = page.locator('table tbody tr')
    await expect(tableRows.first()).toBeVisible({ timeout: 8000 })

    // Verify actual employee data from DB
    const row0 = tableRows.first()
    await expect(row0).toContainText('Abel')

    // Column headers must exist
    await expect(page.locator('body')).toContainText('Job Title')
    await expect(page.locator('body')).toContainText('Status')
    await expect(page.locator('body')).toContainText('Department')
  })

  test('org chart renders with real hierarchy data', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/organization/chart`)

    await expect(page.locator('body')).toContainText('Org Chart', { timeout: 8000 })

    // Employee cards must exist — the `.w-44.p-3.bg-white` card class
    const orgCards = page.locator('.w-44.p-3.bg-white')
    await expect(orgCards.first()).toBeVisible({ timeout: 10000 })

    const count = await orgCards.count()
    expect(count, `Org chart should render cards, got ${count}`).toBeGreaterThan(10)

    // Root node must contain Steven King at the top
    await expect(page.locator('body')).toContainText('Steven King')
    await expect(page.locator('body')).toContainText('President')
  })

  test('departments page renders with non-zero employee counts', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/organization/departments`)

    await expect(page.locator('body')).toContainText('Departments', { timeout: 8000 })

    const cards = page.locator('div.bg-white.rounded-lg.border')
    await expect(cards.first()).toBeVisible({ timeout: 8000 })

    const count = await cards.count()
    expect(count, `Departments page should show cards, got ${count}`).toBeGreaterThan(20)

    // At least one card should show a 2+ digit employee count (not just "1 employee")
    const bodyText = await page.locator('body').textContent() ?? ''
    // The header line says "0 employees" or "10 employees" etc — match standalone 0
    expect(bodyText).not.toMatch(/[>\s]0 employees[<\s]/i,
      'Departments should have employees populated — not all zero')

    await expect(page.locator('body')).toContainText('Sales')
    await expect(page.locator('body')).toContainText('IT')
  })

  test('jobs page renders with job titles and salary ranges', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/organization/jobs`)

    await expect(page.locator('body')).toContainText('Jobs', { timeout: 8000 })
    await expect(page.locator('body')).toContainText('$', { timeout: 8000 })

    const bodyText = await page.locator('body').textContent() ?? ''
    expect(bodyText).toMatch(/Accountant|Sales Representative|Programmer/,
      'Jobs page should show actual job titles from DB')
  })

  test('locations page renders with city names', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/organization/locations`)

    await expect(page.locator('body')).toContainText('Locations', { timeout: 8000 })
    await expect(page.locator('body')).toContainText('Seattle', { timeout: 8000 })
  })

  test('employee detail page renders with employee info', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/employees/100`)

    await expect(page.locator('body')).toContainText('Steven King', { timeout: 8000 })
    await expect(page.locator('body')).toContainText('steven.king', { timeout: 5000 })
    await expect(page.locator('body')).toContainText('President')
  })

  test('hire wizard loads with all steps and data-dependent fields', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/actions/hire`)

    await expect(page.locator('body')).toContainText('Hire Employee', { timeout: 8000 })
    await expect(page.locator('input[placeholder="Jane"]')).toBeVisible({ timeout: 5000 })

    // Fill step 1 and advance to verify dropdowns
    await page.locator('input[placeholder="Jane"]').fill('SmokeTest')
    await page.locator('input[placeholder="Smith"]').fill('Verify')
    await page.locator('input[type="email"]').fill('smoke@test.com')
    await page.locator('input[type="date"]').fill('2026-04-10')
    await page.locator('input[placeholder="Min 8 characters"]').fill('password123')
    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForTimeout(1000)

    // Job, Department, Manager dropdowns all present
    const selects = page.locator('select')
    await expect(selects).toHaveCount(3, { timeout: 5000 })

    // Verify dropdowns are populated with real data from APIs
    const jobOptions = await selects.nth(0).locator('option').count()
    expect(jobOptions, `Job dropdown should have options, got ${jobOptions}`).toBeGreaterThan(15)

    const deptOptions = await selects.nth(1).locator('option').count()
    expect(deptOptions, `Dept dropdown should have options, got ${deptOptions}`).toBeGreaterThan(20)
  })

  test('hire wizard validation catches empty required fields', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/hr/actions/hire`)

    await expect(page.locator('input[placeholder="Jane"]')).toBeVisible({ timeout: 8000 })

    // Click Next without filling anything
    await page.getByRole('button', { name: 'Next' }).click()

    // Required field errors should appear
    await expect(page.locator('body')).toContainText('Required', { timeout: 3000 })
  })

})

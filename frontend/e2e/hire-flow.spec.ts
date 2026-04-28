/**
 * Full hire onboarding flow — 4-step wizard end to end.
 * Runs against the real frontend/backend integration.
 */
import { test, expect } from '@playwright/test'
import { login, terminateEmployeeViaApi } from './helpers'

const NEW_HIRE = {
  firstName: 'Test',
  lastName: 'Candidate',
  email: `test.candidate.${Date.now()}@example.com`,
  phone: '+1 555-0199',
  hireDate: '2026-04-01',
  password: 'Welcome123',
}

test.describe('Hire Employee — full wizard flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/hr/actions/hire')
    await expect(page.getByRole('heading', { name: /hire employee/i })).toBeVisible()
  })

  test('Step 1 — Personal Info: validation blocks empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /next/i }).click()
    // Required field errors should appear
    await expect(page.getByText(/required/i).first()).toBeVisible()
    // Still on step 1
    await expect(page.getByPlaceholder('Jane', { exact: true })).toBeVisible()
  })

  test('Step 1 — Personal Info: invalid email blocked', async ({ page }) => {
    await page.getByPlaceholder('Jane', { exact: true }).fill(NEW_HIRE.firstName)
    await page.getByPlaceholder('Smith', { exact: true }).fill(NEW_HIRE.lastName)
    await page.getByPlaceholder('jane.smith@company.com').fill('not-an-email')
    await page.getByRole('button', { name: /next/i }).click()
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('Full wizard: all 4 steps → hire submitted → redirected to directory', async ({ page, request }) => {
    // ── Step 1: Personal Info ──────────────────────────────────────
    await page.getByPlaceholder('Jane', { exact: true }).fill(NEW_HIRE.firstName)
    await page.getByPlaceholder('Smith', { exact: true }).fill(NEW_HIRE.lastName)
    await page.getByPlaceholder('jane.smith@company.com').fill(NEW_HIRE.email)
    await page.getByPlaceholder('+1 555-0100').fill(NEW_HIRE.phone)
    await page.locator('input[type="date"]').first().fill(NEW_HIRE.hireDate)
    await page.locator('input[type="password"]').fill(NEW_HIRE.password)
    await page.getByRole('button', { name: /next/i }).click()

    // ── Step 2: Job & Department ───────────────────────────────────
    await expect(page.locator('select').first()).toBeVisible()
    // Select first available job
    const jobSelect = page.locator('select').filter({ hasText: /select job/i })
    await jobSelect.selectOption({ index: 1 })
    // Select first available department
    const deptSelect = page.locator('select').filter({ hasText: /select department/i })
    await deptSelect.selectOption({ index: 1 })
    await page.getByRole('button', { name: /next/i }).click()

    // ── Step 3: Compensation ───────────────────────────────────────
    await expect(page.locator('input[type="number"]').first()).toBeVisible()
    // Fill salary input using the selected job's allowed band
    const salaryInput = page.locator('input[type="number"]').first()
    const min = Number(await salaryInput.getAttribute('min'))
    const max = Number(await salaryInput.getAttribute('max'))
    const salary = Number.isFinite(min) && Number.isFinite(max)
      ? Math.round((min + max) / 2)
      : 7500
    await salaryInput.fill(String(salary))
    await page.getByRole('button', { name: /next/i }).click()

    // ── Step 4: Review ─────────────────────────────────────────────
    await expect(page.getByRole('button', { name: /hire employee/i })).toBeVisible()
    await expect(page.getByText(`${NEW_HIRE.firstName} ${NEW_HIRE.lastName}`)).toBeVisible()
    await expect(page.getByText(NEW_HIRE.email)).toBeVisible()

    // Submit
    await page.getByRole('button', { name: /hire employee/i }).click()

    // ── Post-submit: success toast + redirect ──────────────────────
    await expect(page.getByText(/hired successfully/i)).toBeVisible({ timeout: 8000 })
    await expect(page).toHaveURL(/\/hr\/employees/)

    const searchBox = page.getByPlaceholder('Search by name, ID, or title...')
    await searchBox.fill(NEW_HIRE.email)
    const newHireRow = page.locator('table tbody tr').filter({ hasText: NEW_HIRE.lastName }).first()
    await expect(newHireRow).toBeVisible({ timeout: 15000 })
    await newHireRow.click()
    await expect(page).toHaveURL(/\/hr\/employees\/\d+$/)

    const employeeId = Number(page.url().match(/\/hr\/employees\/(\d+)$/)?.[1])
    if (!employeeId) {
      throw new Error(`Unable to resolve created employee id from ${page.url()}`)
    }

    await terminateEmployeeViaApi(request, page, employeeId)
  })
})

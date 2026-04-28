/**
 * Smoke tests — visit every page and assert it renders its <h1>.
 * Runs against the dev server with the real API wiring.
 */
import { test, expect } from '@playwright/test'
import { login, expectPageOk } from './helpers'

test.describe('Page smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('Dashboard renders KPI cards', async ({ page }) => {
    await expectPageOk(page, /welcome back/i)
    await expect(page.getByText('Total Headcount')).toBeVisible()
    await expect(page.getByText('New Hires')).toBeVisible()
    await expect(page.getByText('Active Employees')).toBeVisible()
  })

  test('Employee Directory renders table', async ({ page }) => {
    await page.goto('/hr/employees')
    await expectPageOk(page, /employees/i)
    // At least one employee row should be visible
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 8000 })
  })

  test('Employee Detail page renders', async ({ page }) => {
    await page.goto('/hr/employees')
    await page.locator('table tbody tr').first().click()
    await expect(page).toHaveURL(/\/hr\/employees\/\d+/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Org Chart page renders', async ({ page }) => {
    await page.goto('/hr/organization/chart')
    await expectPageOk(page, /org chart/i)
  })

  test('Notifications page renders', async ({ page }) => {
    await page.goto('/hr/notifications')
    await expectPageOk(page, /notifications/i)
    // At least one notification item
    await expect(page.locator('article, [class*="border-b"]').first()).toBeVisible()
  })

  test('Audit Log page renders', async ({ page }) => {
    await page.goto('/hr/admin')
    await expectPageOk(page, /audit log/i)
  })

  test('Settings page renders', async ({ page }) => {
    await page.goto('/hr/settings')
    await expectPageOk(page, /settings/i)
    await expect(page.getByRole('heading', { name: /preferences/i })).toBeVisible()
  })

  test('Hire Wizard page renders', async ({ page }) => {
    await page.goto('/hr/actions/hire')
    await expectPageOk(page, /hire employee/i)
    await expect(page.getByPlaceholder('Jane', { exact: true })).toBeVisible()
  })

  test('Sidebar action links redirect to employees (no id in URL)', async ({ page }) => {
    for (const path of ['/hr/actions/promote', '/hr/actions/transfer', '/hr/actions/terminate']) {
      await page.goto(path)
      await expect(page).toHaveURL(/\/hr\/employees/)
    }
  })
})

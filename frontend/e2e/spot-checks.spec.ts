/**
 * Spot-check tests — verify key interactions on specific pages.
 */
import { test, expect } from '@playwright/test'
import { login } from './helpers'

test.describe('Spot checks', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('Employee Directory: search filters the list', async ({ page }) => {
    await page.goto('/hr/employees')
    const rows = page.locator('table tbody tr')
    await rows.first().waitFor()
    const totalBefore = await rows.count()

    const searchBox = page.getByPlaceholder('Search by name, ID, or title...')
    await searchBox.click()
    await searchBox.pressSequentially('Steven', { delay: 50 })

    // Poll until the table filters down
    await expect(async () => {
      expect(await rows.count()).toBeLessThan(totalBefore)
    }).toPass({ timeout: 5000 })
    await expect(page.locator('table').getByText('Steven King')).toBeVisible()
  })

  test('Employee Directory: status filter works', async ({ page }) => {
    await page.goto('/hr/employees')
    await page.getByRole('combobox').filter({ hasText: /all status|status/i }).selectOption('ACTIVE')
    await page.waitForTimeout(400)
    // No TERMINATED badge should be visible
    await expect(page.getByText('TERMINATED')).not.toBeVisible()
  })

  test('Employee Detail: navigate from directory', async ({ page }) => {
    await page.goto('/hr/employees')
    await page.locator('table tbody tr').first().waitFor()
    await page.locator('table tbody tr').first().click()
    await expect(page).toHaveURL(/\/hr\/employees\/\d+/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Settings: language preference persists after navigation', async ({ page }) => {
    await page.goto('/hr/settings')
    // Change language to Spanish Mexico
    const languageSelect = page.locator('select').filter({ hasText: /english|en-us/i }).first()
    await languageSelect.selectOption('es-MX')
    await page.getByRole('button', { name: /save changes/i }).click()
    await expect(page.getByText('Preferences saved')).toBeVisible()

    // Navigate away and back
    await page.goto('/hr/dashboard')
    await page.goto('/hr/settings')

    // Language should still be es-MX
    await expect(languageSelect).toHaveValue('es-MX')

    // Reset to English
    await languageSelect.selectOption('en-US')
    await page.getByRole('button', { name: /save changes/i }).click()
  })

  test('Audit Log: table filter dropdown works', async ({ page }) => {
    await page.goto('/hr/admin')
    await page.getByRole('combobox').selectOption('employees')
    await page.waitForTimeout(300)
    // All visible entries should be "Employee" table
    const allText = await page.locator('[class*="text-neutral-700"][class*="w-24"]').allInnerTexts()
    for (const t of allText) {
      expect(t.trim()).toBe('Employee')
    }
  })
})

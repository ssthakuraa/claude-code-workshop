import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

test.describe('HR App Smoke Tests', () => {

  test('login page loads', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('input[type="text"], input[name="username"], input[placeholder*="username" i], input[placeholder*="user" i]').first()).toBeVisible({ timeout: 10000 })
  })

  test('login with steven.king / password123', async ({ page }) => {
    await page.goto(BASE)
    // Fill credentials — try common selectors
    const usernameInput = page.locator('input[name="username"], input[type="text"], input[placeholder*="user" i]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    await usernameInput.fill('steven.king')
    await passwordInput.fill('password123')
    await page.keyboard.press('Enter')
    // Should redirect away from login
    await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
    await expect(page).not.toHaveURL(/login/)
  })

  test('dashboard loads after login', async ({ page }) => {
    await page.goto(BASE)
    const usernameInput = page.locator('input[name="username"], input[type="text"], input[placeholder*="user" i]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    await usernameInput.fill('steven.king')
    await passwordInput.fill('password123')
    await page.keyboard.press('Enter')
    await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
    // Dashboard should show some headcount number
    await expect(page.locator('body')).toContainText(/\d+/, { timeout: 8000 })
  })

  test('employees page shows employee list', async ({ page }) => {
    await page.goto(BASE)
    const usernameInput = page.locator('input[name="username"], input[type="text"], input[placeholder*="user" i]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    await usernameInput.fill('steven.king')
    await passwordInput.fill('password123')
    await page.keyboard.press('Enter')
    await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
    // Navigate to employees
    await page.goto(`${BASE}/hr/employees`)
    // Should show at least one employee name
    await expect(page.locator('body')).toContainText(/King|Abel|Kochhar/, { timeout: 8000 })
  })

})

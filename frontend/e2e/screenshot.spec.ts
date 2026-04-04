import { test } from '@playwright/test'

const BASE = 'http://localhost:5173'

test('capture UI screenshots', async ({ page }) => {
  await page.goto(BASE)
  await page.screenshot({ path: '/tmp/ui-login.png' })

  await page.locator('input[type="text"]').first().fill('steven.king')
  await page.locator('input[type="password"]').first().fill('password123')
  await page.keyboard.press('Enter')
  await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: '/tmp/ui-dashboard.png', fullPage: true })

  await page.goto(`${BASE}/hr/employees`)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: '/tmp/ui-employees.png', fullPage: true })
  
  await page.goto(`${BASE}/hr/employees/100`)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: '/tmp/ui-employee-detail.png', fullPage: true })
})

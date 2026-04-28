import { type APIRequestContext, type Page, expect } from '@playwright/test'

export const BASE = 'http://localhost:5182'
export const ADMIN = { username: 'steven.king', password: 'password123' }

/** Log in and wait for dashboard */
export async function login(page: Page, user = ADMIN) {
  await page.goto('/hr/login')
  await page.getByLabel(/username/i).fill(user.username)
  await page.getByLabel(/password/i).fill(user.password)
  await page.getByRole('button', { name: /sign in|log in/i }).click()
  await expect(page).toHaveURL(/\/hr\/dashboard/)
}

/** Assert the main content area rendered (not an error page) */
export async function expectPageOk(page: Page, heading: string | RegExp) {
  await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible({ timeout: 8000 })
}

export async function getAccessToken(page: Page) {
  return await page.evaluate(() => window.localStorage.getItem('hr_access_token'))
}

export async function terminateEmployeeViaApi(
  request: APIRequestContext,
  page: Page,
  employeeId: number,
  reason = 'E2E cleanup termination',
) {
  const token = await getAccessToken(page)
  if (!token) {
    throw new Error('No access token available for E2E cleanup.')
  }

  const response = await request.post('/app/hr/api/v1/employees/terminate', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: {
      employeeId,
      reason,
      effectiveDate: '2026-04-18',
      idempotencyKey: `e2e-cleanup-${employeeId}-${Date.now()}`,
    },
  })

  if (!response.ok()) {
    throw new Error(`Failed to terminate employee ${employeeId} during E2E cleanup: ${response.status()} ${await response.text()}`)
  }
}

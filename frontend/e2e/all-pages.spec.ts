import { test, expect, Page, BrowserContext } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function loginAndGetContext(page: Page) {
  await page.goto(`${BASE}/hr/login`)
  await page.locator('input[type="text"]').first().fill('steven.king')
  await page.locator('input[type="password"]').first().fill('password123')
  await page.keyboard.press('Enter')
  await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 10000 })
}

const PAGES = [
  { path: '/hr/dashboard',                label: '01-dashboard' },
  { path: '/hr/employees',                label: '02-employee-directory' },
  { path: '/hr/employees/100',            label: '03-employee-detail' },
  { path: '/hr/organization/chart',       label: '04-org-chart' },
  { path: '/hr/organization/departments', label: '05-departments' },
  { path: '/hr/organization/jobs',        label: '06-jobs' },
  { path: '/hr/organization/locations',   label: '07-locations' },
  { path: '/hr/organization/countries',   label: '08-countries' },
  { path: '/hr/actions/hire',             label: '09-hire-wizard' },
  { path: '/hr/actions/promote/100',      label: '10-promote' },
  { path: '/hr/actions/transfer/100',     label: '11-transfer' },
  { path: '/hr/actions/terminate/100',    label: '12-terminate' },
  { path: '/hr/notifications',            label: '13-notifications' },
  { path: '/hr/settings',                 label: '14-settings' },
  { path: '/hr/admin',         label: '15-audit-logs' },
]

test.setTimeout(120000)

test('all pages load without errors', async ({ page }) => {
  await loginAndGetContext(page)

  const results: { label: string; status: string; note: string }[] = []

  for (const { path, label } of PAGES) {
    try {
      await page.goto(`${BASE}${path}`, { timeout: 10000 })
      // Wait for either main content or a quick timeout
      await page.waitForTimeout(2000)
      await page.screenshot({ path: `/tmp/pages/${label}.png`, fullPage: true })

      const body = await page.locator('body').textContent({ timeout: 3000 }) ?? ''
      const is404 = /404|Page Not Found|doesn't exist/i.test(body)
      const hasJsError = /Something went wrong|Application Error|TypeError|Cannot read/i.test(body)

      if (is404) results.push({ label, status: '404', note: 'Route not found' })
      else if (hasJsError) results.push({ label, status: 'JS ERROR', note: body.slice(0, 120) })
      else results.push({ label, status: 'OK', note: '' })
    } catch (e: any) {
      await page.screenshot({ path: `/tmp/pages/${label}-error.png` }).catch(() => {})
      results.push({ label, status: 'TIMEOUT/CRASH', note: e.message.slice(0, 80) })
    }
  }

  // Print results
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║          PAGE LOAD VERIFICATION          ║')
  console.log('╠══════════════════════════════════════════╣')
  for (const r of results) {
    const icon = r.status === 'OK' ? '✓' : '✗'
    console.log(`║ ${icon} ${r.label.padEnd(28)} ${r.status.padEnd(10)}║${r.note ? ' ' + r.note : ''}`)
  }
  console.log('╚══════════════════════════════════════════╝')

  const failed = results.filter(r => r.status !== 'OK')
  expect(failed, `Pages with issues:\n${failed.map(f => `  ${f.label}: ${f.status} — ${f.note}`).join('\n')}`).toHaveLength(0)
})

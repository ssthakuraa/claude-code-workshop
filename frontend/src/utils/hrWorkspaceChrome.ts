import { i18n } from '@/i18n/i18n'

export interface WorkspaceDestination {
  id: string
  label: string
  href: string
}

export const HR_PAGE_BOOKMARKS_KEY = 'hr_page_bookmarks'
export const HR_RECENT_PAGES_KEY = 'hr_recent_pages'
const MAX_RECENT_PAGES = 6

const WORKSPACE_DESTINATIONS: WorkspaceDestination[] = [
  { id: 'dashboard', label: 'dashboard', href: '/hr/dashboard' },
  { id: 'employees', label: 'employees', href: '/hr/employees' },
  { id: 'org-chart', label: 'orgChart', href: '/hr/organization/chart' },
  { id: 'locations', label: 'locations', href: '/hr/organization/locations' },
  { id: 'countries', label: 'countries', href: '/hr/organization/countries' },
  { id: 'notifications', label: 'notifications', href: '/hr/notifications' },
  { id: 'audit-log', label: 'auditLog', href: '/hr/admin' },
  { id: 'settings', label: 'settings', href: '/hr/settings' },
]

function readStoredIds(key: string) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(key)
    const values = stored ? JSON.parse(stored) : []
    return Array.isArray(values) ? values.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

function writeStoredIds(key: string, values: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(values))
  window.dispatchEvent(new Event('hr-workspace-storage'))
}

export function getWorkspaceDestinationById(id: string) {
  const destination = WORKSPACE_DESTINATIONS.find(item => item.id === id)
  if (!destination) {
    return null
  }

  const localizedLabels: Record<string, string> = {
    dashboard: i18n.t('dashboard', { ns: 'common' }),
    employees: i18n.t('employees', { ns: 'common' }),
    'org-chart': i18n.t('orgChart', { ns: 'common' }),
    locations: i18n.t('locations', { ns: 'common' }),
    countries: i18n.t('countries', { ns: 'common' }),
    notifications: i18n.t('notifications', { ns: 'common' }),
    'audit-log': i18n.t('auditLog', { ns: 'common' }),
    settings: i18n.t('settings', { ns: 'common' }),
  }

  return {
    ...destination,
    label: localizedLabels[destination.id] ?? destination.label,
  }
}

export function getWorkspaceDestinationForPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || pathname

  return WORKSPACE_DESTINATIONS.find((destination) => {
    if (destination.href === '/hr/employees') {
      return normalized === '/hr/employees' || normalized.startsWith('/hr/employees/')
    }

    return normalized === destination.href || normalized.startsWith(`${destination.href}/`)
  }) ?? null
}

export function getBookmarkedWorkspaceDestinations() {
  return readStoredIds(HR_PAGE_BOOKMARKS_KEY)
    .map(getWorkspaceDestinationById)
    .filter((destination): destination is WorkspaceDestination => Boolean(destination))
}

export function isWorkspaceBookmarked(id: string) {
  return readStoredIds(HR_PAGE_BOOKMARKS_KEY).includes(id)
}

export function toggleWorkspaceBookmark(id: string) {
  const current = readStoredIds(HR_PAGE_BOOKMARKS_KEY)
  const next = current.includes(id)
    ? current.filter(value => value !== id)
    : [...current, id]
  writeStoredIds(HR_PAGE_BOOKMARKS_KEY, next)
  return next.includes(id)
}

export function recordRecentWorkspacePath(pathname: string) {
  const destination = getWorkspaceDestinationForPath(pathname)
  if (!destination) {
    return
  }

  const current = readStoredIds(HR_RECENT_PAGES_KEY).filter(id => id !== destination.id)
  writeStoredIds(HR_RECENT_PAGES_KEY, [destination.id, ...current].slice(0, MAX_RECENT_PAGES))
}

export function getRecentWorkspaceDestinations() {
  return readStoredIds(HR_RECENT_PAGES_KEY)
    .map(getWorkspaceDestinationById)
    .filter((destination): destination is WorkspaceDestination => Boolean(destination))
}

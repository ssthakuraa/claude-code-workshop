import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Bell,
  FileText,
  GitBranch,
  Globe,
  LayoutDashboard,
  MapPin,
  Search,
  Settings,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'
import { buildHrGlobalSearchHref } from '@/utils/hrGlobalSearch'
import type { UserRole } from '@/types/auth'

interface HrCommandPaletteProps {
  open: boolean
  userRole: UserRole
  onClose: () => void
}

interface PaletteItem {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  roles?: UserRole[]
  keywords?: string[]
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

export function HrCommandPalette({ open, userRole, onClose }: HrCommandPaletteProps) {
  if (!open) {
    return null
  }

  return <HrCommandPaletteDialog userRole={userRole} onClose={onClose} />
}

function HrCommandPaletteDialog({ userRole, onClose }: Omit<HrCommandPaletteProps, 'open'>) {
  const { t } = useTranslation(['common', 'navigation', 'dashboard', 'actions', 'assessments'])
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const items = useMemo<PaletteItem[]>(() => [
    {
      id: 'dashboard',
      title: t('dashboard', { ns: 'common' }),
      description: t('commandPaletteDescriptions.dashboard', { ns: 'navigation' }),
      href: '/hr/dashboard',
      icon: <LayoutDashboard size={16} />,
      keywords: ['home', 'overview'],
    },
    {
      id: 'employees',
      title: t('employees', { ns: 'common' }),
      description: t('commandPaletteDescriptions.employees', { ns: 'navigation' }),
      href: '/hr/employees',
      icon: <Users size={16} />,
      roles: ['ADMIN', 'HR_SPECIALIST'],
      keywords: ['people', 'directory', 'staff'],
    },
    {
      id: 'my-assessments',
      title: t('navLabel', { ns: 'assessments' }),
      description: t('commandPaletteDescriptions.assessments', { ns: 'navigation' }),
      href: '/hr/employees/assessments',
      icon: <FileText size={16} />,
      keywords: ['self review', 'performance', 'draft'],
    },
    {
      id: 'org-chart',
      title: t('orgChart', { ns: 'common' }),
      description: t('commandPaletteDescriptions.orgChart', { ns: 'navigation' }),
      href: '/hr/organization/chart',
      icon: <GitBranch size={16} />,
      roles: ['ADMIN', 'HR_SPECIALIST'],
      keywords: ['hierarchy', 'organization'],
    },
    {
      id: 'locations',
      title: t('locations', { ns: 'common' }),
      description: t('commandPaletteDescriptions.locations', { ns: 'navigation' }),
      href: '/hr/organization/locations',
      icon: <MapPin size={16} />,
      roles: ['ADMIN', 'HR_SPECIALIST'],
      keywords: ['offices', 'sites', 'cities'],
    },
    {
      id: 'countries',
      title: t('countries', { ns: 'common' }),
      description: t('commandPaletteDescriptions.countries', { ns: 'navigation' }),
      href: '/hr/organization/countries',
      icon: <Globe size={16} />,
      roles: ['ADMIN', 'HR_SPECIALIST'],
      keywords: ['regions', 'geography'],
    },
    {
      id: 'notifications',
      title: t('notifications', { ns: 'common' }),
      description: t('commandPaletteDescriptions.notifications', { ns: 'navigation' }),
      href: '/hr/notifications',
      icon: <Bell size={16} />,
      keywords: ['alerts', 'inbox'],
    },
    {
      id: 'settings',
      title: t('settings', { ns: 'common' }),
      description: t('commandPaletteDescriptions.settings', { ns: 'navigation' }),
      href: '/hr/settings',
      icon: <Settings size={16} />,
      keywords: ['preferences', 'profile'],
    },
    {
      id: 'hire',
      title: t('hire.title', { ns: 'actions' }),
      description: t('commandPaletteDescriptions.hire', { ns: 'navigation' }),
      href: '/hr/actions/hire',
      icon: <UserPlus size={16} />,
      roles: ['ADMIN', 'HR_SPECIALIST'],
      keywords: ['new employee', 'workflow'],
    },
    {
      id: 'audit-log',
      title: t('auditLog', { ns: 'common' }),
      description: t('commandPaletteDescriptions.auditLog', { ns: 'navigation' }),
      href: '/hr/admin',
      icon: <Shield size={16} />,
      roles: ['ADMIN', 'HR_SPECIALIST'],
      keywords: ['admin', 'history'],
    },
  ], [t])

  const visibleItems = useMemo(
    () => items.filter(item => !item.roles || item.roles.includes(userRole)),
    [items, userRole],
  )
  const normalizedQuery = normalizeValue(query)

  const searchAction = useMemo<PaletteItem | null>(() => {
    if (!normalizedQuery) {
      return null
    }

    return {
      id: `search-${normalizedQuery}`,
      title: t('commandPaletteSearchAction', { ns: 'navigation', query }),
      description: t('commandPaletteSearchDescription', { ns: 'navigation' }),
      href: buildHrGlobalSearchHref(query),
      icon: <Search size={16} />,
      keywords: [],
    }
  }, [normalizedQuery, query, t])

  const filteredItems = useMemo(() => {
    const matches = visibleItems.filter((item) => {
      if (!normalizedQuery) {
        return true
      }

      const haystack = [
        item.title,
        item.description,
        ...(item.keywords ?? []),
      ].join(' ')

      return normalizeValue(haystack).includes(normalizedQuery)
    })

    return searchAction ? [searchAction, ...matches] : matches
  }, [normalizedQuery, searchAction, visibleItems])

  const resolvedActiveIndex = filteredItems.length === 0
    ? -1
    : Math.min(activeIndex, filteredItems.length - 1)

  useEffect(() => {
    queueMicrotask(() => inputRef.current?.focus())
  }, [])

  function handleSelect(item: PaletteItem) {
    navigate(item.href)
    onClose()
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => {
        if (filteredItems.length === 0) {
          return -1
        }
        return current < filteredItems.length - 1 ? current + 1 : 0
      })
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => {
        if (filteredItems.length === 0) {
          return -1
        }
        return current > 0 ? current - 1 : filteredItems.length - 1
      })
      return
    }

    if (event.key === 'Enter' && resolvedActiveIndex >= 0) {
      event.preventDefault()
      const item = filteredItems[resolvedActiveIndex]
      if (item) {
        handleSelect(item)
      }
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('commandPaletteTitle', { ns: 'navigation' })}
      description={t('commandPaletteDescription', { ns: 'navigation' })}
      size="lg"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--hr-text-subtle)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t('commandPalettePlaceholder', { ns: 'navigation' })}
            className="hr-app-input w-full px-11"
            aria-controls={listboxId}
            aria-activedescendant={resolvedActiveIndex >= 0 ? `${listboxId}-${resolvedActiveIndex}` : undefined}
          />
        </div>

        <div
          id={listboxId}
          role="listbox"
          aria-label={t('commandPaletteTitle', { ns: 'navigation' })}
          className="max-h-[22rem] overflow-y-auto rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] p-2"
        >
          {filteredItems.length === 0 && (
            <div className="rounded-xl px-3 py-6 text-sm text-[color:var(--hr-text-subtle)]">
              {t('commandPaletteEmpty', { ns: 'navigation' })}
            </div>
          )}

          <div className="space-y-1">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                id={`${listboxId}-${index}`}
                type="button"
                role="option"
                aria-selected={index === resolvedActiveIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(item)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                  index === resolvedActiveIndex
                    ? 'border-[color:var(--hr-shell-accent)] bg-white text-[color:var(--hr-shell-accent-strong)] shadow-[var(--shadow-xs)]'
                    : 'border-transparent bg-transparent text-[color:var(--hr-text)] hover:border-[color:var(--hr-border-subtle)] hover:bg-white',
                )}
              >
                <span className="mt-0.5 shrink-0 text-[color:var(--hr-shell-accent)]">{item.icon}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{item.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-[color:var(--hr-text-subtle)]">{item.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

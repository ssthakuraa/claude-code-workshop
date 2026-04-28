import { Bell, ChevronRight, LogOut, Search, Settings, User, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { UserRole } from '@/types/auth'
import { HrCommandPalette } from './HrCommandPalette'

interface HrTopBarProps {
  user: {
    name: string
    avatar?: string
    role: string
  }
  notificationCount?: number
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  onLogout?: () => void
  onMenuClick?: () => void
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

const headerSearchInputStyle = {
  backgroundColor: '#3a3734',
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
} as const

export function HrTopBar({
  user,
  notificationCount = 0,
  onSearch,
  onNotificationClick,
  onLogout,
  onMenuClick,
}: HrTopBarProps) {
  const { t } = useTranslation(['common', 'navigation'])
  const location = useLocation()
  const [searchValue, setSearchValue] = useState(() => new URLSearchParams(location.search).get('search') ?? '')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const userMenuId = useId()
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)
  const settingsMenuItemRef = useRef<HTMLButtonElement>(null)
  const logoutMenuItemRef = useRef<HTMLButtonElement>(null)
  const userMenuRefs = [settingsMenuItemRef, logoutMenuItemRef]

  const roleKey = user.role.startsWith('ROLE_') ? user.role.slice('ROLE_'.length) : user.role
  const normalizedRole = roleKey as UserRole
  const roleLabel: Record<string, string> = {
    ADMIN: t('roles.ADMIN', { ns: 'common' }),
    HR_SPECIALIST: t('roles.HR_SPECIALIST', { ns: 'common' }),
    MANAGER: t('roles.MANAGER', { ns: 'common' }),
    EMPLOYEE: t('roles.EMPLOYEE', { ns: 'common' }),
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    onSearch?.(searchValue)
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
        return
      }

      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) {
        return
      }

      event.preventDefault()
      setCommandPaletteOpen(true)
      setUserMenuOpen(false)
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!userMenuOpen) {
      return
    }

    queueMicrotask(() => settingsMenuItemRef.current?.focus())
  }, [userMenuOpen])

  function closeUserMenu({ restoreFocus = false }: { restoreFocus?: boolean } = {}) {
    setUserMenuOpen(false)
    if (restoreFocus) {
      queueMicrotask(() => userMenuButtonRef.current?.focus())
    }
  }

  function handleUserMenuTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setUserMenuOpen(true)
    }
  }

  function handleUserMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = userMenuRefs.findIndex(ref => ref.current === document.activeElement)

    if (event.key === 'Escape') {
      event.preventDefault()
      closeUserMenu({ restoreFocus: true })
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % userMenuRefs.length : 0
      userMenuRefs[nextIndex]?.current?.focus()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : userMenuRefs.length - 1
      userMenuRefs[nextIndex]?.current?.focus()
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      userMenuRefs[0]?.current?.focus()
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      userMenuRefs[userMenuRefs.length - 1]?.current?.focus()
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#3c3834] bg-[#262421] text-white shadow-[0_3px_10px_rgba(20,18,16,0.06)]">
      <div className="flex h-[3.5rem] items-center gap-3 px-3 lg:px-5">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.12] hover:text-white lg:hidden"
            aria-label={t('navigation:openNavigationMenu')}
          >
            <span>{t('navigation:browseNavigation')}</span>
            <ChevronRight size={14} />
          </button>
        )}

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold tracking-[0.18em] text-white/96">{t('navigation:vertexWordmark')}</div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
            <input
              type="text"
              value={searchValue}
              onChange={event => setSearchValue(event.target.value)}
              placeholder={t('navigation:searchPlaceholder')}
              style={headerSearchInputStyle}
              className="hr-app-input h-10 w-full rounded-xl border border-[#4b4742] bg-[#3a3734] pl-11 pr-4 text-sm text-white placeholder:text-white/50 shadow-none hover:border-[#5a5550] hover:bg-[#3d3a37] focus:border-[#6a645e] focus:bg-[#3f3c39] focus:shadow-[0_0_0_3px_rgba(214,209,202,0.12)]"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-xl border border-[#4b4742] bg-[#34312e] px-3 py-2 text-sm text-white/80 transition-colors hover:border-[#5a5550] hover:bg-[#3a3734] hover:text-white md:inline-flex"
            aria-label={t('navigation:openCommandPalette')}
          >
            <Search size={14} />
            <span>{t('navigation:quickOpen')}</span>
            <span className="rounded border border-white/10 bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
              {t('navigation:commandPaletteShortcut')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileSearchOpen(value => !value)}
            className="rounded-lg border border-transparent p-2 text-white/80 transition-colors hover:border-white/10 hover:bg-white/[0.08] hover:text-white md:hidden"
            aria-label={mobileSearchOpen ? t('navigation:closeSearch') : t('navigation:openSearch')}
            aria-expanded={mobileSearchOpen}
            aria-controls="hr-mobile-search-panel"
          >
            {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          <button
            type="button"
            onClick={() => {
              onNotificationClick?.()
              navigate('/hr/notifications')
            }}
            className="relative rounded-lg border border-transparent p-2 text-white/80 transition-colors hover:border-white/10 hover:bg-white/[0.08] hover:text-white"
            aria-label={t('navigation:openNotifications')}
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-error-500)] px-1 text-[10px] font-semibold text-white">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              ref={userMenuButtonRef}
              type="button"
              onClick={() => setUserMenuOpen(value => !value)}
              onKeyDown={handleUserMenuTriggerKeyDown}
              className="flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/[0.08]"
              aria-label={t('navigation:openUserMenu')}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-controls={userMenuId}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[var(--hr-shell-header)]">
                  {getInitials(user.name) || <User size={14} />}
                </div>
              )}
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => closeUserMenu()} />
                <div
                  id={userMenuId}
                  role="menu"
                  aria-label={t('navigation:openUserMenu')}
                  onKeyDown={handleUserMenuKeyDown}
                  className={cn(
                    'absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--hr-border-subtle)] bg-white shadow-[var(--shadow-lg)]',
                  )}
                >
                  <div className="border-b border-[var(--hr-border-subtle)] bg-[var(--hr-surface-muted)] px-4 py-3">
                    <div className="truncate text-sm font-semibold text-[var(--hr-text)]">{user.name}</div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[var(--hr-text-subtle)]">
                      {roleLabel[roleKey] ?? roleKey}
                    </div>
                  </div>
                  <button
                    ref={settingsMenuItemRef}
                    type="button"
                    onClick={() => {
                      closeUserMenu()
                      navigate('/hr/settings')
                    }}
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[var(--hr-text-muted)] transition-colors hover:bg-[var(--hr-shell-accent-soft)] hover:text-[var(--hr-shell-accent-strong)]"
                  >
                    <Settings size={15} />
                    {t('settings', { ns: 'common' })}
                  </button>
                  <button
                    ref={logoutMenuItemRef}
                    type="button"
                    onClick={() => {
                      closeUserMenu()
                      onLogout?.()
                    }}
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[var(--color-error-600)] transition-colors hover:bg-[var(--color-error-50)]"
                  >
                    <LogOut size={15} />
                    {t('signOut', { ns: 'auth' })}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-full border-b border-[#3c3834] bg-[#262421] px-3 py-3 shadow-[var(--shadow-md)] md:hidden">
          <form id="hr-mobile-search-panel" onSubmit={handleSearch} className="mx-auto max-w-2xl">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
              <input
                type="text"
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                placeholder={t('navigation:searchPlaceholder')}
                style={headerSearchInputStyle}
                className="hr-app-input h-10 w-full rounded-xl border border-[#4b4742] bg-[#3a3734] pl-11 pr-11 text-sm text-white placeholder:text-white/50 hover:border-[#5a5550] hover:bg-[#3d3a37] focus:border-[#6a645e] focus:bg-[#3f3c39] focus:shadow-[0_0_0_3px_rgba(214,209,202,0.12)]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-[#5a5550] bg-[#d6d1ca] px-3 py-1.5 text-xs font-semibold text-[#262421] transition-colors hover:bg-[#e1ddd7]"
              >
                {t('common:ui.search')}
              </button>
            </div>
          </form>
        </div>
      )}

      <HrCommandPalette
        open={commandPaletteOpen}
        userRole={normalizedRole}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </header>
  )
}

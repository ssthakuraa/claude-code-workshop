import {
  ArrowLeftRight,
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  CalendarRange,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe,
  LayoutDashboard,
  MapPin,
  Settings,
  Shield,
  TrendingUp,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { UserRole } from '@/types/auth'
import { getBookmarkedWorkspaceDestinations } from '@/utils/hrWorkspaceChrome'

interface NavItem {
  label: string
  href?: string
  icon?: React.ReactNode
  children?: NavItem[]
  roles?: UserRole[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface HrSidebarProps {
  userRole: UserRole
  variant?: 'desktop' | 'mobile'
  collapsed?: boolean
  open?: boolean
  onClose?: () => void
  onToggleCollapse?: () => void
  onExpandRequest?: () => void
}

function navItemMatchesPath(item: NavItem, pathname: string, userRole: UserRole): boolean {
  if (item.roles && !item.roles.includes(userRole)) {
    return false
  }

  if (item.href) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  if (item.children) {
    return item.children.some(child => navItemMatchesPath(child, pathname, userRole))
  }

  return false
}

function NavGroup({
  item,
  userRole,
  onNavigate,
  collapsed = false,
  onExpandRequest,
  depth = 0,
}: {
  item: NavItem
  userRole: UserRole
  onNavigate?: () => void
  collapsed?: boolean
  onExpandRequest?: () => void
  depth?: number
}) {
  const { t } = useTranslation(['common'])
  const location = useLocation()
  const [expanded, setExpanded] = useState(depth === 0)
  const [showAllChildren, setShowAllChildren] = useState(false)
  const isRoleAllowed = !item.roles || item.roles.includes(userRole)

  const baseCls = cn(
    'group flex w-full items-center gap-3 border-b border-[var(--hr-border-subtle)] text-sm transition-colors',
    depth === 0
      ? 'px-2 py-3 font-medium text-[var(--hr-text-muted)] hover:bg-[var(--hr-shell-accent-soft)] hover:text-[var(--hr-shell-accent-strong)]'
      : 'px-2 py-2.5 text-[13px] text-[var(--hr-text-subtle)] hover:bg-[var(--hr-surface-muted)] hover:text-[var(--hr-text)]',
  )
  const activeCls = 'bg-[var(--hr-shell-accent-soft)] text-[var(--hr-shell-accent-strong)]'
  const visibleChildren = item.children?.filter(child => !child.roles || child.roles.includes(userRole)) ?? []
  const hasActiveChild = visibleChildren.some(child => navItemMatchesPath(child, location.pathname, userRole))
  const isExpanded = expanded || hasActiveChild

  if (!isRoleAllowed) return null

  if (item.href) {
    return (
      <NavLink
        to={item.href}
        end={item.href === '/hr/dashboard'}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) => cn(baseCls, isActive && activeCls)}
      >
        {item.icon && <span className="shrink-0 text-[var(--hr-text-subtle)] group-hover:text-current">{item.icon}</span>}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    )
  }

  if (item.children) {
    if (visibleChildren.length === 0) return null
    const collapsedChildLimit = 3
    const displayedChildren = showAllChildren ? visibleChildren : visibleChildren.slice(0, collapsedChildLimit)
    const shouldShowMore = visibleChildren.length > collapsedChildLimit

    if (collapsed) {
      return (
        <button
          type="button"
          title={item.label}
          onClick={onExpandRequest}
          className={cn(baseCls, 'justify-center')}
        >
          {item.icon && <span className="shrink-0 text-[var(--hr-text-subtle)] group-hover:text-current">{item.icon}</span>}
        </button>
      )
    }

    return (
      <div className="space-y-1">
          <button type="button" onClick={() => setExpanded(value => !value)} className={cn(baseCls, 'justify-between', hasActiveChild && activeCls)}>
            <span className="flex min-w-0 items-center gap-3">
              {item.icon && <span className="shrink-0 text-[var(--hr-text-subtle)] group-hover:text-current">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
          {isExpanded
            ? <ChevronDown size={14} className="shrink-0 text-[var(--hr-text-subtle)]" />
            : <ChevronRight size={14} className="shrink-0 text-[var(--hr-text-subtle)]" />}
        </button>

        {isExpanded && (
          <div className="ml-6 space-y-1 border-l border-[var(--hr-border-subtle)] pl-3">
            {displayedChildren.map((child, index) => (
              <NavGroup key={`${child.label}-${index}`} item={child} userRole={userRole} onNavigate={onNavigate} depth={depth + 1} />
            ))}
            {shouldShowMore && (
              <button
                type="button"
                onClick={() => setShowAllChildren(value => !value)}
                className="ml-3 text-xs font-medium text-[var(--hr-shell-accent)] transition-colors hover:text-[var(--hr-shell-accent-strong)]"
              >
                {showAllChildren
                  ? t('showLess', { ns: 'common' })
                  : `${t('showMore', { ns: 'common' })} (${visibleChildren.length - collapsedChildLimit})`}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return null
}

export function HrSidebar({
  userRole,
  variant = 'mobile',
  collapsed = false,
  open = false,
  onClose,
  onToggleCollapse,
  onExpandRequest,
}: HrSidebarProps) {
  const { t } = useTranslation(['common', 'navigation', 'admin', 'assessments'])
  const isDesktop = variant === 'desktop'
  const localizedSections = useMemo<NavSection[]>(() => [
    {
      title: t('workspace', { ns: 'common' }),
      items: [
        {
          label: t('dashboard', { ns: 'common' }),
          href: '/hr/dashboard',
          icon: <LayoutDashboard size={16} />,
        },
        {
          label: t('navLabel', { ns: 'assessments' }),
          href: '/hr/employees/assessments',
          icon: <ClipboardList size={16} />,
        },
        {
          label: t('employees', { ns: 'common' }),
          icon: <Users size={16} />,
          roles: ['ADMIN', 'HR_SPECIALIST'],
          children: [
            { label: t('employees', { ns: 'common' }), href: '/hr/employees', icon: <Users size={14} /> },
            { label: t('orgChart', { ns: 'common' }), href: '/hr/organization/chart', icon: <BarChart3 size={14} /> },
          ],
        },
        {
          label: t('notifications', { ns: 'common' }),
          href: '/hr/notifications',
          icon: <Bell size={16} />,
        },
      ],
    },
    {
      title: t('workflows', { ns: 'common' }),
      items: [
        {
          label: t('workflows', { ns: 'common' }),
          icon: <ClipboardList size={16} />,
          roles: ['ADMIN', 'HR_SPECIALIST', 'MANAGER'],
          children: [
            { label: t('hire.title', { ns: 'actions' }), href: '/hr/actions/hire', icon: <UserPlus size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
            { label: t('detail.relatedActions.promote.label', { ns: 'employees' }), href: '/hr/actions/promote', icon: <TrendingUp size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
            { label: t('detail.relatedActions.transfer.label', { ns: 'employees' }), href: '/hr/actions/transfer', icon: <ArrowLeftRight size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
            { label: t('detail.relatedActions.terminate.label', { ns: 'employees' }), href: '/hr/actions/terminate', icon: <UserX size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
          ],
        },
        {
          label: t('organization', { ns: 'common' }),
          icon: <Building2 size={16} />,
          roles: ['ADMIN', 'HR_SPECIALIST'],
          children: [
            { label: t('departments', { ns: 'common' }), href: '/hr/organization/departments', icon: <Building2 size={14} /> },
            { label: t('jobs', { ns: 'common' }), href: '/hr/organization/jobs', icon: <FileText size={14} /> },
            { label: t('locations', { ns: 'common' }), href: '/hr/organization/locations', icon: <MapPin size={14} /> },
            { label: t('countries', { ns: 'common' }), href: '/hr/organization/countries', icon: <Globe size={14} /> },
          ],
        },
      ],
    },
    {
      title: t('administration', { ns: 'common' }),
      items: [
        {
          label: t('administration', { ns: 'common' }),
          icon: <Shield size={16} />,
          roles: ['ADMIN', 'HR_SPECIALIST'],
          children: [
            { label: t('assessmentCycles.navLabel', { ns: 'admin' }), href: '/hr/admin/assessment-cycles', icon: <CalendarRange size={14} /> },
            { label: t('auditLog', { ns: 'common' }), href: '/hr/admin', icon: <ClipboardList size={14} /> },
          ],
        },
        {
          label: t('settings', { ns: 'common' }),
          href: '/hr/settings',
          icon: <Settings size={16} />,
        },
      ],
    },
  ], [t])
  const [, setWorkspaceRefresh] = useState(0)
  const visibleSections = useMemo(
    () =>
      localizedSections.map(section => ({
        ...section,
        items: section.items.filter(item => !item.roles || item.roles.includes(userRole)),
      })).filter(section => section.items.length > 0),
    [localizedSections, userRole],
  )
  useEffect(() => {
    function handleWorkspaceRefresh() {
      setWorkspaceRefresh(value => value + 1)
    }

    window.addEventListener('hr-workspace-storage', handleWorkspaceRefresh)
    window.addEventListener('storage', handleWorkspaceRefresh)
    return () => {
      window.removeEventListener('hr-workspace-storage', handleWorkspaceRefresh)
      window.removeEventListener('storage', handleWorkspaceRefresh)
    }
  }, [])

  const bookmarkedDestinations = getBookmarkedWorkspaceDestinations()
  const sidebarContent = (
    <div className="flex h-full flex-col bg-[var(--hr-surface)]">
      <div className={cn('flex h-14 items-center border-b border-[var(--hr-border-subtle)] px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--hr-shell-accent)]">
            {t('navigation:vertexWordmark')}
          </div>
        </div>
        {!isDesktop && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex rounded-md p-2 text-[var(--hr-text-subtle)] transition-colors hover:bg-[var(--hr-shell-accent-soft)] hover:text-[var(--hr-shell-accent-strong)]"
            aria-label={t('closeNavigation', { ns: 'common' })}
          >
            <ArrowLeft size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
        <div className="space-y-5">
          <section>
            <NavLink
              to="/hr/dashboard"
              end
              onClick={onClose}
              title={collapsed ? t('home', { ns: 'common' }) : undefined}
              className={() => cn(
                'group flex w-full items-center border-b border-[var(--hr-border-subtle)] text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-2 py-3',
                'text-[var(--hr-text-muted)] hover:bg-[var(--hr-shell-accent-soft)] hover:text-[var(--hr-shell-accent-strong)]',
              )}
            >
              <LayoutDashboard size={16} className="shrink-0 text-[var(--hr-text-subtle)] group-hover:text-current" />
              {!collapsed && <span className="truncate">{t('home', { ns: 'common' })}</span>}
            </NavLink>
          </section>

          {!collapsed && bookmarkedDestinations.length > 0 && (
            <section>
              <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--hr-text-subtle)]">
                {t('quickAccess', { ns: 'common' })}
              </div>
              <div className="space-y-1">
                {bookmarkedDestinations.map((destination) => (
                  <NavLink
                    key={`bookmark-${destination.id}`}
                    to={destination.href}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      'group flex w-full items-center gap-3 border-b border-[var(--hr-border-subtle)] px-2 py-2.5 text-[13px] transition-colors',
                      isActive
                        ? 'bg-[var(--hr-shell-accent-soft)] text-[var(--hr-shell-accent-strong)]'
                        : 'text-[var(--hr-text-subtle)] hover:bg-[var(--hr-surface-muted)] hover:text-[var(--hr-text)]',
                    )}
                  >
                    <span className="truncate">{destination.label}</span>
                  </NavLink>
                ))}
              </div>
            </section>
          )}
          {visibleSections.map(section => (
            <section key={section.title}>
              {!collapsed && (
                <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--hr-text-subtle)]">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <NavGroup
                    key={`${section.title}-${item.label}-${index}`}
                    item={item}
                    userRole={userRole}
                    onNavigate={onClose}
                    collapsed={collapsed}
                    onExpandRequest={onExpandRequest}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </nav>
    </div>
  )

  if (isDesktop) {
    return (
      <aside className={cn(
        'relative h-full overflow-hidden border-r border-[var(--hr-border-subtle)] bg-[var(--hr-surface)] shadow-[inset_-1px_0_0_rgba(231,228,223,0.85)] transition-[width] duration-200',
        collapsed ? 'w-[76px]' : 'w-[288px]',
      )}>
        {sidebarContent}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="absolute right-0 top-1/2 z-10 inline-flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hr-border-subtle)] bg-white text-[var(--hr-text-subtle)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--hr-shell-accent)] hover:bg-[var(--hr-shell-accent-soft)] hover:text-[var(--hr-shell-accent-strong)]"
            aria-label={collapsed ? t('navigation:expandNavigation') : t('navigation:collapseNavigation')}
            title={collapsed ? t('navigation:expandNavigation') : t('navigation:collapseNavigation')}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </aside>
    )
  }

  if (!open) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 z-50 flex w-[320px] max-w-[92vw] flex-col border-r border-[var(--hr-border-subtle)] bg-[var(--hr-surface)] shadow-[var(--shadow-lg)]">
        {sidebarContent}
      </aside>
    </>
  )
}

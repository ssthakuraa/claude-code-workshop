import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe,
  LayoutDashboard,
  MapPin,
  Settings,
  Shield,
  Users,
  UserPlus,
  TrendingUp,
  ArrowLeftRight,
  UserX,
  Bell,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { UserRole } from '@/types/auth'

interface NavItem {
  label: string
  href?: string
  icon?: React.ReactNode
  children?: NavItem[]
  roles?: UserRole[]
}

const NAV_STRUCTURE: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/hr/dashboard',
    icon: <LayoutDashboard size={16} />,
  },
  {
    label: 'Employees',
    icon: <Users size={16} />,
    children: [
      { label: 'Directory', href: '/hr/employees', icon: <Users size={14} /> },
      { label: 'Org Chart', href: '/hr/organization/chart', icon: <BarChart3 size={14} /> },
    ],
  },
  {
    label: 'Actions',
    icon: <ClipboardList size={16} />,
    roles: ['ADMIN', 'HR_SPECIALIST', 'MANAGER'],
    children: [
      { label: 'Hire Employee', href: '/hr/actions/hire', icon: <UserPlus size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
      { label: 'Promote', href: '/hr/actions/promote', icon: <TrendingUp size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
      { label: 'Transfer', href: '/hr/actions/transfer', icon: <ArrowLeftRight size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
      { label: 'Terminate', href: '/hr/actions/terminate', icon: <UserX size={14} />, roles: ['ADMIN', 'HR_SPECIALIST'] },
    ],
  },
  {
    label: 'Organization',
    icon: <Building2 size={16} />,
    roles: ['ADMIN', 'HR_SPECIALIST'],
    children: [
      { label: 'Departments', href: '/hr/organization/departments', icon: <Building2 size={14} /> },
      { label: 'Jobs', href: '/hr/organization/jobs', icon: <FileText size={14} /> },
      { label: 'Locations', href: '/hr/organization/locations', icon: <MapPin size={14} /> },
      { label: 'Countries', href: '/hr/organization/countries', icon: <Globe size={14} /> },
    ],
  },
  {
    label: 'Notifications',
    href: '/hr/notifications',
    icon: <Bell size={16} />,
  },
  {
    label: 'Admin',
    icon: <Shield size={16} />,
    roles: ['ADMIN', 'HR_SPECIALIST'],
    children: [
      { label: 'Audit Logs', href: '/hr/admin', icon: <ClipboardList size={14} /> },
    ],
  },
  {
    label: 'Settings',
    href: '/hr/settings',
    icon: <Settings size={16} />,
  },
]

interface HrSidebarProps {
  userRole: UserRole
  isCollapsed?: boolean
  onToggle?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function NavGroup({
  item,
  userRole,
  isCollapsed,
  depth = 0,
}: {
  item: NavItem
  userRole: UserRole
  isCollapsed: boolean
  depth?: number
}) {
  const [expanded, setExpanded] = useState(true)

  if (item.roles && !item.roles.includes(userRole)) return null

  const paddingCls = depth === 0 ? 'px-3 py-2' : 'pl-9 pr-3 py-1.5'
  const baseCls = cn(
    'flex items-center gap-2.5 rounded-md text-sm w-full transition-colors cursor-pointer select-none',
    paddingCls,
    depth === 0
      ? 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 font-medium'
      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800',
  )
  const activeCls = 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 !pl-[calc(theme(spacing.9)-4px)]'

  if (item.href) {
    return (
      <NavLink
        to={item.href}
        end={item.href === '/hr/dashboard'}
        className={({ isActive }) =>
          cn(baseCls, isActive && (depth === 0
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 !px-[calc(theme(spacing.3)-4px)]'
            : activeCls
          ))
        }
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    )
  }

  if (item.children) {
    const visibleChildren = item.children.filter(c => !c.roles || c.roles.includes(userRole))
    if (visibleChildren.length === 0) return null

    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className={cn(baseCls, 'justify-between')}
        >
          <span className="flex items-center gap-2.5">
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {!isCollapsed && item.label}
          </span>
          {!isCollapsed && (expanded
            ? <ChevronDown size={13} className="text-neutral-400" />
            : <ChevronRight size={13} className="text-neutral-400" />
          )}
        </button>
        {expanded && !isCollapsed && (
          <div className="mt-0.5 space-y-0.5">
            {visibleChildren.map((child, i) => (
              <NavGroup key={i} item={child} userRole={userRole} isCollapsed={false} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

export function HrSidebar({ userRole, isCollapsed = false, onToggle, mobileOpen = false, onMobileClose }: HrSidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200 flex-shrink-0">
        {!isCollapsed && (
          <span className="text-sm font-semibold text-neutral-800 truncate">HR Platform</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronRight size={16} className={cn('transition-transform', !isCollapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_STRUCTURE.map((item, i) => (
          <NavGroup key={i} item={item} userRole={userRole} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col flex-shrink-0 bg-white border-r border-neutral-200 transition-all duration-200',
          isCollapsed ? 'w-16' : 'w-60',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-white border-r border-neutral-200 md:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}

import { cn } from '@/utils/cn'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export interface NavItem {
  label: string
  href?: string
  icon?: ReactNode
  badge?: string | number
  children?: NavItem[]
}

export interface SidebarProps {
  logo?: ReactNode
  navItems: NavItem[]
  footer?: ReactNode
  className?: string
}

function NavItemRow({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const rowCls = cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors',
    depth > 0 ? 'pl-9 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
  )

  const activeCls = 'bg-primary-50 text-primary-700 hover:bg-primary-50 hover:text-primary-700'

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className={cn(rowCls, 'justify-between')}
        >
          <span className="flex items-center gap-2.5">
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label}
          </span>
          <ChevronDown size={14} className={cn('transition-transform', expanded && 'rotate-180')} />
        </button>
        {expanded && (
          <div className="mt-0.5 space-y-0.5">
            {item.children!.map((child, i) => <NavItemRow key={i} item={child} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }

  if (item.href) {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) => cn(rowCls, isActive && activeCls)}
        end
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        {item.badge !== undefined && (
          <span className="ml-auto bg-primary-100 text-primary-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    )
  }

  return (
    <div className={cn(rowCls, 'cursor-default')}>
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span className="flex-1">{item.label}</span>
    </div>
  )
}

export function Sidebar({ logo, navItems, footer, className }: SidebarProps) {
  return (
    <aside className={cn('flex flex-col h-full w-60 bg-white border-r border-neutral-200', className)}>
      {logo && (
        <div className="px-4 py-4 border-b border-neutral-100 shrink-0">{logo}</div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item, i) => <NavItemRow key={i} item={item} />)}
      </nav>
      {footer && (
        <div className="px-2 py-3 border-t border-neutral-100 shrink-0">{footer}</div>
      )}
    </aside>
  )
}

export interface TopBarProps {
  logo?: ReactNode
  title?: string
  actions?: ReactNode
  onMenuClick?: () => void
  className?: string
}

export function TopBar({ logo, title, actions, onMenuClick, className }: TopBarProps) {
  return (
    <header className={cn('flex items-center h-14 px-4 bg-white border-b border-neutral-200 gap-3 shrink-0', className)}>
      {onMenuClick && (
        <button type="button" onClick={onMenuClick} className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden">
          <Menu size={20} />
        </button>
      )}
      {logo && <div className="shrink-0">{logo}</div>}
      {title && <span className="font-semibold text-neutral-900 text-sm">{title}</span>}
      <div className="flex-1" />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}

export interface AppShellProps {
  sidebar: ReactNode
  topBar?: ReactNode
  children: ReactNode
  className?: string
}

export function AppShell({ sidebar, topBar, children, className }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={cn('flex h-screen overflow-hidden bg-neutral-50', className)}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-neutral-900/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-60">
            {sidebar}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {topBar}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

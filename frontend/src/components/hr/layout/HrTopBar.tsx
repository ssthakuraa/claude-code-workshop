import { Bell, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

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

export function HrTopBar({
  user,
  notificationCount = 0,
  onSearch,
  onNotificationClick,
  onLogout,
  onMenuClick,
}: HrTopBarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchValue)
  }

  const roleLabel: Record<string, string> = {
    ROLE_ADMIN: 'Administrator',
    ROLE_HR_SPECIALIST: 'HR Specialist',
    ROLE_MANAGER: 'Manager',
    ROLE_EMPLOYEE: 'Employee',
    ADMIN: 'Administrator',
    HR_SPECIALIST: 'HR Specialist',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-neutral-200 shadow-sm flex items-center px-4 gap-4">
      {/* Hamburger for mobile */}
      <button
        type="button"
        onClick={onMenuClick}
        className="md:hidden p-1.5 rounded text-neutral-500 hover:bg-neutral-100"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-4 select-none">
        <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">HR</span>
        </div>
        <span className="hidden sm:block text-sm font-semibold text-neutral-800">HR Platform</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-neutral-200 rounded-md bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </form>

      <div className="flex-1" />

      {/* Notifications */}
      <button
        type="button"
        onClick={() => { onNotificationClick?.(); navigate('/hr/notifications') }}
        className="relative p-2 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen(v => !v)}
          className="flex items-center gap-2 p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-neutral-800 leading-tight">{user.name}</div>
            <div className="text-[10px] text-neutral-500 leading-tight">{roleLabel[user.role] ?? user.role}</div>
          </div>
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
            <div className={cn(
              'absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20',
            )}>
              <div className="px-3 py-2 border-b border-neutral-100">
                <div className="text-xs font-medium text-neutral-800">{user.name}</div>
                <div className="text-[11px] text-neutral-500">{roleLabel[user.role] ?? user.role}</div>
              </div>
              <button
                type="button"
                onClick={() => { setUserMenuOpen(false); navigate('/hr/settings') }}
                className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
              >
                <User size={14} />
                Profile & Settings
              </button>
              <button
                type="button"
                onClick={() => { setUserMenuOpen(false); onLogout?.() }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

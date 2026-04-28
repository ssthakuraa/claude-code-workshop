import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { buildHrGlobalSearchHref } from '@/utils/hrGlobalSearch'
import { recordRecentWorkspacePath } from '@/utils/hrWorkspaceChrome'
import { HrTopBar } from './HrTopBar'
import { HrSidebar } from './HrSidebar'

const HR_SIDEBAR_COLLAPSED_STORAGE_KEY = 'hr_shell_sidebar_collapsed'

export function HrPageLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(HR_SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    recordRecentWorkspacePath(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    window.localStorage.setItem(HR_SIDEBAR_COLLAPSED_STORAGE_KEY, String(desktopSidebarCollapsed))
  }, [desktopSidebarCollapsed])

  function handleMenuClick() {
    setMenuOpen(true)
  }

  if (!user) return null

  return (
    <div className="hr-app-shell flex h-screen overflow-hidden">
      <HrTopBar
        key={`${location.pathname}?${location.search}`}
        user={{ name: user.fullName, role: user.role }}
        onSearch={(query) => navigate(buildHrGlobalSearchHref(query))}
        onLogout={logout}
        onMenuClick={handleMenuClick}
      />

      <HrSidebar
        userRole={user.role}
        variant="mobile"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="mt-[54px] flex min-h-0 flex-1">
        <div className="hidden lg:block">
          <HrSidebar
            userRole={user.role}
            variant="desktop"
            collapsed={desktopSidebarCollapsed}
            onToggleCollapse={() => setDesktopSidebarCollapsed(value => !value)}
            onExpandRequest={() => setDesktopSidebarCollapsed(false)}
          />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="min-h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(245,244,241,0.92))] px-4 py-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

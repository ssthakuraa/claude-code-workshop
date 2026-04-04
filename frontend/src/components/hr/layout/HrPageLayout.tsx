import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { HrTopBar } from './HrTopBar'
import { HrSidebar } from './HrSidebar'

export function HrPageLayout() {
  const { user, logout } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) return null

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      <HrSidebar
        userRole={user.role}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <HrTopBar
          user={{ name: user.fullName, role: user.role }}
          onLogout={logout}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-auto mt-14 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types/auth'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/hr/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/hr/unauthorized" replace />
  }

  return <Outlet />
}

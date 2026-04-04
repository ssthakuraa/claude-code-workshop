import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthUser, LoginRequest, LoginResponse } from '@/types/auth'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('hr_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('hr_access_token')
  )

  const login = useCallback(async (credentials: LoginRequest) => {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

    if (USE_MOCK) {
      // Mock auth — accept any credentials, return admin user
      const mockUser: AuthUser = {
        userId: 1,
        employeeId: 100,
        username: credentials.username,
        fullName: 'Steven King',
        role: credentials.username === 'admin' ? 'ADMIN'
            : credentials.username === 'hr' ? 'HR_SPECIALIST'
            : credentials.username === 'manager' ? 'MANAGER'
            : 'EMPLOYEE',
      }
      const mockToken = 'mock-jwt-token'
      localStorage.setItem('hr_access_token', mockToken)
      localStorage.setItem('hr_refresh_token', 'mock-refresh-token')
      localStorage.setItem('hr_user', JSON.stringify(mockUser))
      setToken(mockToken)
      setUser(mockUser)
      return
    }

    const response = await hrApi.post<HrApiResponse<LoginResponse>>('/auth/login', credentials)
    const { token: newToken, refreshToken, user: authUser } = response.data
    localStorage.setItem('hr_access_token', newToken)
    localStorage.setItem('hr_refresh_token', refreshToken)
    localStorage.setItem('hr_user', JSON.stringify(authUser))
    setToken(newToken)
    setUser(authUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('hr_access_token')
    localStorage.removeItem('hr_refresh_token')
    localStorage.removeItem('hr_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

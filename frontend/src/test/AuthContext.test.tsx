import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

function AuthStateProbe() {
  const { isAuthenticated, user } = useAuth()
  return (
    <div>
      <span data-testid="is-authenticated">{String(isAuthenticated)}</span>
      <span data-testid="username">{user?.username ?? 'none'}</span>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('ignores malformed stored user payloads instead of crashing on startup', () => {
    localStorage.setItem('hr_user', '{bad-json')
    localStorage.setItem('hr_access_token', 'stale-token')
    localStorage.setItem('hr_refresh_token', 'stale-refresh-token')

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    )

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('username')).toHaveTextContent('none')
    expect(localStorage.getItem('hr_user')).toBeNull()
    expect(localStorage.getItem('hr_access_token')).toBeNull()
    expect(localStorage.getItem('hr_refresh_token')).toBeNull()
  })
})

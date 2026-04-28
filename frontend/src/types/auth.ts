export type UserRole = 'ADMIN' | 'HR_SPECIALIST' | 'MANAGER' | 'EMPLOYEE'

export interface AuthUser {
  userId: number
  employeeId: number
  username: string
  fullName: string
  role: UserRole
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  user: AuthUser
}

export interface LoginRequest {
  username: string
  password: string
}

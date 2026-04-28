import { describe, expect, it } from 'vitest'
import { canViewEmployeeSalary } from '@/utils/employeePermissions'
import type { AuthUser } from '@/types/auth'
import type { EmployeeDetail } from '@/types/employee'

const employee: EmployeeDetail = {
  employeeId: 200,
  firstName: 'Neena',
  lastName: 'Kochhar',
  fullName: 'Neena Kochhar',
  email: 'neena.kochhar@example.com',
  jobId: 'FI_MGR',
  jobTitle: 'Finance Manager',
  departmentId: 100,
  departmentName: 'Finance',
  managerId: 101,
  employmentStatus: 'ACTIVE',
  employmentType: 'FULL_TIME',
  salary: 17000,
  hireDate: '2024-01-15',
  jobHistory: [],
}

function buildUser(overrides: Partial<AuthUser>): AuthUser {
  return {
    userId: 1,
    employeeId: 999,
    username: 'test.user',
    fullName: 'Test User',
    role: 'EMPLOYEE',
    ...overrides,
  }
}

describe('canViewEmployeeSalary', () => {
  it('allows managers to view a direct report salary', () => {
    expect(canViewEmployeeSalary(buildUser({ role: 'MANAGER', employeeId: 101 }), employee)).toBe(true)
  })

  it('denies unrelated employees', () => {
    expect(canViewEmployeeSalary(buildUser({ role: 'EMPLOYEE', employeeId: 555 }), employee)).toBe(false)
  })
})

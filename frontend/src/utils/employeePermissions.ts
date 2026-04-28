import type { AuthUser } from '@/types/auth'
import type { EmployeeDetail } from '@/types/employee'

export function canViewEmployeeSalary(user: AuthUser | null, employee: EmployeeDetail): boolean {
  if (!user) {
    return false
  }

  return user.role === 'ADMIN'
    || user.role === 'HR_SPECIALIST'
    || user.employeeId === employee.employeeId
    || user.employeeId === employee.managerId
}

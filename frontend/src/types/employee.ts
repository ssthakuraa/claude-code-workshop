export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'PROBATION'
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'

export interface EmployeeSummary {
  employeeId: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  jobId: string
  jobTitle: string
  departmentId: number
  departmentName: string
  employmentStatus: EmploymentStatus
  employmentType: EmploymentType
  salary?: number
  managerId?: number
  managerName?: string
  hireDate: string
}

export interface JobHistoryEntry {
  startDate: string
  endDate: string
  jobId: string
  jobTitle: string
  departmentId: number
  departmentName: string
}

export interface EmployeeDetail extends EmployeeSummary {
  phoneNumber?: string
  commissionPct?: number
  managerId?: number
  locationCity?: string
  contractEndDate?: string
  jobHistory: JobHistoryEntry[]
}

export interface HireRequest {
  firstName?: string
  lastName: string
  email: string
  phoneNumber?: string
  hireDate: string
  jobId: string
  salary?: number
  commissionPct?: number
  managerId?: number
  departmentId?: number
  employmentStatus?: EmploymentStatus
  employmentType?: EmploymentType
  contractEndDate?: string
  username?: string
  initialPassword: string
  idempotencyKey: string
}

export interface TerminateRequest {
  employeeId: number
  reason: string
  effectiveDate?: string
  idempotencyKey: string
}

export interface PromoteRequest {
  employeeId: number
  newJobId: string
  newSalary?: number
  effectiveDate?: string
  idempotencyKey: string
}

export interface TransferRequest {
  employeeId: number
  newDepartmentId: number
  newManagerId?: number
  effectiveDate?: string
  idempotencyKey: string
}

export interface EmployeeFilter {
  search?: string
  departmentId?: number
  status?: EmploymentStatus
  page?: number
  size?: number
  sort?: string
}

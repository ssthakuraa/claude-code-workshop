export interface MockJob {
  jobId: string
  jobTitle: string
  minSalary: number
  maxSalary: number
}

export const mockJobs: MockJob[] = [
  { jobId: 'AD_PRES', jobTitle: 'President', minSalary: 20080, maxSalary: 40000 },
  { jobId: 'AD_VP', jobTitle: 'Administration Vice President', minSalary: 15000, maxSalary: 30000 },
  { jobId: 'AD_ASST', jobTitle: 'Administration Assistant', minSalary: 3000, maxSalary: 6000 },
  { jobId: 'FI_MGR', jobTitle: 'Finance Manager', minSalary: 8200, maxSalary: 16000 },
  { jobId: 'FI_ACCOUNT', jobTitle: 'Accountant', minSalary: 4200, maxSalary: 9000 },
  { jobId: 'AC_MGR', jobTitle: 'Accounting Manager', minSalary: 8200, maxSalary: 16000 },
  { jobId: 'AC_ACCOUNT', jobTitle: 'Public Accountant', minSalary: 4200, maxSalary: 9000 },
  { jobId: 'SA_MAN', jobTitle: 'Sales Manager', minSalary: 10000, maxSalary: 20080 },
  { jobId: 'SA_REP', jobTitle: 'Sales Representative', minSalary: 6000, maxSalary: 12008 },
  { jobId: 'PU_MAN', jobTitle: 'Purchasing Manager', minSalary: 8000, maxSalary: 15000 },
  { jobId: 'PU_CLERK', jobTitle: 'Purchasing Clerk', minSalary: 2500, maxSalary: 5500 },
  { jobId: 'ST_MAN', jobTitle: 'Stock Manager', minSalary: 5500, maxSalary: 8500 },
  { jobId: 'ST_CLERK', jobTitle: 'Stock Clerk', minSalary: 2008, maxSalary: 5000 },
  { jobId: 'SH_CLERK', jobTitle: 'Shipping Clerk', minSalary: 2500, maxSalary: 5500 },
  { jobId: 'IT_PROG', jobTitle: 'Programmer', minSalary: 4000, maxSalary: 10000 },
  { jobId: 'MK_MAN', jobTitle: 'Marketing Manager', minSalary: 9000, maxSalary: 15000 },
  { jobId: 'MK_REP', jobTitle: 'Marketing Representative', minSalary: 4000, maxSalary: 9000 },
  { jobId: 'HR_REP', jobTitle: 'Human Resources Representative', minSalary: 4000, maxSalary: 9000 },
  { jobId: 'PR_REP', jobTitle: 'Public Relations Representative', minSalary: 4500, maxSalary: 10500 },
]

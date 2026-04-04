export interface MockEmployee {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  jobTitle: string
  jobId: string
  department: string
  departmentId: number
  city: string
  country: string
  countryCode: string
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'PROBATION'
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
  hireDate: string
  salary?: number
  managerId?: number
  managerName?: string
}

export const mockEmployees: MockEmployee[] = [
  { id: 100, firstName: 'Steven', lastName: 'King', fullName: 'Steven King', email: 'steven.king@example.com', jobTitle: 'President', jobId: 'AD_PRES', department: 'Administration', departmentId: 90, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1987-06-17', salary: 24000 },
  { id: 101, firstName: 'Neena', lastName: 'Kochhar', fullName: 'Neena Kochhar', email: 'neena.kochhar@example.com', jobTitle: 'Administration Vice President', jobId: 'AD_VP', department: 'Administration', departmentId: 90, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1989-09-21', salary: 17000, managerId: 100, managerName: 'Steven King' },
  { id: 102, firstName: 'Lex', lastName: 'De Haan', fullName: 'Lex De Haan', email: 'lex.dehaan@example.com', jobTitle: 'Administration Vice President', jobId: 'AD_VP', department: 'Administration', departmentId: 90, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1993-01-13', salary: 17000, managerId: 100, managerName: 'Steven King' },
  { id: 103, firstName: 'Alexander', lastName: 'Hunold', fullName: 'Alexander Hunold', email: 'alexander.hunold@example.com', jobTitle: 'Programmer', jobId: 'IT_PROG', department: 'IT', departmentId: 60, city: 'Southlake', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1990-01-03', salary: 9000, managerId: 102, managerName: 'Lex De Haan' },
  { id: 104, firstName: 'Bruce', lastName: 'Ernst', fullName: 'Bruce Ernst', email: 'bruce.ernst@example.com', jobTitle: 'Programmer', jobId: 'IT_PROG', department: 'IT', departmentId: 60, city: 'Southlake', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1991-05-21', salary: 6000, managerId: 103, managerName: 'Alexander Hunold' },
  { id: 107, firstName: 'Diana', lastName: 'Lorentz', fullName: 'Diana Lorentz', email: 'diana.lorentz@example.com', jobTitle: 'Programmer', jobId: 'IT_PROG', department: 'IT', departmentId: 60, city: 'Southlake', country: 'United States', countryCode: 'US', status: 'PROBATION', employmentType: 'FULL_TIME', hireDate: '1999-02-07', salary: 4200, managerId: 103, managerName: 'Alexander Hunold' },
  { id: 108, firstName: 'Nancy', lastName: 'Greenberg', fullName: 'Nancy Greenberg', email: 'nancy.greenberg@example.com', jobTitle: 'Finance Manager', jobId: 'FI_MGR', department: 'Finance', departmentId: 100, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1994-08-17', salary: 12008, managerId: 101, managerName: 'Neena Kochhar' },
  { id: 114, firstName: 'Den', lastName: 'Raphaely', fullName: 'Den Raphaely', email: 'den.raphaely@example.com', jobTitle: 'Purchasing Manager', jobId: 'PU_MAN', department: 'Purchasing', departmentId: 30, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1994-12-07', salary: 11000, managerId: 100, managerName: 'Steven King' },
  { id: 120, firstName: 'Matthew', lastName: 'Weiss', fullName: 'Matthew Weiss', email: 'matthew.weiss@example.com', jobTitle: 'Stock Manager', jobId: 'ST_MAN', department: 'Shipping', departmentId: 50, city: 'South San Francisco', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1996-07-18', salary: 8000, managerId: 100, managerName: 'Steven King' },
  { id: 145, firstName: 'John', lastName: 'Russell', fullName: 'John Russell', email: 'john.russell@example.com', jobTitle: 'Sales Manager', jobId: 'SA_MAN', department: 'Sales', departmentId: 80, city: 'Oxford', country: 'United Kingdom', countryCode: 'UK', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1996-10-01', salary: 14000, managerId: 100, managerName: 'Steven King' },
  { id: 149, firstName: 'Eleni', lastName: 'Zlotkey', fullName: 'Eleni Zlotkey', email: 'eleni.zlotkey@example.com', jobTitle: 'Sales Manager', jobId: 'SA_MAN', department: 'Sales', departmentId: 80, city: 'Oxford', country: 'United Kingdom', countryCode: 'UK', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '2000-01-29', salary: 10500, managerId: 100, managerName: 'Steven King' },
  { id: 174, firstName: 'Ellen', lastName: 'Abel', fullName: 'Ellen Abel', email: 'ellen.abel@example.com', jobTitle: 'Sales Representative', jobId: 'SA_REP', department: 'Sales', departmentId: 80, city: 'Oxford', country: 'United Kingdom', countryCode: 'UK', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1996-05-11', salary: 11000, managerId: 145, managerName: 'John Russell' },
  { id: 176, firstName: 'Jonathon', lastName: 'Taylor', fullName: 'Jonathon Taylor', email: 'jonathon.taylor@example.com', jobTitle: 'Sales Representative', jobId: 'SA_REP', department: 'Sales', departmentId: 80, city: 'Oxford', country: 'United Kingdom', countryCode: 'UK', status: 'ON_LEAVE', employmentType: 'FULL_TIME', hireDate: '1998-03-24', salary: 8600, managerId: 149, managerName: 'Eleni Zlotkey' },
  { id: 200, firstName: 'Jennifer', lastName: 'Whalen', fullName: 'Jennifer Whalen', email: 'jennifer.whalen@example.com', jobTitle: 'Administration Assistant', jobId: 'AD_ASST', department: 'Administration', departmentId: 10, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1987-09-17', salary: 4400, managerId: 101, managerName: 'Neena Kochhar' },
  { id: 201, firstName: 'Michael', lastName: 'Hartstein', fullName: 'Michael Hartstein', email: 'michael.hartstein@example.com', jobTitle: 'Marketing Manager', jobId: 'MK_MAN', department: 'Marketing', departmentId: 20, city: 'Toronto', country: 'Canada', countryCode: 'CA', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1996-02-17', salary: 13000, managerId: 100, managerName: 'Steven King' },
  { id: 202, firstName: 'Pat', lastName: 'Fay', fullName: 'Pat Fay', email: 'pat.fay@example.com', jobTitle: 'Marketing Representative', jobId: 'MK_REP', department: 'Marketing', departmentId: 20, city: 'Toronto', country: 'Canada', countryCode: 'CA', status: 'PROBATION', employmentType: 'CONTRACT', hireDate: '1997-08-17', salary: 6000, managerId: 201, managerName: 'Michael Hartstein' },
  { id: 205, firstName: 'Shelley', lastName: 'Higgins', fullName: 'Shelley Higgins', email: 'shelley.higgins@example.com', jobTitle: 'Accounting Manager', jobId: 'AC_MGR', department: 'Accounting', departmentId: 110, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1994-06-07', salary: 12008, managerId: 101, managerName: 'Neena Kochhar' },
  { id: 206, firstName: 'William', lastName: 'Gietz', fullName: 'William Gietz', email: 'william.gietz@example.com', jobTitle: 'Public Accountant', jobId: 'AC_ACCOUNT', department: 'Accounting', departmentId: 110, city: 'Seattle', country: 'United States', countryCode: 'US', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '1994-06-07', salary: 8300, managerId: 205, managerName: 'Shelley Higgins' },
  { id: 300, firstName: 'Priya', lastName: 'Patel', fullName: 'Priya Patel', email: 'priya.patel@example.com', jobTitle: 'Finance Analyst', jobId: 'FI_ACCOUNT', department: 'Finance', departmentId: 100, city: 'Mumbai', country: 'India', countryCode: 'IN', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '2020-03-15', salary: 7500, managerId: 108, managerName: 'Nancy Greenberg' },
  { id: 301, firstName: 'Rahul', lastName: 'Sharma', fullName: 'Rahul Sharma', email: 'rahul.sharma@example.com', jobTitle: 'Programmer', jobId: 'IT_PROG', department: 'IT', departmentId: 60, city: 'Hyderabad', country: 'India', countryCode: 'IN', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '2019-06-10', salary: 6000, managerId: 103, managerName: 'Alexander Hunold' },
  { id: 302, firstName: 'Aisha', lastName: 'Khan', fullName: 'Aisha Khan', email: 'aisha.khan@example.com', jobTitle: 'Sales Representative', jobId: 'SA_REP', department: 'Sales', departmentId: 80, city: 'Mexico City', country: 'Mexico', countryCode: 'MX', status: 'ACTIVE', employmentType: 'CONTRACT', hireDate: '2021-01-20', salary: 5500, managerId: 145, managerName: 'John Russell' },
  { id: 303, firstName: 'Carlos', lastName: 'Gomez', fullName: 'Carlos Gomez', email: 'carlos.gomez@example.com', jobTitle: 'Stock Clerk', jobId: 'ST_CLERK', department: 'Shipping', departmentId: 50, city: 'Mexico City', country: 'Mexico', countryCode: 'MX', status: 'ACTIVE', employmentType: 'FULL_TIME', hireDate: '2018-07-05', salary: 3500, managerId: 120, managerName: 'Matthew Weiss' },
  { id: 304, firstName: 'Yuki', lastName: 'Tanaka', fullName: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', jobTitle: 'Programmer', jobId: 'IT_PROG', department: 'IT', departmentId: 60, city: 'Hyderabad', country: 'India', countryCode: 'IN', status: 'PROBATION', employmentType: 'INTERN', hireDate: '2024-01-15', salary: 3000, managerId: 103, managerName: 'Alexander Hunold' },
]

export const mockDepartments = [
  ...new Set(mockEmployees.map(e => e.department))
].sort().map((d, i) => ({ id: i + 1, name: d }))

export const mockCountries = [
  ...new Set(mockEmployees.map(e => e.country))
].sort().map((c, i) => ({ id: i + 1, name: c }))

export const mockKpis = {
  totalHeadcount: 212,
  newHiresThisMonth: 6,
  newHiresLastMonth: 4,
  attritionRate: '6.5%',
  openProbations: 19,
  contractsExpiring30d: 4,
}

export const mockHeadcountByCountry = [
  { name: 'United States', value: 124, color: '#1F6BCC' },
  { name: 'India', value: 58, color: '#0E9E6E' },
  { name: 'Mexico', value: 30, color: '#F5A623' },
]

export const mockHeadcountByDepartment = [
  { name: 'IT', value: 38 },
  { name: 'Sales', value: 34 },
  { name: 'Finance', value: 28 },
  { name: 'HR', value: 22 },
  { name: 'Marketing', value: 18 },
  { name: 'Executive', value: 12 },
  { name: 'Legal', value: 10 },
  { name: 'Shipping', value: 8 },
  { name: 'Purchasing', value: 8 },
  { name: 'Accounting', value: 7 },
  { name: 'Operations', value: 7 },
  { name: 'Administration', value: 6 },
  { name: 'Payroll', value: 6 },
  { name: 'Contracting', value: 6 },
  { name: 'Benefits', value: 3 },
  { name: 'Construction', value: 3 },
  { name: 'Recruitment', value: 3 },
  { name: 'Manufacturing', value: 3 },
  { name: 'NOC', value: 3 },
  { name: 'IT Helpdesk', value: 3 },
  { name: 'Government Sales', value: 3 },
]

export const mockAttritionTrend = [
  { month: 'Apr', terminated: 1 },
  { month: 'May', terminated: 0 },
  { month: 'Jun', terminated: 2 },
  { month: 'Jul', terminated: 1 },
  { month: 'Aug', terminated: 3 },
  { month: 'Sep', terminated: 0 },
  { month: 'Oct', terminated: 2 },
  { month: 'Nov', terminated: 1 },
  { month: 'Dec', terminated: 2 },
  { month: 'Jan', terminated: 1 },
  { month: 'Feb', terminated: 0 },
  { month: 'Mar', terminated: 2 },
]

export const mockRecentActivity = [
  { id: 1, type: 'HIRE' as const, text: 'Alex Johnson hired as Software Developer', time: '2 hours ago', user: 'hr_specialist' },
  { id: 2, type: 'PROMOTE' as const, text: 'Maria Garcia promoted to Senior Analyst', time: '5 hours ago', user: 'admin' },
  { id: 3, type: 'TRANSFER' as const, text: 'David Kim transferred to IT department', time: '1 day ago', user: 'hr_specialist' },
  { id: 4, type: 'TERMINATE' as const, text: 'Contract employee offboarded', time: '2 days ago', user: 'admin' },
  { id: 5, type: 'HIRE' as const, text: 'Priya Patel hired as Finance Analyst', time: '3 days ago', user: 'hr_specialist' },
]

export const mockManagerDashboard = {
  teamHeadcount: 8,
  openRoles: 1,
  probations: 2,
  contractsExpiring: 1,
}

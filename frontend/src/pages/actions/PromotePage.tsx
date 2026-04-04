import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { HrSalaryRangeInput } from '@/components/hr/HrSalaryRangeInput'
import { useEmployee, usePromoteEmployee } from '@/api/employees'
import { useJobs } from '@/api/jobs'

export function PromotePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newJobId, setNewJobId] = useState('')
  const [newSalary, setNewSalary] = useState<number | undefined>()
  const [effectiveDate, setEffectiveDate] = useState('')

  const employeeId = Number(id)
  const { data: employee, isLoading } = useEmployee(employeeId)
  const { data: jobs } = useJobs()
  const promote = usePromoteEmployee()

  const selectedJob = (jobs ?? []).find(j => j.jobId === newJobId)

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">Loading…</div>
  if (!employee) return <div className="p-8 text-sm text-neutral-500">Employee not found.</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await promote.mutateAsync({
        employeeId,
        newJobId,
        newSalary,
        effectiveDate: effectiveDate || undefined,
        idempotencyKey: uuidv4(),
      })
      toast.success(`${employee.fullName} promoted to ${selectedJob?.jobTitle ?? newJobId}!`)
      navigate(`/hr/employees/${employeeId}`)
    } catch {
      toast.error('Promotion failed. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/hr/employees" className="hover:text-neutral-800">Employees</Link>
        <ChevronRight size={12} />
        <Link to={`/hr/employees/${employeeId}`} className="hover:text-neutral-800">{employee.fullName}</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-medium">Promote</span>
      </nav>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Promote Employee</h1>
        <p className="text-sm text-neutral-500 mb-5">Current: <strong>{employee.jobTitle}</strong> · {employee.departmentName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Job Title <span className="text-red-500">*</span></label>
            <select value={newJobId} onChange={e => setNewJobId(e.target.value)} required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select new job...</option>
              {(jobs ?? []).filter(j => j.jobId !== employee.jobId).map(j => (
                <option key={j.jobId} value={j.jobId}>{j.jobTitle}</option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <HrSalaryRangeInput
              label="New Salary"
              value={newSalary}
              onChange={setNewSalary}
              min={Number(selectedJob.minSalary)}
              max={Number(selectedJob.maxSalary)}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Effective Date <span className="text-red-500">*</span></label>
            <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" disabled={promote.isPending || !newJobId || !effectiveDate}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              {promote.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Confirm Promotion
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

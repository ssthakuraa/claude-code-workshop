import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { HrConfirmDialog } from '@/components/hr/HrConfirmDialog'
import { HrStatusBadge } from '@/components/hr/HrStatusBadge'
import { useEmployee, useTerminateEmployee } from '@/api/employees'

export function TerminatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const employeeId = Number(id)
  const { data: employee, isLoading } = useEmployee(employeeId)
  const terminate = useTerminateEmployee()

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">Loading…</div>
  if (!employee) return <div className="p-8 text-sm text-neutral-500">Employee not found.</div>

  const handleTerminate = async () => {
    try {
      await terminate.mutateAsync({
        employeeId,
        reason,
        effectiveDate: effectiveDate || undefined,
        idempotencyKey: uuidv4(),
      })
      toast.success(`${employee.fullName} has been terminated.`)
      navigate(`/hr/employees/${employeeId}`)
    } catch {
      toast.error('Termination failed. Please try again.')
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/hr/employees" className="hover:text-neutral-800">Employees</Link>
        <ChevronRight size={12} />
        <Link to={`/hr/employees/${employeeId}`} className="hover:text-neutral-800">{employee.fullName}</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-medium">Terminate</span>
      </nav>

      <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Terminate Employee</h1>
          <p className="text-sm text-neutral-500 mt-0.5">This action will soft-delete the employee record and deactivate their account.</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-neutral-800">{employee.fullName}</div>
            <div className="text-xs text-neutral-500">{employee.jobTitle} · {employee.departmentName}</div>
          </div>
          <div className="ml-auto"><HrStatusBadge status={employee.employmentStatus} size="sm" /></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Effective Date <span className="text-red-500">*</span></label>
            <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Reason / Notes</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="Voluntary resignation, contract end, performance..."
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">
            Cancel
          </button>
          <button onClick={() => setConfirmOpen(true)} disabled={!effectiveDate}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
            Terminate Employee
          </button>
        </div>
      </div>

      <HrConfirmDialog
        open={confirmOpen}
        title="Confirm Termination"
        description={`Are you sure you want to terminate ${employee.fullName}? This will deactivate their account and mark them as terminated.`}
        confirmLabel="Yes, Terminate"
        variant="danger"
        loading={terminate.isPending}
        onConfirm={handleTerminate}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

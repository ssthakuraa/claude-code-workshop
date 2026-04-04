import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { useEmployee, useEmployees, useTransferEmployee } from '@/api/employees'
import { useDepartments } from '@/api/departments'

export function TransferPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newDeptId, setNewDeptId] = useState('')
  const [newManagerId, setNewManagerId] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')

  const employeeId = Number(id)
  const { data: employee, isLoading } = useEmployee(employeeId)
  const { data: pagedEmployees } = useEmployees()
  const { data: departments } = useDepartments()
  const transfer = useTransferEmployee()

  const activeEmployees = (pagedEmployees?.data ?? []).filter(e => e.employmentStatus === 'ACTIVE' && e.employeeId !== employeeId)

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">Loading…</div>
  if (!employee) return <div className="p-8 text-sm text-neutral-500">Employee not found.</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dept = (departments ?? []).find(d => String(d.departmentId) === newDeptId)
      await transfer.mutateAsync({
        employeeId,
        newDepartmentId: Number(newDeptId),
        newManagerId: newManagerId ? Number(newManagerId) : undefined,
        effectiveDate: effectiveDate || undefined,
        idempotencyKey: uuidv4(),
      })
      toast.success(`${employee.fullName} transferred to ${dept?.departmentName ?? 'new department'}!`)
      navigate(`/hr/employees/${employeeId}`)
    } catch {
      toast.error('Transfer failed. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/hr/employees" className="hover:text-neutral-800">Employees</Link>
        <ChevronRight size={12} />
        <Link to={`/hr/employees/${employeeId}`} className="hover:text-neutral-800">{employee.fullName}</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-medium">Transfer</span>
      </nav>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Transfer Employee</h1>
        <p className="text-sm text-neutral-500 mb-5">Current: <strong>{employee.departmentName}</strong></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Department <span className="text-red-500">*</span></label>
            <select value={newDeptId} onChange={e => setNewDeptId(e.target.value)} required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select department...</option>
              {(departments ?? []).map(d => (
                <option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Manager</label>
            <select value={newManagerId} onChange={e => setNewManagerId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">No change</option>
              {activeEmployees.map(e => (
                <option key={e.employeeId} value={String(e.employeeId)}>{e.fullName} ({e.jobTitle})</option>
              ))}
            </select>
          </div>
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
            <button type="submit" disabled={transfer.isPending || !newDeptId || !effectiveDate}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {transfer.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

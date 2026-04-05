import { useJobs } from '@/api/jobs'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

export function JobsPage() {
  const { data: jobs, isLoading, isError } = useJobs()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-neutral-900">Jobs</h1>
      {isError && <p className="text-sm text-red-500">Failed to load jobs.</p>}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Job ID</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Job Title</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600">Min Salary</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600">Max Salary</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="px-4 py-3"><HrSkeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><HrSkeleton className="h-4 w-40" /></td>
                  <td className="px-4 py-3"><HrSkeleton className="h-4 w-20 ml-auto" /></td>
                  <td className="px-4 py-3"><HrSkeleton className="h-4 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : (jobs ?? []).map(job => (
              <tr key={job.jobId} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 font-mono text-xs text-neutral-600">{job.jobId}</td>
                <td className="px-4 py-3 text-neutral-800">{job.jobTitle}</td>
                <td className="px-4 py-3 text-right text-neutral-600">${Number(job.minSalary).toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-neutral-600">${Number(job.maxSalary).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

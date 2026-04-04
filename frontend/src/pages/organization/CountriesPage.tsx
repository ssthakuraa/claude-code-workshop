import { Globe } from 'lucide-react'
import { mockCountries, mockEmployees } from '@/data/mockEmployees'

const countries = mockCountries.map(c => ({
  ...c,
  headcount: mockEmployees.filter(e => e.country === c.name && e.status !== 'TERMINATED').length,
})).sort((a, b) => b.headcount - a.headcount)

export function CountriesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Countries</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{countries.length} countries with employees</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map(c => (
          <div key={c.id} className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Globe size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">{c.name}</p>
              <p className="text-xs text-neutral-500">{c.headcount} {c.headcount === 1 ? 'employee' : 'employees'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

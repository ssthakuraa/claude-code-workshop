import { MapPin } from 'lucide-react'
import { mockEmployees } from '@/data/mockEmployees'

const locations = [
  ...new Map(
    mockEmployees
      .filter(e => e.status !== 'TERMINATED')
      .map(e => [e.city, { city: e.city, country: e.country }])
  ).values(),
].sort((a, b) => a.city.localeCompare(b.city)).map((l, i) => ({
  id: i + 1,
  ...l,
  headcount: mockEmployees.filter(e => e.city === l.city && e.status !== 'TERMINATED').length,
}))

export function LocationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Locations</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{locations.length} office locations</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500">City</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500">Country</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-neutral-500">Employees</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {locations.map(loc => (
              <tr key={loc.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-800">
                  <span className="flex items-center gap-2">
                    <MapPin size={13} className="text-neutral-400" />
                    {loc.city}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{loc.country}</td>
                <td className="px-4 py-3 text-right text-neutral-600">{loc.headcount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

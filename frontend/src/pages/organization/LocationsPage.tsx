import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

export interface HrLocation {
  locationId: number
  streetAddress: string
  postalCode: string
  city: string
  stateProvince: string
  countryId: string
  countryName: string
}

export function LocationsPage() {
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<HrLocation[]> => {
      const resp = await hrApi.get<HrApiResponse<HrLocation[]>>('/locations')
      return resp.data
    },
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Locations</h1>
        {locations ? (
          <p className="text-sm text-neutral-500 mt-0.5">{locations.length} office locations</p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <HrSkeleton />
          <HrSkeleton />
          <HrSkeleton />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500">City</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {locations?.map(loc => (
                <tr key={loc.locationId} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    <span className="flex items-center gap-2">
                      <MapPin size={13} className="text-neutral-400" />
                      {loc.city}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{loc.countryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

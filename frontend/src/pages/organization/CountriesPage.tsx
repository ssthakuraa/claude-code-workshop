import { useQuery } from '@tanstack/react-query'
import { Globe } from 'lucide-react'
import { hrApi } from '@/services/HrApiClient'
import type { HrApiResponse } from '@/types/api'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

export interface HrCountry {
  countryId: string
  countryName: string
  regionId: number
  regionName: string
}

export function CountriesPage() {
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<HrCountry[]> => {
      const resp = await hrApi.get<HrApiResponse<HrCountry[]>>('/countries')
      return resp.data
    },
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Countries</h1>
        {countries ? (
          <p className="text-sm text-neutral-500 mt-0.5">{countries.length} countries</p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
              <HrSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {countries?.map(c => (
            <div key={c.countryId} className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Globe size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">{c.countryName}</p>
                <p className="text-xs text-neutral-500">{c.regionName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

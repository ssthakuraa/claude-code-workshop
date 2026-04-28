import { useMemo } from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useCountries } from '@/api/countries'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { PageHeader } from '@/components/ui/PageHeader'

function parseMultiParam(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function CountriesPage() {
  const { t } = useTranslation(['common'])
  const { data: countries, isLoading, isError } = useCountries()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const selectedRegions = parseMultiParam(searchParams.get('regionId'))

  function updateSearch(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) {
      next.set('search', value)
    } else {
      next.delete('search')
    }
    setSearchParams(next, { replace: true })
  }

  function updateMultiFilterParam(key: string, values: string[]) {
    const next = new URLSearchParams(searchParams)
    if (values.length > 0) {
      next.set(key, values.join(','))
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  const sortedCountries = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    const filtered = (countries ?? []).filter((country) => {
      const haystack = [country.countryName, country.regionName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return (!normalized || haystack.includes(normalized))
        && (selectedRegions.length === 0 || selectedRegions.includes(String(country.regionId)))
    })

    return filtered.sort((a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0))
  }, [countries, search, selectedRegions])

  const interactiveFilters = (() => {
    const regionOptions = Array.from(new Map(
      (countries ?? [])
        .filter(country => country.regionId !== undefined && country.regionName)
        .map(country => [String(country.regionId), {
          value: String(country.regionId),
          label: country.regionName!,
        }]),
    ).values())

    return [
      {
        key: 'regionId',
        label: t('organizationPages.countries.filterLabel', { ns: 'common' }),
        mode: 'multi' as const,
        values: selectedRegions,
        options: regionOptions,
        onChange: (values: string[]) => updateMultiFilterParam('regionId', values),
      },
    ]
  })()

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('countries', { ns: 'common' })}
        subtitle={t('organizationPages.countries.subtitle', { ns: 'common' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('countries', { ns: 'common' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        searchBar={(
          <div className="space-y-1.5">
            <div className="relative max-w-md">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={event => updateSearch(event.target.value)}
                placeholder={t('organizationPages.countries.searchPlaceholder', { ns: 'common' })}
                className="hr-app-input w-full pl-10 pr-3"
              />
            </div>
            <HrInteractiveFilterBar
              filters={interactiveFilters}
              onClearAll={selectedRegions.length > 0 ? () => updateMultiFilterParam('regionId', []) : undefined}
            />
          </div>
        )}
      />

      {isError && <p className="text-sm text-red-500">{t('organizationPages.countries.loadError', { ns: 'common' })}</p>}
      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-2.5 pt-2">
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-neutral-200 p-3.5">
                <HrSkeleton className="mb-2 h-4 w-32" />
                <HrSkeleton className="h-3 w-20" />
              </div>
            ))}
            {!isLoading && sortedCountries.map(c => (
              <div key={c.countryId} className="bg-white rounded-lg border border-neutral-200 p-3.5 flex items-center gap-3 shadow-[var(--shadow-xs)]">
                <div className="rounded-lg bg-[color:var(--hr-shell-accent-soft)] p-2">
                  <Globe size={18} className="text-[color:var(--hr-shell-accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{c.countryName}</p>
                  <p className="text-xs text-neutral-500">{t('organizationPages.countries.employeeCount', { ns: 'common', count: c.employeeCount ?? 0 })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

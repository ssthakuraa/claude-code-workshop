import { useMemo, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useLocations } from '@/api/locations'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { EnhancedDataTable, type EnhancedColumn } from '@/components/ui/EnhancedDataTable'
import type { SortDirection } from '@/components/ui/DataTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { useLocalSavedViews } from '@/hooks/useLocalSavedViews'

function downloadCsv(filename: string, header: string[], rows: Array<Array<string | number>>) {
  const csv = [
    header.join(','),
    ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function parseMultiParam(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function LocationsPage() {
  const { t } = useTranslation(['common'])
  const LIST_RESULT_LIMIT = 100
  const { data: locations, isLoading, isError } = useLocations()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortKey, setSortKey] = useState('city')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const search = searchParams.get('search') ?? ''
  const selectedCountries = parseMultiParam(searchParams.get('countryId'))
  const selectedStates = parseMultiParam(searchParams.get('stateProvince'))
  const { savedViews, saveView, deleteView } = useLocalSavedViews('locations-page')

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

  const filteredLocations = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    const rows = (locations ?? []).filter(location => {
      if (!normalized) {
        return true
      }

      const haystack = [
        location.city,
        location.stateProvince,
        location.countryName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
      .filter(location => selectedCountries.length === 0 || selectedCountries.includes(location.countryId))
      .filter(location => selectedStates.length === 0 || (location.stateProvince && selectedStates.includes(location.stateProvince)))

    rows.sort((left, right) => {
      const direction = sortDirection === 'asc' ? 1 : -1

      switch (sortKey) {
        case 'countryName':
          return left.countryName.localeCompare(right.countryName) * direction
        case 'employeeCount':
          return ((left.employeeCount ?? 0) - (right.employeeCount ?? 0)) * direction
        case 'city':
        default:
          return left.city.localeCompare(right.city) * direction
      }
    })

    return rows
  }, [locations, search, selectedCountries, selectedStates, sortDirection, sortKey])

  const visibleLocations = filteredLocations.slice(0, LIST_RESULT_LIMIT)

  function applySavedView(filters: Record<string, unknown>) {
    const next = new URLSearchParams()
    if (filters.search) {
      next.set('search', String(filters.search))
    }
    if (filters.countryId) {
      next.set('countryId', String(filters.countryId))
    }
    if (filters.stateProvince) {
      next.set('stateProvince', String(filters.stateProvince))
    }
    setSearchParams(next, { replace: true })
  }

  const interactiveFilters = (() => {
    const countryOptions = Array.from(new Map(
      (locations ?? []).map(location => [location.countryId, {
        value: location.countryId,
        label: location.countryName,
      }]),
    ).values())
    const stateOptions = Array.from(new Map(
      (locations ?? [])
        .filter(location => location.stateProvince)
        .map(location => [location.stateProvince!, {
          value: location.stateProvince!,
          label: location.stateProvince!,
        }]),
    ).values())

    return [
      {
        key: 'countryId',
        label: t('organizationPages.locations.filterLabel', { ns: 'common' }),
        mode: 'multi' as const,
        values: selectedCountries,
        searchable: true,
        emptyLabel: t('organizationPages.locations.filterSearchPlaceholder', { ns: 'common' }),
        options: countryOptions,
        onChange: (values: string[]) => updateMultiFilterParam('countryId', values),
      },
      {
        key: 'stateProvince',
        label: t('organizationPages.locations.stateFilterLabel', { ns: 'common' }),
        mode: 'multi' as const,
        values: selectedStates,
        searchable: true,
        emptyLabel: t('organizationPages.locations.stateFilterSearchPlaceholder', { ns: 'common' }),
        options: stateOptions,
        onChange: (values: string[]) => updateMultiFilterParam('stateProvince', values),
      },
    ]
  })()

  const columns = useMemo<EnhancedColumn<(typeof filteredLocations)[number]>[]>(() => [
    {
      key: 'city',
      header: t('organizationPages.locations.tableHeaders.city', { ns: 'common' }),
      sortable: true,
      accessor: location => (
        <span className="flex items-center gap-2 font-medium text-neutral-800">
          <MapPin size={14} className="text-neutral-400" />
          {location.city}{location.stateProvince ? `, ${location.stateProvince}` : ''}
        </span>
      ),
    },
    {
      key: 'countryName',
      header: t('organizationPages.locations.tableHeaders.country', { ns: 'common' }),
      sortable: true,
      accessor: location => <span className="text-neutral-700">{location.countryName}</span>,
    },
    {
      key: 'employeeCount',
      header: t('organizationPages.locations.tableHeaders.employees', { ns: 'common' }),
      sortable: true,
      align: 'right',
      accessor: location => <span className="text-neutral-700">{location.employeeCount ?? 0}</span>,
    },
  ], [t])

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('locations', { ns: 'common' })}
        subtitle={t('organizationPages.locations.subtitle', { ns: 'common' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('locations', { ns: 'common' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        searchBar={(
          <div className="space-y-1.5">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={event => {
                  updateSearch(event.target.value)
                }}
                placeholder={t('organizationPages.locations.searchPlaceholder', { ns: 'common' })}
                className="hr-app-input w-full pl-10 pr-3"
              />
            </div>
            <HrInteractiveFilterBar
              filters={interactiveFilters}
              onClearAll={selectedCountries.length > 0 || selectedStates.length > 0
                ? () => {
                    updateMultiFilterParam('countryId', [])
                    updateMultiFilterParam('stateProvince', [])
                  }
                : undefined}
            />
          </div>
        )}
      />

      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-2.5 pt-2">
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {t('organizationPages.locations.loadError', { ns: 'common' })}
          </div>
        ) : (
          <EnhancedDataTable
            columns={columns}
            data={visibleLocations}
            rowKey={location => location.locationId}
            loading={isLoading}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={(nextSortKey, nextSortDirection) => {
              setSortKey(nextSortKey)
              setSortDirection(nextSortDirection)
            }}
            stickyHeader
            fillHeight
            density="compact"
            compactToolbar
            paginationMode="summary"
            summaryContent={(
              <>
                <span>
                  {filteredLocations.length > LIST_RESULT_LIMIT
                    ? t('organizationPages.locations.summaryOverflow', { ns: 'common', limit: LIST_RESULT_LIMIT, count: filteredLocations.length })
                    : t('organizationPages.locations.summaryDefault', { ns: 'common', count: visibleLocations.length })}
                </span>
                <span>{filteredLocations.length > LIST_RESULT_LIMIT
                  ? t('organizationPages.locations.summaryHintOverflow', { ns: 'common' })
                  : t('organizationPages.locations.summaryHintDefault', { ns: 'common' })}
                </span>
              </>
            )}
            emptyTitle={t('organizationPages.locations.emptyTitle', { ns: 'common' })}
            emptyDescription={t('organizationPages.locations.emptyDescription', { ns: 'common' })}
            emptyIcon={<MapPin size={18} />}
            currentFilters={{
              search,
              countryId: selectedCountries.join(','),
              stateProvince: selectedStates.join(','),
            }}
            savedSearches={savedViews}
            onApplySavedSearch={applySavedView}
            onSaveSearch={saveView}
            onDeleteSearch={deleteView}
            exportFilename="locations-footprint"
            onExport={() => downloadCsv(
              'locations-footprint.csv',
              [
                t('organizationPages.locations.tableHeaders.locationId', { ns: 'common' }),
                t('organizationPages.locations.tableHeaders.city', { ns: 'common' }),
                t('organizationPages.locations.tableHeaders.stateProvince', { ns: 'common' }),
                t('organizationPages.locations.tableHeaders.country', { ns: 'common' }),
                t('organizationPages.locations.tableHeaders.employees', { ns: 'common' }),
              ],
              filteredLocations.map((location) => [
                location.locationId,
                location.city,
                location.stateProvince ?? '',
                location.countryName,
                location.employeeCount ?? 0,
              ]),
            )}
          />
        )}
      </div>
    </div>
  )
}

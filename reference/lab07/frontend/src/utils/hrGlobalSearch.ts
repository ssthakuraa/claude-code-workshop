type SearchRoute =
  | '/hr/employees'
  | '/hr/organization/departments'
  | '/hr/organization/jobs'
  | '/hr/organization/locations'
  | '/hr/organization/countries'

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, ' ')
}

function resolveExplicitRoute(query: string): { route: SearchRoute; search: string } | null {
  const candidates: Array<{ pattern: RegExp; route: SearchRoute }> = [
    { pattern: /^(employees?|people|staff|workforce)\b[:\s-]*(.*)$/i, route: '/hr/employees' },
    { pattern: /^(departments?|dept|teams?)\b[:\s-]*(.*)$/i, route: '/hr/organization/departments' },
    { pattern: /^(jobs?|roles?)\b[:\s-]*(.*)$/i, route: '/hr/organization/jobs' },
    { pattern: /^(locations?|offices?|cities?)\b[:\s-]*(.*)$/i, route: '/hr/organization/locations' },
    { pattern: /^(countries?|country|regions?)\b[:\s-]*(.*)$/i, route: '/hr/organization/countries' },
  ]

  for (const candidate of candidates) {
    const match = query.match(candidate.pattern)
    if (match) {
      return {
        route: candidate.route,
        search: normalizeQuery(match[2] ?? ''),
      }
    }
  }

  return null
}

export function buildHrGlobalSearchHref(rawQuery: string) {
  const normalizedQuery = normalizeQuery(rawQuery)
  const explicit = normalizedQuery ? resolveExplicitRoute(normalizedQuery) : null
  const route = explicit?.route ?? '/hr/employees'
  const searchValue = explicit?.search ?? normalizedQuery
  const params = new URLSearchParams()

  if (searchValue) {
    params.set('search', searchValue)
  }

  const queryString = params.toString()
  return queryString ? `${route}?${queryString}` : route
}

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  Lock,
  LockOpen,
  Plus,
  Save,
  Search,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useAssessmentCycles,
  useCreateAssessmentCycle,
  useUpdateAssessmentCycle,
  type AssessmentCycle,
  type AssessmentCyclePayload,
  type AssessmentCyclePeriodType,
  type AssessmentCycleStatus,
} from '@/api/assessmentCycles'
import { HrInteractiveFilterBar } from '@/components/hr/HrInteractiveFilterBar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { translateApiError } from '@/i18n/errorMessages'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/utils/cn'

type SupportedLocale = 'es-MX' | 'fr-FR' | 'hi-IN'

const SUPPORTED_LOCALES: SupportedLocale[] = ['es-MX', 'fr-FR', 'hi-IN']

function createEmptyCycle(): AssessmentCycle {
  return {
    cycleCode: '',
    defaultLabel: '',
    localizedLabel: '',
    periodType: 'HALF',
    startDate: '',
    endDate: '',
    cycleStatus: 'PLANNED',
    displayOrder: 40,
    active: true,
    translations: {
      'es-MX': '',
      'fr-FR': '',
      'hi-IN': '',
    },
  }
}

function getCycleStatusVariant(status: AssessmentCycleStatus): BadgeVariant {
  switch (status) {
    case 'OPEN':
      return 'success'
    case 'CLOSED':
      return 'neutral'
    default:
      return 'warning'
  }
}

function getLocalizedLabel(cycle: AssessmentCycle, language: string | undefined) {
  if (language && language in cycle.translations) {
    return cycle.translations[language as SupportedLocale] || cycle.defaultLabel
  }
  return cycle.localizedLabel || cycle.defaultLabel
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-sm font-medium text-[color:var(--hr-text-muted)]">{children}</label>
}

export function AssessmentCycleSetupPage() {
  const { t, i18n } = useTranslation(['admin', 'common'])
  const { data: cycles = [], isLoading, isError, error } = useAssessmentCycles()
  const createCycle = useCreateAssessmentCycle()
  const updateCycle = useUpdateAssessmentCycle()
  const [selectedCode, setSelectedCode] = useState('')
  const [draft, setDraft] = useState<AssessmentCycle>(createEmptyCycle())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  const selectedCycle = useMemo(
    () => cycles.find((cycle) => cycle.cycleCode === selectedCode) ?? null,
    [cycles, selectedCode],
  )

  useEffect(() => {
    if (!isCreatingNew && selectedCycle) {
      setDraft(selectedCycle)
    }
  }, [isCreatingNew, selectedCycle])

  useEffect(() => {
    if (isCreatingNew) {
      return
    }
    if (selectedCode && cycles.some((cycle) => cycle.cycleCode === selectedCode)) {
      return
    }
    if (cycles.length > 0) {
      setSelectedCode(cycles[0].cycleCode)
    }
  }, [cycles, isCreatingNew, selectedCode])

  const activeCycles = useMemo(() => cycles.filter((cycle) => cycle.active).length, [cycles])
  const openCycle = useMemo(() => cycles.find((cycle) => cycle.cycleStatus === 'OPEN') ?? null, [cycles])
  const filteredCycles = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    return cycles.filter((cycle) => {
      if (statusFilter.length > 0 && !statusFilter.includes(cycle.cycleStatus)) {
        return false
      }

      if (!normalized) {
        return true
      }

      const haystack = [
        cycle.cycleCode,
        cycle.defaultLabel,
        getLocalizedLabel(cycle, i18n.resolvedLanguage),
      ].join(' ').toLowerCase()

      return haystack.includes(normalized)
    })
  }, [cycles, i18n.resolvedLanguage, search, statusFilter])
  const translationCoverage = useMemo(() => {
    const translated = cycles.reduce((count, cycle) => {
      const hasAllLocales = SUPPORTED_LOCALES.every((locale) => cycle.translations[locale]?.trim())
      return count + (hasAllLocales ? 1 : 0)
    }, 0)
    return `${translated}/${cycles.length}`
  }, [cycles])
  const getPeriodLabel = (periodType: AssessmentCyclePeriodType) => t(`assessmentCycles.periodTypes.${periodType}`, { ns: 'admin' })

  const updateDraft = <K extends keyof AssessmentCycle>(key: K, value: AssessmentCycle[K]) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const updateTranslation = (locale: SupportedLocale, value: string) => {
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: value,
      },
    }))
  }

  const handleSave = async () => {
    const payload: AssessmentCyclePayload = {
      ...draft,
      cycleCode: draft.cycleCode.trim().toUpperCase(),
      defaultLabel: draft.defaultLabel.trim(),
      active: draft.active,
    }
    try {
      if (!isCreatingNew && selectedCycle) {
        const updated = await updateCycle.mutateAsync({ cycleCode: selectedCycle.cycleCode, data: payload })
        setDraft(updated)
        setSelectedCode(updated.cycleCode)
        toast.success(t('assessmentCycles.toasts.updateSuccess', { ns: 'admin', code: updated.cycleCode }))
      } else {
        const created = await createCycle.mutateAsync(payload)
        setIsCreatingNew(false)
        setDraft(created)
        setSelectedCode(created.cycleCode)
        toast.success(t('assessmentCycles.toasts.createSuccess', { ns: 'admin', code: created.cycleCode }))
      }
    } catch (saveError) {
      toast.error(translateApiError(saveError as { message?: string; errorCode?: string }, i18n.resolvedLanguage ?? 'en-US').message)
    }
  }

  const handleCreateNew = () => {
    const nextOrder = Math.max(...cycles.map((cycle) => cycle.displayOrder), 30) + 10
    const nextDraft = { ...createEmptyCycle(), displayOrder: nextOrder }
    setIsCreatingNew(true)
    setSelectedCode('')
    setDraft(nextDraft)
  }

  const toggleActive = () => {
    updateDraft('active', !draft.active)
  }

  const rosterFilters = [
    {
      key: 'status',
      label: t('assessmentCycles.filters.status', { ns: 'admin' }),
      mode: 'single' as const,
      values: statusFilter,
      options: (['PLANNED', 'OPEN', 'CLOSED'] as AssessmentCycleStatus[]).map((status) => ({
        value: status,
        label: t(`assessmentCycles.statuses.${status}`, { ns: 'admin' }),
      })),
      onChange: (values: string[]) => setStatusFilter(values),
    },
  ]
  const savePending = createCycle.isPending || updateCycle.isPending

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        title={t('assessmentCycles.title', { ns: 'admin' })}
        subtitle={t('assessmentCycles.subtitle', { ns: 'admin' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('administration', { ns: 'common' }), href: '/hr/admin' },
          { label: t('assessmentCycles.title', { ns: 'admin' }) },
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('assessmentCycles.filters.searchPlaceholder', { ns: 'admin' })}
                className="hr-app-input w-full pl-10 pr-3"
              />
            </div>
            <HrInteractiveFilterBar
              filters={rosterFilters}
              onClearAll={search || statusFilter.length > 0 ? () => {
                setSearch('')
                setStatusFilter([])
              } : undefined}
            />
          </div>
        )}
        actions={(
          <>
            <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={handleCreateNew}>
              {t('assessmentCycles.actions.newCycle', { ns: 'admin' })}
            </Button>
            <Button size="sm" icon={<Save size={16} />} onClick={() => void handleSave()} loading={savePending} disabled={!draft.cycleCode || !draft.defaultLabel || !draft.startDate || !draft.endDate}>
              {t('assessmentCycles.actions.saveChanges', { ns: 'admin' })}
            </Button>
          </>
        )}
      />

      <div className="hr-app-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] p-3">
        <div className="space-y-4">
          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {translateApiError(error as { message?: string; errorCode?: string }, i18n.resolvedLanguage ?? 'en-US').message}
            </div>
          )}
          <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.95fr)]">
            <Card variant="elevated" className="flex min-h-[32rem] flex-col overflow-hidden">
              <CardHeader className="items-start">
                <div className="space-y-1">
                  <CardTitle>{t('assessmentCycles.list.title', { ns: 'admin' })}</CardTitle>
                  <p className="text-sm text-[color:var(--hr-text-muted)]">
                    {t('assessmentCycles.list.subtitle', { ns: 'admin' })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">
                    {t('assessmentCycles.list.filteredCount', { ns: 'admin', count: filteredCycles.length, total: cycles.length })}
                  </Badge>
                  <Badge variant="neutral">
                    {t('assessmentCycles.list.activeCount', { ns: 'admin', count: activeCycles })}
                  </Badge>
                  {openCycle && (
                    <Badge variant="success">
                      {t('assessmentCycles.list.openCycle', { ns: 'admin', value: openCycle.cycleCode })}
                    </Badge>
                  )}
                  <Badge variant="primary">
                    {t('assessmentCycles.list.translationCoverage', { ns: 'admin', value: translationCoverage })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="min-h-0 flex-1 overflow-auto pr-1">
                {isLoading && (
                  <div className="px-4 py-8 text-sm text-[color:var(--hr-text-subtle)]">
                    {t('loading', { ns: 'common' })}
                  </div>
                )}
                <div className="min-w-[58rem]">
                  <div className="grid grid-cols-[1.1fr_1.8fr_0.9fr_0.9fr_1.4fr_0.8fr_0.9fr] gap-3 border-b border-[color:var(--hr-border-subtle)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">
                    <span>{t('assessmentCycles.list.columns.cycleCode', { ns: 'admin' })}</span>
                    <span>{t('assessmentCycles.list.columns.label', { ns: 'admin' })}</span>
                    <span>{t('assessmentCycles.list.columns.status', { ns: 'admin' })}</span>
                    <span>{t('assessmentCycles.list.columns.periodType', { ns: 'admin' })}</span>
                    <span>{t('assessmentCycles.list.columns.dateRange', { ns: 'admin' })}</span>
                    <span>{t('assessmentCycles.list.columns.active', { ns: 'admin' })}</span>
                    <span className="text-right">{t('assessmentCycles.list.columns.displayOrder', { ns: 'admin' })}</span>
                  </div>
                </div>
                {!isLoading && filteredCycles.length === 0 && (
                  <div className="mt-3 rounded-[1rem] border border-dashed border-[color:var(--hr-border-strong)] bg-[color:var(--hr-surface-muted)] px-4 py-6 text-sm text-[color:var(--hr-text-subtle)]">
                    {t('assessmentCycles.list.emptyState', { ns: 'admin' })}
                  </div>
                )}
                <div className="min-w-[58rem]">
                  {filteredCycles.map((cycle) => {
                  const isSelected = cycle.cycleCode === selectedCode
                  return (
                    <button
                      key={cycle.cycleCode}
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false)
                        setSelectedCode(cycle.cycleCode)
                      }}
                      className={cn(
                        'grid w-full grid-cols-[1.1fr_1.8fr_0.9fr_0.9fr_1.4fr_0.8fr_0.9fr] gap-3 border-b border-[color:var(--hr-border-subtle)] px-4 py-3 text-left transition-all duration-150',
                        isSelected
                          ? 'bg-[color:var(--hr-shell-accent-soft)]'
                          : 'bg-white hover:bg-[color:var(--hr-surface-muted)]',
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[color:var(--hr-text)]">{cycle.cycleCode}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[color:var(--hr-text)]">{cycle.defaultLabel}</p>
                        <p className="truncate text-xs text-[color:var(--hr-text-subtle)]">
                          {getLocalizedLabel(cycle, i18n.resolvedLanguage)}
                        </p>
                      </div>
                      <div>
                        <Badge variant={getCycleStatusVariant(cycle.cycleStatus)} dot>{t(`assessmentCycles.statuses.${cycle.cycleStatus}`, { ns: 'admin' })}</Badge>
                      </div>
                      <div className="text-sm text-[color:var(--hr-text)]">{getPeriodLabel(cycle.periodType)}</div>
                      <div className="text-sm text-[color:var(--hr-text-muted)]">{cycle.startDate} to {cycle.endDate}</div>
                      <div>
                        <Badge variant={cycle.active ? 'success' : 'neutral'}>
                          {cycle.active
                            ? t('assessmentCycles.states.active', { ns: 'admin' })
                            : t('assessmentCycles.states.inactive', { ns: 'admin' })}
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-[color:var(--hr-text-muted)]">{cycle.displayOrder}</div>
                    </button>
                  )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="min-h-0 space-y-4 overflow-auto pr-1">
              <Card variant="elevated">
                <CardHeader className="items-start">
                  <div className="space-y-1">
                    <CardTitle>{t('assessmentCycles.form.title', { ns: 'admin' })}</CardTitle>
                    <p className="text-sm text-[color:var(--hr-text-muted)]">
                      {t('assessmentCycles.form.subtitle', { ns: 'admin' })}
                    </p>
                    {draft.cycleCode && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant={getCycleStatusVariant(draft.cycleStatus)} dot>{t(`assessmentCycles.statuses.${draft.cycleStatus}`, { ns: 'admin' })}</Badge>
                        <Badge variant={draft.active ? 'success' : 'neutral'}>
                          {draft.active
                            ? t('assessmentCycles.states.active', { ns: 'admin' })
                            : t('assessmentCycles.states.inactive', { ns: 'admin' })}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" icon={draft.active ? <LockOpen size={14} /> : <Lock size={14} />} onClick={toggleActive}>
                    {draft.active
                      ? t('assessmentCycles.actions.deactivate', { ns: 'admin' })
                      : t('assessmentCycles.actions.activate', { ns: 'admin' })}
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <FieldLabel>{t('assessmentCycles.form.cycleCode', { ns: 'admin' })}</FieldLabel>
                    <input
                      value={draft.cycleCode}
                      onChange={(event) => updateDraft('cycleCode', event.target.value)}
                      disabled={!isCreatingNew && !!selectedCycle}
                      className="hr-app-input w-full px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>{t('assessmentCycles.form.displayOrder', { ns: 'admin' })}</FieldLabel>
                    <input
                      type="number"
                      value={draft.displayOrder}
                      onChange={(event) => updateDraft('displayOrder', Number(event.target.value) || 0)}
                      className="hr-app-input w-full px-3"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <FieldLabel>{t('assessmentCycles.form.defaultLabel', { ns: 'admin' })}</FieldLabel>
                    <input
                      value={draft.defaultLabel}
                      onChange={(event) => updateDraft('defaultLabel', event.target.value)}
                      className="hr-app-input w-full px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>{t('assessmentCycles.form.periodType', { ns: 'admin' })}</FieldLabel>
                    <select
                      value={draft.periodType}
                      onChange={(event) => updateDraft('periodType', event.target.value as AssessmentCyclePeriodType)}
                      className="hr-app-select w-full px-3 text-sm"
                    >
                      {(['ANNUAL', 'HALF', 'QUARTER'] as AssessmentCyclePeriodType[]).map((periodType) => (
                        <option key={periodType} value={periodType}>{getPeriodLabel(periodType)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>{t('assessmentCycles.form.status', { ns: 'admin' })}</FieldLabel>
                    <select
                      value={draft.cycleStatus}
                      onChange={(event) => updateDraft('cycleStatus', event.target.value as AssessmentCycleStatus)}
                      className="hr-app-select w-full px-3 text-sm"
                    >
                      {(['PLANNED', 'OPEN', 'CLOSED'] as AssessmentCycleStatus[]).map((status) => (
                        <option key={status} value={status}>{t(`assessmentCycles.statuses.${status}`, { ns: 'admin' })}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>{t('assessmentCycles.form.startDate', { ns: 'admin' })}</FieldLabel>
                    <input
                      type="date"
                      value={draft.startDate}
                      onChange={(event) => updateDraft('startDate', event.target.value)}
                      className="hr-app-input w-full px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>{t('assessmentCycles.form.endDate', { ns: 'admin' })}</FieldLabel>
                    <input
                      type="date"
                      value={draft.endDate}
                      onChange={(event) => updateDraft('endDate', event.target.value)}
                      className="hr-app-input w-full px-3"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader className="items-start">
                  <div className="space-y-1">
                    <CardTitle>{t('assessmentCycles.translations.title', { ns: 'admin' })}</CardTitle>
                    <p className="text-sm text-[color:var(--hr-text-muted)]">
                      {t('assessmentCycles.translations.subtitle', { ns: 'admin' })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {SUPPORTED_LOCALES.map((locale) => (
                    <div key={locale} className="rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-white px-4 py-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[color:var(--hr-text)]">{locale}</p>
                        </div>
                        <Badge variant={draft.translations[locale] ? 'success' : 'warning'}>
                          {draft.translations[locale]
                            ? t('assessmentCycles.translations.complete', { ns: 'admin' })
                            : t('assessmentCycles.translations.missing', { ns: 'admin' })}
                        </Badge>
                      </div>
                      <input
                        value={draft.translations[locale]}
                        onChange={(event) => updateTranslation(locale, event.target.value)}
                        className="hr-app-input w-full px-3"
                        placeholder={t('assessmentCycles.translations.placeholder', { ns: 'admin', locale })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card variant="outlined" className="bg-[linear-gradient(180deg,rgba(245,247,249,0.9),rgba(255,255,255,0.95))]">
                <CardHeader className="mb-2 items-start">
                  <div className="space-y-1">
                    <CardTitle>{t('assessmentCycles.guidance.title', { ns: 'admin' })}</CardTitle>
                    <p className="text-sm text-[color:var(--hr-text-muted)]">
                      {t('assessmentCycles.guidance.subtitle', { ns: 'admin' })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[0.95rem] border border-[color:var(--hr-border-subtle)] bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">
                      {t('assessmentCycles.guidance.ruleOneTitle', { ns: 'admin' })}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--hr-text)]">
                      {t('assessmentCycles.guidance.ruleOneText', { ns: 'admin' })}
                    </p>
                  </div>
                  <div className="rounded-[0.95rem] border border-[color:var(--hr-border-subtle)] bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">
                      {t('assessmentCycles.guidance.ruleTwoTitle', { ns: 'admin' })}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--hr-text)]">
                      {t('assessmentCycles.guidance.ruleTwoText', { ns: 'admin' })}
                    </p>
                  </div>
                  <div className="rounded-[0.95rem] border border-[color:var(--hr-border-subtle)] bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">
                      {t('assessmentCycles.guidance.ruleThreeTitle', { ns: 'admin' })}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--hr-text)]">
                      {t('assessmentCycles.guidance.ruleThreeText', { ns: 'admin' })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

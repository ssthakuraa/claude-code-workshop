import { ArrowLeft, Save, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  useAvailableAssessmentCycles,
  useCreateAssessmentDraft,
  useMyAssessment,
  useSubmitAssessmentDraft,
  useUpdateAssessmentDraft,
  type AssessmentStatus,
  type EmployeeAssessmentPayload,
} from '@/api/employeeAssessments'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader, PageHeaderMetaItem } from '@/components/ui/PageHeader'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { translateApiError } from '@/i18n/errorMessages'
import { formatDate } from '@/utils/formatters'

interface AssessmentDraftState {
  cycleCode: string
  goalCompletionPct: string
  competencyScore: string
  employeeReflection: string
  nextCyclePlan: string
}

function createEmptyDraft(): AssessmentDraftState {
  return {
    cycleCode: '',
    goalCompletionPct: '',
    competencyScore: '',
    employeeReflection: '',
    nextCyclePlan: '',
  }
}

function getStatusVariant(status: AssessmentStatus): BadgeVariant {
  switch (status) {
    case 'FINAL':
      return 'success'
    case 'SUBMITTED':
      return 'warning'
    default:
      return 'neutral'
  }
}

function mapDetailToDraft(detail: {
  cycleCode: string
  goalCompletionPct?: number | null
  competencyScore?: number | null
  employeeReflection?: string | null
  nextCyclePlan?: string | null
}): AssessmentDraftState {
  return {
    cycleCode: detail.cycleCode,
    goalCompletionPct: detail.goalCompletionPct == null ? '' : String(detail.goalCompletionPct),
    competencyScore: detail.competencyScore == null ? '' : String(detail.competencyScore),
    employeeReflection: detail.employeeReflection ?? '',
    nextCyclePlan: detail.nextCyclePlan ?? '',
  }
}

function toPayload(draft: AssessmentDraftState): EmployeeAssessmentPayload {
  const parseNumber = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return null
    }
    return Number(trimmed)
  }

  return {
    cycleCode: draft.cycleCode,
    goalCompletionPct: parseNumber(draft.goalCompletionPct),
    competencyScore: parseNumber(draft.competencyScore),
    employeeReflection: draft.employeeReflection,
    nextCyclePlan: draft.nextCyclePlan,
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }
  return <p className="mt-1 text-xs text-[color:var(--color-error-600)]">{message}</p>
}

export function AssessmentEntryPage() {
  const { t, i18n } = useTranslation(['assessments', 'common'])
  const navigate = useNavigate()
  const { assessmentId } = useParams<{ assessmentId?: string }>()
  const numericAssessmentId = assessmentId ? Number(assessmentId) : undefined
  const isCreateMode = !assessmentId
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
  const timeZone = preferences.timezone

  const { data: availableCycles = [], isLoading: cyclesLoading } = useAvailableAssessmentCycles()
  const { data: assessment, isLoading: detailLoading, isError: detailError } = useMyAssessment(numericAssessmentId)
  const createDraft = useCreateAssessmentDraft()
  const updateDraft = useUpdateAssessmentDraft()
  const submitDraft = useSubmitAssessmentDraft()

  const [draft, setDraft] = useState<AssessmentDraftState>(createEmptyDraft())
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (assessment) {
      setDraft(mapDetailToDraft(assessment))
      setFieldErrors({})
      return
    }

    if (isCreateMode && availableCycles.length > 0) {
      setDraft((current) => (
        current.cycleCode
          ? current
          : { ...current, cycleCode: availableCycles[0].cycleCode }
      ))
    }
  }, [assessment, availableCycles, isCreateMode])

  const selectedCycle = useMemo(() => {
    if (assessment) {
      return {
        cycleCode: assessment.cycleCode,
        cycleLabel: assessment.cycleLabel,
        periodType: assessment.periodType,
        startDate: assessment.cycleStartDate,
        endDate: assessment.cycleEndDate,
      }
    }
    return availableCycles.find((cycle) => cycle.cycleCode === draft.cycleCode) ?? null
  }, [assessment, availableCycles, draft.cycleCode])

  const editable = isCreateMode || assessment?.reviewStatus === 'DRAFT'
  const mutationPending = createDraft.isPending || updateDraft.isPending || submitDraft.isPending

  const updateField = <K extends keyof AssessmentDraftState>(field: K, value: AssessmentDraftState[K]) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleApiError = (error: unknown) => {
    const translated = translateApiError(error as { message?: string; errorCode?: string; fieldErrors?: Record<string, string> }, i18n.resolvedLanguage ?? 'en-US')
    setFieldErrors(translated.fieldErrors)
    toast.error(translated.message)
  }

  const handleSave = async () => {
    setFieldErrors({})
    const payload = toPayload(draft)
    try {
      if (isCreateMode) {
        const created = await createDraft.mutateAsync(payload)
        toast.success(t('toasts.saveSuccess', { ns: 'assessments' }))
        navigate(`/hr/employees/assessments/${created.assessmentId}`, { replace: true })
      } else if (numericAssessmentId) {
        await updateDraft.mutateAsync({ assessmentId: numericAssessmentId, payload })
        toast.success(t('toasts.saveSuccess', { ns: 'assessments' }))
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleSubmit = async () => {
    setFieldErrors({})
    const payload = toPayload(draft)
    try {
      if (isCreateMode) {
        const created = await createDraft.mutateAsync(payload)
        const submitted = await submitDraft.mutateAsync({ assessmentId: created.assessmentId, payload })
        toast.success(t('toasts.submitSuccess', { ns: 'assessments' }))
        navigate(`/hr/employees/assessments/${submitted.assessmentId}`, { replace: true })
      } else if (numericAssessmentId) {
        await submitDraft.mutateAsync({ assessmentId: numericAssessmentId, payload })
        toast.success(t('toasts.submitSuccess', { ns: 'assessments' }))
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  if (isCreateMode && !cyclesLoading && availableCycles.length === 0) {
    return (
      <div className="hr-list-page-shell">
        <PageHeader
          eyebrow={t('entry.eyebrow', { ns: 'assessments' })}
          title={t('entry.newTitle', { ns: 'assessments' })}
          subtitle={t('entry.newSubtitle', { ns: 'assessments' })}
          breadcrumbs={[
            { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
            { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
            { label: t('title', { ns: 'assessments' }), href: '/hr/employees/assessments' },
            { label: t('entry.newTitle', { ns: 'assessments' }) },
          ]}
          surface="plain"
          className="mb-3 gap-2"
          actions={(
            <Link to="/hr/employees/assessments">
              <Button variant="secondary" icon={<ArrowLeft size={16} />}>
                {t('actions.backToList', { ns: 'assessments' })}
              </Button>
            </Link>
          )}
        />
        <div className="min-h-0 flex-1 overflow-auto">
          <Card variant="elevated">
            <CardContent>
              <p className="text-sm font-semibold text-[color:var(--hr-text)]">{t('entry.noCycleTitle', { ns: 'assessments' })}</p>
              <p className="mt-1 text-sm text-[color:var(--hr-text-muted)]">{t('entry.noCycleBody', { ns: 'assessments' })}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isCreateMode && detailLoading) {
    return <div className="p-8 text-sm text-neutral-500">{t('loading', { ns: 'common' })}</div>
  }

  if (!isCreateMode && (detailError || !assessment)) {
    return <div className="p-8 text-sm text-neutral-500">{t('states.detailNotFound', { ns: 'assessments' })}</div>
  }

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        eyebrow={t('entry.eyebrow', { ns: 'assessments' })}
        title={isCreateMode ? t('entry.newTitle', { ns: 'assessments' }) : t('entry.editTitle', { ns: 'assessments' })}
        subtitle={isCreateMode ? t('entry.newSubtitle', { ns: 'assessments' }) : t('entry.editSubtitle', { ns: 'assessments' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
          { label: t('title', { ns: 'assessments' }), href: '/hr/employees/assessments' },
          { label: isCreateMode ? t('entry.newTitle', { ns: 'assessments' }) : (assessment?.cycleLabel ?? t('entry.editTitle', { ns: 'assessments' })) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        meta={(
          <>
            {selectedCycle && (
              <PageHeaderMetaItem
                label={t('entry.meta.window', { ns: 'assessments' })}
                value={t('availableCycles.window', {
                  ns: 'assessments',
                  start: formatDate(selectedCycle.startDate, locale, 'medium', timeZone),
                  end: formatDate(selectedCycle.endDate, locale, 'medium', timeZone),
                })}
              />
            )}
            {!isCreateMode && assessment && (
              <PageHeaderMetaItem
                label={t('entry.meta.status', { ns: 'assessments' })}
                value={t(`statuses.${assessment.reviewStatus}`, { ns: 'assessments' })}
              />
            )}
          </>
        )}
        badges={!isCreateMode && assessment ? (
          <Badge variant={getStatusVariant(assessment.reviewStatus)}>
            {t(`statuses.${assessment.reviewStatus}`, { ns: 'assessments' })}
          </Badge>
        ) : undefined}
        actions={(
          <>
            <Link to="/hr/employees/assessments">
              <Button variant="secondary" icon={<ArrowLeft size={16} />}>
                {t('actions.backToList', { ns: 'assessments' })}
              </Button>
            </Link>
            {editable && (
              <>
                <Button variant="secondary" onClick={handleSave} loading={mutationPending} icon={<Save size={16} />}>
                  {t('actions.saveDraft', { ns: 'assessments' })}
                </Button>
                <Button onClick={handleSubmit} loading={mutationPending} icon={<Send size={16} />}>
                  {t('actions.submitAssessment', { ns: 'assessments' })}
                </Button>
              </>
            )}
          </>
        )}
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="space-y-3">
          {!editable && (
            <Card variant="elevated">
              <CardContent>
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('entry.readOnlyBanner', { ns: 'assessments' })}</p>
              </CardContent>
            </Card>
          )}

          <Card variant="elevated">
            <CardHeader className="items-start">
              <div>
                <CardTitle>{t('entry.sections.overview', { ns: 'assessments' })}</CardTitle>
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('entry.sections.overviewBody', { ns: 'assessments' })}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="hr-field-label">{t('fields.cycle', { ns: 'assessments' })}</label>
                  {isCreateMode ? (
                    <select
                      value={draft.cycleCode}
                      onChange={(event) => updateField('cycleCode', event.target.value)}
                      className="hr-app-select w-full px-3 text-sm"
                      disabled={!editable}
                    >
                      {availableCycles.map((cycle) => (
                        <option key={cycle.cycleCode} value={cycle.cycleCode}>
                          {cycle.cycleLabel}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="rounded-xl border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] px-3 py-2.5 text-sm text-[color:var(--hr-text)]">
                      {assessment?.cycleLabel}
                    </div>
                  )}
                  <FieldError message={fieldErrors.cycleCode} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="hr-field-label">{t('fields.goalCompletionPct', { ns: 'assessments' })}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={draft.goalCompletionPct}
                      onChange={(event) => updateField('goalCompletionPct', event.target.value)}
                      className="hr-app-input w-full px-3"
                      disabled={!editable}
                    />
                    <FieldError message={fieldErrors.goalCompletionPct} />
                  </div>

                  <div>
                    <label className="hr-field-label">{t('fields.competencyScore', { ns: 'assessments' })}</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.01"
                      value={draft.competencyScore}
                      onChange={(event) => updateField('competencyScore', event.target.value)}
                      className="hr-app-input w-full px-3"
                      disabled={!editable}
                    />
                    <FieldError message={fieldErrors.competencyScore} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="items-start">
              <div>
                <CardTitle>{t('entry.sections.reflection', { ns: 'assessments' })}</CardTitle>
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('entry.sections.reflectionBody', { ns: 'assessments' })}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label className="hr-field-label">{t('fields.employeeReflection', { ns: 'assessments' })}</label>
                  <textarea
                    rows={5}
                    value={draft.employeeReflection}
                    onChange={(event) => updateField('employeeReflection', event.target.value)}
                    className="hr-app-textarea w-full px-3"
                    disabled={!editable}
                  />
                  <FieldError message={fieldErrors.employeeReflection} />
                </div>
                <div>
                  <label className="hr-field-label">{t('fields.nextCyclePlan', { ns: 'assessments' })}</label>
                  <textarea
                    rows={5}
                    value={draft.nextCyclePlan}
                    onChange={(event) => updateField('nextCyclePlan', event.target.value)}
                    className="hr-app-textarea w-full px-3"
                    disabled={!editable}
                  />
                  <FieldError message={fieldErrors.nextCyclePlan} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="items-start">
              <div>
                <CardTitle>{t('entry.sections.reviewer', { ns: 'assessments' })}</CardTitle>
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('entry.sections.reviewerBody', { ns: 'assessments' })}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">{t('fields.reviewer', { ns: 'assessments' })}</p>
                  <p className="mt-2 text-sm font-semibold text-[color:var(--hr-text)]">{assessment?.reviewerName ?? t('states.reviewerPending', { ns: 'assessments' })}</p>
                  <p className="mt-1 text-sm text-[color:var(--hr-text-muted)]">{assessment?.reviewerJobTitle ?? t('states.reviewerPendingBody', { ns: 'assessments' })}</p>
                </div>
                <div className="rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--hr-text-subtle)]">{t('fields.managerFeedback', { ns: 'assessments' })}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[color:var(--hr-text-muted)]">
                    {assessment?.managerFeedback ?? t('entry.managerFeedbackPending', { ns: 'assessments' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

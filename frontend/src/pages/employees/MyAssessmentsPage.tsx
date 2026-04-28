import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAvailableAssessmentCycles, useMyAssessments, type AssessmentStatus } from '@/api/employeeAssessments'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { formatDate, formatDateTime } from '@/utils/formatters'

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

export function MyAssessmentsPage() {
  const { t } = useTranslation(['assessments', 'common'])
  const { data: assessments = [], isLoading, isError } = useMyAssessments()
  const { data: availableCycles = [] } = useAvailableAssessmentCycles()
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
  const timeZone = preferences.timezone

  return (
    <div className="hr-list-page-shell">
      <PageHeader
        eyebrow={t('eyebrow', { ns: 'assessments' })}
        title={t('title', { ns: 'assessments' })}
        subtitle={t('subtitle', { ns: 'assessments' })}
        breadcrumbs={[
          { label: t('dashboard', { ns: 'common' }), href: '/hr/dashboard' },
          { label: t('employees', { ns: 'common' }), href: '/hr/employees' },
          { label: t('title', { ns: 'assessments' }) },
        ]}
        surface="plain"
        className="mb-3 gap-2"
        actions={(
          <Link to="/hr/employees/assessments/new">
            <Button icon={<Plus size={16} />} disabled={availableCycles.length === 0}>
              {t('actions.newAssessment', { ns: 'assessments' })}
            </Button>
          </Link>
        )}
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="space-y-3">
          <Card variant="elevated">
            <CardHeader className="items-start">
              <div>
                <CardTitle>{t('availableCycles.title', { ns: 'assessments' })}</CardTitle>
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('availableCycles.subtitle', { ns: 'assessments' })}</p>
              </div>
            </CardHeader>
            <CardContent>
              {availableCycles.length === 0 ? (
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('availableCycles.empty', { ns: 'assessments' })}</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {availableCycles.map((cycle) => (
                    <div key={cycle.cycleCode} className="rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[color:var(--hr-text)]">{cycle.cycleLabel}</p>
                          <p className="text-xs text-[color:var(--hr-text-subtle)]">{cycle.cycleCode}</p>
                        </div>
                        <Badge variant="info">{t(`periodTypes.${cycle.periodType}`, { ns: 'assessments' })}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-[color:var(--hr-text-muted)]">
                        {t('availableCycles.window', {
                          ns: 'assessments',
                          start: formatDate(cycle.startDate, locale, 'medium', timeZone),
                          end: formatDate(cycle.endDate, locale, 'medium', timeZone),
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="items-start">
              <div>
                <CardTitle>{t('history.title', { ns: 'assessments' })}</CardTitle>
                <p className="text-sm text-[color:var(--hr-text-muted)]">{t('history.subtitle', { ns: 'assessments' })}</p>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <p className="text-sm text-[color:var(--hr-text-muted)]">{t('loading', { ns: 'common' })}</p>}
              {isError && <p className="text-sm text-[color:var(--color-error-600)]">{t('states.loadError', { ns: 'assessments' })}</p>}
              {!isLoading && !isError && assessments.length === 0 && (
                <div className="rounded-[1rem] border border-dashed border-[color:var(--hr-border-strong)] bg-[color:var(--hr-surface-muted)] p-6 text-center">
                  <p className="text-sm font-semibold text-[color:var(--hr-text)]">{t('states.emptyTitle', { ns: 'assessments' })}</p>
                  <p className="mt-1 text-sm text-[color:var(--hr-text-muted)]">{t('states.emptyBody', { ns: 'assessments' })}</p>
                </div>
              )}
              {!isLoading && !isError && assessments.length > 0 && (
                <div className="grid gap-3">
                  {assessments.map((assessment) => (
                    <div key={assessment.assessmentId} className="rounded-[1rem] border border-[color:var(--hr-border-subtle)] bg-[color:var(--hr-surface-muted)] p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-semibold text-[color:var(--hr-text)]">{assessment.cycleLabel}</p>
                            <Badge variant={getStatusVariant(assessment.reviewStatus)}>
                              {t(`statuses.${assessment.reviewStatus}`, { ns: 'assessments' })}
                            </Badge>
                          </div>
                          <p className="text-xs text-[color:var(--hr-text-subtle)]">{assessment.cycleCode}</p>
                          <div className="grid gap-1 text-sm text-[color:var(--hr-text-muted)] sm:grid-cols-2">
                            <p>{t('history.reviewer', { ns: 'assessments', name: assessment.reviewerName ?? t('states.reviewerPending', { ns: 'assessments' }) })}</p>
                            <p>{assessment.reviewerJobTitle ?? t('states.reviewerPendingBody', { ns: 'assessments' })}</p>
                            <p>{t('history.updated', { ns: 'assessments', value: formatDateTime(assessment.updatedAt, locale, 'medium', timeZone) })}</p>
                            <p>
                              {assessment.submittedAt
                                ? t('history.submitted', { ns: 'assessments', value: formatDateTime(assessment.submittedAt, locale, 'medium', timeZone) })
                                : t('history.notSubmitted', { ns: 'assessments' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/hr/employees/assessments/${assessment.assessmentId}`}>
                            <Button variant="secondary">
                              {assessment.reviewStatus === 'DRAFT'
                                ? t('actions.continueDraft', { ns: 'assessments' })
                                : t('actions.viewAssessment', { ns: 'assessments' })}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

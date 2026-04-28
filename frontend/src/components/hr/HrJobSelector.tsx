import { Select } from '@/components/ui/Select'
import { useTranslation } from 'react-i18next'

export interface JobOption {
  jobId: string
  jobTitle: string
  minSalary?: number
  maxSalary?: number
}

interface HrJobSelectorProps {
  value?: string
  onChange: (jobId: string) => void
  options: JobOption[]
  loading?: boolean
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
}

export function HrJobSelector({ value, onChange, options, loading, label, error, disabled, placeholder }: HrJobSelectorProps) {
  const { t } = useTranslation(['common'])
  const selectOptions = options.map(j => ({
    value: j.jobId,
    label: `${j.jobTitle} (${j.jobId})`,
  }))

  return (
    <Select
      label={label}
      value={value ?? ''}
      onChange={v => onChange(v as string)}
      options={selectOptions}
      placeholder={placeholder ?? t('ui.selectJob', { ns: 'common' })}
      disabled={disabled || loading}
      error={error}
    />
  )
}

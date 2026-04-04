import { Select } from '@/components/ui/Select'

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

export function HrJobSelector({ value, onChange, options, loading, label, error, disabled, placeholder = 'Select job...' }: HrJobSelectorProps) {
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
      placeholder={placeholder}
      disabled={disabled || loading}
      error={error}
    />
  )
}

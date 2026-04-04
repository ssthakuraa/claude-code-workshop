/**
 * KPIBuilder — create custom KPIs from data sources.
 * Produces a KPI config that can be saved to user_preferences.
 */
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { Input } from './Input'
import { Select } from './Select'
import { Button } from './Button'

export type AggregationFn = 'count' | 'sum' | 'avg' | 'min' | 'max'
export type TrendPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year'

export interface DataSource {
  id: string
  label: string
  fields: { key: string; label: string; type: 'number' | 'string' | 'date' }[]
}

export interface KPIConfig {
  id?: string
  name: string
  dataSourceId: string
  field: string
  aggregation: AggregationFn
  filter?: string
  trendPeriod?: TrendPeriod
  format?: 'number' | 'currency' | 'percent'
  prefix?: string
  suffix?: string
}

export interface KPIBuilderProps {
  dataSources: DataSource[]
  initialConfig?: Partial<KPIConfig>
  onSave: (config: KPIConfig) => void
  onCancel?: () => void
  className?: string
}

export function KPIBuilder({ dataSources, initialConfig, onSave, onCancel, className }: KPIBuilderProps) {
  const [config, setConfig] = useState<Partial<KPIConfig>>(initialConfig ?? {})
  const update = (partial: Partial<KPIConfig>) => setConfig(c => ({ ...c, ...partial }))

  const selectedSource = dataSources.find(d => d.id === config.dataSourceId)
  const numericFields = selectedSource?.fields.filter(f => f.type === 'number') ?? []

  const aggOptions = [
    { value: 'count', label: 'Count' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
  ]

  const trendOptions = [
    { value: 'day', label: 'Daily' }, { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' }, { value: 'quarter', label: 'Quarterly' }, { value: 'year', label: 'Yearly' },
  ]

  const formatOptions = [
    { value: 'number', label: 'Number' }, { value: 'currency', label: 'Currency' }, { value: 'percent', label: 'Percentage' },
  ]

  function handleSave() {
    if (!config.name || !config.dataSourceId || !config.aggregation) return
    if (config.aggregation !== 'count' && !config.field) return
    onSave(config as KPIConfig)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Input label="KPI Name" value={config.name ?? ''} onChange={e => update({ name: e.target.value })} placeholder="e.g. Total Collected This Month" required />

      <Select
        label="Data Source"
        options={dataSources.map(d => ({ value: d.id, label: d.label }))}
        value={config.dataSourceId ?? ''}
        onChange={v => update({ dataSourceId: v as string, field: '' })}
        placeholder="Select data source"
      />

      <Select
        label="Aggregation"
        options={aggOptions}
        value={config.aggregation ?? ''}
        onChange={v => update({ aggregation: v as AggregationFn })}
        placeholder="Select aggregation"
      />

      {config.aggregation && config.aggregation !== 'count' && (
        <Select
          label="Field"
          options={numericFields.map(f => ({ value: f.key, label: f.label }))}
          value={config.field ?? ''}
          onChange={v => update({ field: v as string })}
          placeholder="Select field"
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <Select label="Trend Period" options={trendOptions} value={config.trendPeriod ?? ''} onChange={v => update({ trendPeriod: v as TrendPeriod })} placeholder="None" />
        <Select label="Format" options={formatOptions} value={config.format ?? ''} onChange={v => update({ format: v as KPIConfig['format'] })} placeholder="Number" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button variant="primary" onClick={handleSave} disabled={!config.name || !config.dataSourceId || !config.aggregation}>Save KPI</Button>
      </div>
    </div>
  )
}

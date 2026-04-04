/**
 * ChartBuilder — visually configure a chart from a data source.
 * Produces a ChartConfig that can be saved to user_preferences.
 */
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Select } from './Select'
import { AppBarChart, AppLineChart, AppDonutChart, CHART_COLORS } from './Charts'
import type { DataSource } from './KPIBuilder'

export type ChartType = 'line' | 'bar' | 'area' | 'donut' | 'stacked_bar'

export interface ChartConfig {
  id?: string
  name: string
  type: ChartType
  dataSourceId: string
  xField: string
  yFields: string[]
  stacked?: boolean
  showLegend?: boolean
  showGrid?: boolean
}

export interface ChartBuilderProps {
  dataSources: DataSource[]
  initialConfig?: Partial<ChartConfig>
  previewData?: Record<string, string | number>[]
  onSave: (config: ChartConfig) => void
  onCancel?: () => void
  className?: string
}

export function ChartBuilder({ dataSources, initialConfig, previewData = [], onSave, onCancel, className }: ChartBuilderProps) {
  const [config, setConfig] = useState<Partial<ChartConfig>>(initialConfig ?? { showGrid: true, showLegend: true })
  const update = (p: Partial<ChartConfig>) => setConfig(c => ({ ...c, ...p }))

  const selectedSource = dataSources.find(d => d.id === config.dataSourceId)
  const fields = selectedSource?.fields ?? []
  const numericFields = fields.filter(f => f.type === 'number')

  const chartTypeOptions = [
    { value: 'line', label: 'Line' }, { value: 'bar', label: 'Bar' },
    { value: 'area', label: 'Area' }, { value: 'donut', label: 'Donut/Pie' },
    { value: 'stacked_bar', label: 'Stacked Bar' },
  ]

  const previewLines = (config.yFields ?? []).map((k, i) => ({ key: k, label: k, color: CHART_COLORS[i % CHART_COLORS.length] }))
  const previewDonut = (config.yFields ?? []).map((k, i) => ({ label: k, value: (previewData.reduce((s, row) => s + (Number(row[k]) || 0), 0)), color: CHART_COLORS[i] }))

  function handleSave() {
    if (!config.name || !config.type || !config.dataSourceId) return
    onSave(config as ChartConfig)
  }

  return (
    <div className={cn('flex gap-6 items-start', className)}>
      {/* Config panel */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        <Input label="Chart Title" value={config.name ?? ''} onChange={e => update({ name: e.target.value })} required />

        <Select label="Chart Type" options={chartTypeOptions} value={config.type ?? ''} onChange={v => update({ type: v as ChartType })} placeholder="Select type" />

        <Select
          label="Data Source"
          options={dataSources.map(d => ({ value: d.id, label: d.label }))}
          value={config.dataSourceId ?? ''}
          onChange={v => update({ dataSourceId: v as string, xField: '', yFields: [] })}
          placeholder="Select source"
        />

        {config.dataSourceId && (
          <>
            <Select
              label="X-Axis / Category"
              options={fields.map(f => ({ value: f.key, label: f.label }))}
              value={config.xField ?? ''}
              onChange={v => update({ xField: v as string })}
              placeholder="Select X axis"
            />
            <Select
              label="Values (Y-Axis)"
              options={numericFields.map(f => ({ value: f.key, label: f.label }))}
              value={config.yFields ?? []}
              onChange={v => update({ yFields: v as string[] })}
              multi
              placeholder="Select fields"
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
          <Button variant="primary" onClick={handleSave} disabled={!config.name || !config.type}>Save Chart</Button>
        </div>
      </div>

      {/* Preview panel */}
      <div className="flex-1 min-w-0 bg-neutral-50 rounded-lg border border-neutral-200 p-4">
        <p className="text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wide">Preview</p>
        {config.type === 'donut' && previewDonut.length > 0 ? (
          <AppDonutChart data={previewDonut} />
        ) : (config.type === 'bar' || config.type === 'stacked_bar') && previewLines.length > 0 ? (
          <AppBarChart data={previewData} bars={previewLines} xKey={config.xField ?? ''} stacked={config.type === 'stacked_bar'} showGrid={config.showGrid} showLegend={config.showLegend} />
        ) : previewLines.length > 0 ? (
          <AppLineChart data={previewData} lines={previewLines} xKey={config.xField ?? ''} showGrid={config.showGrid} showLegend={config.showLegend} />
        ) : (
          <div className="flex items-center justify-center h-40 text-sm text-neutral-400">Configure chart to see preview</div>
        )}
      </div>
    </div>
  )
}

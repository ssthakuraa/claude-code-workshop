import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from 'recharts'
import type { MouseHandlerDataParam } from 'recharts'
import { useTranslation } from 'react-i18next'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { MODERN_CHART_NEUTRALS } from './chartPalette'

interface BarDataPoint {
  label: string
  value: number
  color?: string
}

interface HrHorizontalBarChartProps {
  data: BarDataPoint[]
  title?: string
  onClick?: (bar: BarDataPoint) => void
  loading?: boolean
  height?: number
  showValues?: boolean
  yAxisWidth?: number
  labelMaxLength?: number
}

const BASE_COLOR = MODERN_CHART_NEUTRALS.info

interface HorizontalBarTooltipPayloadItem {
  payload: BarDataPoint
  value: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: HorizontalBarTooltipPayloadItem[] }) {
  const { t } = useTranslation(['common'])
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-neutral-800">{payload[0].payload.label}</p>
      <p className="text-neutral-600">{payload[0].value} {t('employees', { ns: 'common' }).toLowerCase()}</p>
    </div>
  )
}

export function HrHorizontalBarChart({
  data,
  title,
  onClick,
  loading = false,
  height = 360,
  showValues = true,
  yAxisWidth = 72,
  labelMaxLength,
}: HrHorizontalBarChartProps) {
  const { t } = useTranslation(['common'])
  if (loading) {
    return (
      <div>
        {title && <p className="text-sm font-medium text-neutral-700 mb-3">{title}</p>}
        <HrSkeleton variant="chart" height={height} />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-neutral-400 text-sm" style={{ height }}>
        {t('ui.noDataAvailable', { ns: 'common' })}
      </div>
    )
  }

  // Sort descending
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const max = sorted[0]?.value ?? 1
  const formatLabel = (value: string) => {
    if (!labelMaxLength || value.length <= labelMaxLength) {
      return value
    }

    return `${value.slice(0, Math.max(0, labelMaxLength - 1))}…`
  }

  return (
    <div>
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ left: 4, right: showValues ? 28 : 8, top: 4, bottom: 4 }}
          onClick={onClick ? (nextState: MouseHandlerDataParam) => {
            const activeIndex = typeof nextState.activeTooltipIndex === 'number'
              ? nextState.activeTooltipIndex
              : Number(nextState.activeTooltipIndex)
            const selectedBar = Number.isFinite(activeIndex) ? sorted[activeIndex] : undefined
            if (selectedBar) {
              onClick(selectedBar)
            }
          } : undefined}
          style={{ cursor: onClick ? 'pointer' : undefined }}
        >
          <XAxis type="number" domain={[0, max]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11 }}
            width={yAxisWidth}
            tickFormatter={formatLabel}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#edf6f7' }} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} label={showValues ? { position: 'right', fontSize: 11, fill: MODERN_CHART_NEUTRALS.axis } : false}>
            {sorted.map((entry, i) => {
              const opacity = 1 - (i / sorted.length) * 0.5
              return (
                <Cell
                  key={entry.label}
                  fill={entry.color ?? BASE_COLOR}
                  fillOpacity={opacity}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

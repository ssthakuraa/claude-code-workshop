import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { MODERN_CHART_COLORS } from './chartPalette'

interface DonutDataPoint {
  label: string
  value: number
  percentage: number
  color?: string
  legendLabel?: string
}

interface HrDonutChartProps {
  data: DonutDataPoint[]
  title?: string
  centerLabel?: string
  onClick?: (segment: DonutDataPoint) => void
  loading?: boolean
  height?: number
}

interface DonutTooltipPayloadItem {
  payload: DonutDataPoint
  value: number
}

const DEFAULT_COLORS = MODERN_CHART_COLORS

function CustomTooltip({ active, payload }: { active?: boolean; payload?: DonutTooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as DonutDataPoint
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-neutral-800">{d.label}</p>
      <p className="text-neutral-600">{d.value} ({d.percentage}%)</p>
    </div>
  )
}

export function HrDonutChart({
  data,
  title,
  centerLabel,
  onClick,
  loading = false,
  height = 280,
}: HrDonutChartProps) {
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
      <div className="flex flex-col items-center justify-center text-neutral-400 text-sm" style={{ height }}>
        <p>{t('ui.noDataAvailable', { ns: 'common' })}</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="48%"
            outerRadius="84%"
            dataKey="value"
            nameKey="label"
            isAnimationActive={false}
            onClick={onClick ? (_, idx) => onClick(data[idx]) : undefined}
            cursor={onClick ? 'pointer' : undefined}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.label}
                fill={entry.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {centerLabel && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-neutral-800 text-sm font-semibold">
              {centerLabel}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-0.5">
        {data.map((entry, index) => (
          <div key={entry.label} className="inline-flex min-w-0 items-center gap-1 text-[10px] text-neutral-600">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ backgroundColor: entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
            />
            <span className="truncate" title={entry.label}>{entry.legendLabel ?? entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

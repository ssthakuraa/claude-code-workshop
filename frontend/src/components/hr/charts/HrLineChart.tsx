import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { HrSkeleton } from '@/components/hr/HrSkeleton'
import { useHrDisplayPreferences } from '@/hooks/useHrDisplayPreferences'
import { MODERN_CHART_NEUTRALS } from './chartPalette'
import { formatDate } from '@/utils/formatters'

interface LineDataPoint {
  x: string | Date
  y: number
  metadata?: Record<string, string | number | boolean | null>
}

interface HrLineChartProps {
  data: LineDataPoint[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  color?: string
  showGrid?: boolean
  showDots?: boolean
  loading?: boolean
  height?: number
}

interface LineTooltipPayloadItem {
  value: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: LineTooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-neutral-700">{label}</p>
      <p className="text-neutral-800 font-semibold">{payload[0].value}</p>
    </div>
  )
}

export function HrLineChart({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = MODERN_CHART_NEUTRALS.danger,
  showGrid = true,
  showDots = true,
  loading = false,
  height = 280,
}: HrLineChartProps) {
  const { t } = useTranslation(['common'])
  const preferences = useHrDisplayPreferences()
  const locale = preferences.formattingLocale
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

  const chartData = data.map(d => ({
    x: d.x instanceof Date ? formatDate(d.x, locale, 'short', preferences.timezone) : d.x,
    y: d.y,
    metadata: d.metadata,
  }))

  return (
    <div>
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: xAxisLabel ? 20 : 4 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={MODERN_CHART_NEUTRALS.grid} />}
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11 }}
            tickLine={false}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -8, fontSize: 11 } : undefined}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 11 } : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke={MODERN_CHART_NEUTRALS.grid} strokeWidth={1.5} />
          <Line
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            dot={showDots ? { r: 3, fill: color, strokeWidth: 0 } : false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

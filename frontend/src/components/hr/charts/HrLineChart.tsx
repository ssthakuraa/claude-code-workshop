import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

interface LineDataPoint {
  x: string | Date
  y: number
  metadata?: any
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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
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
  color = '#E53E3E',
  showGrid = true,
  showDots = true,
  loading = false,
  height = 280,
}: HrLineChartProps) {
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
        No data available
      </div>
    )
  }

  const chartData = data.map(d => ({
    x: d.x instanceof Date ? d.x.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : d.x,
    y: d.y,
    metadata: d.metadata,
  }))

  return (
    <div>
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: xAxisLabel ? 20 : 4 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />}
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
          <ReferenceLine y={0} stroke="#E5E7EB" strokeWidth={1.5} />
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

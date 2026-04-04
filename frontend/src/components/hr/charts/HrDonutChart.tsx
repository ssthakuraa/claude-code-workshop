import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

interface DonutDataPoint {
  label: string
  value: number
  percentage: number
  color?: string
}

interface HrDonutChartProps {
  data: DonutDataPoint[]
  title?: string
  centerLabel?: string
  onClick?: (segment: DonutDataPoint) => void
  loading?: boolean
  height?: number
}

const DEFAULT_COLORS = ['#1F6BCC', '#0E9E6E', '#F5A623', '#9B59B6', '#E74C3C', '#1ABC9C']

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
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
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div>
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius="40%"
            outerRadius="60%"
            dataKey="value"
            nameKey="label"
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
          <Legend
            formatter={(value) => <span className="text-xs text-neutral-600">{value}</span>}
          />
          {centerLabel && (
            <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" className="fill-neutral-800 text-sm font-semibold">
              {centerLabel}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from 'recharts'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

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
}

const BASE_COLOR = '#1F6BCC'

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-neutral-800">{payload[0].payload.label}</p>
      <p className="text-neutral-600">{payload[0].value} employees</p>
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
}: HrHorizontalBarChartProps) {
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

  // Sort descending
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const max = sorted[0]?.value ?? 1

  return (
    <div>
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ left: 4, right: showValues ? 28 : 8, top: 4, bottom: 4 }}
          onClick={onClick ? (e: any) => { if (e?.activePayload) onClick(e.activePayload[0].payload) } : undefined}
          style={{ cursor: onClick ? 'pointer' : undefined }}
        >
          <XAxis type="number" domain={[0, max]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={72} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5ff' }} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} label={showValues ? { position: 'right', fontSize: 11, fill: '#6B7280' } : false}>
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

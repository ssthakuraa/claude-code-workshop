/**
 * HrBoxPlotChart
 *
 * Purpose: Salary distribution across job families using a box-and-whisker visualization.
 * Built with recharts ComposedChart (no native box-plot support — implemented via custom shapes).
 */
import {
  ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, Bar,
} from 'recharts'
import { HrSkeleton } from '@/components/hr/HrSkeleton'

interface BoxPlotDataPoint {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers?: number[]
}

interface HrBoxPlotChartProps {
  data: BoxPlotDataPoint[]
  title?: string
  loading?: boolean
  height?: number
}

// Recharts doesn't have a native box-plot shape.
// We render each box using a custom Bar shape.
function BoxShape(props: any) {
  const { x, width, payload } = props
  if (!payload) return null
  const { q1, q3, median, min, max } = payload

  // We use the chart's Y scale to compute pixel positions.
  // recharts passes `y` as the bar's top and `height` as bar height.
  // Since we're using a stacked bar trick, we get the scale indirectly.
  // Instead, we rely on the YAxis domain passed via the shape's yAxis prop.
  const yAxis = props.yAxis as { scale: (v: number) => number } | undefined
  if (!yAxis?.scale) return null
  const toY = yAxis.scale

  const cx = x + width / 2
  const boxX = x + width * 0.15
  const boxW = width * 0.7

  const yQ1 = toY(q1)
  const yQ3 = toY(q3)
  const yMedian = toY(median)
  const yMin = toY(min)
  const yMax = toY(max)

  return (
    <g>
      {/* Whiskers */}
      <line x1={cx} y1={yMin} x2={cx} y2={yQ1} stroke="#6B7280" strokeWidth={1.5} />
      <line x1={cx} y1={yQ3} x2={cx} y2={yMax} stroke="#6B7280" strokeWidth={1.5} />
      {/* Whisker caps */}
      <line x1={cx - 6} y1={yMin} x2={cx + 6} y2={yMin} stroke="#6B7280" strokeWidth={1.5} />
      <line x1={cx - 6} y1={yMax} x2={cx + 6} y2={yMax} stroke="#6B7280" strokeWidth={1.5} />
      {/* Box */}
      <rect x={boxX} y={yQ3} width={boxW} height={Math.abs(yQ1 - yQ3)} fill="#DBEAFE" stroke="#1F6BCC" strokeWidth={1.5} rx={2} />
      {/* Median */}
      <line x1={boxX} y1={yMedian} x2={boxX + boxW} y2={yMedian} stroke="#1F6BCC" strokeWidth={2} />
    </g>
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as BoxPlotDataPoint | undefined
  if (!d) return null
  const fmt = (n: number) => `$${n.toLocaleString()}`
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-md px-3 py-2 text-xs space-y-0.5">
      <p className="font-semibold text-neutral-800 mb-1">{d.label}</p>
      <p className="text-neutral-600">Max: <span className="font-medium">{fmt(d.max)}</span></p>
      <p className="text-neutral-600">Q3: <span className="font-medium">{fmt(d.q3)}</span></p>
      <p className="text-blue-700">Median: <span className="font-semibold">{fmt(d.median)}</span></p>
      <p className="text-neutral-600">Q1: <span className="font-medium">{fmt(d.q1)}</span></p>
      <p className="text-neutral-600">Min: <span className="font-medium">{fmt(d.min)}</span></p>
    </div>
  )
}

export function HrBoxPlotChart({
  data,
  title,
  loading = false,
  height = 380,
}: HrBoxPlotChartProps) {
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

  const allValues = data.flatMap(d => [d.min, d.max])
  const domainMin = Math.floor(Math.min(...allValues) / 1000) * 1000
  const domainMax = Math.ceil(Math.max(...allValues) / 1000) * 1000

  // We use a transparent Bar as a placeholder to drive the XAxis labels and
  // render the actual box-plot via the custom shape.
  const chartData = data.map(d => ({ ...d, _placeholder: d.max }))

  return (
    <div>
      {title && <p className="text-sm font-medium text-neutral-700 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis
            domain={[domainMin, domainMax]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#E5E7EB" />
          <Bar dataKey="_placeholder" shape={<BoxShape />} isAnimationActive={false}>
            {chartData.map((_entry, i) => (
              <Cell key={i} fill="transparent" />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

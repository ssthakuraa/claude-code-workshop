/**
 * Recharts wrappers — styled to match the RDS design system palette.
 * All charts are responsive by default (ResponsiveContainer fills parent width).
 */
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

export type ChartDataPoint = Record<string, string | number>

// ─── Shared palette ──────────────────────────────────────────────────────────
export const CHART_COLORS = [
  '#2563eb', // primary-600
  '#16a34a', // success-600
  '#d97706', // warning-600
  '#dc2626', // error-600
  '#0891b2', // info-600
  '#9333ea', // purple-600
  '#db2777', // pink-600
  '#65a30d', // lime-600
]

const axisStyle = { fontSize: 12, fill: '#6b7280' }
const tooltipStyle = { fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }

// ─── Line Chart ──────────────────────────────────────────────────────────────
export interface LineChartProps {
  data: ChartDataPoint[]
  lines: { key: string; label: string; color?: string }[]
  xKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export function AppLineChart({ data, lines, xKey, height = 280, showGrid = true, showLegend }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((l, i) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color ?? CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────
export interface BarChartProps {
  data: ChartDataPoint[]
  bars: { key: string; label: string; color?: string }[]
  xKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export function AppBarChart({ data, bars, xKey, height = 280, showGrid = true, showLegend, stacked }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b, i) => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color ?? CHART_COLORS[i % CHART_COLORS.length]} radius={[3, 3, 0, 0]} stackId={stacked ? 'stack' : undefined} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Area Chart ──────────────────────────────────────────────────────────────
export interface AreaChartProps {
  data: ChartDataPoint[]
  areas: { key: string; label: string; color?: string }[]
  xKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export function AppAreaChart({ data, areas, xKey, height = 280, showGrid = true, showLegend, stacked }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {areas.map((a, i) => {
          const color = a.color ?? CHART_COLORS[i % CHART_COLORS.length]
          return (
            <Area key={a.key} type="monotone" dataKey={a.key} name={a.label} stroke={color} fill={color} fillOpacity={0.12} strokeWidth={2} stackId={stacked ? 'stack' : undefined} />
          )
        })}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
export interface DonutChartProps {
  data: { label: string; value: number; color?: string }[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
}

export function AppDonutChart({ data, height = 260, innerRadius = 60, outerRadius = 90, showLegend = true }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>} />}
      </PieChart>
    </ResponsiveContainer>
  )
}

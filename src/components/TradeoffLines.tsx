import { useMemo } from 'react'
import * as d3 from 'd3'
import type { Metric } from '@/types'
import { policyLevers } from '@/data/policies'

interface TradeoffLinesProps {
  hoveredLeverId: string | null
  metrics: Metric[]
  chartWidth: number
  chartHeight: number
  chartCenterX: number
  chartCenterY: number
}

// Match DoughnutChart: radius = 240, inner = 84, outer = 204
const RADIUS = 240
const INNER_R = RADIUS * 0.35
const OUTER_R = RADIUS * 0.85

export function TradeoffLines({
  hoveredLeverId,
  metrics,
  chartWidth,
  chartHeight,
  chartCenterX: cx,
  chartCenterY: cy,
}: TradeoffLinesProps) {
  const { paths } = useMemo(() => {
    if (!hoveredLeverId) return { paths: [], labels: [] }
    const lever = policyLevers.find((l) => l.id === hoveredLeverId)
    if (!lever) return { paths: [], labels: [] }

    const angleScale = d3
      .scaleBand()
      .domain(metrics.map((d) => d.id))
      .range([0, 2 * Math.PI])
      .paddingInner(0.02)

    const policyX = chartWidth - 40
    const policyY = chartHeight / 2

    const result: { path: string; metricId: string; direction: 'improve' | 'worsen'; label: string }[] = []
    lever.impacts.forEach((imp) => {
      const m = metrics.find((x) => x.id === imp.metricId)
      if (!m) return
      const start = angleScale(m.id)
      if (start === undefined) return
      const midAngle = start + (angleScale.bandwidth() ?? 0) / 2 - Math.PI / 2
      const r = m.ring === 'ecological'
        ? (OUTER_R + OUTER_R * Math.max(0.3, Math.min(1.5, m.value / 100))) / 2
        : (INNER_R * Math.max(0.2, Math.min(1, m.value / 100)) + INNER_R) / 2
      const wx = cx + r * Math.cos(midAngle)
      const wy = cy + r * Math.sin(midAngle)
      const cpx = (policyX + wx) / 2 + 30
      const cpy = (policyY + wy) / 2 - 20
      const path = `M ${policyX} ${policyY} Q ${cpx} ${cpy} ${wx} ${wy}`
      result.push({
        path,
        metricId: m.id,
        direction: imp.direction,
        label: imp.direction === 'improve' ? '+' : '−',
      })
    })
    return { paths: result }
  }, [hoveredLeverId, metrics, chartWidth, chartHeight, cx, cy])

  if (!hoveredLeverId || paths.length === 0) return null

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={chartWidth}
      height={chartHeight}
    >
      <defs>
        <marker id="arrow-improve" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#4ECDC4" />
        </marker>
        <marker id="arrow-worsen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#FF6B6B" />
        </marker>
      </defs>
      {paths.map((p, i) => (
        <g key={p.metricId}>
          <path
            d={p.path}
            fill="none"
            stroke={p.direction === 'improve' ? '#4ECDC4' : '#FF6B6B'}
            strokeWidth="1.5"
            strokeDasharray="4,2"
            opacity="0.85"
            markerEnd={`url(#arrow-${p.direction})`}
          />
          <text
            x={chartWidth - 120}
            y={chartHeight / 2 - 70 + i * 16}
            fontSize="9"
            fill={p.direction === 'improve' ? '#4ECDC4' : '#FF6B6B'}
            fontWeight="bold"
          >
            {p.metricId} {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

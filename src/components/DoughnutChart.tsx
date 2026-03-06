import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { AnimatePresence } from 'framer-motion'
import type { Metric } from '@/types'
import { getMetricIcon } from '@/data/metricDetails'
import { TransitionOverlay } from './TransitionOverlay'

interface DoughnutChartProps {
  data: Metric[]
  width?: number
  height?: number
  highlightedIds?: string[]
}

const SHORTFALL_COLORS = ['#e07c5c', '#c2410c', '#ea580c', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a']
const OVERSHOOT_COLORS = ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']

export function DoughnutChart({
  data,
  width = 520,
  height = 520,
  highlightedIds = [],
}: DoughnutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [transitioningMetric, setTransitioningMetric] = useState<Metric | null>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const radius = Math.min(width, height) / 2 - 24
    const centerRadius = radius * 0.08
    const innerBoundary = radius * 0.42
    const outerBoundary = radius * 0.72
    const maxOvershoot = radius * 0.28

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const angleScale = d3
      .scaleBand()
      .domain(data.map((d) => d.id))
      .range([0, 2 * Math.PI])
      .paddingInner(0.02)

    const social = data.filter((d) => d.ring === 'social')
    const ecological = data.filter((d) => d.ring === 'ecological')

    // Safe zone band (subtle)
    g.append('path')
      .attr(
        'd',
        d3.arc<unknown>()({
          innerRadius: innerBoundary,
          outerRadius: outerBoundary,
          startAngle: 0,
          endAngle: 2 * Math.PI,
        }) as string
      )
      .attr('fill', 'rgba(148,163,184,0.15)')
      .attr('stroke', 'rgba(148,163,184,0.25)')
      .attr('stroke-width', 1)

    const handleClick = (d: Metric) => {
      setTransitioningMetric(d)
    }

    // Inner ring: social shortfall
    social.forEach((d, i) => {
      const shortfall = Math.max(0, 100 - d.value)
      const wedgeOuter = shortfall <= 0
        ? centerRadius + 4
        : centerRadius + (innerBoundary - centerRadius) * Math.min(1, shortfall / 50)
      const start = angleScale(d.id) ?? 0
      const end = start + (angleScale.bandwidth() ?? 0)
      const arcGen = d3.arc().innerRadius(centerRadius).outerRadius(wedgeOuter).padAngle(0.015).cornerRadius(2)
      const path = g
        .append('path')
        .attr('d', arcGen({ innerRadius: centerRadius, outerRadius: wedgeOuter, startAngle: start, endAngle: end }) ?? '')
        .attr('fill', SHORTFALL_COLORS[i % SHORTFALL_COLORS.length])
        .attr('stroke', 'rgba(255,255,255,0.4)')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .attr('opacity', 0.92)
      path
        .attr('stroke-width', highlightedIds.includes(d.id) ? 2.5 : 1)
        .on('click', () => handleClick(d))
        .on('mouseover', function () {
          d3.select(this).attr('opacity', 1)
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 0.92)
        })
    })

    // Outer ring: ecological overshoot
    ecological.forEach((d, i) => {
      const overshoot = Math.max(0, d.value - 100)
      const extent = overshoot <= 0 ? 4 : Math.min(1, overshoot / 100) * maxOvershoot
      const wedgeInner = outerBoundary
      const wedgeOuter = outerBoundary + extent
      const start = angleScale(d.id) ?? 0
      const end = start + (angleScale.bandwidth() ?? 0)
      const arcGen = d3.arc().innerRadius(wedgeInner).outerRadius(wedgeOuter).padAngle(0.015).cornerRadius(2)
      const path = g
        .append('path')
        .attr('d', arcGen({ innerRadius: wedgeInner, outerRadius: wedgeOuter, startAngle: start, endAngle: end }) ?? '')
        .attr('fill', OVERSHOOT_COLORS[i % OVERSHOOT_COLORS.length])
        .attr('stroke', 'rgba(255,255,255,0.4)')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .attr('opacity', 0.92)
      path
        .attr('stroke-width', highlightedIds.includes(d.id) ? 2.5 : 1)
        .on('click', () => handleClick(d))
        .on('mouseover', function () {
          d3.select(this).attr('opacity', 1)
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 0.92)
        })
    })

    // Icon labels
    data.forEach((d) => {
      const start = angleScale(d.id) ?? 0
      const midAngle = start + (angleScale.bandwidth() ?? 0) / 2 - Math.PI / 2
      const labelR = d.ring === 'social' ? innerBoundary - 18 : outerBoundary + 22
      const x = labelR * Math.cos(midAngle)
      const y = labelR * Math.sin(midAngle)
      const icon = getMetricIcon(d.id)
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 16)
        .attr('pointer-events', 'none')
        .attr('fill', 'rgba(0,0,0,0.6)')
        .text(icon)
    })

    return () => {
      svg.selectAll('*').remove()
    }
  }, [data, width, height, highlightedIds])

  return (
    <div className="relative">
      <svg ref={svgRef} className="mx-auto block" />
      <AnimatePresence>
        {transitioningMetric && (
          <TransitionOverlay
            metric={transitioningMetric}
            onComplete={() => setTransitioningMetric(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

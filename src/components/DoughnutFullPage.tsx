import { getMetricIcon, getMetricSynopsis } from '@/data/metricDetails'
import type { Metric } from '@/types'
import * as d3 from 'd3'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TransitionOverlay } from './TransitionOverlay'

interface Props {
  data: Metric[]
  onReady?: () => void
}

const SOCIAL_COLORS = [
  '#f97316', '#ea580c', '#fb923c', '#c2410c',
  '#f59e0b', '#d97706', '#ef4444', '#dc2626',
]
const ECO_COLORS = [
  '#dc2626', '#b91c1c', '#ef4444', '#f97316',
  '#dc2626', '#ea580c', '#b91c1c', '#ef4444',
]
const GREEN = '#22c55e'
const GREEN_DARK = '#16a34a'

const SUB_METRICS: Record<string, [string, string]> = {
  housing: ['Homelessness', 'Housing Burden'],
  energy: ['Energy Burden', 'Energy Reliability'],
  health: ['Life Expectancy', 'Healthcare Access'],
  equity: ['Gender Pay Gap', 'Racial Equity Index'],
  education: ['Literacy Rate', 'Student Loan Debt'],
  food: ['Food Insecurity', 'Vegetables Per Day'],
  jobs: ['Poverty Rate', 'Unemployment'],
  community: ['Income Inequality', 'Social Trust'],
  climate: ['GHG Emissions', 'Wildfire Risk'],
  nitrogen: ['Fertilizer Runoff', 'Algal Blooms'],
  water: ['Water Quality', 'Groundwater Level'],
  ozone: ['Ozone Layer', 'UV Index'],
  land: ['Deforestation', 'Soil Health'],
  biodiversity: ['Species Loss', 'Habitat Fragmentation'],
  ocean: ['Ocean pH', 'Marine Dead Zones'],
  air: ['PM2.5 Levels', 'Ozone Pollution'],
}

export function DoughnutFullPage({ data, onReady }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 1200, h: 800 })
  const [hovered, setHovered] = useState<Metric | null>(null)
  const [transitioning, setTransitioning] = useState<Metric | null>(null)

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDims({ w: width, h: height })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleClick = useCallback((d: Metric) => setTransitioning(d), [])

  const social = useMemo(() => data.filter(d => d.ring === 'social'), [data])
  const ecological = useMemo(() => data.filter(d => d.ring === 'ecological'), [data])

  /* compute radii & scales once per dims change */
  const layout = useMemo(() => {
    const { w, h } = dims
    const cx = w / 2
    const cy = h / 2
    const R = Math.min(w * 0.32, h * 0.38)
    const coreR = R * 0.10
    const shortfallR = R * 0.42
    const greenIn = R * 0.44
    const greenOut = R * 0.60
    const ecoIn = R * 0.62
    const ecoMaxExt = R * 0.26
    const iconSocialR = R * 0.76
    const iconEcoR = ecoIn + ecoMaxExt + R * 0.14
    /* label radius: middle of each ring so text sits ON the wedge */
    const labelSocialR = (coreR + shortfallR) / 2
    const labelEcoR = ecoIn + ecoMaxExt * 0.45

    const socialAngle = d3.scaleBand()
      .domain(social.map(d => d.id))
      .range([0, 2 * Math.PI])
      .paddingInner(0.04)
    const ecoAngle = d3.scaleBand()
      .domain(ecological.map(d => d.id))
      .range([0, 2 * Math.PI])
      .paddingInner(0.04)

    return { cx, cy, R, coreR, shortfallR, greenIn, greenOut, ecoIn, ecoMaxExt, iconSocialR, iconEcoR, labelSocialR, labelEcoR, socialAngle, ecoAngle }
  }, [dims, social, ecological])

  /* D3 rendering — only geometry, no text labels */
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return
    const { w, h } = dims
    const { cx, cy, coreR, shortfallR, greenIn, greenOut, ecoIn, ecoMaxExt, socialAngle, ecoAngle } = layout
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', w).attr('height', h).attr('viewBox', `0 0 ${w} ${h}`)

    const defs = svg.append('defs')
    const glow = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    glow.append('feGaussianBlur').attr('stdDeviation', 6).attr('result', 'blur')
    glow.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).join('feMergeNode').attr('in', (d: string) => d)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

    /* gridlines */
    social.forEach(d => {
      const a = (socialAngle(d.id) ?? 0) - Math.PI / 2
      g.append('line').attr('x1', 0).attr('y1', 0)
        .attr('x2', greenOut * Math.cos(a)).attr('y2', greenOut * Math.sin(a))
        .attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 0.5)
    })

    /* green safe ring */
    g.append('path')
      .attr('d', d3.arc<unknown>()({ innerRadius: greenIn, outerRadius: greenOut, startAngle: 0, endAngle: 2 * Math.PI }) as string)
      .attr('fill', GREEN).attr('opacity', 0.8).attr('stroke', GREEN_DARK).attr('stroke-width', 1.5)

    /* shortfall wedges */
    social.forEach((d, i) => {
      const shortfall = Math.max(0, 100 - d.value)
      const outer = shortfall <= 0 ? coreR + 3 : coreR + (shortfallR - coreR) * Math.min(1, shortfall / 50)
      const start = socialAngle(d.id) ?? 0
      const end = start + (socialAngle.bandwidth() ?? 0)
      g.append('path')
        .attr('d', d3.arc().innerRadius(coreR).outerRadius(outer).cornerRadius(2)({ innerRadius: coreR, outerRadius: outer, startAngle: start, endAngle: end }) ?? '')
        .attr('fill', SOCIAL_COLORS[i % SOCIAL_COLORS.length])
        .attr('stroke', 'rgba(0,0,0,0.3)').attr('stroke-width', 0.5)
        .attr('cursor', 'pointer').attr('opacity', 0.9)
        .on('mouseover', function () { d3.select(this).attr('opacity', 1).attr('filter', 'url(#glow)'); setHovered(d) })
        .on('mouseout', function () { d3.select(this).attr('opacity', 0.9).attr('filter', null); setHovered(null) })
        .on('click', () => handleClick(d))
    })

    /* overshoot wedges */
    ecological.forEach((d, i) => {
      const overshoot = Math.max(0, d.value - 100)
      const ext = overshoot <= 0 ? 3 : Math.min(1, overshoot / 100) * ecoMaxExt
      const outer = ecoIn + ext
      const start = ecoAngle(d.id) ?? 0
      const end = start + (ecoAngle.bandwidth() ?? 0)
      g.append('path')
        .attr('d', d3.arc().innerRadius(ecoIn).outerRadius(outer).cornerRadius(2)({ innerRadius: ecoIn, outerRadius: outer, startAngle: start, endAngle: end }) ?? '')
        .attr('fill', ECO_COLORS[i % ECO_COLORS.length])
        .attr('stroke', 'rgba(0,0,0,0.3)').attr('stroke-width', 0.5)
        .attr('cursor', 'pointer').attr('opacity', 0.9)
        .on('mouseover', function () { d3.select(this).attr('opacity', 1).attr('filter', 'url(#glow)'); setHovered(d) })
        .on('mouseout', function () { d3.select(this).attr('opacity', 0.9).attr('filter', null); setHovered(null) })
        .on('click', () => handleClick(d))
    })

    /* center dot */
    g.append('circle').attr('r', coreR).attr('fill', '#0f1117').attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 1)

    onReady?.()
    return () => { void svg.selectAll('*').remove() }
  }, [data, dims, layout, handleClick, social, ecological, onReady])

  /* compute HTML-overlay positions — ON the wedge (middle of each ring) */
  const socialIcons = useMemo(() => social.map(d => {
    const start = layout.socialAngle(d.id) ?? 0
    const mid = start + (layout.socialAngle.bandwidth() ?? 0) / 2 - Math.PI / 2
    return { m: d, x: layout.cx + layout.labelSocialR * Math.cos(mid), y: layout.cy + layout.labelSocialR * Math.sin(mid) }
  }), [social, layout])

  const ecoIcons = useMemo(() => ecological.map(d => {
    const start = layout.ecoAngle(d.id) ?? 0
    const mid = start + (layout.ecoAngle.bandwidth() ?? 0) / 2 - Math.PI / 2
    return { m: d, x: layout.cx + layout.labelEcoR * Math.cos(mid), y: layout.cy + layout.labelEcoR * Math.sin(mid) }
  }), [ecological, layout])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #1a1f2e 0%, #0f1117 70%)' }}>
      {/* title */}
      <div className="absolute top-5 left-0 right-0 text-center z-20 pointer-events-none">
        <h1 className="text-sm font-semibold tracking-[0.25em] uppercase text-white/40">California Doughnut</h1>
      </div>

      {/* SVG chart */}
      <svg ref={svgRef} className="absolute inset-0 z-10" />

      {/* Labels ON the inner (social) wheel — centered on each wedge */}
      {socialIcons.map(({ m, x, y }) => (
        <div
          key={m.id}
          className="absolute z-20 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%,-50%)',
            textShadow: '0 0 2px #000, 0 0 4px #000, 0 1px 3px #000, 0 2px 6px rgba(0,0,0,0.8), 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000',
          }}
        >
          <span className="text-sm leading-none drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]">{getMetricIcon(m.id)}</span>
          <span className="text-[8px] font-bold tracking-wide text-white uppercase mt-0.5 whitespace-nowrap leading-tight">
            {m.label}
          </span>
        </div>
      ))}

      {/* Labels ON the outer (ecological) wheel — centered on each wedge */}
      {ecoIcons.map(({ m, x, y }) => (
        <div
          key={m.id}
          className="absolute z-20 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%,-50%)',
            textShadow: '0 0 2px #000, 0 0 4px #000, 0 1px 3px #000, 0 2px 6px rgba(0,0,0,0.8), 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000',
          }}
        >
          <span className="text-sm leading-none drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]">{getMetricIcon(m.id)}</span>
          <span className="text-[8px] font-bold tracking-wide text-white uppercase mt-0.5 whitespace-nowrap leading-tight">
            {m.label}
          </span>
        </div>
      ))}

      {/* center label (HTML for crispness) */}
      <div
        className="absolute z-20 pointer-events-none select-none text-center"
        style={{ left: layout.cx, top: layout.cy, transform: 'translate(-50%,-50%)', textShadow: '0 0 12px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)' }}
      >
        <div className="text-[9px] font-bold tracking-[0.12em] text-white/80 leading-tight">SOCIAL</div>
        <div className="text-[7px] font-medium tracking-[0.10em] text-white/60 leading-tight">FOUNDATION</div>
      </div>

      {/* left panel — social: wide enough to show all text */}
      <div className="absolute left-0 top-0 bottom-0 w-[min(22rem,28vw)] min-w-[200px] flex flex-col justify-center gap-3 py-12 pl-5 pr-4 z-20 bg-gradient-to-r from-black/85 via-black/60 to-transparent pointer-events-auto">
        {social.map(m => {
          const shortfall = Math.max(0, Math.round(100 - m.value))
          const subs = SUB_METRICS[m.id] ?? ['—', '—']
          const isHov = hovered?.id === m.id
          return (
            <div key={m.id} onClick={() => handleClick(m)}
              className={`cursor-pointer transition-all duration-150 ${isHov ? 'opacity-100 translate-x-0.5' : 'opacity-60 hover:opacity-80'}`}>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs font-bold tracking-wider text-white uppercase min-w-0 break-words">{m.label}</span>
                <span className="text-[10px] font-semibold text-orange-400 tabular-nums flex-shrink-0">{shortfall > 0 ? `-${shortfall}%` : 'OK'}</span>
              </div>
              <div className="h-px bg-white/10 my-0.5" />
              {subs.map(s => (
                <div key={s} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-sm bg-orange-500/70 flex-shrink-0 mt-1.5" />
                  <span className="text-[10px] text-white/50 leading-snug break-words">{s}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* right panel — ecological: wide enough to show all text */}
      <div className="absolute right-0 top-0 bottom-0 w-[min(22rem,28vw)] min-w-[200px] flex flex-col justify-center gap-3 py-12 pr-5 pl-4 z-20 bg-gradient-to-l from-black/85 via-black/60 to-transparent pointer-events-auto">
        {ecological.map(m => {
          const overshoot = Math.max(0, Math.round(m.value - 100))
          const subs = SUB_METRICS[m.id] ?? ['—', '—']
          const isHov = hovered?.id === m.id
          return (
            <div key={m.id} onClick={() => handleClick(m)}
              className={`cursor-pointer transition-all duration-150 text-right ${isHov ? 'opacity-100 -translate-x-0.5' : 'opacity-60 hover:opacity-80'}`}>
              <div className="flex items-center justify-between gap-2 min-w-0 flex-row-reverse">
                <span className="text-xs font-bold tracking-wider text-white uppercase min-w-0 break-words text-right">{m.label}</span>
                <span className="text-[10px] font-semibold text-red-400 tabular-nums flex-shrink-0">{overshoot > 0 ? `+${overshoot}%` : 'OK'}</span>
              </div>
              <div className="h-px bg-white/10 my-0.5" />
              {subs.map(s => (
                <div key={s} className="flex items-start justify-end gap-1.5">
                  <span className="text-[10px] text-white/50 leading-snug break-words text-right">{s}</span>
                  <span className="w-1 h-1 rounded-sm bg-red-500/70 flex-shrink-0 mt-1.5" />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div key={hovered.id}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 pointer-events-none"
            style={{ left: dims.w / 2 - 130, bottom: 40 }}>
            <div className="w-[260px] bg-black/85 backdrop-blur-md rounded-lg px-4 py-3 text-center border border-white/10">
              <p className="text-sm font-semibold text-white">{getMetricIcon(hovered.id)} {hovered.label}</p>
              <p className="text-xs text-white/50 mt-1">{hovered.value}% — {hovered.ring === 'social'
                ? `${Math.max(0, 100 - hovered.value)}% shortfall`
                : `${Math.max(0, hovered.value - 100)}% overshoot`}</p>
              <p className="text-[10px] text-white/35 mt-1 leading-snug">{getMetricSynopsis(hovered.id).slice(0, 90)}…</p>
              <p className="text-[10px] text-emerald-400/80 mt-1">Click to explore →</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* transition */}
      <AnimatePresence>
        {transitioning && <TransitionOverlay metric={transitioning} onComplete={() => setTransitioning(null)} />}
      </AnimatePresence>

      {/* legend */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-5 z-20 text-[9px] text-white/35">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500" />Social Shortfall</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" />Safe Zone</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-600" />Ecological Overshoot</span>
      </div>
    </div>
  )
}

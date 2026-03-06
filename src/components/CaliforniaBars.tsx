import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Metric } from '@/types'
import { getMetricIcon } from '@/data/metricDetails'
import { WedgeDetailOverlay } from './WedgeDetailOverlay'

interface CaliforniaBarsProps {
  data: Metric[]
  highlightedIds?: string[]
}

const SOCIAL_COLORS = ['#FF6B6B', '#FF8E8E', '#FFB5A7', '#FF9F9F', '#FFB5B5']
const ECO_COLORS = ['#E07C5C', '#FF8E72', '#FF6B6B', '#E07C5C', '#FF9F9F']

export function CaliforniaBars({ data, highlightedIds = [] }: CaliforniaBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusedMetric, setFocusedMetric] = useState<Metric | null>(null)

  const { social, ecological } = useMemo(() => {
    const s = data.filter((d) => d.ring === 'social')
    const e = data.filter((d) => d.ring === 'ecological')
    return { social: s, ecological: e }
  }, [data])

  const maxShortfall = 100
  const maxBarWidth = 140

  return (
    <div ref={containerRef} className="relative">
      {/* Inner bars - Social shortfall (bars extend inward/left) */}
      <div className="space-y-3 mb-8">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-display font-bold text-amber-800/90 flex items-center gap-2"
        >
          <span>🌴</span> Where we're falling short
        </motion.p>
        <div className="flex flex-col gap-3">
          {social.map((d, i) => {
            const shortfall = Math.max(0, 100 - d.value)
            const width = (shortfall / maxShortfall) * maxBarWidth
            const isHighlighted = highlightedIds.includes(d.id)
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <span className="text-2xl w-8 text-center opacity-90">{getMetricIcon(d.id)}</span>
                <div
                  className="flex-1 flex items-center justify-end"
                  style={{ maxWidth: maxBarWidth + 60 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => setFocusedMetric(d)}
                      onClick={() => setFocusedMetric(d)}
                      className="h-7 rounded-r-lg cursor-pointer transition-shadow hover:shadow-lg"
                      style={{
                        width: Math.max(width, 8),
                        backgroundColor: SOCIAL_COLORS[i % SOCIAL_COLORS.length],
                        border: isHighlighted ? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                      }}
                    />
                    <span className="ml-2 text-sm font-bold text-amber-900/80 min-w-[3rem]">
                      {d.value}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Divider - organic wavy feel */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
        className="h-1 my-8 rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 opacity-80"
        style={{ transformOrigin: 'left' }}
      />

      {/* Outer bars - Ecological overshoot (bars extend outward/right) */}
      <div className="space-y-3">
        <motion.p
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-display font-bold text-sky-800/90 flex items-center gap-2"
        >
          <span>☀️</span> Where we're overshooting
        </motion.p>
        <div className="flex flex-col gap-3">
          {ecological.map((d, i) => {
            const overshoot = Math.max(0, d.value - 100)
            const width = Math.min(1, overshoot / 100) * maxBarWidth
            const isHighlighted = highlightedIds.includes(d.id)
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <span className="text-2xl w-8 text-center opacity-90">{getMetricIcon(d.id)}</span>
                <div className="flex-1 flex items-center" style={{ maxWidth: maxBarWidth + 60 }}>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-bold text-sky-900/80 min-w-[3rem]">
                      {d.value}%
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => setFocusedMetric(d)}
                      onClick={() => setFocusedMetric(d)}
                      className="h-7 rounded-l-lg cursor-pointer transition-shadow hover:shadow-lg"
                      style={{
                        width: Math.max(width, 8),
                        backgroundColor: ECO_COLORS[i % ECO_COLORS.length],
                        border: isHighlighted ? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '-2px 2px 0 rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <WedgeDetailOverlay metric={focusedMetric} onClose={() => setFocusedMetric(null)} />
    </div>
  )
}

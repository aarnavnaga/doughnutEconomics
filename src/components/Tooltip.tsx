import { motion } from 'framer-motion'
import type { Metric } from '@/types'
import { getInterpretation, getRecommendation } from '@/utils/format'

interface TooltipProps {
  metric: Metric | null
  x: number
  y: number
}

export function Tooltip({ metric, x, y }: TooltipProps) {
  if (!metric) return null
  const interpretation = getInterpretation(metric)
  const recommendation = getRecommendation(metric)
  const isBad = interpretation === 'Overshoot' || interpretation === 'Shortfall'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="absolute z-50 pointer-events-none"
      style={{ left: x + 12, top: y }}
    >
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl px-4 py-3 max-w-[220px] border-2 border-mint/30">
        <div className="font-display font-semibold text-gray-800 text-base">{metric.label}</div>
        <div className="text-mint font-bold text-sm mt-0.5">
          {metric.value}% {metric.unit ?? ''}
        </div>
        <div className={`mt-1 font-bold text-sm ${isBad ? 'text-coral' : 'text-mint'}`}>
          {interpretation}
        </div>
        <div className="text-gray-500 text-xs mt-1.5">{recommendation}</div>
      </div>
    </motion.div>
  )
}

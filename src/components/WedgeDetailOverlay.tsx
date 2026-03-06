import { motion, AnimatePresence } from 'framer-motion'
import type { Metric } from '@/types'
import { getInterpretation, getRecommendation } from '@/utils/format'
import { getMetricIcon, getMetricSynopsis } from '@/data/metricDetails'

interface WedgeDetailOverlayProps {
  metric: Metric | null
  onClose: () => void
}

export function WedgeDetailOverlay({ metric, onClose }: WedgeDetailOverlayProps) {
  if (!metric) return null

  const interpretation = getInterpretation(metric)
  const synopsis = getMetricSynopsis(metric.id)
  const recommendation = getRecommendation(metric)
  const icon = getMetricIcon(metric.id)
  const isProblem = interpretation === 'Overshoot' || interpretation === 'Shortfall'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop - dims and zooms the page behind */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Content card - zooms in */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-amber-50/95 rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-300/60"
        >
          {/* Header with icon and metric */}
          <div className="bg-gradient-to-r from-amber-100/80 to-sky-100/80 px-8 py-6">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{icon}</span>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-800">{metric.label}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-amber-700">{metric.value}%</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-bold ${
                      isProblem ? 'bg-rose-200/80 text-rose-700' : 'bg-emerald-200/80 text-emerald-700'
                    }`}
                  >
                    {interpretation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="px-8 py-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">The Issue</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{synopsis}</p>

            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">What We Can Do</h3>
            <p className="text-base text-gray-700">{recommendation}</p>
          </div>

          {/* Close hint */}
          <div className="px-8 pb-6">
            <p className="text-sm text-gray-400 text-center">Click anywhere to close</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

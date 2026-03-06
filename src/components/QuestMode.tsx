import { motion, AnimatePresence } from 'framer-motion'
import type { QuestStep } from '@/types'

const STEPS = [
  {
    id: 1,
    title: '💧 Water Crisis',
    description: 'California faces severe freshwater overshoot. Use the Water lever to fix it!',
    highlightWedges: ['water'],
    highlightLever: 'water_infra',
  },
  {
    id: 2,
    title: '🏠 Housing Shortfall',
    description: 'Affordable housing is below the foundation. Build housing—and try Green Housing!',
    highlightWedges: ['housing', 'climate'],
    highlightLever: 'housing_zoning',
  },
  {
    id: 3,
    title: '🔥 Wildfire Risk',
    description: 'Land use and air quality matter. Invest in wildfire prevention!',
    highlightWedges: ['land', 'air', 'biodiversity'],
    highlightLever: 'wildfire_prep',
  },
]

interface QuestModeProps {
  step: QuestStep
  onStepChange: (s: QuestStep) => void
  onClose: () => void
}

export function QuestMode({ step, onStepChange, onClose }: QuestModeProps) {
  const current = STEPS[step - 1]
  const isComplete = step > 3

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white/95 backdrop-blur max-w-lg w-full p-6 shadow-xl"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-medium text-stone-800">Quest Mode</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {!isComplete && current ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex gap-2">
                {STEPS.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepChange(s.id as QuestStep)}
                    className={`flex-1 py-2 text-sm font-medium ${
                      step === s.id ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    Step {s.id}
                  </motion.button>
                ))}
              </div>
              <h3 className="text-lg font-medium text-stone-800">{current.title}</h3>
              <p className="text-stone-600 text-sm mt-1">{current.description}</p>
              <div className="flex gap-2">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepChange((step - 1) as QuestStep)}
                    className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800"
                  >
                    Back
                  </motion.button>
                )}
                {step < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepChange((step + 1) as QuestStep)}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-stone-800 text-white"
                  >
                    Next →
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStepChange(0)}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-stone-800 text-white"
                  >
                    Complete! 🎉
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-3"
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-medium text-stone-800">Quest Complete</h3>
              <p className="text-stone-600 mt-2 text-sm">
                Keep playing with the levers to heal California!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-4 px-6 py-2 text-sm font-medium bg-stone-800 text-white"
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

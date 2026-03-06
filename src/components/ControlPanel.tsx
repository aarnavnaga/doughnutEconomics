import { motion } from 'framer-motion'
import type { Persona } from '@/types'
import { policyLevers } from '@/data/policies'
import { useAppStore } from '@/store/useAppStore'

interface ControlPanelProps {
  persona: Persona
  highlightedLeverId?: string
  onLeverHover?: (leverId: string | null) => void
}

export function ControlPanel({ persona, highlightedLeverId, onLeverHover }: ControlPanelProps) {
  const { policySliders, setPolicySlider, setGreenToggle } = useAppStore()
  const isStudent = persona === 'student'

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-stone-800">
        {isStudent ? 'Play with the levers' : 'Policy Sandbox'}
      </h2>
      <p className="text-sm text-stone-500">
        {isStudent ? 'Drag sliders to heal California' : 'Adjust levers. Each impacts 2–4 metrics.'}
      </p>

      <div className="space-y-5 max-h-[420px] overflow-y-auto">
        {policyLevers.map((lever, i) => {
          const state = policySliders[lever.id] ?? { value: 0, greenEnabled: false }
          const isHighlighted = highlightedLeverId === lever.id

          return (
            <motion.div
              key={lever.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => onLeverHover?.(lever.id)}
              onMouseLeave={() => onLeverHover?.(null)}
              className={`py-3 transition-colors ${isHighlighted ? 'bg-stone-100/80' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-stone-800">
                  {isStudent ? (lever.labelStudent ?? lever.label) : lever.label}
                </span>
                <span className="text-xs text-stone-500">{lever.cost}</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={state.value}
                onChange={(e) => setPolicySlider(lever.id, parseInt(e.target.value, 10))}
                className="w-full h-2 accent-stone-600 cursor-pointer"
              />
              <p className="text-xs text-stone-500 mt-1">
                {isStudent ? (lever.descriptionStudent ?? lever.description) : lever.description}
              </p>
              {lever.greenVariant && (
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.greenEnabled}
                    onChange={(e) => setGreenToggle(lever.id, e.target.checked)}
                    className="accent-stone-600"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    {isStudent
                      ? (lever.greenVariant.labelStudent ?? lever.greenVariant.label)
                      : lever.greenVariant.label}
                  </span>
                </label>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

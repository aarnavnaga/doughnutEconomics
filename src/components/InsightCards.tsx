import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

const BADGES: Record<string, { label: string; icon: string; description: string }> = {
  water_guardian: {
    label: 'Water Guardian',
    icon: '💧',
    description: 'Healed freshwater!',
  },
  housing_healer: {
    label: 'Housing Healer',
    icon: '🏠',
    description: 'More homes for all!',
  },
  climate_champion: {
    label: 'Climate Champion',
    icon: '🌍',
    description: 'Cut the overshoot!',
  },
  doughnut_master: {
    label: 'Doughnut Master',
    icon: '🍩',
    description: '70+ score!',
  },
}

export function InsightCards() {
  const { unlockedBadges } = useAppStore()

  if (unlockedBadges.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-stone-800">Badges Unlocked</h3>
      <div className="flex flex-wrap gap-3">
        {unlockedBadges.map((id, i) => {
          const b = BADGES[id]
          if (!b) return null
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl">{b.icon}</span>
              <div>
                <div className="text-sm font-medium text-stone-800">{b.label}</div>
                <div className="text-xs text-stone-500">{b.description}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

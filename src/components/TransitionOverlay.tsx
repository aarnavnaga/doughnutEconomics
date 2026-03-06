import { getMetricIcon } from '@/data/metricDetails'
import type { Metric } from '@/types'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  metric: Metric
  onComplete: () => void
}

const COLORS: Record<string, string> = {
  social: '#1c1917',
  ecological: '#0c0a09',
}

export function TransitionOverlay({ metric, onComplete }: Props) {
  const navigate = useNavigate()
  const bg = COLORS[metric.ring] ?? '#0c0a09'
  const icon = getMetricIcon(metric.id)

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(`/metric/${metric.id}`)
      onComplete()
    }, 500)
    return () => clearTimeout(t)
  }, [metric.id, navigate, onComplete])

  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-8xl"
      >
        {icon}
      </motion.span>
    </motion.div>
  )
}

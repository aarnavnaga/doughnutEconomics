import type { Metric } from '@/types'

export function formatValue(value: number, unit?: string): string {
  const v = Math.round(value)
  return unit ? `${v} ${unit}` : `${v}%`
}

export function getInterpretation(metric: Metric): string {
  if (metric.ring === 'ecological') {
    if (metric.value > 100) return 'Overshoot'
    if (metric.value < 100) return 'Underuse'
    return 'Safe'
  }
  // social
  if (metric.value < 100) return 'Shortfall'
  if (metric.value > 100) return 'Surplus'
  return 'Safe'
}

export function getRecommendation(metric: Metric): string {
  if (metric.ring === 'ecological' && metric.value > 100) {
    return 'Reduce pressure: decarbonize, restore ecosystems'
  }
  if (metric.ring === 'ecological' && metric.value < 100) {
    return 'Maintain or restore natural systems'
  }
  if (metric.ring === 'social' && metric.value < 100) {
    return 'Invest in access: housing, healthcare, energy'
  }
  if (metric.ring === 'social' && metric.value > 100) {
    return 'Sustain gains, ensure equitable distribution'
  }
  return 'Maintain current trajectory'
}

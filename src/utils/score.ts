import type { Metric } from '@/types'

/**
 * Compute doughnut score 0-100 from metrics.
 * Penalty = |value - 100|, normalized by 100.
 * Score = 100 * (1 - averagePenalty)
 */
export function computeScore(metrics: Metric[]): number {
  if (metrics.length === 0) return 0
  const totalPenalty = metrics.reduce((sum, m) => {
    const penalty = Math.abs(m.value - 100)
    return sum + Math.min(penalty / 100, 1)
  }, 0)
  const avgPenalty = totalPenalty / metrics.length
  return Math.round(Math.max(0, Math.min(100, 100 * (1 - avgPenalty))))
}

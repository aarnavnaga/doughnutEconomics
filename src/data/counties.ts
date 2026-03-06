/** County IDs for selector and leaderboard. Supports real county data later. */
export const COUNTIES = [
  { id: 'statewide', label: 'California (statewide)' },
  { id: 'Los Angeles', label: 'Los Angeles' },
  { id: 'San Diego', label: 'San Diego' },
  { id: 'Santa Clara', label: 'Santa Clara' },
  { id: 'Orange', label: 'Orange' },
  { id: 'Sacramento', label: 'Sacramento' },
  { id: 'Alameda', label: 'Alameda' },
  { id: 'San Francisco', label: 'San Francisco' },
  { id: 'Riverside', label: 'Riverside' },
  { id: 'San Bernardino', label: 'San Bernardino' },
  { id: 'Fresno', label: 'Fresno' },
  { id: 'Kern', label: 'Kern' },
  { id: 'Contra Costa', label: 'Contra Costa' },
  { id: 'Ventura', label: 'Ventura' },
]

/** Sample doughnut scores for leaderboard (replace with computed from real data) */
export const countyScores: Record<string, number> = {
  statewide: 52,
  'Santa Clara': 68,
  'San Francisco': 72,
  Alameda: 65,
  Orange: 58,
  'San Diego': 55,
  Sacramento: 54,
  'Los Angeles': 48,
  Riverside: 42,
  'San Bernardino': 40,
  Fresno: 45,
  Kern: 38,
  'Contra Costa': 62,
  Ventura: 56,
}

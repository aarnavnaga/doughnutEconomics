/** Unified metric structure for doughnut visualization */
export interface Metric {
  id: string
  label: string
  ring: 'ecological' | 'social'
  value: number // 0-200, 100 = safe threshold
  unit?: string
  description?: string
  countyValues?: Record<string, number>
  colorScaleKey?: string
}

/** Policy lever impact on a single metric */
export interface PolicyImpact {
  metricId: string
  deltaPerUnit: number // applied as sliderValue * deltaPerUnit
  direction: 'improve' | 'worsen' // improve = toward 100, worsen = away
}

/** Policy lever with optional green variant */
export interface PolicyLever {
  id: string
  label: string
  labelStudent?: string // Fun copy for Student persona
  cost: string
  description: string
  descriptionStudent?: string
  impacts: PolicyImpact[]
  greenVariant?: {
    label: string
    labelStudent?: string
    climatePenaltyReduction: number // 0-1, reduces climate impact when enabled
  }
}

export type Persona = 'policymaker' | 'student' | 'citizen'

export type QuestStep = 0 | 1 | 2 | 3 // 0 = not started, 1-3 = steps

export interface Badge {
  id: string
  label: string
  description: string
  icon: string
  threshold: { metricId?: string; value?: number; score?: number }
}

import { create } from 'zustand'
import type { Metric, Persona, QuestStep } from '@/types'
import { mockMetricsStatewide } from '@/data/mockMetrics'
import { policyLevers } from '@/data/policies'
import { computeScore } from '@/utils/score'
import { loadMetricsCsv } from '@/data/loadCsv'

export interface PolicySliderState {
  [leverId: string]: { value: number; greenEnabled: boolean }
}

interface AppState {
  // Persona & County
  persona: Persona
  setPersona: (p: Persona) => void
  selectedCounty: string
  setSelectedCounty: (c: string) => void

  // Metrics (base + computed with policy impacts)
  baseMetrics: Metric[]
  metrics: Metric[]
  setBaseMetrics: (m: Metric[]) => void
  loadFromCsv: (statewide: boolean) => Promise<void>

  // Policy levers
  policySliders: PolicySliderState
  setPolicySlider: (leverId: string, value: number, greenEnabled?: boolean) => void
  setGreenToggle: (leverId: string, enabled: boolean) => void
  resetPolicies: () => void

  // Computed
  score: number
  unlockedBadges: string[]

  // Quest
  questStep: QuestStep
  setQuestStep: (s: QuestStep) => void
  unlockedInsights: number[]

  // Apply policy impacts to base metrics
  applyPolicies: () => void
}

const initialSliders: PolicySliderState = {}
policyLevers.forEach((p) => {
  initialSliders[p.id] = { value: 0, greenEnabled: false }
})

function applyPolicyImpacts(
  base: Metric[],
  sliders: PolicySliderState,
  levers: typeof policyLevers
): Metric[] {
  const byId = new Map(base.map((m) => [m.id, { ...m }]))
  levers.forEach((lever) => {
    const state = sliders[lever.id]
    if (!state) return
    const sliderVal = state.value
    const greenReduction = lever.greenVariant && state.greenEnabled
      ? lever.greenVariant.climatePenaltyReduction
      : 0
    lever.impacts.forEach((imp) => {
      const m = byId.get(imp.metricId)
      if (!m) return
      let delta = sliderVal * imp.deltaPerUnit
      if (imp.metricId === 'climate' && greenReduction > 0) {
        delta *= 1 - greenReduction
      }
      const improve = imp.direction === 'improve'
      if (m.ring === 'ecological') {
        m.value = improve ? m.value - delta : m.value + delta
      } else {
        m.value = improve ? m.value + delta : m.value - delta
      }
      m.value = Math.max(0, Math.min(200, m.value))
    })
  })
  return Array.from(byId.values())
}

function getUnlockedBadges(metrics: Metric[], score: number): string[] {
  const badges: string[] = []
  const water = metrics.find((m) => m.id === 'water')
  if (water && water.value <= 120) badges.push('water_guardian')
  const housing = metrics.find((m) => m.id === 'housing')
  if (housing && housing.value >= 80) badges.push('housing_healer')
  const climate = metrics.find((m) => m.id === 'climate')
  if (climate && climate.value <= 110) badges.push('climate_champion')
  if (score >= 70) badges.push('doughnut_master')
  return badges
}

export const useAppStore = create<AppState>((set, get) => ({
  persona: 'policymaker',
  setPersona: (p) => set({ persona: p }),
  selectedCounty: 'statewide',
  setSelectedCounty: (c) => {
    set({ selectedCounty: c })
    get().applyPolicies()
  },

  baseMetrics: mockMetricsStatewide,
  metrics: [...mockMetricsStatewide],
  setBaseMetrics: (m) => set({ baseMetrics: m, metrics: m }),
  loadFromCsv: async (statewide) => {
    try {
      const data = await loadMetricsCsv(
        statewide ? 'metrics_statewide.csv' : 'metrics_counties.csv'
      )
      set({ baseMetrics: data, metrics: data })
      get().applyPolicies()
    } catch {
      set({ baseMetrics: mockMetricsStatewide, metrics: mockMetricsStatewide })
    }
  },

  policySliders: initialSliders,
  setPolicySlider: (leverId, value, greenEnabled) => {
    set((s) => ({
      policySliders: {
        ...s.policySliders,
        [leverId]: {
          ...s.policySliders[leverId],
          value: Math.max(0, Math.min(20, value)),
          greenEnabled: greenEnabled !== undefined ? greenEnabled : (s.policySliders[leverId]?.greenEnabled ?? false),
        },
      },
    }))
    get().applyPolicies()
  },
  setGreenToggle: (leverId: string, enabled: boolean) => {
    set((s) => ({
      policySliders: {
        ...s.policySliders,
        [leverId]: { ...s.policySliders[leverId], greenEnabled: enabled },
      },
    }))
    get().applyPolicies()
  },
  resetPolicies: () => {
    set({ policySliders: initialSliders })
    get().applyPolicies()
  },

  score: 52,
  unlockedBadges: [],

  questStep: 0,
  setQuestStep: (s) => set({ questStep: s }),
  unlockedInsights: [],

  applyPolicies: () => {
    const { baseMetrics, policySliders, selectedCounty } = get()
    let base = baseMetrics
    if (selectedCounty !== 'statewide') {
      base = baseMetrics.map((m) => {
        const cv = m.countyValues?.[selectedCounty]
        if (cv != null) return { ...m, value: cv }
        return m
      })
    }
    const metrics = applyPolicyImpacts(base, policySliders, policyLevers)
    const score = computeScore(metrics)
    const unlockedBadges = getUnlockedBadges(metrics, score)
    set({ metrics, score, unlockedBadges })
  },
}))

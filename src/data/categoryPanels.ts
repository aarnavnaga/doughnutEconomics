import type { Metric } from '@/types'

export interface CategoryItem {
  id: string
  label: string
  subMetrics: [string, string]
  metric?: Metric
}

/** Left panel categories (social foundation) */
export const LEFT_CATEGORIES: CategoryItem[] = [
  { id: 'water', label: 'WATER & SANITATION', subMetrics: ['Water Quality', 'Access'], metric: undefined },
  { id: 'food', label: 'FOOD', subMetrics: ['Food Security', 'Nutrition'], metric: undefined },
  { id: 'health', label: 'HEALTH', subMetrics: ['Healthcare Access', 'Mental Health'], metric: undefined },
  { id: 'education', label: 'EDUCATION', subMetrics: ['Quality', 'Access'], metric: undefined },
  { id: 'equity', label: 'EQUITY', subMetrics: ['Income Equality', 'Opportunity'], metric: undefined },
  { id: 'housing', label: 'HOUSING', subMetrics: ['Affordability', 'Access'], metric: undefined },
]

/** Right panel categories (ecological + more social) */
export const RIGHT_CATEGORIES: CategoryItem[] = [
  { id: 'jobs', label: 'INCOME & WORK', subMetrics: ['Living Wage', 'Safety'], metric: undefined },
  { id: 'community', label: 'SOCIAL COHESION', subMetrics: ['Community', 'Trust'], metric: undefined },
  { id: 'energy', label: 'ENERGY', subMetrics: ['Access', 'Reliability'], metric: undefined },
  { id: 'climate', label: 'CLIMATE', subMetrics: ['Emissions', 'Resilience'], metric: undefined },
  { id: 'land', label: 'LAND', subMetrics: ['Use Change', 'Habitat'], metric: undefined },
  { id: 'biodiversity', label: 'BIODIVERSITY', subMetrics: ['Species', 'Ecosystems'], metric: undefined },
]

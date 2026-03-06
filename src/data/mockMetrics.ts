import type { Metric } from '@/types'

/**
 * Base statewide metrics aligned with The California Doughnut Snapshot and Report
 * (Zenodo 17540639, Aritza & Kraus-Polk et al. 2025)
 *
 * Report findings:
 * - California falls short on 100% of social indicators
 * - Overshoots 89% of ecological indicators
 * - Average social shortfall: 34%
 * - Average ecological overshoot: 286%
 *
 * 42 indicators total: 24 social (12 categories), 18 ecological (9 categories)
 * Representative subset below for visualization.
 */
export const mockMetricsStatewide: Metric[] = [
  // ECOLOGICAL CEILING (value > 100 = overshoot; report: 89% overshoot, avg 286%)
  // Scaled to 0-200 for viz; reflects relative severity
  { id: 'climate', label: 'Climate Change', ring: 'ecological', value: 165, unit: '%', description: 'GHG emissions vs planetary boundary', colorScaleKey: 'red' },
  { id: 'nitrogen', label: 'Nitrogen Loading', ring: 'ecological', value: 145, unit: '%', description: 'Fertilizer runoff, livestock', colorScaleKey: 'orange' },
  { id: 'water', label: 'Freshwater Use', ring: 'ecological', value: 178, unit: '%', description: 'Withdrawal vs sustainable yield', colorScaleKey: 'red' },
  { id: 'ozone', label: 'Ozone Depletion', ring: 'ecological', value: 85, unit: '%', description: 'Stratospheric ozone', colorScaleKey: 'green' },
  { id: 'land', label: 'Land Use Change', ring: 'ecological', value: 155, unit: '%', description: 'Deforestation, conversion', colorScaleKey: 'orange' },
  { id: 'biodiversity', label: 'Biodiversity Loss', ring: 'ecological', value: 168, unit: '%', description: 'Species extinction rate', colorScaleKey: 'red' },
  { id: 'ocean', label: 'Ocean Acidification', ring: 'ecological', value: 95, unit: '%', description: 'CO2 absorption', colorScaleKey: 'green' },
  { id: 'air', label: 'Air Quality', ring: 'ecological', value: 142, unit: '%', description: 'PM2.5, ozone pollution', colorScaleKey: 'orange' },
  // SOCIAL FOUNDATION (value < 100 = shortfall; report: 100% shortfall, avg 34%)
  { id: 'housing', label: 'Housing', ring: 'social', value: 58, unit: '%', description: 'Affordable housing access', colorScaleKey: 'red' },
  { id: 'energy', label: 'Energy Access', ring: 'social', value: 72, unit: '%', description: 'Reliable electricity', colorScaleKey: 'yellow' },
  { id: 'health', label: 'Health', ring: 'social', value: 64, unit: '%', description: 'Healthcare access', colorScaleKey: 'orange' },
  { id: 'equity', label: 'Social Equity', ring: 'social', value: 52, unit: '%', description: 'Income equality, opportunity', colorScaleKey: 'red' },
  { id: 'education', label: 'Education', ring: 'social', value: 68, unit: '%', description: 'Quality education access', colorScaleKey: 'yellow' },
  { id: 'food', label: 'Food Security', ring: 'social', value: 78, unit: '%', description: 'Nutritional adequacy', colorScaleKey: 'yellow' },
  { id: 'jobs', label: 'Decent Work', ring: 'social', value: 62, unit: '%', description: 'Living wage, safety', colorScaleKey: 'orange' },
  { id: 'community', label: 'Community', ring: 'social', value: 70, unit: '%', description: 'Social cohesion', colorScaleKey: 'yellow' },
]

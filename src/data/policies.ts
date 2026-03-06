import type { PolicyLever } from '@/types'

/**
 * Policy levers with systems-thinking impacts.
 * Slider 0-20, delta = sliderValue * deltaPerUnit.
 * Ecological: improve = decrease value; Social: improve = increase value.
 */
export const policyLevers: PolicyLever[] = [
  {
    id: 'regenerative_ag',
    label: 'Subsidize Regenerative Agriculture',
    labelStudent: '🌱 Plant Community Gardens',
    cost: '$5B',
    description: 'Reduces nitrogen loading, improves soil carbon. Secondary: food security.',
    descriptionStudent: 'Help farmers heal the soil! Watch Nitrogen shrink!',
    impacts: [
      { metricId: 'nitrogen', deltaPerUnit: -1.2, direction: 'improve' },
      { metricId: 'land', deltaPerUnit: -0.5, direction: 'improve' },
      { metricId: 'food', deltaPerUnit: 0.8, direction: 'improve' },
    ],
  },
  {
    id: 'housing_zoning',
    label: 'Implement High-Density Zoning',
    labelStudent: '🏗️ Build Affordable Apartments',
    cost: '$12B',
    description: 'Improves housing access. Tradeoff: may increase emissions unless green.',
    descriptionStudent: 'More homes for everyone!',
    impacts: [
      { metricId: 'housing', deltaPerUnit: 1.5, direction: 'improve' },
      { metricId: 'climate', deltaPerUnit: 0.8, direction: 'worsen' },
      { metricId: 'land', deltaPerUnit: -0.3, direction: 'improve' },
    ],
    greenVariant: {
      label: 'Green Housing (solar, transit)',
      labelStudent: '✨ Green Buildings',
      climatePenaltyReduction: 0.7,
    },
  },
  {
    id: 'water_infra',
    label: 'Water Infrastructure & Recycling',
    labelStudent: '💧 Save Every Drop',
    cost: '$8B',
    description: 'Direct impact on freshwater. Secondary: reduces energy for pumping.',
    descriptionStudent: 'Fix leaks, recycle water!',
    impacts: [
      { metricId: 'water', deltaPerUnit: -1.8, direction: 'improve' },
      { metricId: 'energy', deltaPerUnit: 0.3, direction: 'improve' },
    ],
  },
  {
    id: 'wildfire_prep',
    label: 'Wildfire Prevention & Forest Mgmt',
    labelStudent: '🔥 Protect the Forests',
    cost: '$4B',
    description: 'Reduces land degradation, improves air quality. Tradeoff: prescribed burns.',
    descriptionStudent: 'Healthy forests = healthy air!',
    impacts: [
      { metricId: 'land', deltaPerUnit: -0.6, direction: 'improve' },
      { metricId: 'air', deltaPerUnit: -0.9, direction: 'improve' },
      { metricId: 'biodiversity', deltaPerUnit: -0.4, direction: 'improve' },
    ],
  },
  {
    id: 'healthcare_expand',
    label: 'Expand Healthcare Access',
    labelStudent: '🏥 Healthcare for All',
    cost: '$15B',
    description: 'Direct health improvement. Secondary: community resilience.',
    descriptionStudent: 'Everyone deserves care!',
    impacts: [
      { metricId: 'health', deltaPerUnit: 1.2, direction: 'improve' },
      { metricId: 'equity', deltaPerUnit: 0.5, direction: 'improve' },
      { metricId: 'community', deltaPerUnit: 0.4, direction: 'improve' },
    ],
  },
  {
    id: 'clean_energy',
    label: 'Accelerate Clean Energy Transition',
    labelStudent: '⚡ Go Solar & Wind',
    cost: '$20B',
    description: 'Decarbonize grid. Improves climate, air. Tradeoff: land use for solar.',
    descriptionStudent: 'Sun + wind = clean power!',
    impacts: [
      { metricId: 'climate', deltaPerUnit: -1.5, direction: 'improve' },
      { metricId: 'air', deltaPerUnit: -0.8, direction: 'improve' },
      { metricId: 'energy', deltaPerUnit: 0.6, direction: 'improve' },
      { metricId: 'land', deltaPerUnit: 0.4, direction: 'worsen' },
    ],
  },
]

export const METRIC_ICONS: Record<string, string> = {
  climate: '🌡️',
  nitrogen: '🌱',
  water: '💧',
  ozone: '☀️',
  land: '🌲',
  biodiversity: '🦋',
  ocean: '🌊',
  air: '💨',
  housing: '🏠',
  energy: '⚡',
  health: '🏥',
  equity: '⚖️',
  education: '📚',
  food: '🍎',
  jobs: '💼',
  community: '👥',
}

export const METRIC_SYNOPSES: Record<string, string> = {
  climate:
    'California emits far more greenhouse gases than the planet can absorb. Wildfires, drought, and heat waves are intensifying. We need rapid decarbonization—clean energy, electric vehicles, and sustainable land use—to bring emissions within safe limits.',
  nitrogen:
    'Excess nitrogen from fertilizers and livestock runs off into waterways, causing algal blooms and dead zones. Regenerative agriculture, reduced fertilizer use, and better manure management can restore balance.',
  water:
    'California withdraws more freshwater than nature can replenish. Aquifers are overdrawn, rivers run dry, and millions face water insecurity. Conservation, recycling, and sustainable groundwater management are critical.',
  ozone:
    'Stratospheric ozone is recovering thanks to global action. California must continue avoiding ozone-depleting chemicals and support international agreements.',
  land:
    'Forests are being cleared, wetlands drained, and natural habitats converted for development. Protecting and restoring ecosystems—especially for carbon and biodiversity—is essential.',
  biodiversity:
    'Species are disappearing at an alarming rate. Habitat loss, climate change, and pollution threaten California\'s unique wildlife. We need protected areas, wildlife corridors, and reduced pesticide use.',
  ocean:
    'The ocean absorbs CO₂, becoming more acidic and harming shellfish and coral. Cutting emissions and protecting coastal ecosystems can help marine life adapt.',
  air:
    'PM2.5 and ozone pollution harm lungs and hearts, especially in low-income communities near freeways and industry. Cleaner vehicles, industry, and wildfire prevention save lives.',
  housing:
    'California has a severe affordable housing shortage. Millions pay more than half their income on rent. Building more homes—especially near transit—and protecting tenants can close the gap.',
  energy:
    'Some communities lack reliable, affordable electricity. Expanding clean energy access, rooftop solar, and grid resilience ensures everyone can power their lives.',
  health:
    'Healthcare is costly and uneven. Many lack insurance, mental health care, or nearby clinics. Expanding Medi-Cal, community health centers, and preventive care improves outcomes.',
  equity:
    'Inequality is stark: the richest have far more income, wealth, and opportunity. Progressive taxes, living wages, and investments in underserved communities can level the playing field.',
  education:
    'Schools are underfunded and outcomes vary by zip code. Quality preschool, well-paid teachers, and support for English learners and students with disabilities close achievement gaps.',
  food:
    'Food insecurity affects millions. High costs, food deserts, and climate threats to agriculture limit access to nutritious food. Supporting local farms, SNAP, and school meals helps.',
  jobs:
    'Many jobs pay poverty wages with little security. Raising the minimum wage, strengthening labor rights, and supporting unions ensure dignified work for all.',
  community:
    'Social isolation and distrust are growing. Investing in parks, libraries, community centers, and civic engagement builds the connections that make neighborhoods thrive.',
}

export function getMetricIcon(id: string): string {
  return METRIC_ICONS[id] ?? '📊'
}

export function getMetricSynopsis(id: string): string {
  return METRIC_SYNOPSES[id] ?? 'No detailed synopsis available.'
}

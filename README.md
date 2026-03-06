# California Doughnut Navigator

An interactive, gamified web dashboard that turns the California Doughnut report into an "X-ray machine" for ecological overshoot and social shortfall.

**Data source:** [The California Doughnut Snapshot and Report](https://zenodo.org/records/17540639) (Aritza & Kraus-Polk et al., 2025). California falls short on 100% of social indicators and overshoots 89% of ecological indicators.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- **Two-ring Doughnut Chart**: Ecological ceiling (outer) and social foundation (inner)
  - Overshoot (ecological > 100): wedges extend outward
  - Shortfall (social < 100): wedges collapse inward
  - Safe zone band (green) between rings
- **Policy Sandbox**: 6 policy levers with sliders (0–20)
  - Each lever impacts 2–4 metrics (systems thinking)
  - Green variant toggle for housing (reduces climate penalty)
- **Personas**: Policymaker (technical), Student (gamified), Citizen (community)
- **County Leaderboard**: Select county, view ranking by doughnut score
- **Quest Mode**: 3-step guided tour (Water → Housing → Wildfire)
- **Badges**: Unlock "Water Guardian", "Housing Healer", etc. when thresholds are met

## Data Pipeline

### Swapping in Real Data

1. **CSV format** (place in `public/data/`):
   - `metrics_statewide.csv`: columns `id`, `label`, `ring`, `value`, `unit`, `description`
   - `metrics_counties.csv`: same + county columns (e.g. `Los Angeles`, `San Diego`)

2. **Example row**:
   ```csv
   id,label,ring,value,unit,Los Angeles,San Diego
   water,Freshwater Use,ecological,165,%,170,160
   ```

3. **Load on startup**: The app loads `metrics_counties.csv` by default. To load statewide only, call `loadFromCsv(true)`.

### Mock Data

- `src/data/mockMetrics.ts`: 16 metrics (8 ecological, 8 social)
- `src/data/policies.ts`: Policy lever definitions and impact multipliers

## File Structure

```
src/
├── components/
│   ├── DoughnutChart.tsx   # D3 radial wedges, tooltips
│   ├── Tooltip.tsx
│   ├── ControlPanel.tsx    # Policy sliders
│   ├── PersonaSwitch.tsx
│   ├── CountyLeaderboard.tsx
│   ├── QuestMode.tsx
│   └── InsightCards.tsx     # Badges
├── data/
│   ├── mockMetrics.ts
│   ├── policies.ts
│   ├── counties.ts
│   └── loadCsv.ts          # PapaParse CSV loader
├── store/
│   └── useAppStore.ts      # Zustand state
├── utils/
│   ├── score.ts            # 0–100 doughnut score
│   └── format.ts
└── types.ts
public/data/
├── metrics_statewide.csv
└── metrics_counties.csv
```

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- D3.js (arcs, scales)
- PapaParse (CSV)
- Zustand (state)

## Score Function

For each metric: `penalty = |value - 100| / 100`
Overall: `score = 100 * (1 - averagePenalty)` (clamped 0–100)

## Demo Script (30 seconds)

1. **View the doughnut** – Red = overshoot/shortfall, green = safe
2. **Drag sliders** – Watch wedges and score change
3. **Switch persona** – Student shows emojis and score
4. **Start Quest** – Follow the 3-step guide
5. **Select county** – Compare leaderboard
6. **Reset Simulation** – Back to baseline

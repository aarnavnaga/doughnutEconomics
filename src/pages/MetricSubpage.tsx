import { getMetricIcon, getMetricSynopsis } from '@/data/metricDetails'
import { useAppStore } from '@/store/useAppStore'
import { getInterpretation } from '@/utils/format'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const THEMES: Record<string, { grad: string; bar: string; accent: string }> = {
  food: { grad: 'from-amber-900 via-orange-900 to-red-950', bar: 'bg-amber-500', accent: 'text-amber-400' },
  education: { grad: 'from-indigo-950 via-blue-950 to-slate-950', bar: 'bg-indigo-500', accent: 'text-indigo-400' },
  health: { grad: 'from-teal-950 via-emerald-950 to-green-950', bar: 'bg-teal-500', accent: 'text-teal-400' },
  housing: { grad: 'from-stone-900 via-amber-950 to-yellow-950', bar: 'bg-stone-400', accent: 'text-amber-400' },
  jobs: { grad: 'from-blue-950 via-slate-950 to-gray-950', bar: 'bg-blue-500', accent: 'text-blue-400' },
  community: { grad: 'from-pink-950 via-rose-950 to-red-950', bar: 'bg-rose-500', accent: 'text-rose-400' },
  equity: { grad: 'from-purple-950 via-violet-950 to-fuchsia-950', bar: 'bg-violet-500', accent: 'text-violet-400' },
  energy: { grad: 'from-yellow-950 via-amber-950 to-orange-950', bar: 'bg-yellow-500', accent: 'text-yellow-400' },
  climate: { grad: 'from-red-950 via-orange-950 to-amber-950', bar: 'bg-red-500', accent: 'text-red-400' },
  water: { grad: 'from-cyan-950 via-blue-950 to-sky-950', bar: 'bg-cyan-500', accent: 'text-cyan-400' },
  land: { grad: 'from-green-950 via-emerald-950 to-teal-950', bar: 'bg-green-500', accent: 'text-green-400' },
  biodiversity: { grad: 'from-lime-950 via-green-950 to-emerald-950', bar: 'bg-lime-500', accent: 'text-lime-400' },
  ocean: { grad: 'from-blue-950 via-cyan-950 to-teal-950', bar: 'bg-blue-500', accent: 'text-blue-400' },
  air: { grad: 'from-sky-950 via-blue-950 to-indigo-950', bar: 'bg-sky-500', accent: 'text-sky-400' },
  nitrogen: { grad: 'from-lime-950 via-green-950 to-yellow-950', bar: 'bg-lime-500', accent: 'text-lime-400' },
  ozone: { grad: 'from-violet-950 via-indigo-950 to-blue-950', bar: 'bg-violet-500', accent: 'text-violet-400' },
}

const RECS: Record<string, string[]> = {
  housing: ['Build 2.5M homes by 2030', 'Expand rent stabilization', 'Transit-oriented zoning'],
  energy: ['100% clean grid by 2035', 'Community solar programs', 'Weatherize low-income homes'],
  health: ['Expand Medi-Cal to all', 'Fund community clinics', 'Mental health parity'],
  equity: ['Progressive tax reform', 'Minimum wage $25/hr', 'Invest in underserved areas'],
  education: ['Universal pre-K', 'Teacher salary increase', 'Free community college'],
  food: ['Double SNAP benefits', 'Farm-to-school programs', 'Urban farming incentives'],
  jobs: ['Green jobs pipeline', 'Strengthen labor rights', 'Paid family leave'],
  community: ['Fund public spaces', 'Civic engagement grants', 'Community land trusts'],
  climate: ['Cut emissions 80% by 2035', 'EV mandate', 'Carbon pricing'],
  nitrogen: ['Regenerative ag subsidies', 'Fertilizer caps', 'Wetland restoration'],
  water: ['Groundwater banking', 'Recycled water expansion', 'Drought-resilient crops'],
  ozone: ['Continue CFC bans', 'Monitor recovery', 'Support Montreal Protocol'],
  land: ['Protect 30% by 2030', 'Reforestation programs', 'Urban growth boundaries'],
  biodiversity: ['Wildlife corridors', 'Pesticide reduction', 'Endangered species funding'],
  ocean: ['Marine protected areas', 'Reduce runoff', 'Kelp forest restoration'],
  air: ['Zero-emission zones', 'Wildfire prevention', 'Industrial scrubbers'],
}

export function MetricSubpage() {
  const { metricId } = useParams<{ metricId: string }>()
  const navigate = useNavigate()
  const metrics = useAppStore((s) => s.metrics)
  const loadFromCsv = useAppStore((s) => s.loadFromCsv)
  const metric = metrics.find((m) => m.id === metricId)

  useEffect(() => {
    if (metrics.length === 0) loadFromCsv(false).catch(() => {})
  }, [metrics.length, loadFromCsv])

  if (!metric) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <button onClick={() => navigate('/')} className="text-white/60 hover:text-white text-sm">← Back to doughnut</button>
      </div>
    )
  }

  const theme = THEMES[metric.id] ?? THEMES.food
  const synopsis = getMetricSynopsis(metric.id)
  const interpretation = getInterpretation(metric)
  const icon = getMetricIcon(metric.id)
  const recs = RECS[metric.id] ?? ['Invest in research', 'Community engagement', 'Policy reform']

  const isSocial = metric.ring === 'social'
  const barPct = isSocial ? metric.value : Math.min(200, metric.value) / 2
  const severity = isSocial ? Math.max(0, 100 - metric.value) : Math.max(0, metric.value - 100)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.grad} overflow-y-auto`}>
      {/* back button */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back
      </motion.button>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        {/* hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-7xl block mb-4">{icon}</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">{metric.label}</h1>
          <p className="text-white/40 mt-2 text-sm tracking-wide uppercase">{metric.ring} · California</p>
        </motion.div>

        {/* stat bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-16"
        >
          <div className="flex items-end justify-between mb-2">
            <span className={`text-3xl font-bold ${theme.accent}`}>{metric.value}%</span>
            <span className="text-sm text-white/40">{interpretation} · {severity > 0 ? `${severity}% ${isSocial ? 'below safe' : 'above safe'}` : 'Within safe zone'}</span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${barPct}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${theme.bar}`}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-white/25">
            <span>0%</span>
            <span className="text-white/40">Safe threshold: 100%</span>
            <span>{isSocial ? '100%' : '200%'}</span>
          </div>
        </motion.div>

        {/* synopsis */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-12"
        >
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">The Issue</h2>
          <p className="text-white/80 text-base leading-relaxed">{synopsis}</p>
        </motion.div>

        {/* recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">What California Can Do</h2>
          <div className="space-y-3">
            {recs.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${theme.bar} text-white`}>{i + 1}</span>
                <span className="text-white/70 text-sm leading-relaxed">{r}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ambient icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center text-[120px] select-none"
        >
          {icon}
        </motion.div>
      </div>
    </div>
  )
}

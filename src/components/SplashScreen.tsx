import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface Props {
  onFinish: () => void
}

const METRIC_ICONS = ['🏠', '🏥', '📚', '🍎', '⚖️', '💼', '⚡', '👥', '🌊', '🌲', '🦎', '💨']
const RING_SEGMENTS = 12
const INNER_R = 130
const OUTER_R = 158

function buildArcPath(i: number, total: number, rIn: number, rOut: number): string {
  const gap = 0.04
  const a0 = (i / total) * Math.PI * 2 - Math.PI / 2 + gap
  const a1 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - gap
  const cx = 200, cy = 200
  return [
    `M ${cx + rIn * Math.cos(a0)} ${cy + rIn * Math.sin(a0)}`,
    `A ${rIn} ${rIn} 0 0 1 ${cx + rIn * Math.cos(a1)} ${cy + rIn * Math.sin(a1)}`,
    `L ${cx + rOut * Math.cos(a1)} ${cy + rOut * Math.sin(a1)}`,
    `A ${rOut} ${rOut} 0 0 0 ${cx + rOut * Math.cos(a0)} ${cy + rOut * Math.sin(a0)}`,
    'Z',
  ].join(' ')
}

const SEG_COLORS = [
  '#f97316', '#ea580c', '#fb923c', '#22c55e', '#16a34a', '#34d399',
  '#ef4444', '#dc2626', '#f87171', '#3b82f6', '#6366f1', '#a855f7',
]

export function SplashScreen({ onFinish }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 60 + Math.random() * 40,
        size: Math.random() * 3 + 1.5,
        dur: 5 + Math.random() * 6,
        delay: Math.random() * 4,
      })),
    [],
  )

  const orbitIcons = useMemo(
    () =>
      METRIC_ICONS.map((icon, i) => {
        const angle = (i / METRIC_ICONS.length) * Math.PI * 2 - Math.PI / 2
        const r = 195
        return { icon, x: 200 + r * Math.cos(angle), y: 200 + r * Math.sin(angle), i }
      }),
    [],
  )

  return (
    <motion.div
      key="splash"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #1e293b 0%, #0f172a 45%, #020617 100%)',
      }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── floating particles (purely decorative) ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(52,211,153,0.5)',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.7, 0], y: -300 }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ── repeating pulse rings (pointer-events-none!) ── */}
      {[0, 0.8, 1.6, 2.4].map((delay, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            border: `1px solid rgba(52,211,153,${0.18 - i * 0.04})`,
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: [0, 480 + i * 80],
            height: [0, 480 + i * 80],
            opacity: [0, 0.25, 0],
          }}
          transition={{
            duration: 3.5,
            delay,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ── rotating SVG doughnut preview ── */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0, rotate: 0, scale: 0.85 }}
        animate={{ opacity: 0.22, rotate: 360, scale: 1 }}
        transition={{
          opacity: { delay: 0.4, duration: 1.2 },
          scale: { delay: 0.4, duration: 1.2, ease: 'easeOut' },
          rotate: { duration: 80, repeat: Infinity, ease: 'linear' },
        }}
      >
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          className="pointer-events-none"
        >
          <defs>
            <filter id="seg-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: RING_SEGMENTS }, (_, i) => (
            <motion.path
              key={i}
              d={buildArcPath(i, RING_SEGMENTS, INNER_R, OUTER_R)}
              fill={SEG_COLORS[i % SEG_COLORS.length]}
              filter="url(#seg-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.55] }}
              transition={{ delay: 0.5 + i * 0.08, duration: 1.2, ease: 'easeOut' }}
            />
          ))}
          {/* inner thin ring */}
          <circle
            cx="200"
            cy="200"
            r={INNER_R - 4}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>

      {/* ── orbiting metric icons ── */}
      <div
        className="absolute pointer-events-none"
        style={{ width: 400, height: 400 }}
      >
        {orbitIcons.map(({ icon, x, y, i }) => (
          <motion.span
            key={i}
            className="absolute text-xl pointer-events-none"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%,-50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0.35], scale: [0, 1.15, 1] }}
            transition={{
              delay: 1.2 + i * 0.08,
              duration: 0.7,
              ease: 'backOut',
            }}
          >
            {icon}
          </motion.span>
        ))}
      </div>

      {/* ── text content layer (z-10, interactive) ── */}
      <motion.div className="relative z-10 flex flex-col items-center">
        {/* kicker */}
        <motion.p
          className="text-[11px] font-bold tracking-[0.5em] uppercase text-emerald-400/50 mb-5"
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          The State of California
        </motion.p>

        {/* main title — gradient + shimmer */}
        <motion.h1
          className="text-6xl md:text-7xl font-black tracking-tight text-center shimmer-text"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #22c55e, #ffffff, #f97316, #ffffff, #22c55e)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          The Doughnut
        </motion.h1>

        {/* divider line */}
        <motion.div
          className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mt-5"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />

        {/* subtitle */}
        <motion.p
          className="text-white/30 mt-5 text-sm md:text-base text-center max-w-md leading-relaxed tracking-wide"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          An interactive look at how California meets everyone&apos;s needs
          within the planet&apos;s limits
        </motion.p>

        {/* stats row */}
        <motion.div
          className="flex items-center gap-10 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
        >
          {[
            { value: '8', label: 'Social Metrics', color: 'text-orange-400' },
            { value: '8', label: 'Eco Metrics', color: 'text-red-400' },
            { value: '200+', label: 'Data Points', color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.12 }}
            >
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA button — glowing, clearly interactive */}
        <motion.button
          className="relative mt-14 group cursor-pointer focus:outline-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          onClick={onFinish}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          {/* glow backdrop */}
          <span className="absolute -inset-3 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/35 transition-all duration-500 pointer-events-none glow-pulse" />
          {/* button face */}
          <span className="relative flex items-center gap-2 px-10 py-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm text-emerald-300 text-sm font-bold tracking-[0.2em] uppercase group-hover:border-emerald-400/60 group-hover:bg-emerald-500/20 group-hover:text-emerald-200 transition-all duration-300">
            Explore California
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M1 7h11M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.button>
      </motion.div>

      {/* ── bottom credit ── */}
      <motion.p
        className="absolute bottom-5 text-[9px] text-white/12 tracking-widest pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        Based on Kate Raworth&apos;s Doughnut Economics
      </motion.p>
    </motion.div>
  )
}

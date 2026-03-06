import type { Persona } from '@/types'

interface PersonaSwitchProps {
  value: Persona
  onChange: (p: Persona) => void
}

const OPTIONS: { value: Persona; label: string; icon: string }[] = [
  { value: 'policymaker', label: 'Policymaker', icon: '🏛️' },
  { value: 'student', label: 'Student', icon: '🎮' },
  { value: 'citizen', label: 'Citizen', icon: '🏡' },
]

export function PersonaSwitch({ value, onChange }: PersonaSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-stone-500">I'm a</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Persona)}
        className="px-3 py-2 text-sm font-medium text-stone-700 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-300 cursor-pointer"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.icon} {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

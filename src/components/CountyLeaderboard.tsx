import { COUNTIES, countyScores } from '@/data/counties'
import { useAppStore } from '@/store/useAppStore'

export function CountyLeaderboard() {
  const { selectedCounty, setSelectedCounty } = useAppStore()

  const ranked = COUNTIES.map((c) => ({ ...c, score: countyScores[c.id] ?? 0 }))
    .filter((c) => c.id !== 'statewide')
    .sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-stone-800">County Leaderboard</h3>
      <select
        value={selectedCounty}
        onChange={(e) => setSelectedCounty(e.target.value)}
        className="w-full px-3 py-2 text-sm font-medium text-stone-700 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-300"
      >
        {COUNTIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="text-left py-2 font-medium text-stone-600">#</th>
              <th className="text-left py-2 font-medium text-stone-600">County</th>
              <th className="text-right py-2 font-medium text-stone-600">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((c, i) => (
              <tr
                key={c.id}
                className={`border-b border-stone-100 ${c.id === selectedCounty ? 'bg-stone-50' : ''}`}
              >
                <td className="py-2 text-stone-500">{i + 1}</td>
                <td className="py-2 font-medium text-stone-800">{c.label}</td>
                <td className="py-2 text-right font-medium text-stone-700">{c.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

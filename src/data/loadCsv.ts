import Papa from 'papaparse'
import type { Metric } from '@/types'

export interface CsvRow {
  id: string
  label: string
  ring: 'ecological' | 'social'
  value: string
  unit?: string
  description?: string
  [key: string]: string | undefined // county columns
}

/**
 * Load and parse a metrics CSV from /public/data/.
 * Expected columns: id, label, ring, value, unit?, description?, [county_*]?
 */
export async function loadMetricsCsv(filename: string): Promise<Metric[]> {
  const res = await fetch(`/data/${filename}`)
  const text = await res.text()
  const { data } = Papa.parse<CsvRow>(text, { header: true, skipEmptyLines: true })
  return data.map((row) => {
    const value = parseFloat(row.value) || 0
    const countyValues: Record<string, number> = {}
    Object.keys(row).forEach((k) => {
      if (!['id', 'label', 'ring', 'value', 'unit', 'description'].includes(k) && row[k]) {
        const v = parseFloat(row[k] as string)
        if (!isNaN(v)) countyValues[k] = Math.max(0, Math.min(200, v))
      }
    })
    return {
      id: row.id,
      label: row.label,
      ring: row.ring as 'ecological' | 'social',
      value: Math.max(0, Math.min(200, value)),
      unit: row.unit,
      description: row.description,
      countyValues: Object.keys(countyValues).length > 0 ? countyValues : undefined,
    }
  })
}

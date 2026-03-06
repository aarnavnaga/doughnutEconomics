import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { countyScores } from '@/data/counties'

interface CountyChoroplethProps {
  selectedCounty: string
  onSelectCounty: (name: string) => void
  width?: number
  height?: number
}

export function CountyChoropleth({
  selectedCounty,
  onSelectCounty,
  width = 280,
  height = 320,
}: CountyChoroplethProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{ name: string; score: number; x: number; y: number } | null>(null)
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null)

  useEffect(() => {
    fetch('/california-counties.geojson')
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => setGeoData(null))
  }, [])

  useEffect(() => {
    if (!svgRef.current || !geoData) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const projection = d3.geoMercator().fitSize([width, height], geoData)
    const pathGen = d3.geoPath().projection(projection)

    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([30, 75])

    const g = svg.attr('width', width).attr('height', height).append('g')

    g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', pathGen as (d: GeoJSON.Feature) => string)
      .attr('fill', (d) => {
        const name = (d.properties as { name?: string }).name ?? ''
        const score = countyScores[name] ?? 50
        return colorScale(score)
      })
      .attr('stroke', (d) => {
        const name = (d.properties as { name?: string }).name ?? ''
        return name === selectedCounty ? '#57534e' : '#e7e5e4'
      })
      .attr('stroke-width', (d) => {
        const name = (d.properties as { name?: string }).name ?? ''
        return name === selectedCounty ? 2.5 : 0.5
      })
      .attr('cursor', 'pointer')
      .attr('rx', 2)
      .on('mouseover', function (event, d) {
        const name = (d.properties as { name?: string }).name ?? ''
        const score = countyScores[name] ?? 50
        d3.select(this).attr('opacity', 0.9)
        setTooltip({ name, score, x: (event as MouseEvent).offsetX, y: (event as MouseEvent).offsetY })
      })
      .on('mousemove', (event) => {
        setTooltip((t) => (t ? { ...t, x: (event as MouseEvent).offsetX, y: (event as MouseEvent).offsetY } : null))
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1)
        setTooltip(null)
      })
      .on('click', (_, d) => {
        const name = (d.properties as { name?: string }).name ?? ''
        onSelectCounty(name)
      })
  }, [geoData, width, height, selectedCounty, onSelectCounty])

  return (
    <div className="relative">
      <h3 className="text-base font-medium text-stone-800 mb-2">County Map</h3>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <svg ref={svgRef} className="block w-full" />
      </motion.div>
      {tooltip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute z-10 bg-white/95 backdrop-blur px-3 py-2 shadow-md text-sm font-medium text-stone-700 pointer-events-none"
          style={{ left: tooltip.x + 8, top: tooltip.y + 8 }}
        >
          {tooltip.name}: <span className="text-stone-900">{tooltip.score}</span>
        </motion.div>
      )}
    </div>
  )
}

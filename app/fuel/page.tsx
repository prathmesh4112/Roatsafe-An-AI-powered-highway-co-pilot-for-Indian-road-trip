'use client'

import { useState } from 'react'
import {
  Fuel,
  Zap,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'
import { StopCard } from '@/components/stops/stop-card'

export default function FuelStationsPage() {
  const { origin, destination, fuel, setFuel, intelData, loading, fetchRouteData } = useRoute()
  const [activeCategory, setActiveCategory] = useState<'all' | 'ev' | 'fuel'>('all')
  const [searchFilter, setSearchFilter] = useState('')

  const stops = (intelData?.stops || []).filter((s) => s.category === 'fuel' || s.category === 'ev')

  const filteredStops = stops.filter((s) => {
    if (activeCategory === 'ev' && s.category !== 'ev') return false
    if (activeCategory === 'fuel' && s.category !== 'fuel') return false
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">VERIFIED ENERGY RADAR</p>
          <h1>Fuel & EV Charging Stations</h1>
          <p className="subhead">
            Real-time operating hours, pressure diagnostics, and EV supercharger availability along <strong>{origin} → {destination}</strong>.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => fetchRouteData(origin, destination, fuel)}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Scanning SerpApi Maps...' : 'Re-scan Stations'}
        </button>
      </div>

      {/* FILTER & POWERTRAIN SELECTOR */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`stop-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Stations
          </button>
          <button
            className={`stop-filter-btn ${activeCategory === 'ev' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ev')}
          >
            <Zap size={13} /> ⚡ EV Superchargers (50kW+)
          </button>
          <button
            className={`stop-filter-btn ${activeCategory === 'fuel' ? 'active' : ''}`}
            onClick={() => setActiveCategory('fuel')}
          >
            <Fuel size={13} /> CNG & Petrol Pumps
          </button>
        </div>

        <div className="field-input-box" style={{ minWidth: '220px', background: 'var(--surface)', padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--line)' }}>
          <Search size={14} style={{ marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Search station or brand..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* STATIONS GRID */}
      <div className="stops-grid">
        {filteredStops.length > 0 ? (
          filteredStops.map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <Fuel size={32} color="#55d7c0" style={{ margin: '0 auto 10px' }} />
            <h4>No stations found matching filter</h4>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Try selecting 'All Stations' or clearing the search query.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

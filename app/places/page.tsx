'use client'

import { useState } from 'react'
import {
  Sparkles,
  Utensils,
  HeartPulse,
  RefreshCw,
  Search,
  ShieldCheck,
  Coffee,
  Wrench,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'
import { StopCard } from '@/components/stops/stop-card'

export default function PlacesPage() {
  const { origin, destination, intelData, loading, fetchRouteData, fuel } = useRoute()
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'emergency'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stops = (intelData?.stops || []).filter((s) => s.category === 'food' || s.category === 'emergency')

  const filteredStops = stops.filter((s) => {
    if (activeCategory === 'food' && s.category !== 'food') return false
    if (activeCategory === 'emergency' && s.category !== 'emergency') return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">HIGHWAY HOSPITALITY & SAFETY</p>
          <h1>Highway Dhabas & Emergency Care</h1>
          <p className="subhead">
            Top-rated family rest stops, clean washrooms, 24/7 highway trauma care, and emergency mechanics along <strong>{origin} → {destination}</strong>.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => fetchRouteData(origin, destination, fuel)}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Scanning Places...' : 'Re-scan Places'}
        </button>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`stop-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Places
          </button>
          <button
            className={`stop-filter-btn ${activeCategory === 'food' ? 'active' : ''}`}
            onClick={() => setActiveCategory('food')}
          >
            <Utensils size={13} /> 🍽️ Dhabas & Food Courts
          </button>
          <button
            className={`stop-filter-btn ${activeCategory === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveCategory('emergency')}
          >
            <HeartPulse size={13} /> 🏥 Emergency Medical & Trauma
          </button>
        </div>

        <div className="field-input-box" style={{ minWidth: '220px', background: 'var(--surface)', padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--line)' }}>
          <Search size={14} style={{ marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Search restaurant or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* PLACES GRID */}
      <div className="stops-grid">
        {filteredStops.length > 0 ? (
          filteredStops.map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <Utensils size={32} color="#55d7c0" style={{ margin: '0 auto 10px' }} />
            <h4>No pitstops found matching filter</h4>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Select 'All Places' to view all highway hospitality and emergency services.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

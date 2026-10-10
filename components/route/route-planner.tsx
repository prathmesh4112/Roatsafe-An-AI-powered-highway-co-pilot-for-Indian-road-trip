'use client'

import { useState } from 'react'
import { MapPin, Search, ArrowRight, Fuel, ShieldCheck, RefreshCw } from 'lucide-react'
import { useRoute } from '@/lib/route-context'

const PRESET_CORRIDORS = [
  { from: 'Pune', to: 'Goa', label: 'Pune → Goa' },
  { from: 'Mumbai', to: 'Pune', label: 'Mumbai → Pune' },
  { from: 'Delhi', to: 'Jaipur', label: 'Delhi → Jaipur' },
  { from: 'Bangalore', to: 'Coorg', label: 'Bangalore → Coorg' },
  { from: 'Chandigarh', to: 'Manali', label: 'Chandigarh → Manali' },
]

export function RoutePlanner() {
  const {
    origin,
    destination,
    fuel,
    loading,
    setOrigin,
    setDestination,
    setFuel,
    fetchRouteData,
    handleSwap,
    handlePresetClick,
  } = useRoute()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination.trim()) return
    fetchRouteData(origin, destination, fuel)
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <h3>Trip Route Planner</h3>
          <p>Enter any highway corridor or pick a popular route below.</p>
        </div>
        <span className="secure-note">
          <ShieldCheck size={14} /> SerpApi Live Multi-Engine Active
        </span>
      </div>

      {/* CORRIDOR PRESETS */}
      <div className="corridor-presets">
        {PRESET_CORRIDORS.map((corridor) => (
          <button
            key={corridor.label}
            className={`preset-btn ${origin === corridor.from && destination === corridor.to ? 'active' : ''}`}
            onClick={() => handlePresetClick(corridor.from, corridor.to)}
          >
            {corridor.label}
          </button>
        ))}
      </div>

      {/* PLAN CARD FORM */}
      <form onSubmit={handleSubmit} className="plan-card">
        <div className="field">
          <label><MapPin size={13} /> FROM</label>
          <div className="field-input-box">
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Departure city"
            />
            <Search size={14} />
          </div>
        </div>

        <button
          type="button"
          className="swap-btn"
          onClick={handleSwap}
          title="Swap origin and destination"
        >
          <ArrowRight size={14} />
        </button>

        <div className="field">
          <label><MapPin size={13} /> TO</label>
          <div className="field-input-box">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination city"
            />
            <Search size={14} />
          </div>
        </div>

        <div className="field small-field">
          <label><Fuel size={13} /> FUEL / POWERTRAIN</label>
          <div className="fuel-options">
            {['CNG', 'Petrol', 'EV'].map((x) => (
              <button
                type="button"
                key={x}
                className={fuel === x ? 'fuel active' : 'fuel'}
                onClick={() => {
                  setFuel(x)
                  fetchRouteData(origin, destination, x)
                }}
              >
                {x === 'EV' ? '⚡ EV' : x}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="plan-arrow"
          disabled={loading}
          title="Plan Route with SerpApi"
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  )
}

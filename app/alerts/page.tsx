'use client'

import { useState } from 'react'
import {
  Bell,
  TriangleAlert,
  Wind,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CloudRain,
  ExternalLink,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'
import { AlertCard } from '@/components/alerts/alert-card'

export default function AlertsPage() {
  const { origin, destination, intelData, loading, fetchRouteData, fuel } = useRoute()
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'advisory'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const alerts = intelData?.alerts || []

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q) ||
        (a.location && a.location.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">HIGHWAY HAZARD INTELLIGENCE</p>
          <h1>Live Road & Weather Alerts</h1>
          <p className="subhead">
            Real-time highway blockages, landslide advisories, and weather alerts for <strong>{origin} → {destination}</strong>.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => fetchRouteData(origin, destination, fuel)}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Scanning Feeds...' : 'Sync SerpApi News'}
        </button>
      </div>

      {/* WEATHER WAYPOINT RADAR */}
      {intelData?.weather && (
        <div style={{ marginBottom: '24px' }}>
          <div className="section-heading" style={{ margin: '0 0 12px' }}>
            <div>
              <h3>Micro-Climate Waypoint Radar</h3>
              <p>Forecasts along high-elevation ghats and coastal segments.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {intelData.weather.map((w, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: '#1b3839',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#55d7c0',
                  }}
                >
                  <CloudRain size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{w.location}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#edf4f3', marginTop: '2px' }}>
                    {w.condition} · {w.temp}
                  </div>
                  <div style={{ fontSize: '10px', color: '#7ba49b', marginTop: '2px' }}>
                    Rain: {w.rainChance} · Wind: {w.wind}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px', alignItems: 'center' }}>
        <div className="field-input-box" style={{ flex: 1, minWidth: '220px', background: 'var(--surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)' }}>
          <Search size={14} style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search alerts by landmark, highway, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'critical', 'warning', 'advisory'] as const).map((s) => (
            <button
              key={s}
              className={`preset-btn ${severityFilter === s ? 'active' : ''}`}
              onClick={() => setSeverityFilter(s)}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ALERTS LIST */}
      <div className="panel" style={{ padding: '20px' }}>
        <div className="panel-header" style={{ marginBottom: '14px' }}>
          <div>
            <h3>Active Incident Stream ({filteredAlerts.length})</h3>
            <p>Verified against local news, meteorological departments, and traffic authority feeds.</p>
          </div>
          <span className="checked"><span /> Live sync</span>
        </div>

        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>
            <ShieldCheck size={32} color="#55d7c0" style={{ margin: '0 auto 10px' }} />
            <h4>No active incidents matching criteria</h4>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Corridor traffic and weather conditions are clear.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { CloudRain, Sun, Wind, Eye, ShieldCheck, TriangleAlert } from 'lucide-react'
import { SerpWeatherPoint } from '@/lib/serpapi'

interface WeatherClearanceProps {
  weatherPoints: SerpWeatherPoint[];
  origin: string;
  destination: string;
}

export function WeatherClearance({ weatherPoints, origin, destination }: WeatherClearanceProps) {
  if (!weatherPoints || weatherPoints.length === 0) return null

  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="section-heading" style={{ margin: '0 0 12px' }}>
        <div>
          <h3>Proactive Corridor Weather & Ghat Clearance</h3>
          <p>Micro-climate rain, fog, and visibility diagnostics sampled every 100 km.</p>
        </div>
        <span className="secure-note">
          <ShieldCheck size={14} /> Pre-Trip Weather Clearance Verified
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
        {weatherPoints.map((wp, idx) => {
          const isCaution = wp.status === 'Caution' || wp.status === 'Wet / Foggy'

          return (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: isCaution ? '1px solid #efb86a' : '1px solid var(--line)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#8fa0a5', fontWeight: 600 }}>
                  {wp.checkpointKm}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isCaution ? '#3a2d1e' : '#143834',
                    color: isCaution ? '#f59e0b' : '#55d7c0',
                  }}
                >
                  {wp.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isCaution ? '#3b2f21' : '#163636',
                    display: 'grid',
                    placeItems: 'center',
                    color: isCaution ? '#f59e0b' : '#55d7c0',
                    flexShrink: 0,
                  }}
                >
                  {isCaution ? <CloudRain size={18} /> : <Sun size={18} />}
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#edf4f3' }}>
                    {wp.location}
                  </div>
                  <div style={{ fontSize: '11px', color: '#7ba49b', fontWeight: 600 }}>
                    {wp.condition} · {wp.temp}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '9.5px',
                  color: 'var(--muted)',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '8px',
                  marginTop: '4px',
                }}
              >
                <span>🌧️ Rain: <strong>{wp.rainChance}</strong></span>
                <span>💨 Wind: <strong>{wp.wind}</strong></span>
                <span>👁️ Vis: <strong>{wp.visibility}</strong></span>
              </div>

              {wp.warning && (
                <div
                  style={{
                    background: 'rgba(239, 184, 106, 0.08)',
                    borderLeft: '2px solid #efb86a',
                    padding: '4px 6px',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '9px',
                    color: '#f3c485',
                    marginTop: '2px',
                  }}
                >
                  ⚠️ {wp.warning}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

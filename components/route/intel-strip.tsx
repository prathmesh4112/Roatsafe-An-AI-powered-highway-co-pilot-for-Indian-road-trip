'use client'

import { ShieldCheck, Compass, CloudRain, Sparkles } from 'lucide-react'
import { useRoute } from '@/lib/route-context'

export function IntelStrip() {
  const { intelData } = useRoute()

  if (!intelData) return null

  return (
    <div className="intel-strip">
      <div className="intel-card">
        <div className="intel-icon safety">
          <ShieldCheck size={20} />
        </div>
        <div className="intel-info">
          <small>Safety Index</small>
          <strong>{intelData.safetyScore} / 100 ({intelData.safetyTier})</strong>
        </div>
      </div>

      <div className="intel-card">
        <div className="intel-icon dist">
          <Compass size={20} />
        </div>
        <div className="intel-info">
          <small>Distance & Time</small>
          <strong>{intelData.distanceKm} km · {intelData.estDriveTime}</strong>
        </div>
      </div>

      <div className="intel-card">
        <div className="intel-icon weather">
          <CloudRain size={20} />
        </div>
        <div className="intel-info">
          <small>Mid-way Weather</small>
          <strong>{intelData.weather[1]?.condition || 'Clear'}, {intelData.weather[1]?.temp}</strong>
        </div>
      </div>

      <div className="intel-card">
        <div className="intel-icon ai">
          <Sparkles size={20} />
        </div>
        <div className="intel-info">
          <small>Optimal Departure</small>
          <strong>05:30 AM - 06:15 AM</strong>
        </div>
      </div>
    </div>
  )
}

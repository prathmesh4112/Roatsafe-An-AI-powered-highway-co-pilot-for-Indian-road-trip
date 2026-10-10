'use client'

import { MapPin, CloudRain } from 'lucide-react'
import { useRoute } from '@/lib/route-context'

export function RouteVisualizer() {
  const { origin, destination, intelData } = useRoute()

  return (
    <div className="route-visual" aria-label="Interactive Route Corridor">
      <div className="map-grid" />
      <div className="route-line">
        <span className="route-start" title={origin}>
          <MapPin size={16} fill="currentColor" />
        </span>
        <span className="route-node one" title="Waypoint 1: Micro-climate weather node" />
        <span className="route-node two" title="Waypoint 2: Live incident alert node" />
        <span className="route-node three" title="Waypoint 3: Verified fuel stop" />
        <span className="route-end" title={destination}>
          <MapPin size={16} fill="currentColor" />
        </span>
      </div>
      <span className="city pune">{origin}</span>
      <span className="city goa">{destination}</span>

      <div className="route-card">
        <div className="mini-icon"><CloudRain size={14} /></div>
        <div>
          <strong>Weather corridor</strong>
          <small>
            {intelData?.weather[1]?.condition || 'Light rain'} · {intelData?.weather[1]?.temp || '24°C'}
          </small>
        </div>
      </div>
    </div>
  )
}

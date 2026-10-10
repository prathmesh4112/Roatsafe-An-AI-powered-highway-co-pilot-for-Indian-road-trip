'use client'

import { Navigation, X } from 'lucide-react'

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Navigation size={18} color="#55d7c0" />
            <span>How RoadSafe Leverages SerpApi</span>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="briefing-text">
          <p>
            <strong>RoadSafe</strong> solves the critical challenge of stale and fragmented highway data by combining three specialized SerpApi engines into an agentic driving co-pilot:
          </p>

          <div style={{ marginTop: '12px', borderLeft: '3px solid #55d7c0', paddingLeft: '10px' }}>
            <strong>1. Google News Engine (`google_news`):</strong>
            <p style={{ marginTop: '2px', color: '#9cb0b1' }}>
              Scrapes hyper-local news and police traffic alerts for road closures, landslides, accidents, and highway protests along the travel corridor.
            </p>
          </div>

          <div style={{ marginTop: '12px', borderLeft: '3px solid #60a5fa', paddingLeft: '10px' }}>
            <strong>2. Google Maps & Local Engine (`google_maps`):</strong>
            <p style={{ marginTop: '2px', color: '#9cb0b1' }}>
              Fetches live verified EV superchargers, high-pressure CNG stations, 24/7 Dhabas, and emergency trauma centers with operational hours and review sentiments.
            </p>
          </div>

          <div style={{ marginTop: '12px', borderLeft: '3px solid #efb86a', paddingLeft: '10px' }}>
            <strong>3. Google Search Weather Engine (`google`):</strong>
            <p style={{ marginTop: '2px', color: '#9cb0b1' }}>
              Monitors micro-climate conditions across sensitive waypoints (ghat climbs, fog zones, coastal heavy rain stretches).
            </p>
          </div>

          <div style={{ marginTop: '12px', borderLeft: '3px solid #c084fc', paddingLeft: '10px' }}>
            <strong>4. Agentic AI Synthesis:</strong>
            <p style={{ marginTop: '2px', color: '#9cb0b1' }}>
              Combines all raw search results into an actionable <strong>Trip Safety Score (0-100)</strong>, optimal departure recommendations, and driver voice briefings.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="primary-button" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

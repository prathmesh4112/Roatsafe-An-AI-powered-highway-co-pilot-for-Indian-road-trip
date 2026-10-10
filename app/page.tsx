'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Fuel,
  Bell,
  CalendarDays,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'
import { RoutePlanner } from '@/components/route/route-planner'
import { IntelStrip } from '@/components/route/intel-strip'
import { RouteVisualizer } from '@/components/route/route-visualizer'
import { StopCard } from '@/components/stops/stop-card'
import { AlertCard } from '@/components/alerts/alert-card'
import { AiBriefingModal } from '@/components/ai/ai-briefing-modal'
import { WeatherClearance } from '@/components/weather/weather-clearance'

export default function OverviewPage() {
  const { origin, destination, fuel, intelData, loading, fetchRouteData, handlePresetClick } = useRoute()
  const [briefingOpen, setBriefingOpen] = useState(false)

  return (
    <div>
      {/* WELCOME ROW */}
      <div className="welcome-row">
        <div>
          <p className="eyebrow">LIVE ROAD-TRIP CO-PILOT</p>
          <h1>Good morning, Arjun <span>✦</span></h1>
          <p className="subhead">
            AI Highway Co-pilot powered by <strong>SerpApi</strong> real-time Maps, Weather & News Search.
          </p>
        </div>
      </div>

      {/* HERO CARD */}
      <section className="hero-card">
        <div className="hero-copy">
          <div className="live-pill">
            <span /> LIVE ROUTE INTELLIGENCE & RADAR
          </div>
          <h2>Where are you headed<br /><em>next?</em></h2>
          <p>
            Curating only top-rated $\ge 4.4\star$ verified working {fuel} stations and micro-climate clearance along {origin} → {destination}.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setBriefingOpen(true)}>
              <Sparkles size={15} /> AI Safety Briefing <ArrowRight size={15} />
            </button>
            <Link href="/map" className="secondary-button">
              🗺️ Open Live GPS Map
            </Link>
          </div>
        </div>

        <RouteVisualizer />
      </section>

      {/* ROUTE PLANNER FORM */}
      <RoutePlanner />

      {/* METRIC INTELLIGENCE STRIP */}
      <IntelStrip />

      {/* PROACTIVE HIGHWAY WEATHER CLEARANCE */}
      {intelData?.weather && (
        <WeatherClearance
          weatherPoints={intelData.weather}
          origin={origin}
          destination={destination}
        />
      )}

      {/* RECENT TRIPS & LIVE ALERTS GRID */}
      <div className="grid-layout">
        {/* TRIPS PANEL */}
        <section className="panel" id="trips">
          <div className="panel-header">
            <div>
              <h3>Your Highway Journeys</h3>
              <p>Click any route to load instant SerpApi intelligence.</p>
            </div>
            <Link href="/trips" className="view-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="trip-list">
            <div onClick={() => handlePresetClick('Pune', 'Goa')}>
              <TripRow date="Oct 18, 2026" from="Pune" to="Goa" distance="450 km" status="Upcoming" />
            </div>
            <div onClick={() => handlePresetClick('Mumbai', 'Pune')}>
              <TripRow date="Sep 28, 2026" from="Mumbai" to="Pune" distance="148 km" status="Completed" />
            </div>
            <div onClick={() => handlePresetClick('Delhi', 'Jaipur')}>
              <TripRow date="Aug 12, 2026" from="Delhi" to="Jaipur" distance="280 km" status="Completed" />
            </div>
          </div>
        </section>

        {/* ALERTS PANEL */}
        <section className="panel alerts-panel" id="alerts">
          <div className="panel-header">
            <div>
              <h3>Real-Time Highway Alerts</h3>
              <p>Sourced dynamically from Google News & NHAI feeds.</p>
            </div>
            <Link href="/alerts" className="view-link">
              All alerts <ArrowRight size={14} />
            </Link>
          </div>

          {intelData?.alerts && intelData.alerts.length > 0 ? (
            intelData.alerts.slice(0, 2).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <div className="alert-box">
              <div className="alert-symbol advisory"><Sparkles size={16} /></div>
              <div className="alert-content">
                <strong>No critical road closures detected</strong>
                <p>Highway traffic moving smoothly along major toll expressways.</p>
              </div>
            </div>
          )}

          <div className="info-line">
            <Bell size={13} /> Continuous monitoring active for landslides, floods & bridge work.
          </div>
        </section>
      </div>

      {/* TOP-RATED PITSTOP PREVIEW RADAR */}
      <section className="stops-section">
        <div className="section-heading">
          <div>
            <h3>Top-Rated Highway Pitstops (Curated $\ge 4.4\star$)</h3>
            <p>Approximately 2 verified working stations per major city cluster along {origin} → {destination}.</p>
          </div>
          <Link href="/fuel" className="view-link">
            Explore all stations <ArrowRight size={14} />
          </Link>
        </div>

        <div className="stops-grid">
          {(intelData?.stops || []).slice(0, 3).map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
        </div>
      </section>

      {/* AI BRIEFING MODAL */}
      <AiBriefingModal isOpen={briefingOpen} onClose={() => setBriefingOpen(false)} />
    </div>
  )
}

function TripRow({ date, from, to, distance, status }: { date: string; from: string; to: string; distance: string; status: string }) {
  return (
    <div className="trip-row">
      <div className="date-icon"><CalendarDays size={16} /></div>
      <div className="trip-route">
        <strong>{from} <span>→</span> {to}</strong>
        <small>{date} · {distance}</small>
      </div>
      <span className={'trip-status ' + (status === 'Upcoming' ? 'upcoming' : '')}>{status}</span>
      <ArrowRight size={15} className="row-arrow" />
    </div>
  )
}

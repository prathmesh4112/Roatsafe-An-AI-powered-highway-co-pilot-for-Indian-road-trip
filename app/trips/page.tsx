'use client'

import { useState } from 'react'
import {
  MapPin,
  CalendarDays,
  ArrowRight,
  Plus,
  ShieldCheck,
  Fuel,
  CloudSun,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'
import Link from 'next/link'

interface TripItem {
  id: string;
  from: string;
  to: string;
  date: string;
  distance: string;
  duration: string;
  safetyScore: number;
  fuelType: string;
  status: 'Upcoming' | 'Completed' | 'Draft';
  waypoints: string[];
}

const INITIAL_TRIPS: TripItem[] = [
  {
    id: 'trip-1',
    from: 'Pune',
    to: 'Goa',
    date: 'Oct 18, 2026',
    distance: '450 km',
    duration: '8h 30m',
    safetyScore: 88,
    fuelType: 'CNG',
    status: 'Upcoming',
    waypoints: ['Satara Bypass', 'Karad Food Mall', 'Belagavi Ghats'],
  },
  {
    id: 'trip-2',
    from: 'Mumbai',
    to: 'Pune',
    date: 'Sep 28, 2026',
    distance: '148 km',
    duration: '2h 45m',
    safetyScore: 94,
    fuelType: 'EV',
    status: 'Completed',
    waypoints: ['Navi Mumbai Express', 'Lonavala Expressway', 'Somatane Toll'],
  },
  {
    id: 'trip-3',
    from: 'Delhi',
    to: 'Jaipur',
    date: 'Aug 12, 2026',
    distance: '280 km',
    duration: '4h 15m',
    safetyScore: 82,
    fuelType: 'Petrol',
    status: 'Completed',
    waypoints: ['Gurugram Cyber City', 'Neemrana Japanese Zone', 'Shahpura'],
  },
  {
    id: 'trip-4',
    from: 'Bangalore',
    to: 'Coorg',
    date: 'Jul 04, 2026',
    distance: '245 km',
    duration: '5h 10m',
    safetyScore: 79,
    fuelType: 'EV',
    status: 'Completed',
    waypoints: ['Mysore Ring Road', 'Hunsur Forest Stretch', 'Madikeri Hills'],
  },
]

export default function TripsPage() {
  const { setOrigin, setDestination, setFuel, fetchRouteData } = useRoute()
  const [trips, setTrips] = useState<TripItem[]>(INITIAL_TRIPS)
  const [filter, setFilter] = useState<'all' | 'Upcoming' | 'Completed'>('all')

  const handleSelectTrip = (trip: TripItem) => {
    setOrigin(trip.from)
    setDestination(trip.to)
    setFuel(trip.fuelType)
    fetchRouteData(trip.from, trip.to, trip.fuelType)
  }

  const filteredTrips = trips.filter((t) => {
    if (filter === 'all') return true
    return t.status === filter
  })

  return (
    <div>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">YOUR HIGHWAY ITINERARY</p>
          <h1>My Trips & Corridors</h1>
          <p className="subhead">
            Saved journeys, waypoint itineraries, and historical SerpApi safety audits.
          </p>
        </div>

        <Link href="/" className="primary-button">
          <Plus size={16} /> Plan New Corridor
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['all', 'Upcoming', 'Completed'] as const).map((f) => (
          <button
            key={f}
            className={`preset-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Journeys' : f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="stop-card"
            style={{ cursor: 'pointer' }}
            onClick={() => handleSelectTrip(trip)}
          >
            <div className="stop-top">
              <span className={`confidence ${trip.status === 'Upcoming' ? 'amber' : 'teal'}`}>
                {trip.status}
              </span>
              <span style={{ fontSize: '11px', color: '#7ba49b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Safety {trip.safetyScore}/100
              </span>
            </div>

            <h4 style={{ fontSize: '16px', margin: '14px 0 6px' }}>
              {trip.from} <span style={{ color: '#55d7c0' }}>→</span> {trip.to}
            </h4>

            <p className="stop-area">
              <CalendarDays size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {trip.date} · {trip.distance} · {trip.duration}
            </p>

            <div style={{ margin: '14px 0 10px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '9px', color: '#6f838a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                Planned Corridor Waypoints
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {trip.waypoints.map((wp, i) => (
                  <span key={i} className="feature-tag" style={{ color: '#d2e3df' }}>
                    {i + 1}. {wp}
                  </span>
                ))}
              </div>
            </div>

            <div className="stop-footer">
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Fuel size={12} /> {trip.fuelType} Strategy
              </span>
              <Link
                href="/"
                style={{ color: '#55d7c0', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}
              >
                Launch Co-pilot <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

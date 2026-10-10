'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
  MapPin,
  Navigation,
  Compass,
  ArrowRight,
  Fuel,
  Zap,
  TriangleAlert,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Play,
  Square,
  Radio,
  Gauge,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'
import { RouteGeoData, fetchRealRoadGeometry } from '@/lib/route-geometry'

// Dynamically import Leaflet Map to avoid SSR window errors
const RouteMap = dynamic(() => import('@/components/map/route-map'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '480px',
        borderRadius: '12px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--muted)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px', color: '#55d7c0' }} />
        <div>Calculating Exact Highway Road Geometry & Snapping to Roads...</div>
      </div>
    </div>
  ),
})

export default function LiveMapPage() {
  const { origin, destination, fuel, intelData, loading, fetchRouteData } = useRoute()
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null)
  const [geoData, setGeoData] = useState<RouteGeoData | null>(null)
  const [loadingRoads, setLoadingRoads] = useState(true)

  // Simulation & Real GPS State
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulatedProgress, setSimulatedProgress] = useState(0)
  const [isRealGpsActive, setIsRealGpsActive] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [currentGpsCoord, setCurrentGpsCoord] = useState<[number, number] | null>(null)
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState(1)

  // Fetch real road-following geometry when origin or destination changes
  useEffect(() => {
    let isMounted = true
    setLoadingRoads(true)
    setSimulatedProgress(0)
    setIsSimulating(false)

    fetchRealRoadGeometry(origin, destination).then((data) => {
      if (isMounted) {
        setGeoData(data)
        setLoadingRoads(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [origin, destination])

  const stops = intelData?.stops || []
  const alerts = intelData?.alerts || []

  // Driving Simulation Animation Loop
  useEffect(() => {
    let interval: any = null
    if (isSimulating) {
      setCurrentSpeed(82)
      interval = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 1) {
            setIsSimulating(false)
            setCurrentSpeed(0)
            return 1
          }
          return prev + 0.002 * simSpeedMultiplier
        })
      }, 100)
    } else {
      if (!isRealGpsActive) setCurrentSpeed(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulating, simSpeedMultiplier, isRealGpsActive])

  // Current turn index based on progress
  const activeTurnIndex = useMemo(() => {
    const turnsCount = geoData?.turns.length || 1
    return Math.min(Math.floor(simulatedProgress * turnsCount), turnsCount - 1)
  }, [simulatedProgress, geoData?.turns])

  const activeTurn = geoData?.turns[activeTurnIndex] || geoData?.turns[0]

  const handleOpenGoogleMapsOfficial = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
    window.open(url, '_blank')
  }

  const handleToggleRealGps = () => {
    if (!isRealGpsActive) {
      setIsSimulating(false)
      if ('geolocation' in navigator) {
        setIsRealGpsActive(true)
      } else {
        alert('Geolocation is not supported by your browser.')
      }
    } else {
      setIsRealGpsActive(false)
    }
  }

  return (
    <div>
      {/* HEADER ROW */}
      <div className="welcome-row">
        <div>
          <p className="eyebrow">AUTHENTIC GOOGLE MAPS HIGHWAY ROUTE</p>
          <h1>Live Map & Turn Navigation</h1>
          <p className="subhead">
            Road-snapped highway driving polyline following every bend, turn, and expressway for <strong>{origin} → {destination}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={isRealGpsActive ? 'primary-button' : 'secondary-button'}
            onClick={handleToggleRealGps}
          >
            <Radio size={14} className={isRealGpsActive ? 'animate-pulse' : ''} />
            {isRealGpsActive ? 'Real GPS Connected' : 'Connect Device GPS'}
          </button>

          <button
            className={isSimulating ? 'primary-button' : 'secondary-button'}
            onClick={() => {
              if (isSimulating) {
                setIsSimulating(false)
              } else {
                setIsRealGpsActive(false)
                if (simulatedProgress >= 1) setSimulatedProgress(0)
                setIsSimulating(true)
              }
            }}
          >
            {isSimulating ? <Square size={14} /> : <Play size={14} fill="currentColor" />}
            {isSimulating ? 'Pause Drive' : '▶ Simulate Drive'}
          </button>

          <button className="secondary-button" onClick={handleOpenGoogleMapsOfficial}>
            <ExternalLink size={14} /> Open in Google Maps
          </button>
        </div>
      </div>

      {/* LIVE DRIVING TELEMETRY BAR */}
      {(isSimulating || isRealGpsActive) && (
        <div
          style={{
            background: 'linear-gradient(90deg, #10292c, #16383c)',
            border: '1px solid #285052',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#1a73e8',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '14px',
                fontWeight: 800,
              }}
            >
              {currentSpeed}
              <small style={{ fontSize: '7px', display: 'block', marginTop: '-4px' }}>KM/H</small>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#55d7c0', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
                {isSimulating ? '🚗 Live Driving on Actual Highway' : '📡 Live Device GPS Active'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#edf4f3', marginTop: '2px' }}>
                Next: {activeTurn?.instruction}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isSimulating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Speed:</span>
                {[1, 4, 12].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeedMultiplier(spd)}
                    style={{
                      background: simSpeedMultiplier === spd ? '#55d7c0' : '#1b3238',
                      color: simSpeedMultiplier === spd ? '#071f1b' : '#edf4f3',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 7px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            )}

            <div style={{ minWidth: '130px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginBottom: '3px' }}>
                <span>Highway Progress</span>
                <span>{Math.round(simulatedProgress * 100)}%</span>
              </div>
              <div style={{ height: '5px', background: '#1c343a', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.round(simulatedProgress * 100)}%`,
                    background: '#1a73e8',
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TWO COLUMN INTERACTIVE INTERFACE: MAP ON LEFT, TURN CUES ON RIGHT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: '18px', marginBottom: '24px' }}>
        {/* MAP CONTAINER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            {geoData && !loadingRoads ? (
              <RouteMap
                geoData={geoData}
                originName={origin}
                destinationName={destination}
                stops={stops}
                alerts={alerts}
                isSimulating={isSimulating}
                isRealGpsActive={isRealGpsActive}
                simulatedProgress={simulatedProgress}
                onGpsUpdate={(coords, spd) => {
                  setCurrentGpsCoord(coords)
                  setCurrentSpeed(spd)
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '480px',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--muted)',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px', color: '#55d7c0' }} />
                  <div>Snapping to Actual Highway Roads...</div>
                </div>
              </div>
            )}

            {/* MAP OVERLAY LEGEND */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                gap: '14px',
                fontSize: '10.5px',
                color: '#222',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 400,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a73e8' }} /> Origin 📍
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea4335' }} /> Destination 🏁
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} /> EV ⚡ / Fuel ⛽
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea4335' }} /> Hazard ⚠️
              </div>
            </div>
          </div>

          {/* NEXT PITSTOP RADAR COUNTDOWN STRIP */}
          <div className="panel" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
              ⚡ Corridor Station Proximity Radar ({stops.length} Stations Active)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {stops.slice(0, 3).map((stop) => (
                <div
                  key={stop.id}
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#edf4f3' }}>
                      {stop.name.length > 22 ? stop.name.slice(0, 22) + '...' : stop.name}
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--muted)', marginTop: '2px' }}>
                      {stop.type} · ★ {stop.rating}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#55d7c0', background: '#173634', padding: '3px 8px', borderRadius: '5px', whiteSpace: 'nowrap' }}>
                    {stop.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TURN-BY-TURN NAVIGATION CUE SHEET */}
        <div className="panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', maxHeight: '590px' }}>
          <div className="panel-header" style={{ marginBottom: '14px', flexShrink: 0 }}>
            <div>
              <h3>Turn-by-Turn Driving Cues</h3>
              <p>{geoData?.turns.length || 0} highway maneuvers snapped to real roads.</p>
            </div>
            <span className="checked"><span /> Live Road Snapped</span>
          </div>

          {/* SCROLLABLE TURN LIST */}
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(geoData?.turns || []).map((turn, idx) => {
              const isCurrentActive = idx === activeTurnIndex
              const isSelected = selectedTurnId === turn.id

              return (
                <div
                  key={turn.id}
                  onClick={() => setSelectedTurnId(isSelected ? null : turn.id)}
                  style={{
                    background: isCurrentActive ? '#133538' : isSelected ? '#152d30' : 'var(--surface-2)',
                    border: isCurrentActive ? '1.5px solid #55d7c0' : isSelected ? '1px solid #55d7c0' : '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: '.2s',
                    position: 'relative',
                  }}
                >
                  {isCurrentActive && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '10px',
                        fontSize: '9px',
                        background: '#55d7c0',
                        color: '#071f1b',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      CURRENT STEP
                    </span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isCurrentActive ? '#55d7c0' : isSelected ? '#55d7c0' : '#1f353d',
                        color: isCurrentActive || isSelected ? '#0b1618' : '#8fa8ad',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {turn.stepNumber}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#edf4f3', lineHeight: 1.35 }}>
                        {turn.instruction}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '10px', color: 'var(--muted)' }}>
                        <span>🛣️ {turn.roadName}</span>
                        <span>•</span>
                        <span style={{ color: '#55d7c0', fontWeight: 600 }}>{turn.distanceToStep}</span>
                      </div>

                      {turn.note && (
                        <div
                          style={{
                            marginTop: '8px',
                            background: 'rgba(255,255,255,0.04)',
                            borderLeft: '2px solid #55d7c0',
                            padding: '4px 8px',
                            borderRadius: '0 4px 4px 0',
                            fontSize: '10px',
                            color: '#b5ccc8',
                          }}
                        >
                          {turn.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

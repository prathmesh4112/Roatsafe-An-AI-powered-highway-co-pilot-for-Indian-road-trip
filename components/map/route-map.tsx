'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { RouteGeoData } from '@/lib/route-geometry'
import { SerpHighwayStop, SerpHighwayAlert } from '@/lib/serpapi'

interface RouteMapProps {
  geoData: RouteGeoData;
  originName: string;
  destinationName: string;
  stops: SerpHighwayStop[];
  alerts: SerpHighwayAlert[];
  isSimulating: boolean;
  isRealGpsActive: boolean;
  simulatedProgress: number; // 0 to 1
  onGpsUpdate?: (coords: [number, number], speedKmH: number) => void;
}

export default function RouteMap({
  geoData,
  originName,
  destinationName,
  stops,
  alerts,
  isSimulating,
  isRealGpsActive,
  simulatedProgress,
  onGpsUpdate,
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const carMarkerRef = useRef<L.Marker | null>(null)
  const [mapStyle, setMapStyle] = useState<'google-streets' | 'google-hybrid' | 'google-terrain'>('google-streets')

  // Calculate position along polyline based on progress (0 to 1)
  const calculatePositionOnPolyline = (progress: number): [number, number] => {
    const points = geoData.waypoints
    if (points.length < 2) return geoData.originCoords
    if (progress <= 0) return points[0]
    if (progress >= 1) return points[points.length - 1]

    const totalSegments = points.length - 1
    const segmentIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1)
    const segmentProgress = (progress * totalSegments) - segmentIndex

    const p1 = points[segmentIndex]
    const p2 = points[segmentIndex + 1]

    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress
    return [lat, lng]
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      center: geoData.center,
      zoom: geoData.zoom,
      zoomControl: true,
      attributionControl: false,
    })
    mapInstanceRef.current = map

    // Authentic Google Maps Tile Servers
    let googleTileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' // Google Maps Standard
    if (mapStyle === 'google-hybrid') {
      googleTileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' // Google Maps Satellite + Roads
    } else if (mapStyle === 'google-terrain') {
      googleTileUrl = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}' // Google Maps Terrain
    }

    L.tileLayer(googleTileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map)

    // Route Polyline (Authentic Google Maps Route Style: Bold Royal Blue with border)
    L.polyline(geoData.waypoints, {
      color: '#1a73e8', // Google Maps Primary Blue
      weight: 8,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    // Inner White Dashed Core
    L.polyline(geoData.waypoints, {
      color: '#ffffff',
      weight: 2,
      opacity: 0.8,
      dashArray: '6, 8',
    }).addTo(map)

    // Google Maps Origin Pin
    const originIcon = L.divIcon({
      className: 'custom-map-pin origin',
      html: `
        <div style="background:#1a73e8; color:#fff; border-radius:50%; width:32px; height:32px; display:grid; place-items:center; font-weight:bold; font-size:13px; border:2.5px solid #fff; box-shadow:0 3px 10px rgba(0,0,0,0.5)">
          📍
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    // Google Maps Destination Pin
    const destIcon = L.divIcon({
      className: 'custom-map-pin dest',
      html: `
        <div style="background:#ea4335; color:#fff; border-radius:50%; width:32px; height:32px; display:grid; place-items:center; font-weight:bold; font-size:13px; border:2.5px solid #fff; box-shadow:0 3px 10px rgba(0,0,0,0.5)">
          🏁
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    L.marker(geoData.originCoords, { icon: originIcon })
      .addTo(map)
      .bindPopup(`<strong>Origin:</strong> ${originName}`)

    L.marker(geoData.destCoords, { icon: destIcon })
      .addTo(map)
      .bindPopup(`<strong>Destination:</strong> ${destinationName}`)

    // Fuel & EV Stations along corridor
    stops.forEach((stop, i) => {
      const wpIndex = Math.min(i + 1, geoData.waypoints.length - 2)
      const baseCoord = geoData.waypoints[wpIndex] || geoData.center
      const lat = baseCoord[0] + (i % 2 === 0 ? 0.035 : -0.035) * (i + 1)
      const lng = baseCoord[1] + (i % 2 === 0 ? -0.025 : 0.025) * (i + 1)

      const isEv = stop.category === 'ev'
      const iconHtml = isEv
        ? `<div style="background:#0284c7; color:#fff; border-radius:8px; width:30px; height:30px; display:grid; place-items:center; font-size:14px; border:2px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,0.5)">⚡</div>`
        : `<div style="background:#16a34a; color:#fff; border-radius:8px; width:30px; height:30px; display:grid; place-items:center; font-size:14px; border:2px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,0.5)">⛽</div>`

      const stopIcon = L.divIcon({
        className: 'custom-stop-icon',
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      L.marker([lat, lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; min-width:180px; padding:2px">
            <strong style="font-size:13px; color:#111; display:block">${stop.name}</strong>
            <div style="font-size:11px; color:#555; margin-top:3px">${stop.distance} ahead · ★ ${stop.rating}</div>
            <div style="font-size:10.5px; color:#0284c7; font-weight:600; margin-top:3px">${stop.type}</div>
            <div style="font-size:10px; color:#16a34a; font-weight:bold; margin-top:4px">${stop.status}</div>
          </div>
        `)
    })

    // Live Hazard Marker
    if (alerts.length > 0 && geoData.waypoints.length > 3) {
      const hazardCoord = geoData.waypoints[Math.floor(geoData.waypoints.length / 2)]
      const alertIcon = L.divIcon({
        className: 'custom-hazard-icon',
        html: `<div style="background:#ea4335; color:#fff; border-radius:50%; width:30px; height:30px; display:grid; place-items:center; font-size:14px; border:2px solid #fff; box-shadow:0 0 16px rgba(234,67,53,0.9)">⚠️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      L.marker(hazardCoord, { icon: alertIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; min-width:190px">
            <strong style="font-size:12px; color:#ea4335">Live Road Hazard:</strong>
            <div style="font-size:11px; color:#111; margin-top:3px">${alerts[0].title}</div>
            <div style="font-size:9.5px; color:#666; margin-top:3px">${alerts[0].source}</div>
          </div>
        `)
    }

    // Google Navigation Live Car Marker
    const carIcon = L.divIcon({
      className: 'custom-car-marker',
      html: `
        <div style="position:relative; width:38px; height:38px; display:grid; place-items:center;">
          <div style="position:absolute; inset:-4px; background:rgba(26,115,232,0.45); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="background:#1a73e8; color:#fff; border:2.5px solid #fff; border-radius:50%; width:36px; height:36px; display:grid; place-items:center; font-size:18px; box-shadow:0 4px 14px rgba(0,0,0,0.6); z-index:10">🚗</div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    })

    const carMarker = L.marker(geoData.originCoords, { icon: carIcon, zIndexOffset: 1000 }).addTo(map)
    carMarkerRef.current = carMarker

    // Fit bounds
    const bounds = L.latLngBounds(geoData.waypoints)
    map.fitBounds(bounds, { padding: [50, 50] })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [geoData, originName, destinationName, stops, alerts, mapStyle])

  // Update Car Marker position during simulation or real GPS
  useEffect(() => {
    if (!carMarkerRef.current || !mapInstanceRef.current) return

    if (isSimulating) {
      const pos = calculatePositionOnPolyline(simulatedProgress)
      carMarkerRef.current.setLatLng(pos)
      if (onGpsUpdate) {
        onGpsUpdate(pos, 78)
      }
    }
  }, [simulatedProgress, isSimulating])

  // Real browser geolocation watcher
  useEffect(() => {
    if (!isRealGpsActive || !navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords
        const pos: [number, number] = [latitude, longitude]

        if (carMarkerRef.current) {
          carMarkerRef.current.setLatLng(pos)
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(pos, { animate: true })
        }
        if (onGpsUpdate) {
          const speedKmH = speed ? Math.round(speed * 3.6) : 65
          onGpsUpdate(pos, speedKmH)
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message)
      },
      { enableHighAccuracy: true, maximumAge: 1000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [isRealGpsActive])

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '480px',
          borderRadius: '12px',
          border: '1px solid var(--line)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      />

      {/* GOOGLE MAPS LAYER SWITCHER */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '4px',
          display: 'flex',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          zIndex: 400,
        }}
      >
        <button
          onClick={() => setMapStyle('google-streets')}
          style={{
            background: mapStyle === 'google-streets' ? '#1a73e8' : 'transparent',
            color: mapStyle === 'google-streets' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🗺️ Google Map
        </button>
        <button
          onClick={() => setMapStyle('google-hybrid')}
          style={{
            background: mapStyle === 'google-hybrid' ? '#1a73e8' : 'transparent',
            color: mapStyle === 'google-hybrid' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🛰️ Google Satellite
        </button>
        <button
          onClick={() => setMapStyle('google-terrain')}
          style={{
            background: mapStyle === 'google-terrain' ? '#1a73e8' : 'transparent',
            color: mapStyle === 'google-terrain' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ⛰️ Google Terrain
        </button>
      </div>
    </div>
  )
}

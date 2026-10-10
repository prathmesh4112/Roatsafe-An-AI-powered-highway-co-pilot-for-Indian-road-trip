'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { RouteIntelResponse } from '@/lib/serpapi'

interface RouteContextType {
  origin: string;
  destination: string;
  fuel: string;
  loading: boolean;
  intelData: RouteIntelResponse | null;
  customApiKey: string;
  theme: 'dark' | 'light';
  setOrigin: (val: string) => void;
  setDestination: (val: string) => void;
  setFuel: (val: string) => void;
  setCustomApiKey: (val: string) => void;
  setTheme: (val: 'dark' | 'light') => void;
  fetchRouteData: (org?: string, dest?: string, fuelType?: string) => Promise<void>;
  handleSwap: () => void;
  handlePresetClick: (from: string, to: string) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [origin, setOrigin] = useState('Pune')
  const [destination, setDestination] = useState('Goa')
  const [fuel, setFuel] = useState('CNG')
  const [loading, setLoading] = useState(false)
  const [intelData, setIntelData] = useState<RouteIntelResponse | null>(null)
  const [customApiKey, setCustomApiKey] = useState('')

  const fetchRouteData = async (org = origin, dest = destination, fuelType = fuel) => {
    setLoading(true)
    try {
      const res = await fetch('/api/route-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: org,
          destination: dest,
          fuelType,
          apiKey: customApiKey || undefined,
        }),
      })
      if (res.ok) {
        const data: RouteIntelResponse = await res.json()
        setIntelData(data)
      }
    } catch (err) {
      console.error('Failed to fetch route intel:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRouteData('Pune', 'Goa', 'CNG')
  }, [])

  const handleSwap = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
    fetchRouteData(destination, temp, fuel)
  }

  const handlePresetClick = (from: string, to: string) => {
    setOrigin(from)
    setDestination(to)
    fetchRouteData(from, to, fuel)
  }

  return (
    <RouteContext.Provider
      value={{
        origin,
        destination,
        fuel,
        loading,
        intelData,
        customApiKey,
        theme,
        setOrigin,
        setDestination,
        setFuel,
        setCustomApiKey,
        setTheme,
        fetchRouteData,
        handleSwap,
        handlePresetClick,
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider')
  }
  return context
}

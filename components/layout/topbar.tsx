'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Sun, Moon, Bell, Key } from 'lucide-react'
import { useRoute } from '@/lib/route-context'

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onOpenHelp: () => void;
}

export function Topbar({ onToggleMobileMenu, onOpenHelp }: TopbarProps) {
  const { origin, destination, theme, setTheme, customApiKey, setCustomApiKey, fetchRouteData, fuel } = useRoute()
  const [showKeyDrawer, setShowKeyDrawer] = useState(false)

  return (
    <>
      <header className="topbar">
        <button className="mobile-menu" onClick={onToggleMobileMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          <Link href="/">RoadSafe</Link>
          <span className="slash">/</span>
          <strong>{origin} → {destination} Corridor</strong>
        </div>

        <div className="top-actions">
          <button
            className="icon-button"
            title="SerpApi Configuration"
            onClick={() => setShowKeyDrawer(!showKeyDrawer)}
          >
            <Key size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link href="/alerts" className="icon-button notification" aria-label="Notifications">
            <Bell size={17} />
            <i />
          </Link>
          <div className="top-avatar">AK</div>
        </div>
      </header>

      {showKeyDrawer && (
        <div style={{ background: '#13282b', padding: '12px 36px', borderBottom: '1px solid #285052', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Key size={16} color="#55d7c0" />
          <span style={{ fontSize: '11px', color: '#b2c8c6' }}>SerpApi Key:</span>
          <input
            type="password"
            placeholder="Paste custom SerpApi key (or use server default)"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            style={{ background: '#0b1618', border: '1px solid #285052', padding: '5px 10px', borderRadius: '5px', fontSize: '11px', color: '#fff', flex: 1 }}
          />
          <button
            className="primary-button"
            style={{ padding: '5px 12px', fontSize: '10px' }}
            onClick={() => fetchRouteData(origin, destination, fuel)}
          >
            Apply Key
          </button>
        </div>
      )}
    </>
  )
}

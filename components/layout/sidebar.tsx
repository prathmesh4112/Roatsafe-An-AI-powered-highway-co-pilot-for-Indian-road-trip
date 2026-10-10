'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Navigation,
  MapPin,
  Bell,
  Fuel,
  Sparkles,
  CircleHelp,
  ChevronDown,
  Map,
} from 'lucide-react'
import { useRoute } from '@/lib/route-context'

interface SidebarProps {
  onOpenHelp: () => void;
}

export function Sidebar({ onOpenHelp }: SidebarProps) {
  const pathname = usePathname()
  const { origin } = useRoute()

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <Link href="/" className="flex items-center gap-2">
          <span className="brand-mark">
            <Navigation size={16} fill="currentColor" />
          </span>
          <span>RoadSafe</span>
        </Link>
        <span className="serp-badge">SERPAPI</span>
      </div>

      <div className="workspace-label">YOUR JOURNEY</div>
      <nav className="nav-list" aria-label="Main navigation">
        <Link
          href="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <span className="nav-icon"><Navigation size={16} /></span> Overview
        </Link>
        <Link
          href="/map"
          className={`nav-item ${isActive('/map') ? 'active' : ''}`}
        >
          <span className="nav-icon"><Map size={16} /></span> Live Map & Turns
          <span className="serp-badge" style={{ fontSize: '8px', padding: '1px 5px' }}>GPS</span>
        </Link>
        <Link
          href="/trips"
          className={`nav-item ${isActive('/trips') ? 'active' : ''}`}
        >
          <span className="nav-icon"><MapPin size={16} /></span> My Trips
          <span className="nav-count">3</span>
        </Link>
        <Link
          href="/alerts"
          className={`nav-item ${isActive('/alerts') ? 'active' : ''}`}
        >
          <span className="nav-icon"><Bell size={16} /></span> Road Alerts
          <span className="alert-dot" />
        </Link>
      </nav>

      <div className="workspace-label second">CORRIDOR RADAR</div>
      <nav className="nav-list">
        <Link
          href="/fuel"
          className={`nav-item ${isActive('/fuel') ? 'active' : ''}`}
        >
          <span className="nav-icon"><Fuel size={16} /></span> Fuel & EV Radar
        </Link>
        <Link
          href="/places"
          className={`nav-item ${isActive('/places') ? 'active' : ''}`}
        >
          <span className="nav-icon"><Sparkles size={16} /></span> Dhabas & Care
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={onOpenHelp}>
          <span className="nav-icon"><CircleHelp size={16} /></span> How It Works
        </button>
        <div className="profile-mini">
          <div className="avatar">AK</div>
          <div>
            <strong>Arjun Kapoor</strong>
            <small>{origin}, India</small>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </aside>
  )
}

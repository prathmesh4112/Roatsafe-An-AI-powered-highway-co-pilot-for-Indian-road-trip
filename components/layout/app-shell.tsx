'use client'

import React, { useState } from 'react'
import { RouteProvider, useRoute } from '@/lib/route-context'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { HowItWorksModal } from '@/components/modals/how-it-works-modal'
import Link from 'next/link'

function ShellInner({ children }: { children: React.ReactNode }) {
  const { theme } = useRoute()
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <main className={theme === 'light' ? 'app-shell light' : 'app-shell'}>
      <Sidebar onOpenHelp={() => setHelpOpen(true)} />

      <section className="content">
        <Topbar
          onToggleMobileMenu={() => setMenuOpen(!menuOpen)}
          onOpenHelp={() => setHelpOpen(true)}
        />

        {menuOpen && (
          <div className="mobile-panel">
            <Link href="/" onClick={() => setMenuOpen(false)}>Overview</Link>
            <Link href="/map" onClick={() => setMenuOpen(false)}>Live Map & Turns</Link>
            <Link href="/trips" onClick={() => setMenuOpen(false)}>My Trips</Link>
            <Link href="/alerts" onClick={() => setMenuOpen(false)}>Road Alerts</Link>
            <Link href="/fuel" onClick={() => setMenuOpen(false)}>Fuel & EV</Link>
            <Link href="/places" onClick={() => setMenuOpen(false)}>Dhabas & Care</Link>
            <button
              onClick={() => { setHelpOpen(true); setMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '9px 15px', fontSize: '12px' }}
            >
              How It Works
            </button>
          </div>
        )}

        <div className="page-wrap">
          {children}

          <footer>
            <span>SerpApi Hackathon Project · Multi-Engine Google Maps, News & Weather</span>
            <span>RoadSafe © 2026 · AI Highway Co-pilot</span>
          </footer>
        </div>
      </section>

      <HowItWorksModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </main>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RouteProvider>
      <ShellInner>{children}</ShellInner>
    </RouteProvider>
  )
}

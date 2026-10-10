'use client'

import { Fuel, Zap, Utensils, HeartPulse, ExternalLink, CheckCircle2, Star, ThumbsUp } from 'lucide-react'
import { SerpHighwayStop } from '@/lib/serpapi'

interface StopCardProps {
  stop: SerpHighwayStop;
}

export function StopCard({ stop }: StopCardProps) {
  const getIcon = () => {
    switch (stop.category) {
      case 'ev': return <Zap size={16} />;
      case 'food': return <Utensils size={16} />;
      case 'emergency': return <HeartPulse size={16} />;
      default: return <Fuel size={16} />;
    }
  }

  const handleOpenMaps = () => {
    const query = `${stop.name} ${stop.area}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  }

  return (
    <div className="stop-card">
      <div className="stop-top">
        <span className={`station-icon ${stop.tone}`}>
          {getIcon()}
        </span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {stop.cityCluster && (
            <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', color: '#a0b4b8', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--line)' }}>
              {stop.cityCluster}
            </span>
          )}
          <span className={`confidence ${stop.tone}`}>{stop.status}</span>
        </div>
      </div>

      <h4 style={{ fontSize: '13px', margin: '12px 0 4px', fontWeight: 600 }}>{stop.name}</h4>
      <p className="stop-area">{stop.area}</p>

      <div className="stop-meta" style={{ margin: '10px 0' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <strong style={{ color: '#e3b66e' }}>★ {stop.rating}</strong>
          <small>({stop.reviewsCount} verified reviews)</small>
        </span>
        <span style={{ color: '#55d7c0', fontWeight: 600 }}>{stop.distance}</span>
      </div>

      {stop.verifiedReviewSnippet && (
        <div
          style={{
            background: 'rgba(85,215,192,0.05)',
            borderLeft: '2px solid #55d7c0',
            padding: '6px 8px',
            borderRadius: '0 5px 5px 0',
            fontSize: '9.5px',
            color: '#b6ccc8',
            marginBottom: '10px',
            lineHeight: 1.4,
          }}
        >
          {stop.verifiedReviewSnippet}
        </div>
      )}

      {stop.features && (
        <div className="feature-tags">
          {stop.features.map((f) => (
            <span key={f} className="feature-tag">{f}</span>
          ))}
        </div>
      )}

      <div className="stop-footer">
        <span style={{ fontWeight: 600 }}>{stop.type}</span>
        <button
          aria-label={`Directions to ${stop.name}`}
          title="Open in Google Maps"
          onClick={handleOpenMaps}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#55d7c0', fontSize: '10px' }}
        >
          <span>Directions</span>
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  )
}

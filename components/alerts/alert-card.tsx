'use client'

import { TriangleAlert, Wind, ShieldCheck, ExternalLink } from 'lucide-react'
import { SerpHighwayAlert } from '@/lib/serpapi'

interface AlertCardProps {
  alert: SerpHighwayAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const getIcon = () => {
    switch (alert.severity) {
      case 'critical': return <TriangleAlert size={16} />;
      case 'warning': return <Wind size={16} />;
      default: return <ShieldCheck size={16} />;
    }
  }

  return (
    <div className="alert-box">
      <div className={`alert-symbol ${alert.severity}`}>
        {getIcon()}
      </div>
      <div className="alert-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <strong>{alert.title}</strong>
          {alert.link && (
            <a
              href={alert.link}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#55d7c0', marginLeft: '6px' }}
              title="Read full news article"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
        <p>{alert.snippet}</p>
        <div className="alert-meta">
          <span className={`severity-pill ${alert.severity}`}>{alert.severity}</span>
          <span>{alert.source}</span>
          <span>•</span>
          <span>{alert.timeAgo}</span>
          {alert.location && <span>• {alert.location}</span>}
        </div>
      </div>
    </div>
  )
}

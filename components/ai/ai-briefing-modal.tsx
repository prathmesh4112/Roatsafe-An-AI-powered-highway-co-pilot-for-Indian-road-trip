'use client'

import { useState } from 'react'
import { Sparkles, X, Play, Square, Volume2 } from 'lucide-react'
import { useRoute } from '@/lib/route-context'

interface AiBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiBriefingModal({ isOpen, onClose }: AiBriefingModalProps) {
  const { origin, destination, fuel, intelData } = useRoute()
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  if (!isOpen) return null;

  const handleReadAloud = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `RoadSafe AI briefing for ${origin} to ${destination}. Overall safety score is ${intelData?.safetyScore || 88} out of 100. ${intelData?.departureAdvice || 'Drive with normal caution.'} Fuel strategy is configured for ${fuel}. Drive safely.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }

  const handleTogglePlay = () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      handleReadAloud();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={18} color="#55d7c0" />
            <span>AI Driver Safety Briefing ({origin} → {destination})</span>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="audio-player-bar">
          <button
            className="play-btn"
            onClick={handleTogglePlay}
            title={isPlayingAudio ? 'Pause Voice Briefing' : 'Play Voice Briefing'}
          >
            {isPlayingAudio ? <Square size={14} /> : <Play size={14} fill="currentColor" />}
          </button>
          <div className="wave-bars">
            {[40, 75, 30, 90, 60, 100, 45, 80, 25, 95, 70, 50, 85, 30, 60, 40].map((h, i) => (
              <div
                key={i}
                className={`wave-bar ${isPlayingAudio ? 'playing' : ''}`}
                style={{ height: isPlayingAudio ? undefined : `${h}%`, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#8ca2a6', fontFamily: 'monospace' }}>
            {isPlayingAudio ? 'Playing...' : '0:28 AI Voice'}
          </span>
        </div>

        <div className="briefing-text">
          <p>
            <strong>🛡️ Corridor Safety Rating: {intelData?.safetyScore || 88}/100 ({intelData?.safetyTier || 'Good'})</strong>
          </p>
          <p style={{ marginTop: '8px' }}>
            {intelData?.departureAdvice || 'Optimal departure advice calculating...'}
          </p>
          <div style={{ marginTop: '12px' }}>
            <strong>Key Highway Hazards & Micro-climates:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
              {(intelData?.safetyRationale || []).map((r, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{r}</li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: '12px' }}>
            <strong>Powertrain Advisory ({fuel}):</strong>
            <p style={{ marginTop: '4px' }}>
              {fuel === 'EV'
                ? 'Recommended charging stop at Jio-bp pulse 120kW (Km 168) to top up from 25% to 80% before entering the ghat section.'
                : fuel === 'CNG'
                ? 'Fill tank at Indian Oil Green Highway (Km 88) where cascade pressure is consistently above 200 bar.'
                : 'Fuel availability is high across the corridor. Standard highway safety precautions apply.'}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
          <button className="primary-button" onClick={handleReadAloud}>
            <Volume2 size={15} /> Read Aloud
          </button>
        </div>
      </div>
    </div>
  )
}

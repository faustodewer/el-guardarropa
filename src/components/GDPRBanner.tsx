import { useState, useEffect } from 'react'
import './GDPRBanner.css'

interface GDPRBannerProps {
  onNavigate?: (page: string) => void
}

export function GDPRBanner({ onNavigate }: GDPRBannerProps) {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const gdprConsent = localStorage.getItem('gdpr_consent')
    if (!gdprConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('gdpr_consent', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="gdpr-banner">
      <div className="gdpr-content">
        <p>
          Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra{' '}
          {onNavigate ? (
            <a href="#" onClick={() => onNavigate('privacy')}>Política de Privacidad</a>
          ) : (
            <a href="/privacy">Política de Privacidad</a>
          )}
          {' '}y{' '}
          {onNavigate ? (
            <a href="#" onClick={() => onNavigate('terms')}>Términos de Servicio</a>
          ) : (
            <a href="/terms">Términos de Servicio</a>
          )}
          .
        </p>
        <button onClick={handleAccept} className="gdpr-accept">
          Aceptar
        </button>
      </div>
    </div>
  )
}

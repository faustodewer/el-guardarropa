import { useState, useEffect } from 'react'
import './GDPRBanner.css'

export function GDPRBanner() {
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
          <a href="/privacy">Política de Privacidad</a> y{' '}
          <a href="/terms">Términos de Servicio</a>.
        </p>
        <button onClick={handleAccept} className="gdpr-accept">
          Aceptar
        </button>
      </div>
    </div>
  )
}

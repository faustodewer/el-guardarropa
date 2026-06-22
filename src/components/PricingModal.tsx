import { useState } from 'react'
import { createCheckoutSession } from '../lib/lemonSqueezy'
import './PricingModal.css'

interface PricingModalProps {
  user: any
  onClose: () => void
}

export function PricingModal({ user, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')

    try {
      const checkoutUrl = await createCheckoutSession(user.id, user.email)

      if (checkoutUrl) {
        // Store return URL in sessionStorage so we know to check premium status on return
        sessionStorage.setItem('returnedFromCheckout', 'true')
        window.location.href = checkoutUrl
      } else {
        setError('No se pudo procesar el pago. Intenta de nuevo.')
      }
    } catch (err: any) {
      setError('Error al iniciar el pago: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pricing-modal-overlay">
      <div className="pricing-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>Desbloquea Premium</h2>

        <div className="pricing-content">
          <div className="plan-card free-plan">
            <h3>Freemium</h3>
            <p className="price">€0</p>
            <ul className="features">
              <li>✓ 25 prendas</li>
              <li>✓ Análisis IA básico</li>
              <li>✓ Galería de prendas</li>
              <li>✗ Combinaciones de outfits</li>
              <li>✗ Notificaciones diarias</li>
              <li>✗ Historial de looks</li>
            </ul>
          </div>

          <div className="plan-card premium-plan">
            <span className="badge">RECOMENDADO</span>
            <h3>Premium</h3>
            <p className="price">€4.99<span>/mes</span></p>
            <ul className="features">
              <li>✓ Prendas ilimitadas</li>
              <li>✓ Análisis IA avanzado</li>
              <li>✓ Galería de prendas</li>
              <li>✓ Combinaciones de outfits</li>
              <li>✓ Notificaciones diarias</li>
              <li>✓ Historial de looks</li>
              <li>✓ Sincronización en la nube</li>
            </ul>

            <button onClick={handleUpgrade} disabled={loading} className="upgrade-btn">
              {loading ? '⏳ Procesando...' : '✓ Actualizar a Premium'}
            </button>
          </div>
        </div>

        {error && <div className="pricing-error">{error}</div>}

        <p className="pricing-footer">
          Cancelable en cualquier momento. Sin compromisos.
        </p>
      </div>
    </div>
  )
}

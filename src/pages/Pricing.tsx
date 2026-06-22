import { useState } from 'react'
import { useAuth } from '../lib/useAuth'
import { createCheckoutSession } from '../lib/lemonSqueezy'
import './Pricing.css'

export function Pricing() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    if (!user) {
      alert('Por favor inicia sesión primero')
      return
    }

    setLoading(true)
    setError('')

    try {
      const checkoutUrl = await createCheckoutSession(user.id, user.email)

      if (checkoutUrl) {
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
    <div className="pricing-page">
      <header className="pricing-header">
        <h1>Planes y Precios</h1>
        <p>Elige el plan perfecto para tu estilo</p>
      </header>

      <div className="pricing-plans">
        <div className="plan free-plan">
          <h2>Freemium</h2>
          <p className="plan-price">€0</p>
          <p className="plan-description">Para empezar</p>

          <ul className="plan-features">
            <li>✓ 25 prendas</li>
            <li>✓ Análisis IA básico</li>
            <li>✓ Galería de prendas</li>
            <li className="disabled">✗ Combinaciones de outfits</li>
            <li className="disabled">✗ Notificaciones diarias</li>
            <li className="disabled">✗ Historial de looks</li>
            <li className="disabled">✗ Sincronización en la nube</li>
          </ul>

          <button disabled className="plan-button">
            Plan Actual
          </button>
        </div>

        <div className="plan premium-plan featured">
          <span className="plan-badge">RECOMENDADO</span>
          <h2>Premium</h2>
          <p className="plan-price">
            €4.99
            <span>/mes</span>
          </p>
          <p className="plan-description">Para amantes de la moda</p>

          <ul className="plan-features">
            <li>✓ Prendas ilimitadas</li>
            <li>✓ Análisis IA avanzado</li>
            <li>✓ Galería de prendas</li>
            <li>✓ Combinaciones de outfits</li>
            <li>✓ Notificaciones diarias</li>
            <li>✓ Historial de looks</li>
            <li>✓ Sincronización en la nube</li>
          </ul>

          <button onClick={handleUpgrade} disabled={loading} className="plan-button upgrade-button">
            {loading ? '⏳ Procesando...' : '✓ Activar Premium'}
          </button>
        </div>
      </div>

      {error && <div className="pricing-error">{error}</div>}

      <section className="pricing-faq">
        <h2>Preguntas Frecuentes</h2>

        <div className="faq-item">
          <h3>¿Puedo cambiar de plan?</h3>
          <p>Sí, puedes cambiar a cualquier momento. Nos creeremos tu decisión.</p>
        </div>

        <div className="faq-item">
          <h3>¿Hay período de prueba?</h3>
          <p>El plan freemium es tu prueba sin límite de tiempo. Prueba todas las funciones con 25 prendas.</p>
        </div>

        <div className="faq-item">
          <h3>¿Es seguro el pago?</h3>
          <p>Usamos Lemon Squeezy, un procesador de pagos certificado y seguro. Tus datos están protegidos.</p>
        </div>

        <div className="faq-item">
          <h3>¿Puedo cancelar en cualquier momento?</h3>
          <p>Claro. Cancela tu suscripción sin preguntas en tu panel de control.</p>
        </div>
      </section>
    </div>
  )
}

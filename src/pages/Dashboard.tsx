import { useState, useEffect } from 'react'
import { signOut } from '../lib/auth'
import { PhotoUpload } from '../components/PhotoUpload'
import { GarmentForm } from '../components/GarmentForm'
import { GarmentList } from '../components/GarmentList'
import { PricingModal } from '../components/PricingModal'
import { supabase } from '../lib/supabase'
import { isPremiumUser } from '../lib/subscriptions'
import './Dashboard.css'

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [garments, setGarments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [count, setCount] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const limit = isPremium ? Infinity : 25

  useEffect(() => {
    checkPremium()
    loadGarments()

    // Check if returning from checkout
    if (sessionStorage.getItem('returnedFromCheckout')) {
      sessionStorage.removeItem('returnedFromCheckout')

      // Poll for premium status with exponential backoff
      let retries = 0
      const maxRetries = 30

      const pollPremium = async () => {
        const premium = await isPremiumUser(user.id)
        if (!premium && retries < maxRetries) {
          retries++
          const delay = Math.min(1000 * (2 ** (retries - 1)), 30000)
          setTimeout(pollPremium, delay)
        } else if (premium) {
          checkPremium()
        }
      }

      // Start polling after 1 second (webhook needs time to process)
      const timer = setTimeout(pollPremium, 1000)
      return () => clearTimeout(timer)
    }
  }, [user])

  const checkPremium = async () => {
    const premium = await isPremiumUser(user.id)
    setIsPremium(premium)
  }

  const loadGarments = async () => {
    try {
      const { data, error } = await supabase
        .from('garments')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGarments(data || [])
      setCount(data?.length || 0)
    } catch (err) {
      console.error('Error loading garments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGarmentAdded = async () => {
    await loadGarments()
  }

  const handleLogout = async () => {
    try {
      await signOut()
      onLogout()
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>El Guardarropa</h1>
          <p>{user.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Salir
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-label">Prendas</span>
            <span className="stat-value">{count}/{limit}</span>
          </div>
          {count >= limit && (
            <div className="stat warning">
              <span>🔒 Límite alcanzado (freemium)</span>
            </div>
          )}
        </div>

        {count < limit ? (
          <PhotoUpload user={user} onPhotoAdded={handleGarmentAdded} />
        ) : (
          <div className="upgrade-notice">
            <h3>Límite de prendas alcanzado</h3>
            <p>Actualiza a premium para agregar más prendas</p>
            <button onClick={() => setShowPricingModal(true)} className="upgrade-link">
              Ver planes premium →
            </button>
          </div>
        )}

        {showForm && <GarmentForm user={user} onSubmit={handleGarmentAdded} onCancel={() => setShowForm(false)} />}

        {showPricingModal && <PricingModal user={user} onClose={() => setShowPricingModal(false)} />}

        <section className="garments-section">
          <h2>Mis Prendas</h2>
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : garments.length === 0 ? (
            <p className="empty">No hay prendas aún. ¡Sube una foto!</p>
          ) : (
            <GarmentList garments={garments} onGarmentsChange={loadGarments} />
          )}
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2026 El Guardarropa</p>
      </footer>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { signOut } from '../lib/auth'
import { PhotoUpload } from '../components/PhotoUpload'
import { GarmentForm } from '../components/GarmentForm'
import { GarmentList } from '../components/GarmentList'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [garments, setGarments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [count, setCount] = useState(0)
  const limit = 25

  useEffect(() => {
    loadGarments()
  }, [user])

  const loadGarments = async () => {
    try {
      const { data, error } = await supabase
        .from('garments')
        .select('*')
        .eq('user_id', user.id)
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
          </div>
        )}

        {showForm && <GarmentForm user={user} onSubmit={handleGarmentAdded} onCancel={() => setShowForm(false)} />}

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

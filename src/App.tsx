import { useState, useEffect } from 'react'
import { GDPRBanner } from './components/GDPRBanner'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import './App.css'
import './pages/Legal.css'

type Page = 'home' | 'privacy' | 'terms'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [user] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Initialize Supabase auth
    setLoading(false)
  }, [])

  const renderPage = () => {
    switch (page) {
      case 'privacy':
        return <Privacy />
      case 'terms':
        return <Terms />
      default:
        return (
          <>
            <header className="header">
              <h1>El Guardarropa</h1>
              <p>Old Money Wardrobe</p>
            </header>

            <main className="main">
              {!user ? (
                <div className="auth-section">
                  <h2>Bienvenido</h2>
                  <p>Organiza tu armario con estilo Old Money</p>
                  <button>Iniciar sesión</button>
                </div>
              ) : (
                <div className="dashboard">
                  <h2>Tu Armario</h2>
                  <p>Bienvenido de nuevo</p>
                </div>
              )}
            </main>

            <footer className="footer">
              <p>&copy; 2026 El Guardarropa</p>
              <nav className="footer-nav">
                <button onClick={() => setPage('privacy')} className="footer-link">
                  Privacidad
                </button>
                <span> • </span>
                <button onClick={() => setPage('terms')} className="footer-link">
                  Términos
                </button>
              </nav>
            </footer>
          </>
        )
    }
  }

  if (loading) {
    return <div className="loading">Cargando…</div>
  }

  return (
    <div className="app">
      {renderPage()}
      <GDPRBanner />
    </div>
  )
}

export default App

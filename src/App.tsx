import { useEffect, useState } from 'react'
import { GDPRBanner } from './components/GDPRBanner'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { useAuth } from './lib/useAuth'
import './App.css'
import './pages/Legal.css'

type Page = 'home' | 'privacy' | 'terms' | 'dashboard'

function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    if (user && page === 'home') {
      setPage('dashboard')
    } else if (!user && page === 'dashboard') {
      setPage('home')
    }
  }, [user, page])

  const renderPage = () => {
    switch (page) {
      case 'privacy':
        return <Privacy />
      case 'terms':
        return <Terms />
      case 'dashboard':
        return user ? (
          <Dashboard user={user} onLogout={() => setPage('home')} />
        ) : (
          <Auth onAuthSuccess={() => setPage('dashboard')} />
        )
      default:
        return user ? (
          <Dashboard user={user} onLogout={() => setPage('home')} />
        ) : (
          <Auth onAuthSuccess={() => setPage('dashboard')} />
        )
    }
  }

  if (loading) {
    return <div className="loading">Cargando…</div>
  }

  return (
    <div className="app">
      {renderPage()}
      {page !== 'dashboard' && <GDPRBanner />}
    </div>
  )
}

export default App

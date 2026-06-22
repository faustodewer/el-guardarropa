import { useEffect, useState } from 'react'
import { onAuthStateChange } from './auth'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = onAuthStateChange(setUser)
    setLoading(false)

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading }
}

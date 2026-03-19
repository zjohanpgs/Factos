import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        skipBrowserRedirect: true
      }
    })
    if (error) return console.error('Login error:', error.message)

    const width = 500, height = 600
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2
    const popup = window.open(
      data.url,
      'google-login',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    const interval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval)
          return
        }
        if (popup.location.origin === window.location.origin) {
          clearInterval(interval)
          popup.close()
          supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
          })
        }
      } catch (e) { /* cross-origin, ignore */ }
    }, 300)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

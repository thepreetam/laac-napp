'use client'

import * as React from 'react'

interface AuthUser {
  userId: string
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; data?: any; message?: string }>
  register: (params: { email: string; password: string; firstName: string; lastName: string; persona: string }) => Promise<{ success: boolean; data?: any; message?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setUser(data.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { refresh() }, [refresh])

  const login = React.useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) {
      setUser({ userId: data.data.userId, name: data.data.name, email: data.data.email })
    }
    return data
  }, [])

  const register = React.useCallback(async (params: { email: string; password: string; firstName: string; lastName: string; persona: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const data = await res.json()
    if (data.success) {
      setUser({ userId: data.data.userId, name: data.data.name, email: data.data.email })
    }
    return data
  }, [])

  const logout = React.useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

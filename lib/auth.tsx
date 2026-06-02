'use client'

import { User, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, googleProvider } from '@/lib/firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    loginWithGoogle: async () => {
      await signInWithPopup(auth, googleProvider)
    },
    logout: async () => {
      await signOut(auth)
    }
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login/')
    }
  }, [loading, user, router])

  if (loading) {
    return <div className="min-h-screen bg-wall-ink px-6 py-24 text-center text-white">Sprawdzamy sesję użytkownika...</div>
  }

  if (!user) {
    return <div className="min-h-screen bg-wall-ink px-6 py-24 text-center text-white">Przekierowanie do logowania...</div>
  }

  return <>{children}</>
}

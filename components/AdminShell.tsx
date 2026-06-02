'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { ProtectedRoute, useAuth } from '@/lib/auth'

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.replace('/login/')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 text-wall-ink">
        <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
          <div className="container-wall flex min-h-20 items-center justify-between gap-4 py-4">
            <Link href="/admin/" className="focus-ring rounded-xl"><Logo dark /></Link>
            <nav className="flex items-center gap-3" aria-label="Nawigacja panelu">
              <Link className="focus-ring rounded-xl px-4 py-3 text-sm font-bold hover:bg-zinc-100" href="/admin/">Dashboard</Link>
              <Link className="focus-ring rounded-xl px-4 py-3 text-sm font-bold hover:bg-zinc-100" href="/admin/config/">Konfiguracja</Link>
              <Link className="focus-ring rounded-xl px-4 py-3 text-sm font-bold hover:bg-zinc-100" href="/">Strona</Link>
            </nav>
            <div className="hidden text-right text-xs text-zinc-500 md:block">
              <div className="font-bold text-wall-ink">{user?.email}</div>
              <button className="focus-ring mt-1 rounded-lg text-wall-orange" type="button" onClick={handleLogout}>Wyloguj</button>
            </div>
          </div>
        </header>
        {children}
      </div>
    </ProtectedRoute>
  )
}

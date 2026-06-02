'use client'

import Link from 'next/link'
import { FirebaseError } from 'firebase/app'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { siteConfig } from '@/lib/site-config'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { login, loginWithGoogle, loading, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/')
    }
  }, [loading, user, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      router.replace('/admin/')
    } catch (caughtError) {
      const message = caughtError instanceof FirebaseError ? caughtError.message : 'Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setSubmitting(true)

    try {
      await loginWithGoogle()
      router.replace('/admin/')
    } catch (caughtError) {
      const message = caughtError instanceof FirebaseError ? caughtError.message : 'Logowanie Google nie powiodło się.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-wall-ink text-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center p-6 md:p-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="focus-ring mb-10 inline-flex rounded-xl"><Logo /></Link>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">Panel administracyjny</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Zaloguj się do WALL</h1>
          <p className="mt-4 leading-7 text-white/66">Dostęp jest obsługiwany wyłącznie przez Firebase Authentication po stronie klienta.</p>
          <form onSubmit={handleSubmit} className="mt-9 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              E-mail
              <input className="focus-ring rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-white placeholder:text-white/35" type="email" value={email} onChange={event => setEmail(event.target.value)} required placeholder="admin@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Hasło
              <input className="focus-ring rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-white placeholder:text-white/35" type="password" value={password} onChange={event => setPassword(event.target.value)} required placeholder="••••••••" />
            </label>
            {error && <p className="rounded-2xl bg-red-500/12 p-4 text-sm font-semibold text-red-100" role="alert">{error}</p>}
            <button className="focus-ring rounded-2xl bg-wall-orange px-6 py-4 text-sm font-black text-white transition hover:bg-[#e84412] disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || loading} type="submit">
              {submitting ? 'Logowanie...' : 'Zaloguj przez Email/Password'}
            </button>
          </form>
          {siteConfig.auth.googleEnabled && (
            <button className="focus-ring mt-4 w-full rounded-2xl border border-white/14 px-6 py-4 text-sm font-black text-white transition hover:bg-white/8" type="button" onClick={handleGoogleLogin} disabled={submitting || loading}>
              Zaloguj przez Google
            </button>
          )}
        </div>
      </section>
      <section className="hidden items-center bg-[radial-gradient(circle_at_center,rgba(255,77,22,0.28),transparent_38%)] p-12 lg:flex">
        <div className="rounded-[36px] border border-white/12 bg-white/[0.05] p-10 shadow-dark backdrop-blur-xl">
          <h2 className="text-4xl font-black tracking-tight">Bez bazy danych. Bez backendu. Spark friendly.</h2>
          <p className="mt-5 text-lg leading-8 text-white/66">Panel pozwala testować konfigurację lokalnie w przeglądarce i eksportować JSON do wdrożenia statycznego.</p>
        </div>
      </section>
    </main>
  )
}

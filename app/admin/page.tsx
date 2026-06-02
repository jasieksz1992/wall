'use client'

import Link from 'next/link'
import { AdminShell } from '@/components/AdminShell'
import { useAuth } from '@/lib/auth'

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <AdminShell>
      <main className="container-wall py-12 md:py-16">
        <section className="rounded-[32px] bg-wall-ink p-8 text-white shadow-dark md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">Dashboard</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Panel administracyjny WALL</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">Jesteś zalogowany jako {user?.email}. Panel działa bez bazy danych i zapisuje konfigurację lokalnie w tej przeglądarce.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/admin/config/" className="focus-ring rounded-2xl bg-wall-orange px-6 py-4 text-sm font-black text-white">Edytuj konfigurację</Link>
            <Link href="/" className="focus-ring rounded-2xl border border-white/14 px-6 py-4 text-sm font-black text-white">Zobacz stronę</Link>
          </div>
        </section>
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ['Firebase Auth', 'Logowanie działa przez Firebase Web SDK po stronie klienta.'],
            ['Static export', 'Next.js generuje statyczny folder out gotowy na Firebase Hosting.'],
            ['localStorage', 'Zmiany konfiguracji są prywatne dla aktualnej przeglądarki.']
          ].map(([title, description]) => (
            <article key={title} className="rounded-[28px] bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-zinc-600">{description}</p>
            </article>
          ))}
        </section>
      </main>
    </AdminShell>
  )
}

import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-wall-ink p-6 text-white">
      <section className="max-w-xl text-center">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight">Nie znaleziono strony</h1>
        <p className="mt-5 text-lg leading-8 text-white/68">Adres, którego szukasz, nie istnieje w statycznym serwisie WALL.</p>
        <Link href="/" className="focus-ring mt-8 inline-flex rounded-2xl bg-wall-orange px-6 py-4 text-sm font-bold text-white">Wróć na stronę główną</Link>
      </section>
    </main>
  )
}

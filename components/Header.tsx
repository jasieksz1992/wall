'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SiteConfig } from '@/types/site-config'
import { ButtonLink } from '@/components/ButtonLink'
import { Logo } from '@/components/Logo'

export function Header({ config }: { config: SiteConfig }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-wall-ink/78 backdrop-blur-2xl">
      <div className="container-wall flex h-20 items-center justify-between gap-6">
        <Link href="/" className="focus-ring rounded-xl" aria-label="Przejdź na stronę główną WALL">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Główna nawigacja">
          {config.navigation.map(item => (
            <Link key={item.href} href={item.href} className="focus-ring rounded-lg text-sm font-semibold text-white/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <ButtonLink href="#wyslij-projekt">Wyślij projekt</ButtonLink>
        </div>
        <button className="focus-ring rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white lg:hidden" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation">
          Menu
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="container-wall border-t border-white/10 pb-5 lg:hidden" aria-label="Nawigacja mobilna">
          <div className="grid gap-2 pt-4">
            {config.navigation.map(item => (
              <Link key={item.href} href={item.href} className="focus-ring rounded-xl px-3 py-3 text-base font-semibold text-white/85" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <ButtonLink href="#wyslij-projekt">Wyślij projekt</ButtonLink>
          </div>
        </nav>
      )}
    </header>
  )
}

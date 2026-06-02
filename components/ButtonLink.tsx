import Link from 'next/link'
import { ReactNode } from 'react'

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'light'
}

export function ButtonLink({ href, children, variant = 'primary' }: ButtonLinkProps) {
  const className = {
    primary: 'bg-wall-orange text-white shadow-lg shadow-wall-orange/25 hover:bg-[#e84412]',
    secondary: 'border border-white/25 bg-white/5 text-white hover:bg-white/10',
    light: 'bg-white text-wall-ink shadow-lg shadow-black/10 hover:bg-zinc-100'
  }[variant]

  return (
    <Link href={href} className={`focus-ring inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold transition ${className}`}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  )
}

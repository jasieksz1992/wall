import Image from 'next/image'
import { SiteConfig } from '@/types/site-config'
import { ButtonLink } from '@/components/ButtonLink'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { ProjectForm } from '@/components/ProjectForm'

export function LandingPage({ config }: { config: SiteConfig }) {
  return (
    <div className="min-h-screen bg-wall-soft">
      <Header config={config} />
      <main>
        <Hero config={config} />
        <Benefits config={config} />
        <Process config={config} />
        <Systems config={config} />
        <AiSection config={config} />
        <Realizations config={config} />
        <Interior config={config} />
        <Stats config={config} />
        <FinalCta config={config} />
      </main>
      <Footer config={config} />
    </div>
  )
}

function Hero({ config }: { config: SiteConfig }) {
  return (
    <section className="relative overflow-hidden bg-wall-ink text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,77,22,0.20),transparent_34%),linear-gradient(120deg,rgba(7,10,14,0.98),rgba(7,10,14,0.78))]" />
      <div className="container-wall relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:py-28">
        <div>
          <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-wall-orange">{config.hero.eyebrow}</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
            {config.hero.title} <span className="text-wall-orange">{config.hero.highlight}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">{config.hero.description}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={config.hero.primaryCta.href}>{config.hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={config.hero.secondaryCta.href} variant="secondary">{config.hero.secondaryCta.label}</ButtonLink>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            {config.hero.trustBadges.map(badge => (
              <span key={badge} className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-bold text-white/80">{badge}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <Image src={config.hero.image} alt="Budowa domu z prefabrykowanych ścian z cegły WALL" width={1200} height={760} priority className="aspect-[1.42] rounded-[32px] object-cover shadow-dark" />
          <div className="absolute bottom-5 left-5 rounded-[24px] border border-white/20 bg-wall-ink/82 p-5 text-white shadow-dark backdrop-blur-xl">
            <div className="text-4xl font-black text-wall-orange">{config.hero.stats[0]?.value}</div>
            <div className="text-sm font-bold text-white/75">{config.hero.stats[0]?.label}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits({ config }: { config: SiteConfig }) {
  return (
    <section id="technologia" className="section-padding bg-white">
      <div className="container-wall">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {config.benefits.map(benefit => (
            <article key={benefit.title} className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-premium">
              {benefit.image && <Image src={benefit.image} alt={benefit.title} width={1200} height={760} className="aspect-[1.6] object-cover" />}
              <div className="p-8">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl font-black text-wall-orange">{benefit.icon}</div>
                <h2 className="text-2xl font-black tracking-tight text-wall-ink">{benefit.title}</h2>
                <p className="mt-4 leading-7 text-zinc-600">{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process({ config }: { config: SiteConfig }) {
  return (
    <section id="jak-to-dziala" className="section-padding bg-wall-ink text-white">
      <div className="container-wall">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">Proces</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Jak to działa</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-5">
          {config.processSteps.map((step, index) => (
            <article key={step.title} className="rounded-[28px] border border-white/12 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:bg-white/[0.07]">
              <Image src={step.image} alt={step.title} width={1200} height={760} className="mb-6 aspect-[4/3] rounded-2xl object-cover" />
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wall-orange text-sm font-black">{index + 1}</span>
                <h3 className="text-lg font-black">{step.title}</h3>
              </div>
              <p className="text-sm leading-6 text-white/68">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Systems({ config }: { config: SiteConfig }) {
  return (
    <section id="produkty" className="section-padding bg-white">
      <div className="container-wall grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">{config.systemsSection.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-wall-ink md:text-5xl">{config.systemsSection.title}</h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600">{config.systemsSection.description}</p>
          <ul className="mt-7 grid gap-3">
            {config.systemsSection.features.map(feature => <FeatureItem key={feature} label={feature} />)}
          </ul>
          {config.systemsSection.cta && <div className="mt-8"><ButtonLink href={config.systemsSection.cta.href} variant="light">{config.systemsSection.cta.label}</ButtonLink></div>}
        </div>
        <Image src={config.systemsSection.image} alt="Render prefabrykowanej ściany z cegły z oknem" width={1200} height={760} className="aspect-[1.42] rounded-[32px] object-cover shadow-premium" />
      </div>
    </section>
  )
}

function AiSection({ config }: { config: SiteConfig }) {
  return (
    <section className="section-padding bg-wall-ink text-white">
      <div className="container-wall grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">{config.aiSection.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{config.aiSection.title}</h2>
          <p className="mt-6 text-lg leading-8 text-white/68">{config.aiSection.description}</p>
          {config.aiSection.cta && <div className="mt-8"><ButtonLink href={config.aiSection.cta.href} variant="secondary">{config.aiSection.cta.label}</ButtonLink></div>}
        </div>
        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <Image src={config.aiSection.image} alt="Blueprint i digital twin budynku" width={1200} height={760} className="aspect-[1.42] rounded-[32px] object-cover shadow-dark" />
          <div className="grid gap-4">
            {config.aiSection.features.map(feature => <div key={feature} className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 font-bold text-white/82">{feature}</div>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Realizations({ config }: { config: SiteConfig }) {
  return (
    <section id="realizacje" className="section-padding bg-white">
      <div className="container-wall">
        <div className="mb-12 text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">Portfolio</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-wall-ink md:text-5xl">Realizacje</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {config.realizations.map(realization => (
            <article key={realization.title} className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
              <Image src={realization.image} alt={realization.title} width={1200} height={760} className="aspect-[1.35] object-cover" />
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="text-xl font-black text-wall-ink">{realization.title}</h3>
                  <p className="mt-2 leading-6 text-zinc-600">{realization.description}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wall-orange font-black text-white transition group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Interior({ config }: { config: SiteConfig }) {
  return (
    <section id="komfort" className="section-padding bg-wall-ink text-white">
      <div className="container-wall grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <Image src={config.interiorSection.image} alt="Komfortowe wnętrze domu po szybkiej konstrukcji" width={1200} height={760} className="aspect-[1.42] rounded-[32px] object-cover shadow-dark" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">{config.interiorSection.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{config.interiorSection.title}</h2>
          <p className="mt-6 text-lg leading-8 text-white/70">{config.interiorSection.description}</p>
          <ul className="mt-7 grid gap-3">
            {config.interiorSection.features.map(feature => <FeatureItem key={feature} label={feature} dark />)}
          </ul>
          {config.interiorSection.cta && <div className="mt-8"><ButtonLink href={config.interiorSection.cta.href}>{config.interiorSection.cta.label}</ButtonLink></div>}
        </div>
      </div>
    </section>
  )
}

function Stats({ config }: { config: SiteConfig }) {
  const stats = [...config.hero.stats, { value: '0', label: 'kompromisów' }]

  return (
    <section className="bg-white py-10">
      <div className="container-wall grid gap-4 md:grid-cols-4">
        {stats.slice(0, 4).map(stat => (
          <div key={`${stat.value}-${stat.label}`} className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-8 text-center">
            <div className="text-4xl font-black text-wall-orange">{stat.value}</div>
            <div className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCta({ config }: { config: SiteConfig }) {
  return (
    <section className="bg-wall-orange py-14 text-white">
      <div className="container-wall grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">{config.finalCta.title}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/88">{config.finalCta.description}</p>
        </div>
        <ButtonLink href={config.finalCta.cta.href} variant="light">{config.finalCta.cta.label}</ButtonLink>
      </div>
      <div className="container-wall mt-10">
        <ProjectForm />
      </div>
    </section>
  )
}

function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer id="kontakt" className="bg-wall-ink py-14 text-white">
      <div className="container-wall grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm leading-7 text-white/62">{config.footer.description}</p>
          <p className="mt-6 text-sm text-white/45">© 2026 WALL. Wszelkie prawa zastrzeżone.</p>
        </div>
        {config.footer.columns.map(column => (
          <div key={column.title}>
            <h3 className="mb-4 font-black">{column.title}</h3>
            <div className="grid gap-3">
              {column.links.map(link => <a key={link.label} href={link.href} className="focus-ring rounded text-sm text-white/62 transition hover:text-white">{link.label}</a>)}
            </div>
          </div>
        ))}
        <div>
          <h3 className="mb-4 font-black">Kontakt</h3>
          <div className="grid gap-3 text-sm text-white/62">
            <a className="focus-ring rounded hover:text-white" href={`tel:${config.contact.phone}`}>{config.contact.phone}</a>
            <a className="focus-ring rounded hover:text-white" href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
            <span>{config.contact.address}</span>
          </div>
          <label className="mt-6 grid gap-2 text-sm font-bold text-white/80">
            Newsletter
            <input className="focus-ring rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-white placeholder:text-white/35" placeholder="Twój e-mail" aria-label="Statyczny newsletter bez backendu" />
          </label>
          <div className="mt-5 flex gap-3">
            {config.footer.social.map(link => <a key={link.label} href={link.href} className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-xs font-black transition hover:bg-wall-orange" aria-label={link.label}>{link.label.slice(0, 2)}</a>)}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FeatureItem({ label, dark = false }: { label: string, dark?: boolean }) {
  return (
    <li className={`flex items-center gap-3 font-bold ${dark ? 'text-white/80' : 'text-zinc-700'}`}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wall-orange text-xs text-white" aria-hidden="true">✓</span>
      {label}
    </li>
  )
}

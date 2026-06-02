'use client'

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { AdminShell } from '@/components/AdminShell'
import { LandingPage } from '@/components/LandingPage'
import { clearLocalConfig, readLocalConfig, saveLocalConfig, siteConfig } from '@/lib/site-config'
import { SiteConfig } from '@/types/site-config'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<SiteConfig>(siteConfig)
  const [jsonValue, setJsonValue] = useState('')
  const [status, setStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const localConfig = readLocalConfig()
    setConfig(localConfig)
    setJsonValue(JSON.stringify(localConfig, null, 2))
  }, [])

  function updateText(path: ConfigPath, value: string) {
    const nextConfig = structuredClone(config)

    if (path === 'brand.name') {
      nextConfig.brand.name = value
    }

    if (path === 'brand.claim') {
      nextConfig.brand.claim = value
    }

    if (path === 'brand.logoText') {
      nextConfig.brand.logoText = value
    }

    if (path === 'brand.primaryColor') {
      nextConfig.brand.primaryColor = value
    }

    if (path === 'seo.title') {
      nextConfig.seo.title = value
    }

    if (path === 'seo.description') {
      nextConfig.seo.description = value
    }

    if (path === 'hero.eyebrow') {
      nextConfig.hero.eyebrow = value
    }

    if (path === 'hero.title') {
      nextConfig.hero.title = value
    }

    if (path === 'hero.highlight') {
      nextConfig.hero.highlight = value
    }

    if (path === 'hero.description') {
      nextConfig.hero.description = value
    }

    if (path === 'finalCta.title') {
      nextConfig.finalCta.title = value
    }

    if (path === 'finalCta.description') {
      nextConfig.finalCta.description = value
    }

    setConfig(nextConfig)
    setJsonValue(JSON.stringify(nextConfig, null, 2))
  }

  function handleSave() {
    saveLocalConfig(config)
    setStatus('Konfiguracja została zapisana lokalnie w tej przeglądarce.')
  }

  function handleRestore() {
    clearLocalConfig()
    setConfig(siteConfig)
    setJsonValue(JSON.stringify(siteConfig, null, 2))
    setStatus('Przywrócono domyślną konfigurację z public/site-config.json.')
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'site-config.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Wyeksportowano plik JSON z aktualną konfiguracją.')
  }

  function handleJsonChange(value: string) {
    setJsonValue(value)

    try {
      const parsedConfig = JSON.parse(value) as SiteConfig
      setConfig(parsedConfig)
      setStatus('Podgląd został zaktualizowany z treści JSON.')
    } catch {
      setStatus('JSON zawiera błąd składni. Popraw go przed zapisem.')
    }
  }

  function handleFileImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      handleJsonChange(result)
      setStatus('Zaimportowano plik JSON do edytora.')
    }
    reader.readAsText(file)
  }

  return (
    <AdminShell>
      <main className="container-wall py-10 md:py-14">
        <section className="rounded-[32px] bg-white p-6 shadow-premium md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-wall-orange">Konfiguracja</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Edytor statycznej strony WALL</h1>
          <p className="mt-5 rounded-2xl bg-orange-50 p-5 font-semibold leading-7 text-wall-ink">Konfiguracja zapisana w panelu działa lokalnie w tej przeglądarce. Aby opublikować zmiany globalnie, wyeksportuj JSON i podmień plik public/site-config.json przed wdrożeniem.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="focus-ring rounded-2xl bg-wall-orange px-5 py-3 text-sm font-black text-white" type="button" onClick={handleSave}>Zapisz lokalnie</button>
            <button className="focus-ring rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-black" type="button" onClick={handleRestore}>Przywróć domyślne</button>
            <button className="focus-ring rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-black" type="button" onClick={handleExport}>Eksportuj JSON</button>
            <button className="focus-ring rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-black" type="button" onClick={() => fileInputRef.current?.click()}>Importuj JSON</button>
            <input ref={fileInputRef} className="hidden" type="file" accept="application/json" onChange={handleFileImport} />
          </div>
          {status && <p className="mt-5 rounded-2xl bg-zinc-100 p-4 text-sm font-bold text-zinc-700" role="status">{status}</p>}
        </section>
        <section className="mt-8 grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="grid gap-6">
            <EditorCard title="Marka">
              <TextField label="Nazwa" value={config.brand.name} onChange={value => updateText('brand.name', value)} />
              <TextField label="Claim" value={config.brand.claim} onChange={value => updateText('brand.claim', value)} />
              <TextField label="Logo text" value={config.brand.logoText} onChange={value => updateText('brand.logoText', value)} />
              <TextField label="Kolor główny" value={config.brand.primaryColor} onChange={value => updateText('brand.primaryColor', value)} />
            </EditorCard>
            <EditorCard title="SEO i hero">
              <TextField label="Tytuł SEO" value={config.seo.title} onChange={value => updateText('seo.title', value)} />
              <TextAreaField label="Opis SEO" value={config.seo.description} onChange={value => updateText('seo.description', value)} />
              <TextField label="Hero eyebrow" value={config.hero.eyebrow} onChange={value => updateText('hero.eyebrow', value)} />
              <TextField label="Hero title" value={config.hero.title} onChange={value => updateText('hero.title', value)} />
              <TextField label="Hero highlight" value={config.hero.highlight} onChange={value => updateText('hero.highlight', value)} />
              <TextAreaField label="Hero description" value={config.hero.description} onChange={value => updateText('hero.description', value)} />
            </EditorCard>
            <EditorCard title="Final CTA i pełny JSON">
              <TextField label="CTA title" value={config.finalCta.title} onChange={value => updateText('finalCta.title', value)} />
              <TextAreaField label="CTA description" value={config.finalCta.description} onChange={value => updateText('finalCta.description', value)} />
              <label className="grid gap-2 text-sm font-bold">
                Pełny JSON
                <textarea className="focus-ring min-h-[360px] rounded-2xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-5" value={jsonValue} onChange={event => handleJsonChange(event.target.value)} />
              </label>
            </EditorCard>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-premium">
            <div className="border-b border-zinc-200 p-5">
              <h2 className="text-2xl font-black">Podgląd podstawowych sekcji</h2>
              <p className="mt-1 text-sm text-zinc-600">Podgląd korzysta z aktualnego obiektu SiteConfig w pamięci przeglądarki.</p>
            </div>
            <div className="max-h-[1200px] overflow-auto">
              <div className="origin-top scale-[0.82] md:scale-90 xl:scale-75">
                <LandingPage config={config} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  )
}

type ConfigPath = 'brand.name' | 'brand.claim' | 'brand.logoText' | 'brand.primaryColor' | 'seo.title' | 'seo.description' | 'hero.eyebrow' | 'hero.title' | 'hero.highlight' | 'hero.description' | 'finalCta.title' | 'finalCta.description'

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function EditorCard({ title, children }: { title: string, children: ReactNode }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-black">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </section>
  )
}

function TextField({ label, value, onChange }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input className="focus-ring rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-medium" value={value} onChange={event => onChange(event.target.value)} />
    </label>
  )
}

function TextAreaField({ label, value, onChange }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <textarea className="focus-ring min-h-28 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-medium" value={value} onChange={event => onChange(event.target.value)} />
    </label>
  )
}

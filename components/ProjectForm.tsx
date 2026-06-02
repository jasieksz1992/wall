'use client'

import { FormEvent, useState } from 'react'

export function ProjectForm() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('To demonstracyjny formularz statyczny. Aby odbierać zgłoszenia, podłącz zewnętrzny system formularzy albo przejdź na Blaze lub inną usługę backendową.')
  }

  return (
    <form id="wyslij-projekt" onSubmit={handleSubmit} className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-premium md:p-8" aria-label="Formularz wysłania projektu">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-wall-ink">
          Imię i nazwisko
          <input className="focus-ring rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 font-medium" name="name" required placeholder="Jan Kowalski" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-wall-ink">
          E-mail
          <input className="focus-ring rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 font-medium" name="email" type="email" required placeholder="jan@example.com" />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-bold text-wall-ink">
        Opis projektu
        <textarea className="focus-ring min-h-32 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 font-medium" name="project" required placeholder="Napisz, jaki dom chcesz zbudować i na jakim etapie jest dokumentacja." />
      </label>
      <button className="focus-ring mt-5 rounded-2xl bg-wall-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-wall-orange" type="submit">
        Wyślij projekt demonstracyjnie
      </button>
      {message && <p className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-semibold text-wall-ink" role="status">{message}</p>}
    </form>
  )
}

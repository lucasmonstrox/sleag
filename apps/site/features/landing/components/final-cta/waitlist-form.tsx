"use client"

import { useState } from "react"
import { Check } from "lucide-react"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormStatus = "idle" | "error" | "done"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")

  function handleSubmit() {
    if (!EMAIL_RE.test(email)) {
      setStatus("error")
      return
    }
    // TODO: integrar com o provedor de e-mail (Resend) quando o backend existir
    setStatus("done")
  }

  if (status === "done") {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-lg border border-[#25f4ee]/40 bg-[#25f4ee]/10 px-5 py-4">
        <Check className="size-4 shrink-0 text-[#25f4ee]" aria-hidden />
        <p className="text-sm text-zinc-200">
          Você está na lista. A gente avisa antes de todo mundo — óbvio.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
      className="mx-auto max-w-md"
      noValidate
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Seu melhor e-mail
        </label>
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (status === "error") setStatus("idle")
          }}
          placeholder="seu melhor e-mail"
          aria-invalid={status === "error"}
          className="flex-1 rounded-lg border border-white/15 bg-[#0a0a0c] px-4 py-3 text-sm text-zinc-100 transition-colors outline-none placeholder:text-zinc-600 focus:border-[#25f4ee] aria-[invalid=true]:border-[#fe2c55]"
        />
        <button
          type="submit"
          className="rounded-lg bg-white px-6 py-3 text-sm font-medium whitespace-nowrap text-black transition-colors hover:bg-zinc-200"
        >
          Entrar na lista
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-left text-xs text-[#fe2c55]" role="alert">
          Esse e-mail não parece válido — confere aí.
        </p>
      )}
    </form>
  )
}

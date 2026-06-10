"use client"

import { useState, useTransition } from "react"
import { ArrowLeftIcon, Loader2Icon, MailCheckIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { redefinirComOtp, solicitarRecuperacao } from "../../actions/auth"

type Step = "email" | "codigo"

const submitClass =
  "mt-2 bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] font-medium text-white shadow-[0_8px_30px_-12px_rgba(254,44,85,0.6)] transition-opacity hover:opacity-90 hover:bg-gradient-to-r"

export function RecuperarSenhaForm() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSolicitar(formData: FormData) {
    const value = String(formData.get("email") ?? "")
    setError(null)
    startTransition(async () => {
      const result = await solicitarRecuperacao(value)
      if (result.error) {
        setError(result.error)
        return
      }
      setEmail(value)
      setStep("codigo")
    })
  }

  function handleRedefinir(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await redefinirComOtp({
        email,
        token: String(formData.get("token") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirmar: String(formData.get("confirmar") ?? ""),
      })
      // Sucesso → a action redireciona no servidor. Só tratamos o erro.
      if (result?.error) setError(result.error)
    })
  }

  if (step === "email") {
    return (
      <form action={handleSolicitar} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-muted-foreground">
            Email da conta
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com.br"
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className={submitClass}>
          {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          Enviar código
        </Button>
      </form>
    )
  }

  return (
    <form action={handleRedefinir} className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 text-sm ring-1 ring-white/10">
        <MailCheckIcon className="mt-0.5 size-4.5 shrink-0 text-cyan-300" />
        <p className="text-muted-foreground">
          Enviámos um código de 6 dígitos para{" "}
          <span className="text-foreground">{email}</span>.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="token" className="text-sm text-muted-foreground">
          Código de verificação
        </label>
        <Input
          id="token"
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          className="text-center text-lg tracking-[0.5em]"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-muted-foreground">
          Nova senha
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmar" className="text-sm text-muted-foreground">
          Confirmar nova senha
        </label>
        <Input
          id="confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className={submitClass}>
        {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
        Redefinir senha
      </Button>

      <button
        type="button"
        onClick={() => {
          setError(null)
          setStep("email")
        }}
        className="mx-auto flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <ArrowLeftIcon className="size-3.5" />
        Usar outro email
      </button>
    </form>
  )
}

"use client"

import { useActionState } from "react"
import { CheckCircle2Icon, Loader2Icon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { signUp } from "../../actions/auth"

export function RegistroForm() {
  const [state, formAction, isPending] = useActionState(signUp, {})

  if (state.message) {
    return (
      <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4 text-sm ring-1 ring-white/10">
        <CheckCircle2Icon className="mt-0.5 size-4.5 shrink-0 text-cyan-300" />
        <p className="text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="nome" className="text-sm text-muted-foreground">
          Nome
        </label>
        <Input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          placeholder="Como podemos te chamar?"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-muted-foreground">
          Email
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

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-muted-foreground">
          Senha
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
          Confirmar senha
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

      {state.error ? (
        <p className="text-sm text-rose-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] font-medium text-white shadow-[0_8px_30px_-12px_rgba(254,44,85,0.6)] transition-opacity hover:opacity-90 hover:bg-gradient-to-r"
      >
        {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
        Criar conta
      </Button>
    </form>
  )
}

"use client"

import { useActionState } from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { definirSenha } from "../../actions/auth"

export function DefinirSenhaForm() {
  const [state, formAction, isPending] = useActionState(definirSenha, {})

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-muted-foreground">
          Nova senha
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
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
        Definir senha
      </Button>
    </form>
  )
}

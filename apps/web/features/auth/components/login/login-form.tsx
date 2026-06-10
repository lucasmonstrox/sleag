"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { signIn } from "../../actions/auth"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, {})

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Senha
          </label>
          <Link
            href="/recuperar-senha"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Esqueci a senha
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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
        Entrar
      </Button>
    </form>
  )
}

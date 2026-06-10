import { CrosshairIcon } from "lucide-react"

import { AuthHero } from "./auth-hero"

type AuthShellProps = {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

/** Layout split-screen partilhado pelas páginas de auth (login, registro, recuperar). */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <AuthHero />

      <div className="relative flex flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[#FE2C55]/10 blur-[120px] lg:hidden"
        />

        <div className="relative flex w-full max-w-sm flex-col gap-8">
          {/* Marca (só no mobile; no desktop ela vive no hero) */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <div className="flex aspect-square size-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#25F4EE] to-[#FE2C55] text-white">
              <CrosshairIcon className="size-5" />
            </div>
            <span className="font-heading text-lg font-semibold tracking-[0.2em]">
              TIKSPY
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}

          {footer ? (
            <div className="text-center text-xs leading-relaxed text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

import { NAV_LINKS } from "../consts"
import { Parallax } from "./fx/parallax"

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#010101] pt-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className="tt-glitch-soft font-mono text-lg font-extrabold tracking-tighter">
              SLEAG
            </p>
            <p className="mt-2 font-mono text-xs text-zinc-500">
              // o dinheiro deixa rastro
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-10 text-[11px] leading-relaxed text-zinc-600">
          Plataforma independente, sem vínculo com o TikTok ou a ByteDance. Métricas exibidas são
          estimativas sobre dados públicos. © 2026 SLEAG · Feito no Brasil.
        </p>
      </div>

      <Parallax speed={-0.1}>
        <p
          className="tt-outline font-display pointer-events-none mt-6 -mb-[0.22em] text-center text-[22vw] leading-none font-extrabold tracking-tight uppercase opacity-50 select-none"
          aria-hidden
        >
          SLEAG
        </p>
      </Parallax>
    </footer>
  )
}

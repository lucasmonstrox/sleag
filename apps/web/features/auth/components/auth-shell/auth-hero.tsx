import {
  BellRingIcon,
  CrosshairIcon,
  GaugeIcon,
  TrendingUpIcon,
} from "lucide-react"

const FEATURES = [
  {
    icon: TrendingUpIcon,
    title: "Produtos em alta",
    description:
      "O que está bombando por categoria — com GMV, velocidade de vendas e janela de oportunidade.",
  },
  {
    icon: CrosshairIcon,
    title: "Espione a concorrência",
    description:
      "Vídeos, lives e catálogo dos players que importam. Veja a jogada antes de reagir.",
  },
  {
    icon: GaugeIcon,
    title: "Score de viabilidade",
    description:
      "Saiba se vale a pena vender antes de comprometer o estoque.",
  },
  {
    icon: BellRingIcon,
    title: "Alertas em tempo real",
    description:
      "WhatsApp, e-mail e Telegram no segundo em que algo decola.",
  },
] as const

const PROOF = [
  "+12 mil produtos rastreados/dia",
  "Dados de hora em hora",
  "TikTok Shop Brasil",
] as const

export function AuthHero() {
  return (
    <div className="relative hidden overflow-hidden bg-[#070708] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      {/* Glows da marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-[28rem] rounded-full bg-[#25F4EE]/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 size-[32rem] rounded-full bg-[#FE2C55]/20 blur-[140px]"
      />
      {/* Grid sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#25F4EE] to-[#FE2C55] text-white">
          <CrosshairIcon className="size-5" />
        </div>
        <span className="font-heading text-base font-semibold tracking-[0.25em]">
          TIKSPY
        </span>
      </div>

      <div className="relative flex max-w-xl flex-col gap-10">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-white/10">
            <span className="size-1.5 rounded-full bg-[#25F4EE] shadow-[0_0_8px_#25F4EE]" />
            Inteligência de mercado · TikTok Shop
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
            Descubra o próximo produto{" "}
            <span className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] bg-clip-text text-transparent">
              viral
            </span>{" "}
            antes de todo mundo.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Produtos em ascensão, criativos que convertem e a jogada da
            concorrência — em tempo real, no maior canal de vendas do Brasil.
          </p>
        </div>

        <ul className="flex flex-col gap-5">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex items-start gap-4">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-200 ring-1 ring-white/10">
                <feature.icon className="size-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{feature.title}</span>
                <span className="text-sm leading-snug text-muted-foreground">
                  {feature.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {PROOF.map((item, index) => (
          <span key={item} className="flex items-center gap-3">
            {index > 0 ? (
              <span className="size-1 rounded-full bg-white/20" />
            ) : null}
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

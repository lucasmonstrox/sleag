import type { ReactNode } from "react"

import { BadgeCheckIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react"

import type { MarketCreatorDetail } from "api"

import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { formatCompact, formatRegion, getInitials } from "@/shared"

type CriadorDetalheHeaderProps = {
  creator: MarketCreatorDetail
}

export function CriadorDetalheHeader({ creator }: CriadorDetalheHeaderProps) {
  const region = formatRegion(creator.region)

  return (
    <div className="flex flex-wrap items-start gap-4">
      {creator.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- CDN externo (EchoTik), sem next/image config
        <img
          src={creator.avatar}
          alt={creator.name}
          className="size-20 shrink-0 rounded-full bg-muted object-cover ring-1 ring-foreground/10"
        />
      ) : (
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-rose-500/20 font-heading text-lg font-semibold text-cyan-200">
          {getInitials(creator.name)}
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {creator.name}
          </h1>
          {creator.verified ? (
            <BadgeCheckIcon
              className="size-5 shrink-0 fill-[#25F4EE] text-background"
              aria-label="Conta verificada"
            />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {creator.handle ? (
            <a
              href={`https://www.tiktok.com/@${creator.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
            >
              @{creator.handle}
              <ExternalLinkIcon className="size-3" />
            </a>
          ) : null}
          {region ? (
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-3" />
              {region}
            </span>
          ) : null}
          <span className="text-muted-foreground/80">
            Segue {formatCompact(creator.following)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {creator.niche && creator.niche !== "—" ? (
            <Badge variant="outline" className="border-[#25F4EE]/40 text-[#25F4EE]">
              {creator.niche}
            </Badge>
          ) : null}
          {creator.ecScore > 0 ? (
            <Badge variant="outline" className="text-muted-foreground">
              EC score {Math.round(creator.ecScore)}
            </Badge>
          ) : null}
          {/* Redes externas: ligadas quando o realtime trouxe, desligadas (cinza,
              sem link) quando não. */}
          <SocialLink
            href={creator.youtube?.url}
            label={creator.youtube?.title ?? "Sem canal de YouTube"}
            icon={<YoutubeIcon />}
          />
          <SocialLink
            href={creator.twitter?.url}
            label={
              creator.twitter ? `@${creator.twitter.handle}` : "Sem Twitter/X"
            }
            icon={<XIcon />}
          />
        </div>
        {creator.bio ? (
          <p className="mt-1 max-w-xl whitespace-pre-line text-sm text-muted-foreground/90">
            {creator.bio}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/** Ícone de rede: link colorido quando há `href`; cinza e inerte quando não. */
function SocialLink({
  href,
  label,
  icon,
}: {
  href?: string | null
  label: string
  icon: ReactNode
}) {
  const base =
    "inline-flex size-7 items-center justify-center rounded-md ring-1 transition-colors"
  if (!href) {
    return (
      <span
        title={label}
        aria-label={label}
        className={cn(
          base,
          "cursor-default text-muted-foreground/30 ring-border/40",
        )}
      >
        {icon}
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className={cn(
        base,
        "text-foreground/80 ring-border/60 hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {icon}
    </a>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.8-8.9L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.7L7.4 3.8H5.6L17.7 20Z" />
    </svg>
  )
}

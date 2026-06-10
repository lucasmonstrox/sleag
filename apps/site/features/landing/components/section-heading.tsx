import { cn } from "@workspace/ui/lib/utils"

interface SectionHeadingProps {
  kicker: string
  title: React.ReactNode
  lead?: React.ReactNode
  align?: "left" | "center"
}

export function SectionHeading({ kicker, title, lead, align = "left" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="font-mono text-xs tracking-[0.3em] text-[#25f4ee] uppercase">{kicker}</p>
      <h2 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-zinc-400">{lead}</p>}
    </div>
  )
}

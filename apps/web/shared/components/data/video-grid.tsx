import { EyeIcon, PlayIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

const THUMB_TONES = [
  "from-cyan-500/25 via-slate-800 to-rose-500/20",
  "from-rose-500/25 via-slate-900 to-violet-500/20",
  "from-violet-500/25 via-slate-900 to-cyan-500/20",
  "from-amber-500/20 via-slate-900 to-emerald-500/15",
  "from-emerald-500/20 via-slate-900 to-sky-500/20",
  "from-sky-500/25 via-slate-900 to-amber-500/15",
]

export type VideoItem = {
  title: string
  creator: string
  views: string
  gmv: string
}

type VideoGridProps = {
  items: VideoItem[]
  className?: string
}

export function VideoGrid({ items, className }: VideoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={item.title} className="flex flex-col gap-2.5">
          <div
            className={cn(
              "relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-gradient-to-br ring-1 ring-foreground/10",
              THUMB_TONES[index % THUMB_TONES.length],
            )}
          >
            <PlayIcon
              className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-white/50"
              fill="currentColor"
            />
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
              <EyeIcon className="size-3" />
              {item.views}
            </span>
          </div>
          <span className="truncate text-sm font-medium">{item.title}</span>
          <div className="flex items-center justify-between text-xs">
            <span className="truncate text-muted-foreground">{item.creator}</span>
            <span className="font-medium text-emerald-400">{item.gmv}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Plus } from "lucide-react"

import { FAQ_ITEMS } from "../consts"
import { SectionHeading } from "./section-heading"

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-b border-white/[0.08] py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeading align="center" kicker="// objeções" title="Sem letra miúda." />

        <div className="mt-12">
          {FAQ_ITEMS.map((item, index) => (
            <details key={item.question} className="group border-b border-white/10 py-5">
              <summary className="flex cursor-pointer list-none items-center gap-4 font-semibold text-zinc-200 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-xs text-[#25f4ee]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.question}
                <Plus
                  className="ml-auto size-4 shrink-0 text-[#25f4ee] transition-transform group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 pl-9 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

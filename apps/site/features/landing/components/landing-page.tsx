import { ConsoleSection } from "./console/console-section"
import { FaqSection } from "./faq-section"
import { FinalCtaSection } from "./final-cta/final-cta-section"
import { CursorCrosshair } from "./fx/cursor-crosshair"
import { HeroSection } from "./hero/hero-section"
import { MarketSection } from "./market/market-section"
import { PricingSection } from "./pricing-section"
import { ScoreSection } from "./score-section/score-section"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { StatementBand } from "./statement-band"
import { TickerTape } from "./ticker-tape"
import { VisionBand } from "./vision-band"

export function LandingPage() {
  return (
    <div className="bg-[#010101] text-zinc-50">
      <CursorCrosshair />
      <SiteHeader />
      <main>
        <HeroSection />
        <TickerTape />
        <div className="mx-auto max-w-6xl border-x border-white/[0.08]">
          <VisionBand />
          <ConsoleSection />
          <ScoreSection />
          <StatementBand />
          <MarketSection />
          <PricingSection />
          <FaqSection />
          <FinalCtaSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

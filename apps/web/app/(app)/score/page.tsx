import type { Metadata } from "next"

import { ScorePage } from "@/features/viabilidade"

export const metadata: Metadata = { title: "Score & quadrante" }

export default function Page() {
  return <ScorePage />
}

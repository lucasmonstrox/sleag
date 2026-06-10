import type { Metadata } from "next"

import { DesempenhoPage } from "@/features/desempenho"

export const metadata: Metadata = { title: "Desempenho" }

export default function Page() {
  return <DesempenhoPage />
}

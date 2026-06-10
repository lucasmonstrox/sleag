import type { Metadata } from "next"

import { LojasPage } from "@/features/concorrencia"

export const metadata: Metadata = { title: "Lojas" }

export default function Page() {
  return <LojasPage />
}

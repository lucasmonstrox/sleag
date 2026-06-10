import type { Metadata } from "next"

import { ContaPage } from "@/features/conta"

export const metadata: Metadata = { title: "Conta" }

export default function Page() {
  return <ContaPage />
}

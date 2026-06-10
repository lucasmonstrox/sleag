import type { Metadata } from "next"

import { AlertasPage } from "@/features/alertas"

export const metadata: Metadata = { title: "Alertas" }

export default function Page() {
  return <AlertasPage />
}

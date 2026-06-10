import type { Metadata } from "next"

import { MonitoramentoPage } from "@/features/monitoramento"

export const metadata: Metadata = { title: "Regras" }

export default function Page() {
  return <MonitoramentoPage />
}

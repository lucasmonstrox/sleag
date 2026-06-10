import { PageHeader, PageShell } from "@/shared"

import { LojasTab } from "./tabs/lojas-tab"

export function LojasPage() {
  return (
    <PageShell>
      <PageHeader
        title="Lojas"
        description="Inteligência competitiva de lojas: sortimento, desempenho e movimentos recentes."
      />
      <LojasTab />
    </PageShell>
  )
}

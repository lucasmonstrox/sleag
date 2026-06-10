import { PageHeader, PageShell } from "@/shared"

import { CriadoresTab } from "./tabs/criadores-tab"

export function CriadoresPage() {
  return (
    <PageShell>
      <PageHeader
        title="Criadores"
        description="Quem está vendendo o quê — afiliados e criadores ranqueados por eficiência de venda."
      />
      <CriadoresTab />
    </PageShell>
  )
}

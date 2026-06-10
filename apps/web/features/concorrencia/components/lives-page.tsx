import { PageHeader, PageShell } from "@/shared"

import { LivesTab } from "./tabs/lives-tab"

export function LivesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Lives"
        description="Monitoramento de lives de venda — o motor do TikTok Shop Brasil."
      />
      <LivesTab />
    </PageShell>
  )
}

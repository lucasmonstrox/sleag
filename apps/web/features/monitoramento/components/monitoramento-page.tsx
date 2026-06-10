import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { PageHeader, PageShell } from "@/shared"

import { listarRegras } from "../services/regras"
import { NovaRegraDialog } from "./nova-regra-dialog"
import { RegrasTab } from "./tabs/regras-tab"
import { WatchlistTab } from "./tabs/watchlist-tab"

export async function MonitoramentoPage() {
  const regras = await listarRegras()
  return (
    <PageShell>
      <PageHeader
        title="Regras"
        description="Crie regras e monte sua watchlist — os alertas chegam na caixa de entrada."
      >
        <NovaRegraDialog />
      </PageHeader>
      <Tabs defaultValue="watchlist" className="gap-6">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="regras">Regras</TabsTrigger>
        </TabsList>
        <TabsContent value="watchlist" className="flex flex-col gap-6">
          <WatchlistTab />
        </TabsContent>
        <TabsContent value="regras" className="flex flex-col gap-6">
          <RegrasTab regras={regras} />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

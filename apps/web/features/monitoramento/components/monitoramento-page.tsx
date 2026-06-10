import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { PageHeader, PageShell } from "@/shared"

import { NovaRegraDialog } from "./nova-regra-dialog"
import { AlertasTab } from "./tabs/alertas-tab"
import { RegrasTab } from "./tabs/regras-tab"
import { WatchlistTab } from "./tabs/watchlist-tab"

export function MonitoramentoPage() {
  return (
    <PageShell>
      <PageHeader
        title="Monitoramento"
        description="Watchlist, alertas e regras — o TIKSPY vigia o mercado e avisa antes dos outros."
      >
        <NovaRegraDialog />
      </PageHeader>
      <Tabs defaultValue="watchlist" className="gap-6">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="regras">Regras</TabsTrigger>
        </TabsList>
        <TabsContent value="watchlist" className="flex flex-col gap-6">
          <WatchlistTab />
        </TabsContent>
        <TabsContent value="alertas" className="flex flex-col gap-6">
          <AlertasTab />
        </TabsContent>
        <TabsContent value="regras" className="flex flex-col gap-6">
          <RegrasTab />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

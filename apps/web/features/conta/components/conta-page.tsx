import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { PageHeader, PageShell } from "@/shared"

import { ConfiguracoesTab } from "./tabs/configuracoes-tab"
import { PlanoTab } from "./tabs/plano-tab"

export function ContaPage() {
  return (
    <PageShell>
      <PageHeader
        title="Conta"
        description="Perfil, notificações, assinatura e limites de uso."
      />
      <Tabs defaultValue="configuracoes" className="gap-6">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="plano">Plano & uso</TabsTrigger>
        </TabsList>
        <TabsContent value="configuracoes" className="flex flex-col gap-6">
          <ConfiguracoesTab />
        </TabsContent>
        <TabsContent value="plano" className="flex flex-col gap-6">
          <PlanoTab />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

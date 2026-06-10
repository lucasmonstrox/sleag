import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { PageHeader, PageShell } from "@/shared"

import { BuscarTab } from "./tabs/buscar-tab"
import { EmAltaTab } from "./tabs/em-alta-tab"
import { EmergentesTab } from "./tabs/emergentes-tab"

export function ProdutosPage() {
  return (
    <PageShell>
      <PageHeader
        title="Produtos"
        description="Descoberta de produtos no TikTok Shop Brasil — busca, rankings e emergentes antes do pico."
      />
      <Tabs defaultValue="buscar" className="gap-6">
        <TabsList>
          <TabsTrigger value="buscar">Buscar</TabsTrigger>
          <TabsTrigger value="em-alta">Em alta</TabsTrigger>
          <TabsTrigger value="emergentes">Emergentes</TabsTrigger>
        </TabsList>
        <TabsContent value="buscar" className="flex flex-col gap-6">
          <BuscarTab />
        </TabsContent>
        <TabsContent value="em-alta" className="flex flex-col gap-6">
          <EmAltaTab />
        </TabsContent>
        <TabsContent value="emergentes" className="flex flex-col gap-6">
          <EmergentesTab />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

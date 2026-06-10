import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import {
  DataTable,
  Gauge,
  KpiRow,
  MediaCell,
  PageShell,
  ScorePill,
  SubscoreBars,
  TrendChart,
  VideoGrid,
} from "@/shared"
import type { DataColumn } from "@/shared"

import {
  PRODUTO_CRIADORES,
  PRODUTO_DETALHE,
  PRODUTO_KPIS,
  PRODUTO_LOJAS,
  PRODUTO_SUBSCORES,
  PRODUTO_VENDAS_SERIE,
  PRODUTO_VIDEOS,
  PRODUTO_VIDEOS_SERIE,
} from "../../mocks"
import type { ProdutoCriador, ProdutoLoja } from "../../mocks"

import { ProdutoDetalheHeader } from "./produto-detalhe-header"

const CRIADORES_COLUMNS: DataColumn<ProdutoCriador>[] = [
  {
    header: "Criador",
    render: (row, index) => (
      <MediaCell title={row.nome} subtitle={row.nicho} seed={index} shape="circle" />
    ),
  },
  {
    header: "Seguidores",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.seguidores}</span>
    ),
  },
  {
    header: "Vídeos",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.videos}</span>
    ),
  },
  {
    header: "GMV estimado",
    align: "right",
    render: (row) => <span className="text-sm font-medium">{row.gmv}</span>,
  },
  {
    header: "Eficiência",
    align: "right",
    render: (row) => <ScorePill value={row.eficiencia} />,
  },
]

const LOJAS_COLUMNS: DataColumn<ProdutoLoja>[] = [
  {
    header: "Loja",
    render: (row, index) => <MediaCell title={row.nome} seed={index + 1} />,
  },
  {
    header: "Preço",
    align: "right",
    render: (row) => <span className="text-sm">{row.preco}</span>,
  },
  {
    header: "Vendas 30d",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.vendas30d}</span>
    ),
  },
  {
    header: "GMV 30d",
    align: "right",
    render: (row) => <span className="text-sm font-medium">{row.gmv30d}</span>,
  },
  {
    header: "Participação",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.participacao}%
      </span>
    ),
  },
]

export function ProdutoDetalhePage() {
  return (
    <PageShell>
      <ProdutoDetalheHeader />
      <KpiRow items={PRODUTO_KPIS} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Score de viabilidade</CardTitle>
            <CardDescription>Percentil vs. categoria, explicável</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Gauge
              value={PRODUTO_DETALHE.score}
              label="Percentil 96 em Eletrônicos"
              className="self-center"
            />
            <SubscoreBars items={PRODUTO_SUBSCORES} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Série temporal</CardTitle>
            <CardDescription>
              Vendas estimadas × vídeos publicados, 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              size="hero"
              xLabels={["11 mai", "18 mai", "25 mai", "1 jun", "10 jun"]}
              series={[
                {
                  label: "Vendas estimadas",
                  data: PRODUTO_VENDAS_SERIE,
                  strokeClassName: "stroke-[#25F4EE]",
                  fillClassName: "fill-[#25F4EE]/10",
                  dotClassName: "bg-[#25F4EE]",
                },
                {
                  label: "Vídeos publicados",
                  data: PRODUTO_VIDEOS_SERIE,
                  strokeClassName: "stroke-[#FE2C55]",
                  dotClassName: "bg-[#FE2C55]",
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="criadores" className="gap-6">
        <TabsList>
          <TabsTrigger value="criadores">
            Criadores
            <Badge variant="secondary" className="ml-1.5">
              {PRODUTO_CRIADORES.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="videos">
            Vídeos
            <Badge variant="secondary" className="ml-1.5">
              {PRODUTO_VIDEOS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="lojas">
            Lojas
            <Badge variant="secondary" className="ml-1.5">
              {PRODUTO_LOJAS.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="criadores">
          <DataTable columns={CRIADORES_COLUMNS} rows={PRODUTO_CRIADORES} />
        </TabsContent>
        <TabsContent value="videos">
          <VideoGrid items={PRODUTO_VIDEOS} />
        </TabsContent>
        <TabsContent value="lojas">
          <DataTable columns={LOJAS_COLUMNS} rows={PRODUTO_LOJAS} />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import {
  DataTable,
  FilterBar,
  Gauge,
  MediaCell,
  PageHeader,
  PageShell,
  QuadrantScatter,
  ScorePill,
  SubscoreBars,
} from "@/shared"
import type { DataColumn } from "@/shared"

import {
  OPORTUNIDADES,
  QUADRANT_DOTS,
  SATURADOS,
  SCORE_MEDIO,
  SUBSCORES_MEDIOS,
} from "../mocks"
import type { ProdutoQuadrante } from "../mocks"

const QUADRANTE_COLUMNS: DataColumn<ProdutoQuadrante>[] = [
  {
    header: "Produto",
    render: (row, index) => <MediaCell title={row.nome} seed={index} />,
  },
  {
    header: "Categoria",
    render: (row) => <Badge variant="secondary">{row.categoria}</Badge>,
  },
  {
    header: "Score",
    align: "right",
    render: (row) => <ScorePill value={row.score} />,
  },
]

export function ScorePage() {
  return (
    <PageShell>
      <PageHeader
        title="Score & quadrante"
        description="Viabilidade de mercado: demanda × concorrência condensadas num score explicável de 0 a 100."
      />
      <FilterBar
        searchPlaceholder="Buscar produto…"
        filters={["Categoria", "Quadrante", "Período"]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quadrante demanda × concorrência</CardTitle>
            <CardDescription>
              Posição dos produtos monitorados na janela de 14 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuadrantScatter dots={QUADRANT_DOTS} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Como o score é calculado</CardTitle>
            <CardDescription>
              Percentil por indicador, média geométrica ponderada
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Gauge
              value={SCORE_MEDIO}
              label="Score médio do filtro"
              className="self-center"
            />
            <SubscoreBars items={SUBSCORES_MEDIOS} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades</CardTitle>
            <CardDescription>Alta demanda, baixa concorrência</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable bare columns={QUADRANTE_COLUMNS} rows={OPORTUNIDADES} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saturados</CardTitle>
            <CardDescription>Alta demanda, concorrência alta demais</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable bare columns={QUADRANTE_COLUMNS} rows={SATURADOS} />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

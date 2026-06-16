import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"

import { formatBrlCompact, formatCompact, formatDeltaPct } from "@/shared"

/**
 * Saída da tool `nichoEmAlta` (apps/api). Os apps são separados (sem import
 * cruzado), então o contrato é redeclarado aqui — mantenha em sincronia com
 * apps/api/src/agent/tools/nicho-em-alta.ts.
 */
type NichoRow = {
  rank: number
  id: string
  name: string
  gmv: number
  sales: number
  productCount: number
  gmvDelta: number | null
  gmvTrend: number[]
}

type NichoEmAltaOutput = {
  success: boolean
  source: "echotik" | "mock"
  mode: "tamanho" | "crescimento"
  categories: NichoRow[]
}

function DeltaTag({ delta }: { delta: number | null }) {
  if (delta == null) return <span className="text-muted-foreground">—</span>
  const up = delta >= 0
  return (
    <span
      className={cn(
        "tabular-nums",
        up ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      )}
    >
      {formatDeltaPct(delta)}
    </span>
  )
}

export function NichoEmAltaWidget({ output }: { output: unknown }) {
  const data = output as NichoEmAltaOutput

  if (!data?.success || !data.categories?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum nicho encontrado.
      </p>
    )
  }

  const byGrowth = data.mode === "crescimento"
  const maxGmv = Math.max(...data.categories.map((c) => c.gmv), 1)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Nichos em alta · {byGrowth ? "crescimento" : "tamanho de mercado"}
        </span>
        <span className="uppercase">{data.source}</span>
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">Nicho</th>
              <th className="w-28 px-3 py-2 text-right font-medium">GMV</th>
              <th className="w-16 px-3 py-2 text-right font-medium">
                {byGrowth ? "Δ" : "Vendas"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category) => (
              <tr key={category.id} className="border-b last:border-b-0">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-right text-xs text-muted-foreground tabular-nums">
                      {category.rank}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <Progress
                      value={(category.gmv / maxGmv) * 100}
                      className="h-1.5 w-14"
                    />
                    <span className="w-16 text-right tabular-nums">
                      {formatBrlCompact(category.gmv)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {byGrowth ? (
                    <DeltaTag delta={category.gmvDelta} />
                  ) : (
                    formatCompact(category.sales)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

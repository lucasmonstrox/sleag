import { FilterBar, KpiRow } from "@/shared"

import { EMERGENTES, EMERGENTES_KPIS } from "../../mocks"
import { EmergenteCard } from "../emergente-card"

export function EmergentesTab() {
  return (
    <>
      <KpiRow items={EMERGENTES_KPIS} />
      <FilterBar
        searchPlaceholder="Buscar emergente…"
        filters={["Categoria", "Sinal", "Janela"]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {EMERGENTES.map((emergente, index) => (
          <EmergenteCard
            key={emergente.nome}
            emergente={emergente}
            seed={index + 2}
          />
        ))}
      </div>
    </>
  )
}

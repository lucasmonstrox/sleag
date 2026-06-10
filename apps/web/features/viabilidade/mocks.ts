import type { QuadrantDot, Subscore } from "@/shared"

export const SCORE_MEDIO = 64

export const SUBSCORES_MEDIOS: Subscore[] = [
  { label: "Demanda", value: 78 },
  { label: "Aceleração", value: 66 },
  { label: "Concorrência", value: 52 },
  { label: "Comissão", value: 71 },
  { label: "Frescor", value: 59 },
]

export const QUADRANT_DOTS: QuadrantDot[] = [
  { x: 16, y: 22, size: 16, tone: "opportunity", label: "Fone ANC X12" },
  { x: 28, y: 14, size: 11, tone: "opportunity", label: "Luminária Galaxy" },
  { x: 22, y: 38, size: 13, tone: "opportunity" },
  { x: 36, y: 30, size: 9, tone: "opportunity" },
  { x: 62, y: 18, size: 17, tone: "saturated", label: "Kit Pincéis 12pç" },
  { x: 74, y: 28, size: 12, tone: "saturated" },
  { x: 82, y: 12, size: 10, tone: "saturated", label: "Película HD" },
  { x: 68, y: 40, size: 11, tone: "saturated" },
  { x: 18, y: 72, size: 12, tone: "emerging", label: "Projetor Astronauta" },
  { x: 30, y: 82, size: 9, tone: "emerging" },
  { x: 26, y: 62, size: 14, tone: "emerging", label: "Máscara Liso Glow" },
  { x: 58, y: 74, size: 8, tone: "avoid" },
  { x: 74, y: 66, size: 10, tone: "avoid" },
  { x: 86, y: 84, size: 7, tone: "avoid" },
]

export type ProdutoQuadrante = {
  nome: string
  categoria: string
  score: number
}

export const OPORTUNIDADES: ProdutoQuadrante[] = [
  { nome: "Fone Bluetooth ANC X12", categoria: "Eletrônicos", score: 88 },
  { nome: "Sérum Vitamina C 30ml", categoria: "Beleza", score: 82 },
  { nome: "Luminária LED Galaxy", categoria: "Casa & decoração", score: 79 },
  { nome: "Escova Alisadora 5 em 1", categoria: "Beleza", score: 74 },
  { nome: "Smartwatch Fit Pro 8", categoria: "Eletrônicos", score: 71 },
]

export const SATURADOS: ProdutoQuadrante[] = [
  { nome: "Kit Pincéis Maquiagem 12pç", categoria: "Beleza", score: 52 },
  { nome: "Película Hidrogel HD", categoria: "Acessórios", score: 41 },
  { nome: "Capinha Anti-impacto Pro", categoria: "Acessórios", score: 38 },
  { nome: "Ring Light 26cm", categoria: "Eletrônicos", score: 35 },
  { nome: "Cinto Slim Fitness", categoria: "Fitness", score: 31 },
]

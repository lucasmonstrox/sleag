import type { Kpi, Subscore, VideoItem } from "@/shared"

export type Produto = {
  nome: string
  categoria: string
  preco: string
  comissao: string
  gmv7d: string
  vendas7d: string
  criadores: string
  variacao: string
  up: boolean
  score: number
  spark: number[]
}

export const PRODUTOS: Produto[] = [
  {
    nome: "Fone Bluetooth ANC X12",
    categoria: "Eletrônicos",
    preco: "R$ 89,90",
    comissao: "18%",
    gmv7d: "R$ 412 mil",
    vendas7d: "4,6 mil",
    criadores: "312",
    variacao: "+212%",
    up: true,
    score: 88,
    spark: [20, 24, 31, 38, 52, 70, 92],
  },
  {
    nome: "Sérum Vitamina C 30ml",
    categoria: "Beleza",
    preco: "R$ 49,90",
    comissao: "22%",
    gmv7d: "R$ 386 mil",
    vendas7d: "7,7 mil",
    criadores: "489",
    variacao: "+140%",
    up: true,
    score: 82,
    spark: [35, 38, 44, 51, 63, 72, 84],
  },
  {
    nome: "Luminária LED Galaxy",
    categoria: "Casa & decoração",
    preco: "R$ 69,90",
    comissao: "15%",
    gmv7d: "R$ 298 mil",
    vendas7d: "4,3 mil",
    criadores: "201",
    variacao: "+128%",
    up: true,
    score: 79,
    spark: [12, 15, 14, 22, 31, 44, 58],
  },
  {
    nome: "Escova Alisadora 5 em 1",
    categoria: "Beleza",
    preco: "R$ 99,90",
    comissao: "20%",
    gmv7d: "R$ 274 mil",
    vendas7d: "2,7 mil",
    criadores: "176",
    variacao: "+64%",
    up: true,
    score: 74,
    spark: [40, 44, 49, 47, 58, 66, 71],
  },
  {
    nome: "Smartwatch Fit Pro 8",
    categoria: "Eletrônicos",
    preco: "R$ 129,90",
    comissao: "12%",
    gmv7d: "R$ 251 mil",
    vendas7d: "1,9 mil",
    criadores: "143",
    variacao: "+41%",
    up: true,
    score: 71,
    spark: [30, 28, 34, 39, 37, 45, 51],
  },
  {
    nome: "Mini Liquidificador Portátil",
    categoria: "Cozinha",
    preco: "R$ 59,90",
    comissao: "17%",
    gmv7d: "R$ 233 mil",
    vendas7d: "3,9 mil",
    criadores: "228",
    variacao: "+48%",
    up: true,
    score: 68,
    spark: [28, 31, 30, 36, 41, 39, 47],
  },
  {
    nome: "Body Modelador Comfort",
    categoria: "Moda feminina",
    preco: "R$ 79,90",
    comissao: "25%",
    gmv7d: "R$ 219 mil",
    vendas7d: "2,7 mil",
    criadores: "354",
    variacao: "+37%",
    up: true,
    score: 66,
    spark: [22, 26, 25, 31, 34, 38, 42],
  },
  {
    nome: "Garrafa Térmica Inox 1L",
    categoria: "Fitness",
    preco: "R$ 45,90",
    comissao: "14%",
    gmv7d: "R$ 187 mil",
    vendas7d: "4,1 mil",
    criadores: "167",
    variacao: "+22%",
    up: true,
    score: 58,
    spark: [33, 35, 34, 38, 37, 41, 43],
  },
  {
    nome: "Kit Pincéis Maquiagem 12pç",
    categoria: "Beleza",
    preco: "R$ 39,90",
    comissao: "21%",
    gmv7d: "R$ 164 mil",
    vendas7d: "4,1 mil",
    criadores: "297",
    variacao: "-8%",
    up: false,
    score: 52,
    spark: [48, 46, 47, 44, 42, 43, 40],
  },
  {
    nome: "Organizador Acrílico Make",
    categoria: "Casa & decoração",
    preco: "R$ 54,90",
    comissao: "16%",
    gmv7d: "R$ 142 mil",
    vendas7d: "2,6 mil",
    criadores: "118",
    variacao: "+12%",
    up: true,
    score: 55,
    spark: [25, 27, 26, 29, 28, 31, 33],
  },
  {
    nome: "Película Hidrogel HD",
    categoria: "Acessórios",
    preco: "R$ 19,90",
    comissao: "30%",
    gmv7d: "R$ 121 mil",
    vendas7d: "6,1 mil",
    criadores: "203",
    variacao: "-22%",
    up: false,
    score: 41,
    spark: [55, 52, 49, 47, 44, 40, 38],
  },
  {
    nome: "Corretor Postural Ajustável",
    categoria: "Saúde",
    preco: "R$ 34,90",
    comissao: "19%",
    gmv7d: "R$ 98 mil",
    vendas7d: "2,8 mil",
    criadores: "94",
    variacao: "+18%",
    up: true,
    score: 49,
    spark: [18, 20, 19, 23, 22, 25, 27],
  },
]

const byIndexes = (indexes: number[]) =>
  indexes.map((index) => PRODUTOS[index]!)

export const EM_ALTA: Record<"hoje" | "7d" | "30d", Produto[]> = {
  hoje: byIndexes([0, 1, 2, 3, 5, 4, 6, 8, 7, 9]),
  "7d": byIndexes([1, 0, 3, 2, 6, 5, 4, 7, 9, 10]),
  "30d": byIndexes([1, 3, 0, 6, 2, 8, 5, 4, 10, 7]),
}

export const EMERGENTES_KPIS: Kpi[] = [
  { label: "Detectados hoje", value: "27", delta: "+9", deltaUp: true, hint: "vs. ontem" },
  { label: "Aceleração média", value: "2,8σ", delta: "+0,4", deltaUp: true, hint: "janela 14d" },
  { label: "Janela média até o pico", value: "5,2 dias", hint: "histórico 90d" },
  { label: "Categorias em movimento", value: "6", hint: "beleza lidera" },
]

export type Emergente = {
  nome: string
  categoria: string
  sinal: "Acelerando" | "Pré-pico" | "Novo"
  spark: number[]
  vendasBase: string
  detectado: string
  score: number
}

export const EMERGENTES: Emergente[] = [
  {
    nome: "Fone Bluetooth ANC X12",
    categoria: "Eletrônicos",
    sinal: "Acelerando",
    spark: [8, 10, 14, 22, 36, 58, 92],
    vendasBase: "640/dia",
    detectado: "hoje, 09h14",
    score: 88,
  },
  {
    nome: "Máscara Capilar Liso Glow",
    categoria: "Beleza",
    sinal: "Pré-pico",
    spark: [5, 7, 9, 14, 21, 33, 49],
    vendasBase: "410/dia",
    detectado: "hoje, 07h42",
    score: 76,
  },
  {
    nome: "Mini Projetor Astronauta",
    categoria: "Casa & decoração",
    sinal: "Novo",
    spark: [2, 3, 5, 8, 13, 21, 34],
    vendasBase: "180/dia",
    detectado: "ontem, 22h05",
    score: 72,
  },
  {
    nome: "Cinta Modeladora Invisível",
    categoria: "Moda feminina",
    sinal: "Acelerando",
    spark: [11, 13, 17, 24, 35, 51, 74],
    vendasBase: "520/dia",
    detectado: "ontem, 18h31",
    score: 70,
  },
  {
    nome: "Suporte Veicular Magnético",
    categoria: "Acessórios",
    sinal: "Pré-pico",
    spark: [6, 8, 11, 16, 24, 36, 53],
    vendasBase: "290/dia",
    detectado: "ontem, 15h12",
    score: 67,
  },
  {
    nome: "Difusor Elétrico Aromas",
    categoria: "Casa & decoração",
    sinal: "Novo",
    spark: [3, 4, 6, 10, 15, 24, 38],
    vendasBase: "150/dia",
    detectado: "ontem, 11h48",
    score: 61,
  },
]

export type Categoria = {
  nome: string
  gmv: string
  produtos: string
  crescimento: string
  up: boolean
  bars: number[]
}

export const CATEGORIAS: Categoria[] = [
  {
    nome: "Beleza & perfumaria",
    gmv: "R$ 1,9M",
    produtos: "3.214",
    crescimento: "+21%",
    up: true,
    bars: [40, 45, 52, 58, 66, 78, 92],
  },
  {
    nome: "Moda feminina",
    gmv: "R$ 1,4M",
    produtos: "5.871",
    crescimento: "+14%",
    up: true,
    bars: [50, 48, 55, 61, 64, 70, 76],
  },
  {
    nome: "Casa & decoração",
    gmv: "R$ 980 mil",
    produtos: "2.642",
    crescimento: "+18%",
    up: true,
    bars: [30, 36, 34, 42, 51, 58, 67],
  },
  {
    nome: "Eletrônicos",
    gmv: "R$ 870 mil",
    produtos: "1.918",
    crescimento: "+32%",
    up: true,
    bars: [22, 28, 35, 44, 56, 71, 88],
  },
  {
    nome: "Cozinha & utilidades",
    gmv: "R$ 540 mil",
    produtos: "1.473",
    crescimento: "+9%",
    up: true,
    bars: [38, 41, 39, 45, 48, 52, 55],
  },
  {
    nome: "Fitness & esportes",
    gmv: "R$ 410 mil",
    produtos: "1.105",
    crescimento: "+6%",
    up: true,
    bars: [42, 44, 43, 47, 46, 50, 52],
  },
  {
    nome: "Saúde & bem-estar",
    gmv: "R$ 350 mil",
    produtos: "894",
    crescimento: "-3%",
    up: false,
    bars: [55, 52, 54, 50, 48, 47, 45],
  },
  {
    nome: "Acessórios de celular",
    gmv: "R$ 290 mil",
    produtos: "2.207",
    crescimento: "-11%",
    up: false,
    bars: [70, 66, 61, 58, 52, 47, 43],
  },
]

// ── Detalhe do produto ────────────────────────────────────────────────

export const PRODUTO_DETALHE = {
  nome: "Fone Bluetooth ANC X12",
  categoria: "Eletrônicos",
  loja: "TechMax Brasil",
  badges: ["Emergente", "Top 3 em GMV"],
  score: 88,
}

export const PRODUTO_KPIS: Kpi[] = [
  { label: "Preço médio", value: "R$ 89,90", delta: "-5%", deltaUp: false, hint: "promo ativa" },
  { label: "GMV 30d", value: "R$ 1,2M", delta: "+212%", deltaUp: true, hint: "vs. 30d anteriores" },
  { label: "Vendas 30d", value: "14,2 mil", delta: "+187%", deltaUp: true, hint: "unidades" },
  { label: "Comissão média", value: "18%", hint: "R$ 16,18/venda" },
]

export const PRODUTO_SUBSCORES: Subscore[] = [
  { label: "Demanda", value: 92 },
  { label: "Aceleração", value: 88 },
  { label: "Concorrência", value: 64 },
  { label: "Comissão", value: 78 },
  { label: "Frescor", value: 84 },
]

export const PRODUTO_VENDAS_SERIE = [
  10, 12, 11, 14, 16, 15, 19, 23, 21, 27, 32, 30, 37, 43, 41, 49, 56, 53, 62,
  70, 67, 78, 86, 83, 90, 95, 92, 97, 99, 98,
]

export const PRODUTO_VIDEOS_SERIE = [
  6, 8, 7, 10, 13, 12, 16, 20, 18, 25, 30, 28, 36, 42, 40, 49, 55, 52, 60, 68,
  64, 74, 80, 77, 85, 90, 87, 93, 96, 94,
]

export type ProdutoCriador = {
  nome: string
  nicho: string
  seguidores: string
  videos: string
  gmv: string
  eficiencia: number
}

export const PRODUTO_CRIADORES: ProdutoCriador[] = [
  { nome: "@techdoluca", nicho: "Tech", seguidores: "1,2M", videos: "14", gmv: "R$ 218 mil", eficiencia: 91 },
  { nome: "@achadinhosdaduda", nicho: "Achados", seguidores: "890 mil", videos: "9", gmv: "R$ 164 mil", eficiencia: 84 },
  { nome: "@reviewsdopedro", nicho: "Reviews", seguidores: "640 mil", videos: "11", gmv: "R$ 97 mil", eficiencia: 72 },
  { nome: "@ofertasdamile", nicho: "Promo", seguidores: "410 mil", videos: "7", gmv: "R$ 63 mil", eficiencia: 66 },
  { nome: "@gadgetsbr", nicho: "Tech", seguidores: "275 mil", videos: "5", gmv: "R$ 41 mil", eficiencia: 58 },
]

export const PRODUTO_VIDEOS: VideoItem[] = [
  { title: "ESSE fone cancela TUDO 😱", creator: "@techdoluca", views: "2,4M", gmv: "R$ 86 mil" },
  { title: "Testei o fone viral do TikTok", creator: "@reviewsdopedro", views: "1,8M", gmv: "R$ 54 mil" },
  { title: "Achadinho: fone ANC por R$ 89", creator: "@achadinhosdaduda", views: "1,1M", gmv: "R$ 47 mil" },
  { title: "Fone bom e barato existe?", creator: "@gadgetsbr", views: "740 mil", gmv: "R$ 28 mil" },
  { title: "Unboxing + teste de bateria", creator: "@techdoluca", views: "620 mil", gmv: "R$ 22 mil" },
  { title: "3 motivos pra comprar HOJE", creator: "@ofertasdamile", views: "480 mil", gmv: "R$ 18 mil" },
]

export type ProdutoLoja = {
  nome: string
  preco: string
  vendas30d: string
  gmv30d: string
  participacao: number
}

export const PRODUTO_LOJAS: ProdutoLoja[] = [
  { nome: "TechMax Brasil", preco: "R$ 89,90", vendas30d: "8,1 mil", gmv30d: "R$ 728 mil", participacao: 58 },
  { nome: "Top Elétrico BR", preco: "R$ 92,90", vendas30d: "3,4 mil", gmv30d: "R$ 316 mil", participacao: 25 },
  { nome: "Loja do Som", preco: "R$ 86,90", vendas30d: "1,6 mil", gmv30d: "R$ 139 mil", participacao: 11 },
  { nome: "Mega Imports", preco: "R$ 99,90", vendas30d: "690", gmv30d: "R$ 69 mil", participacao: 5 },
  { nome: "Audio Center", preco: "R$ 94,90", vendas30d: "120", gmv30d: "R$ 11 mil", participacao: 1 },
]

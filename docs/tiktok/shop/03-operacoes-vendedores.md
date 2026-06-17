# 3. Operações para Vendedores

## Como Funciona para Quem Vende

O TikTok Shop opera como um **marketplace** onde vendedores listam produtos que são descobertos pelo algoritmo, promovidos por criadores afiliados, ou encontrados via busca/Shop Tab. A venda acontece completamente dentro do app.

Este documento cobre a operação do ponto de vista do vendedor/lojista: taxas, fulfillment, tipos de loja, e como começar.

---

## Taxas da Plataforma (EUA, 2026)

### Taxa de Referral (Principal)

A taxa de referral é **unificada** — cobre tanto a comissão de marketplace quanto o processamento de pagamento. Não há taxa de transação separada.

| Categoria | Taxa Padrão |
|-----------|-------------|
| **Maioria das categorias** | **6%** sobre o valor do pedido |
| Joias | 5% |
| Colecionáveis | 5% (3% na parcela acima de US$10K) |

**Histórico de volatilidade:** A taxa já foi anunciada como 8% (2024), depois retornou a 6%. Em abril/2024, a estrutura era diferente com taxas por categoria (2-4%). O modelo atual de 6% unificada está estável desde o final de 2024.

**Fonte:** Corroborada por 8+ fontes independentes (FitSmallBusiness, OneCart, Dashboardly, Podbase, Canopy Management, Influencer Marketing Hub, m2ecloud, Virlo, Tapstitch). Verificação adversarial: 2-1 a favor.

### Promoção para Novos Vendedores

Desde **1 de abril de 2025**, novos vendedores qualificam-se para:

| Condição | Benefício |
|----------|-----------|
| Primeira venda em até 60 dias do onboarding | Referral fee reduzida: **3%** |
| Duração do benefício | **30 dias** após a primeira venda |
| Ativação | Em até 48 horas após o primeiro pedido |

### Taxas Relacionadas a Reembolso

| Taxa | Valor | Detalhe |
|------|-------|---------|
| **Refund Admin Fee** | 20% da referral fee original | Teto de US$5 por SKU |
| **Commission Clawback** | Total da comissão | TikTok recupera a comissão paga quando há reembolso (mesmo semanas depois) |
| **Teto da admin fee** | US$5 por SKU | Aplica-se mesmo em reembolsos parciais |

### Subsídios em Devoluções

O **Shop Performance Score (SPS)** determina quanto o vendedor paga em devoluções:

| SPS | Subsídio em Frete de Devolução |
|-----|-------------------------------|
| ≥ 4 | TikTok subsidia **80%** do custo |
| < 4 | Custo dividido **50/50** com TikTok |
| FBT sellers | Taxa fixa adicional de **US$3,00/pedido** + custos de armazém |

---

## Estrutura de Custo Real por Venda

A referral fee de 6% é apenas a **ponta do iceberg**. O custo real por venda inclui:

```
Custo Real = Referral Fee (6%)
           + Processamento de Pagamento
           + Fulfillment (FBT/FBM)
           + Comissão de Afiliados (10-20% se aplicável)
           + Ads (GMV Max)
           + Provisão para Reembolso (8-10% para moda, 3-5% para beleza)
           + Armazenamento (se FBT)
```

**Exemplo para um pedido de US$50:**
| Componente | Valor | % do Pedido |
|------------|-------|-------------|
| Preço do produto | US$50,00 | 100% |
| Referral fee (6%) | -US$3,00 | 6% |
| Processamento pagamento | -US$1,75 | 3,5% |
| Comissão afiliado (15%) | -US$7,50 | 15% |
| Fulfillment (FBT est.) | -US$4,00 | 8% |
| Provisão reembolso (5%) | -US$2,50 | 5% |
| **Custo total plataforma** | **-US$18,75** | **37,5%** |
| **Margem bruta pós-taxas** | US$31,25 | 62,5% |
| Custo do produto | variável | — |
| Ads (GMV Max) | variável | — |
| **Margem líquida** | **variável** | — |

> ⚠️ O custo real de plataforma pode facilmente chegar a **30-40% do valor do pedido** quando todos os componentes são considerados.

---

## Fulfillment: FBT vs FBM

### FBT (Fulfilled by TikTok)

O equivalente ao FBA da Amazon. O TikTok armazena, empacota e envia seus produtos.

**Vantagens:**
- **Velocidade de entrega:** Next-day e 2-day delivery disponíveis em muitos mercados
- **Boost algorítmico:** Velocidade de entrega melhora o ranqueamento
- **Simplicidade operacional:** Sem picking, packing e shipping manuais
- **Flexibilidade promocional:** Serviços de kitting e bundle

**Desvantagens:**
- **Perda de dados do cliente:** "Every FBT order is a black hole for retention" — você perde emails, endereços, histórico de compras
- **Custos adicionais:** Pick-and-pack fees, storage fees, fragile-item handling, kitting/prep service
- **Delay de inbound:** Na Europa, inventário só é "sellable" após TikTok confirmar labeling, contagem e integridade — atrasa lançamento de campanhas
- **Custo de devolução:** US$3,00 adicionais por pedido devolvido

**Custos (estimados, sem confirmação oficial):**

⚠️ Claims sobre preços exatos de FBT foram **refutadas** na verificação adversarial por inconsistência entre fontes. Os valores abaixo são **aproximados** baseados em múltiplos relatos:
- Single-unit (0-1 lb): ~US$3,50-4,00
- Multi-unit: ~US$2,86/item
- Storage: Gratuito por 30-60 dias (conforme campanha), depois ~US$0,02/cubic foot/dia

### FBM (Fulfilled by Merchant)

Você armazena, empacota e envia. Pode usar seu próprio armazém ou terceirizar para um 3PL.

**Vantagens:**
- **Dados do cliente:** Propriedade total — remarketing, email, LTV
- **Negociação de frete:** Para itens volumosos, pode conseguir taxas melhores que FBT
- **Sem delay de inbound QC:** Produtos disponíveis imediatamente
- **Controle de packaging:** Inserts, warranty cards, QR codes, VIP invitations

**Desvantagens:**
- **Risco de SLA:** Atrasos resultam em cancelamentos automáticos
- **Sem boost algorítmico de entrega**
- **Complexidade operacional:** Escala com volume de pedidos
- **Sobretaxas por mercado:** UK cobra £0,50 por pacote enviado pelo seller (em um produto de £5, isso é 10% de margem)

### SLA e Compliance

- **Prazo de envio:** 1-2 dias úteis para despachar
- **Atraso:** Pedidos atrasados são **automaticamente cancelados** — seller perde custo de mão de obra e não recebe nada
- **Late Dispatch Rate (LDR):** Penalidades progressivas por atrasos
- **Violation points:** 48 pontos = fechamento permanente da loja, com fundos congelados por até 365 dias

### Framework de Decisão FBT vs FBM

| Tipo de SKU | Modo Recomendado | Razão |
|-------------|-----------------|-------|
| Leve, baixo AOV, compra por impulso | **FBT** | Velocidade converte; sobretaxas de FBM matam margem |
| Bundles/kits mid-AOV | **FBT com kitting** | Simplifica merchandising; protege SLA em picos |
| Alto AOV, volumoso, customizado | **FBM / 3PL** | Dados do cliente para recompra; negociação de frete |
| Retenção-crítica (suplementos, apparel, beleza) | **FBM / 3PL** | Dados superam a inconveniência |
| Trend-driven, creator bursts, flash sales | **FBT** | Velocidade valida o hook criativo |

### Estratégia Híbrida (Recomendada)

A maioria dos sellers de sucesso opera com **dual-path:**
- **FBT** para SKUs de giro rápido e ofertas de tempo limitado
- **FBM ou 3PL** para linhas de alto valor ou que dependem de retenção

Criadores empurram SKUs FBT para aquisição. Inserts e pack-ins redirecionam compradores para itens self-fulfilled onde o LTV é capturado.

---

## Tipos de Loja

| Tipo | Descrição | Quem Usa |
|------|-----------|----------|
| **Local Shop** | Empresa registrada no país de operação. Estoque local. | Maioria dos sellers nos EUA, UK, SE Asia |
| **Cross-border Shop** | Empresa em um país, vende em outro. Ex: empresa chinesa vendendo nos EUA. | Sellers chineses, dropshippers |
| **Fully Managed (S-ship)** | TikTok gerencia tudo: sourcing, pricing, fulfillment. Seller só produz. | Fornecedores/fábricas |
| **Brand Shop** | Loja oficial de marca registrada. | Marcas como Glossier, Crocs, Samsung |

---

## Como Abrir uma Loja (EUA)

### Requisitos

| Requisito | Detalhe |
|-----------|---------|
| Entidade empresarial | CNPJ/EIN nos EUA, registro válido |
| Tax ID | EIN ou SSN |
| Conta bancária | Conta comercial nos EUA |
| Identidade | Documento de identificação do responsável |
| Catálogo de produtos | Em conformidade com políticas do TikTok |
| Seguro | A partir do Q1 2026: "Commercial General Liability + Product Liability, mínimo US$1M por ocorrência" (~US$29/mês) |

### Processo

1. Registrar-se no **TikTok Seller Center** (seller.tiktok.com)
2. Submeter documentos de verificação
3. Aguardar aprovação (1-3 dias úteis, tipicamente)
4. Listar produtos com fotos, descrições, preços
5. Configurar fulfillment (FBT ou FBM)
6. Conectar conta de ads e criadores afiliados

### Custos Iniciais

| Item | Custo Estimado |
|------|---------------|
| Registro | Gratuito |
| Seguro | ~US$29/mês (obrigatório desde Q1 2026) |
| Amostras para criadores | Variável (custo do produto + envio) |
| Fotos/vídeos profissionais | Opcional, mas recomendado |
| Estoque inicial | Depende da estratégia |

---

## Performance do Vendedor (SPS - Shop Performance Score)

O SPS é uma métrica composta que afeta:
- Visibilidade de produtos
- Subsídio em devoluções
- Participação em eventos promocionais
- Aprovação de amostras para criadores

Fatores que impactam o SPS:
- Late Dispatch Rate (envio atrasado)
- Taxa de cancelamento
- Taxa de devolução
- Avaliações negativas
- Disputas de clientes
- Violações de política

---

## Políticas de Produto e Compliance

### Produtos Proibidos
- Armas e munições
- Tabaco e vaping
- Certos suplementos (lista varia por país)
- Joias finas usadas
- Produtos falsificados
- Itens que requerem prescrição médica

### Requisitos de Conteúdo
- **FTC (EUA):** Criadores devem divulgar relação comercial com #ad ou #sponsored
- Imagens e descrições devem ser precisas (não enganosas)
- Claims de saúde exigem comprovação científica

---

> **Próximo:** [04-distribuicao-lucro.md](04-distribuicao-lucro.md) — Split economics, GMV, comparação entre plataformas

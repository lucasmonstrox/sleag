# Tendência de Produto / Snapshot Histórico (Product Trends Snapshot - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369131823e0) · **`GET /api/v3/echotik/product/trend`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna a **série temporal histórica** (snapshot diário) de um produto identificado por `product_id`, suportando até os **últimos 180 dias**. Cada item de `data[]` é o estado do produto em uma data (`dt`): vendas e GMV acumulados, incremento de vendas/GMV daquele dia, e contagens de criadores/lives/vídeos. Use para desenhar gráficos de evolução (vendas ao longo do tempo, ramp-up de um produto) e detectar quando um produto disparou. Biblioteca offline T+1.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | — | ID do produto cuja série histórica se quer. |
| `start_date` | string | Sim | `yyyy-MM-dd` | Início da janela de datas (até 180 dias atrás). |
| `end_date` | string | Sim | `yyyy-MM-dd` | Fim da janela de datas. |
| `page_num` | int | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | int | Sim | **máx. 10** | Itens por página (1 item = 1 dia). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/trend?product_id=1729383769606034185&start_date=2026-05-01&end_date=2026-05-10&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por dia)
| Campo | Tipo | O que é |
|---|---|---|
| `dt` | string | Data do snapshot (provavelmente `yyyy-MM-dd` ou `yyyyMMdd` — não documentado o formato exato pela EchoTik). |
| `product_id` | string | ID do produto (ecoa o parâmetro). |
| `spu_avg_price` | number | Preço médio dos SKUs do produto naquela data. |
| `total_ifl_cnt` | int | Total de criadores que venderam o produto (acumulado até a data). |
| `total_live_cnt` | int | Total de sessões de live (acumulado até a data). |
| `total_sale_1d_cnt` | int | Incremento de vendas **no dia** (vendas daquele dia). |
| `total_sale_cnt` | int | Vendas totais acumuladas até a data. |
| `total_sale_gmv_1d_amt` | int | Incremento de GMV **no dia**. |
| `total_sale_gmv_amt` | int | GMV total acumulado até a data. |
| `total_video_cnt` | int | Total de vídeos associados (acumulado até a data). |

## Notas & gotchas
- Janela máxima de **180 dias**.
- `_1d_` é o **incremento do dia**; a versão sem janela (`total_sale_cnt`, `total_sale_gmv_amt`) é o **acumulado** até `dt` — para reconstruir a curva diária, use os `_1d_` ou faça diff dos acumulados.
- Vendas e GMV são **ESTIMATIVAS**; unidade do GMV não documentada (confirmar moeda vs centavos).
- `page_size` máx. 10 → para 180 dias serão 18 páginas.
- Dado T+1.

## Relevância para o SLEAG
- **Gráfico de evolução de um produto** na página de detalhe do produto (vendas/GMV ao longo do tempo).
- Detectar momentum / produtos "estourando" comparando incrementos diários recentes.
- Insumo para timelines do dashboard de mercado (produtos mais vendidos com histórico).

---

<details>
<summary>Spec original (OpenAPI 3.0.1)</summary>

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v3/echotik/product/trend:
    get:
      summary: Product Trends (Snapshot) - EchoTik
      deprecated: false
      description: >-
        Retrieve a historical trend snapshot of the product using the
        product_id, supporting up to the past 180 days.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: start_date
          in: query
          description: Date range filter, yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: end_date
          in: query
          description: Date range filter, yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: page_num
          in: query
          description: Page numbers start from 1 and go up to a maximum of 100,000.
          required: true
          schema:
            type: integer
        - name: page_size
          in: query
          description: The maximum number of pages is 10.
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                  message:
                    type: string
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        dt:
                          type: string
                        product_id:
                          type: string
                        spu_avg_price:
                          type: number
                          title: Average price of product SKUs
                        total_ifl_cnt:
                          type: integer
                          title: Total number of sales creators
                        total_live_cnt:
                          type: integer
                          title: Total live stream sessions
                        total_sale_1d_cnt:
                          type: integer
                          title: Sales increase in the last 1 day
                        total_sale_cnt:
                          type: integer
                          title: Total sales
                        total_sale_gmv_1d_amt:
                          type: integer
                          title: GMV increase in the last 1 day
                        total_sale_gmv_amt:
                          type: integer
                          title: Total Sales GMV
                        total_video_cnt:
                          type: integer
                          title: Total video count
                      x-apifox-orders:
                        - dt
                        - product_id
                        - spu_avg_price
                        - total_ifl_cnt
                        - total_live_cnt
                        - total_sale_1d_cnt
                        - total_sale_cnt
                        - total_sale_gmv_1d_amt
                        - total_sale_gmv_amt
                        - total_video_cnt
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8SZSBQECNNAFDH8PQ21SEJ6
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8SZSBQECNNAFDH8PQ21SEJ6:
                    $ref: >-
                      #/components/schemas/%E5%95%86%E5%93%81%E8%B6%8B%E5%8A%BF%EF%BC%88%E5%BF%AB%E7%85%A7%EF%BC%89
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369131823-run
components:
  schemas:
    商品趋势（快照）:
      type: object
      properties:
        code:
          type: integer
        message:
          type: string
        data:
          type: array
          items:
            type: object
            properties:
              dt:
                type: string
              product_id:
                type: string
              spu_avg_price:
                type: number
                title: Average price of product SKUs
              total_ifl_cnt:
                type: integer
                title: Total number of sales creators
              total_live_cnt:
                type: integer
                title: Total live stream sessions
              total_sale_1d_cnt:
                type: integer
                title: Sales increase in the last 1 day
              total_sale_cnt:
                type: integer
                title: Total sales
              total_sale_gmv_1d_amt:
                type: integer
                title: GMV increase in the last 1 day
              total_sale_gmv_amt:
                type: integer
                title: Total Sales GMV
              total_video_cnt:
                type: integer
                title: Total video count
            x-apifox-orders:
              - dt
              - product_id
              - spu_avg_price
              - total_ifl_cnt
              - total_live_cnt
              - total_sale_1d_cnt
              - total_sale_cnt
              - total_sale_gmv_1d_amt
              - total_sale_gmv_amt
              - total_video_cnt
            x-apifox-ignore-properties: []
        requestId:
          type: string
      required:
        - code
        - message
        - data
        - requestId
      x-apifox-orders:
        - code
        - message
        - data
        - requestId
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
  securitySchemes:
    basic:
      type: http
      scheme: basic
servers:
  - url: ''
    description: 正式环境
security: []
```

</details>

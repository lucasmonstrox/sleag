# Tendência da Loja (Snapshot histórico) — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369400701e0) · **`GET /api/v3/echotik/seller/trend`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna a **série temporal** (snapshot diário) de métricas de uma loja identificada por `seller_id`, dentro de um intervalo de datas — **até 180 dias** no passado. Cada item de `data[]` é o estado da loja em um dia (`dt`). É o que alimenta gráficos de evolução (GMV, vendas, nº de produtos/lives/vídeos/criadores ao longo do tempo). Para o snapshot único atual, use `seller/detail`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja | Loja-alvo da série temporal. |
| `start_date` | string | **Sim** | `yyyy-MM-dd` | Início do intervalo. Máximo de 180 dias no passado. |
| `end_date` | string | **Sim** | `yyyy-MM-dd` | Fim do intervalo. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx **10** | Itens (dias) por página. Limite rígido de 10 — para 180 dias serão necessárias várias páginas. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/trend?seller_id=7495539486134995508&start_date=2026-05-01&end_date=2026-05-10&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (um item por dia)
| Campo | Tipo | O que é |
|---|---|---|
| `dt` | string | Data do snapshot (o dia a que as métricas se referem). (formato não documentado — provavelmente `yyyy-MM-dd` ou `yyyyMMdd`.) |
| `seller_id` | string | Id da loja (eco do parâmetro). |
| `total_crawl_product_cnt` | integer | Nº de produtos catalogados na loja naquele dia. |
| `total_live_cnt` | integer | Nº total de lives até aquele dia. |
| `total_live_ifl_cnt` | integer | Nº de criadores que venderam via live. |
| `total_product_cnt` | integer | Nº total de produtos **incluindo descontinuados**. |
| `total_sale_1d_cnt` | integer | Vendas (unid.) do dia — incremento daquele 1 dia. |
| `total_sale_cnt` | integer | Vendas totais acumuladas até aquele dia. |
| `total_sale_gmv_1d_amt` | integer | GMV de vendas daquele 1 dia (estimado). |
| `total_sale_gmv_amt` | integer | GMV total acumulado até aquele dia (estimado). |
| `total_video_cnt` | integer | Nº total de vídeos até aquele dia. |
| `total_video_ifl_cnt` | integer | Nº de criadores que venderam via vídeo. |
| `user_id` | string | Id de usuário associado à loja. (sem descrição — provavelmente conta dona da loja.) |

## Notas & gotchas
- **Strings numéricas**: `seller_id` e `user_id` como string.
- Janela máxima de **180 dias**; com `page_size` 10, paginar bastante para cobrir o período inteiro.
- Distinguir **acumulado** (`total_sale_cnt`, `total_sale_gmv_amt`) de **incremento diário** (`*_1d_*`) ao plotar — somar incrementos ≈ derivada do acumulado.
- **GMV estimado**.
- Dado **offline T+1**.

## Relevância para o TIKSPY
- Gera os **gráficos de tendência** da página de loja na área de Concorrência (curva de GMV/vendas, crescimento de catálogo, atividade de lives/vídeos/criadores).
- Permite detectar lojas em aceleração/desaceleração para alertas e ranking dinâmico.

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
  /api/v3/echotik/seller/trend:
    get:
      summary: Shop Trends (Snapshot) - EchoTik
      deprecated: false
      description: >-
        Retrieve a historical trend snapshot of the store via seller_id,
        supporting up to the past 180 days.
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: Shop Id
          required: true
          schema:
            type: string
        - name: start_date
          in: query
          description: Time range filter, yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: end_date
          in: query
          description: Time range filter, yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: page_num
          in: query
          description: Page numbers, starting from 1, maximum 100000
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
                        seller_id:
                          type: string
                        total_crawl_product_cnt:
                          type: integer
                          title: Number of items in store
                        total_live_cnt:
                          type: integer
                          title: Total number of live streams
                        total_live_ifl_cnt:
                          type: integer
                          title: Live stream sales creator count
                        total_product_cnt:
                          type: integer
                          title: >-
                            Total number of products (including discontinued
                            products)
                        total_sale_1d_cnt:
                          type: integer
                          title: Sales increase in the past 1 day
                        total_sale_cnt:
                          type: integer
                          title: Total sales
                        total_sale_gmv_1d_amt:
                          type: integer
                          title: GMV of sales in the past 1 day
                        total_sale_gmv_amt:
                          type: integer
                          title: Total Sales GMV
                        total_video_cnt:
                          type: integer
                          title: Total number of videos
                        total_video_ifl_cnt:
                          type: integer
                          title: Total video sales creators
                        user_id:
                          type: string
                      x-apifox-orders:
                        - dt
                        - seller_id
                        - total_crawl_product_cnt
                        - total_live_cnt
                        - total_live_ifl_cnt
                        - total_product_cnt
                        - total_sale_1d_cnt
                        - total_sale_cnt
                        - total_sale_gmv_1d_amt
                        - total_sale_gmv_amt
                        - total_video_cnt
                        - total_video_ifl_cnt
                        - user_id
                  requestId:
                    type: string
                x-apifox-orders:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs: {}
                required:
                  - code
                  - message
                  - data
                  - requestId
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Shop
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369400701-run
components:
  schemas: {}
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

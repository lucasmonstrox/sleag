# Detalhes de Produtos em Lote (Batch Fetch Product Details - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369143952e0) · **`GET /api/v3/echotik/product/detail`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Busca os **detalhes completos de até 10 produtos por vez** a partir de uma lista de `product_id` separados por vírgula. É o complemento do endpoint de Lista de Produtos: quando você já tem os IDs (de ranking, vídeos, lives, etc.) e quer hidratar com o bloco completo de métricas, chama este aqui em lote. Biblioteca offline T+1. O conjunto de campos do response é **o mesmo da Lista de Produtos** (o próprio spec diz: "Please refer to the product list for descriptions of the returned fields"), exceto que aqui o schema não declara `from_flag`, `is_hot`, `shop_type` e `shipping_price`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_ids` | string | Sim | até **10** IDs separados por vírgula (vírgula ASCII `,`) | Lista de produtos a detalhar em lote. Máx. 10 por request. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/detail?product_ids=1729383769606034185,1729471493154312768" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
Mesmo schema do endpoint **Lista de Produtos** (`product-list-echotik.md`) — veja lá a explicação detalhada de cada campo. Resumo dos grupos:

| Grupo | Campos | O que é |
|---|---|---|
| Identificação / categoria | `category_id`, `category_l2_id`, `category_l3_id`, `product_id`, `product_name`, `region`, `seller_id` | Identidade e taxonomia do produto. |
| Atributos / preço | `cover_url`, `desc_detail`, `discount`, `first_crawl_dt`, `free_shipping`, `is_s_shop`, `max_price`, `min_price`, `off_mark`, `product_commission_rate`, `product_rating`, `review_count`, `sale_props`, `sales_flag`, `sales_trend_flag`, `skus`, `spu_avg_price`, `specification` | Atributos comerciais. `cover_url`/`desc_detail`/`sale_props`/`skus`/`specification` vêm como **JSON serializado em string**. |
| Criadores (`total_ifl_*`) | `total_ifl_cnt` + `total_ifl_live_{1,7,15,30,60,90}d_cnt` + `total_ifl_video_{1,7,15,30,60,90}d_cnt` | Total e incrementos do nº de criadores por live/vídeo. |
| Lives (`total_live_*`) | `total_live_cnt`, `total_live_{...}d_cnt`, `total_live_sale_cnt`, `total_live_sale_{...}d_cnt`, `total_live_sale_gmv_amt`, `total_live_sale_gmv_{...}d_amt` | Sessões, vendas e GMV via live (total + janelas). |
| Vendas/GMV gerais (`total_sale_*`) | `total_sale_cnt`, `total_sale_{...}d_cnt`, `total_sale_gmv_amt`, `total_sale_gmv_{...}d_amt` | Vendas e GMV de todos os canais (total + janelas). |
| Vídeos (`total_video_*`) | `total_video_cnt`, `total_video_{...}d_cnt`, `total_video_sale_cnt`, `total_video_sale_{...}d_cnt`, `total_video_sale_gmv_amt`, `total_video_sale_gmv_{...}d_amt` | Vídeos, vendas e GMV via vídeo (total + janelas). |
| Views (`total_views_*`) | `total_views_cnt`, `total_views_{...}d_cnt` | Views dos vídeos (total + janelas). |

> Janelas `_1d_`/`_7d_`/`_15d_`/`_30d_`/`_60d_`/`_90d_` = incremento do período; sem janela = acumulado total. (Mesma convenção da Lista de Produtos.)

**Diferenças de tipagem vs Lista de Produtos (conforme o spec):** aqui alguns campos de GMV vêm como `number` em vez de `int` — `total_sale_gmv_60d_amt`, `total_sale_gmv_90d_amt`, `total_sale_gmv_amt`. Trate todo GMV como numérico (pode vir com decimais).

## Notas & gotchas
- **Máx. 10 IDs por request** — divida listas maiores em lotes.
- Vírgula tem que ser a ASCII `,` ("English comma"); evite vírgulas Unicode.
- Campos JSON-em-string precisam de `JSON.parse`.
- Este schema **não declara** `from_flag`, `is_hot`, `shop_type`, `shipping_price` (presentes na Lista) — podem não vir ou vir sem garantia formal.
- Vendas/GMV são ESTIMATIVAS; dado T+1.

## Relevância para o SLEAG
- **Hidratação de detalhe de produto**: pega IDs do ranking / vídeos / lives e busca o bloco completo de métricas em uma chamada.
- Eficiência de cota: 10 produtos por request, ideal para popular cards do dashboard e a página de detalhe do produto.

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
  /api/v3/echotik/product/detail:
    get:
      summary: Batch fetch product details - EchoTik
      deprecated: false
      description: >-
        Retrieve product detail data in bulk via product_id, with a maximum of
        10 items per request. Multiple items can be separated by an English
        comma.
      tags:
        - Product
      parameters:
        - name: product_ids
          in: query
          description: Multiple product IDs are separated by commas.
          required: true
          schema:
            type: string
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
                        category_id:
                          type: string
                        category_l2_id:
                          type: string
                        category_l3_id:
                          type: string
                        cover_url:
                          type: string
                        desc_detail:
                          type: string
                        discount:
                          type: string
                        first_crawl_dt:
                          type: integer
                        free_shipping:
                          type: integer
                        is_s_shop:
                          type: integer
                        max_price:
                          type: number
                        min_price:
                          type: number
                        off_mark:
                          type: integer
                        product_commission_rate:
                          type: integer
                        product_id:
                          type: string
                        product_name:
                          type: string
                        product_rating:
                          type: integer
                        region:
                          type: string
                        review_count:
                          type: integer
                        sale_props:
                          type: string
                        sales_flag:
                          type: integer
                        sales_trend_flag:
                          type: integer
                        seller_id:
                          type: string
                        skus:
                          type: string
                        spu_avg_price:
                          type: number
                        total_ifl_cnt:
                          type: integer
                        total_ifl_live_15d_cnt:
                          type: integer
                        total_ifl_live_1d_cnt:
                          type: integer
                        total_ifl_live_30d_cnt:
                          type: integer
                        total_ifl_live_60d_cnt:
                          type: integer
                        total_ifl_live_7d_cnt:
                          type: integer
                        total_ifl_live_90d_cnt:
                          type: integer
                        total_ifl_video_15d_cnt:
                          type: integer
                        total_ifl_video_1d_cnt:
                          type: integer
                        total_ifl_video_30d_cnt:
                          type: integer
                        total_ifl_video_60d_cnt:
                          type: integer
                        total_ifl_video_7d_cnt:
                          type: integer
                        total_ifl_video_90d_cnt:
                          type: integer
                        total_live_15d_cnt:
                          type: integer
                        total_live_1d_cnt:
                          type: integer
                        total_live_30d_cnt:
                          type: integer
                        total_live_60d_cnt:
                          type: integer
                        total_live_7d_cnt:
                          type: integer
                        total_live_90d_cnt:
                          type: integer
                        total_live_cnt:
                          type: integer
                        total_live_sale_15d_cnt:
                          type: integer
                        total_live_sale_1d_cnt:
                          type: integer
                        total_live_sale_30d_cnt:
                          type: integer
                        total_live_sale_60d_cnt:
                          type: integer
                        total_live_sale_7d_cnt:
                          type: integer
                        total_live_sale_90d_cnt:
                          type: integer
                        total_live_sale_cnt:
                          type: integer
                        total_live_sale_gmv_15d_amt:
                          type: integer
                        total_live_sale_gmv_1d_amt:
                          type: integer
                        total_live_sale_gmv_30d_amt:
                          type: integer
                        total_live_sale_gmv_60d_amt:
                          type: integer
                        total_live_sale_gmv_7d_amt:
                          type: integer
                        total_live_sale_gmv_90d_amt:
                          type: integer
                        total_live_sale_gmv_amt:
                          type: integer
                        total_sale_15d_cnt:
                          type: integer
                        total_sale_1d_cnt:
                          type: integer
                        total_sale_30d_cnt:
                          type: integer
                        total_sale_60d_cnt:
                          type: integer
                        total_sale_7d_cnt:
                          type: integer
                        total_sale_90d_cnt:
                          type: integer
                        total_sale_cnt:
                          type: integer
                        total_sale_gmv_15d_amt:
                          type: integer
                        total_sale_gmv_1d_amt:
                          type: integer
                        total_sale_gmv_30d_amt:
                          type: integer
                        total_sale_gmv_60d_amt:
                          type: number
                        total_sale_gmv_7d_amt:
                          type: integer
                        total_sale_gmv_90d_amt:
                          type: number
                        total_sale_gmv_amt:
                          type: number
                        total_video_15d_cnt:
                          type: integer
                        total_video_1d_cnt:
                          type: integer
                        total_video_30d_cnt:
                          type: integer
                        total_video_60d_cnt:
                          type: integer
                        total_video_7d_cnt:
                          type: integer
                        total_video_90d_cnt:
                          type: integer
                        total_video_cnt:
                          type: integer
                        total_video_sale_15d_cnt:
                          type: integer
                        total_video_sale_1d_cnt:
                          type: integer
                        total_video_sale_30d_cnt:
                          type: integer
                        total_video_sale_60d_cnt:
                          type: integer
                        total_video_sale_7d_cnt:
                          type: integer
                        total_video_sale_90d_cnt:
                          type: integer
                        total_video_sale_cnt:
                          type: integer
                        total_video_sale_gmv_15d_amt:
                          type: integer
                        total_video_sale_gmv_1d_amt:
                          type: integer
                        total_video_sale_gmv_30d_amt:
                          type: integer
                        total_video_sale_gmv_60d_amt:
                          type: integer
                        total_video_sale_gmv_7d_amt:
                          type: integer
                        total_video_sale_gmv_90d_amt:
                          type: integer
                        total_video_sale_gmv_amt:
                          type: integer
                        total_views_15d_cnt:
                          type: integer
                        total_views_1d_cnt:
                          type: integer
                        total_views_30d_cnt:
                          type: integer
                        total_views_60d_cnt:
                          type: integer
                        total_views_7d_cnt:
                          type: integer
                        total_views_90d_cnt:
                          type: integer
                        total_views_cnt:
                          type: integer
                        specification:
                          type: string
                      x-apifox-orders:
                        - category_id
                        - category_l2_id
                        - category_l3_id
                        - cover_url
                        - desc_detail
                        - discount
                        - first_crawl_dt
                        - free_shipping
                        - is_s_shop
                        - max_price
                        - min_price
                        - off_mark
                        - product_commission_rate
                        - product_id
                        - product_name
                        - product_rating
                        - region
                        - review_count
                        - sale_props
                        - sales_flag
                        - sales_trend_flag
                        - seller_id
                        - skus
                        - spu_avg_price
                        - total_ifl_cnt
                        - total_ifl_live_15d_cnt
                        - total_ifl_live_1d_cnt
                        - total_ifl_live_30d_cnt
                        - total_ifl_live_60d_cnt
                        - total_ifl_live_7d_cnt
                        - total_ifl_live_90d_cnt
                        - total_ifl_video_15d_cnt
                        - total_ifl_video_1d_cnt
                        - total_ifl_video_30d_cnt
                        - total_ifl_video_60d_cnt
                        - total_ifl_video_7d_cnt
                        - total_ifl_video_90d_cnt
                        - total_live_15d_cnt
                        - total_live_1d_cnt
                        - total_live_30d_cnt
                        - total_live_60d_cnt
                        - total_live_7d_cnt
                        - total_live_90d_cnt
                        - total_live_cnt
                        - total_live_sale_15d_cnt
                        - total_live_sale_1d_cnt
                        - total_live_sale_30d_cnt
                        - total_live_sale_60d_cnt
                        - total_live_sale_7d_cnt
                        - total_live_sale_90d_cnt
                        - total_live_sale_cnt
                        - total_live_sale_gmv_15d_amt
                        - total_live_sale_gmv_1d_amt
                        - total_live_sale_gmv_30d_amt
                        - total_live_sale_gmv_60d_amt
                        - total_live_sale_gmv_7d_amt
                        - total_live_sale_gmv_90d_amt
                        - total_live_sale_gmv_amt
                        - total_sale_15d_cnt
                        - total_sale_1d_cnt
                        - total_sale_30d_cnt
                        - total_sale_60d_cnt
                        - total_sale_7d_cnt
                        - total_sale_90d_cnt
                        - total_sale_cnt
                        - total_sale_gmv_15d_amt
                        - total_sale_gmv_1d_amt
                        - total_sale_gmv_30d_amt
                        - total_sale_gmv_60d_amt
                        - total_sale_gmv_7d_amt
                        - total_sale_gmv_90d_amt
                        - total_sale_gmv_amt
                        - total_video_15d_cnt
                        - total_video_1d_cnt
                        - total_video_30d_cnt
                        - total_video_60d_cnt
                        - total_video_7d_cnt
                        - total_video_90d_cnt
                        - total_video_cnt
                        - total_video_sale_15d_cnt
                        - total_video_sale_1d_cnt
                        - total_video_sale_30d_cnt
                        - total_video_sale_60d_cnt
                        - total_video_sale_7d_cnt
                        - total_video_sale_90d_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_15d_amt
                        - total_video_sale_gmv_1d_amt
                        - total_video_sale_gmv_30d_amt
                        - total_video_sale_gmv_60d_amt
                        - total_video_sale_gmv_7d_amt
                        - total_video_sale_gmv_90d_amt
                        - total_video_sale_gmv_amt
                        - total_views_15d_cnt
                        - total_views_1d_cnt
                        - total_views_30d_cnt
                        - total_views_60d_cnt
                        - total_views_7d_cnt
                        - total_views_90d_cnt
                        - total_views_cnt
                        - specification
                    title: >-
                      Please refer to the product list for descriptions of the
                      returned fields.
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
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369143952-run
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

# Detalhe da Loja — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369404326e0) · **`GET /api/v3/echotik/seller/detail`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna os dados detalhados de **uma única loja** identificada pelo `seller_id`. O payload é exatamente o mesmo objeto do endpoint `seller/list` (mesmos campos), só que para uma loja específica em vez de uma lista paginada. Use quando já tem o `seller_id` (ex.: vindo de um ranking ou da lista) e quer o snapshot atual completo da loja. Para a evolução ao longo do tempo, use `seller/trend`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja | Identifica a loja a detalhar. Obtenha de `seller/list` ou `seller/ranklist`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/detail?seller_id=7495539486134995508" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

> `data` é um **array** na spec (reaproveita o schema da lista de lojas), normalmente com um único elemento referente ao `seller_id` consultado.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | Id da categoria primária da loja. Resolva via `category/l1`. |
| `category_l2_id` | string | Id da categoria secundária. |
| `category_l3_id` | string | Id da categoria de terceiro nível. |
| `cover_url` | string | URL da capa da loja. EchoTik recomenda baixar via interface de download. |
| `first_crawl_dt` | integer | Data/hora do primeiro rastreamento da loja. (formato não documentado — provavelmente epoch ou `yyyyMMdd` inteiro.) |
| `from_flag` | integer | Origem: `1` = local · `2` = cross-border. |
| `most_product_category_list` | string | Categoria TOP1 de produtos da loja. **String JSON**, precisa de parse. |
| `product_category_list` | string | Lista de categorias de produto da loja. **String JSON**, precisa de parse. |
| `rating` | integer | Nota/avaliação da loja. (sem descrição — provavelmente nota média; pode vir fracionada apesar do tipo `integer`.) |
| `region` | string | Região da loja (ex.: `BR`). |
| `sales_flag` | integer | Canal de venda predominante: `1` = vídeo · `2` = live. |
| `sales_trend_flag` | integer | Tendência de vendas: `0` = estável · `1` = subindo · `2` = caindo. |
| `seller_id` | string | Id da loja (eco do parâmetro). |
| `seller_link` | null | Link da loja. Vem como `null`. (não documentado — provavelmente reservado para URL pública.) |
| `seller_name` | string | Nome da loja. (sem descrição — nome de exibição do seller.) |
| `spu_avg_price` | number | Preço médio de todos os SKUs da loja. |
| `total_crawl_product_cnt` | integer | Nº de produtos atualmente catalogados (coletados pela EchoTik). |
| `total_ifl_cnt` | integer | Nº total de criadores que vendem produtos da loja. |
| `total_live_cnt` | integer | Nº total de lives da loja. |
| `total_product_cnt` | integer | Nº histórico de produtos, **incluindo removidos**. |
| `total_sale_1d_cnt` | integer | Vendas (unid.) no último 1 dia — incremental. |
| `total_sale_30d_cnt` | integer | Vendas (unid.) nos últimos 30 dias — incremental. |
| `total_sale_7d_cnt` | integer | Vendas (unid.) nos últimos 7 dias — incremental. |
| `total_sale_90d_cnt` | integer | Vendas (unid.) nos últimos 90 dias — incremental. |
| `total_sale_cnt` | integer | Vendas totais acumuladas. |
| `total_sale_gmv_1d_amt` | integer | GMV do último 1 dia — incremental (estimado). |
| `total_sale_gmv_30d_amt` | integer | GMV dos últimos 30 dias — incremental (estimado). |
| `total_sale_gmv_7d_amt` | integer | GMV dos últimos 7 dias — incremental (estimado). |
| `total_sale_gmv_90d_amt` | integer | GMV dos últimos 90 dias — incremental (estimado). |
| `total_sale_gmv_amt` | number | GMV total acumulado (estimado). |
| `total_video_cnt` | integer | Nº total de vídeos de venda associados à loja. |
| `user_id` | string | Id de usuário associado à loja. (sem descrição — provavelmente o `user_id` da conta dona da loja.) |

## Notas & gotchas
- **Strings numéricas**: ids vêm como string (números longos) — não converter para `number`.
- `data` é **array** mesmo sendo "detalhe": leia `data[0]`.
- **GMV estimado**, não receita oficial.
- Métricas `*_1d/7d/30d/90d` são **incrementais** (variação do período).
- `most_product_category_list` / `product_category_list` são **strings JSON** a parsear.
- Dado **offline T+1**.

## Relevância para o SLEAG
- Fonte do **perfil/cabeçalho da página de loja** na área de Concorrência (nome, capa, categoria, GMV, nº de produtos/criadores/lives/vídeos).
- Combinado com `seller/trend`, monta o painel de uma loja concorrente (snapshot + série temporal).

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
  /api/v3/echotik/seller/detail:
    get:
      summary: Shop Detail - EchoTik
      deprecated: false
      description: Retrieve store detailed data based on seller_id
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: Shop Id
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
                          title: First-level category ID
                        category_l2_id:
                          type: string
                          title: Secondary category ID
                        category_l3_id:
                          type: string
                          title: Third-level category ID
                        cover_url:
                          type: string
                          title: >-
                            Please use the download interface to download the
                            store cover image.
                        first_crawl_dt:
                          type: integer
                          title: First store crawl time
                        from_flag:
                          type: integer
                          title: Cross-border identification 1=Local 2=Cross-border
                        most_product_category_list:
                          type: string
                          title: TOP1 Product Category
                        product_category_list:
                          type: string
                          title: Product categories
                        rating:
                          type: integer
                        region:
                          type: string
                        sales_flag:
                          type: integer
                          title: 'Main sales methods: 1. Video; 2. Live streaming'
                        sales_trend_flag:
                          type: integer
                          title: Sales Trends
                        seller_id:
                          type: string
                          title: Shop Id
                        seller_link:
                          type: 'null'
                        seller_name:
                          type: string
                        spu_avg_price:
                          type: number
                          title: Average price of all SKUs in the store
                        total_crawl_product_cnt:
                          type: integer
                          title: Number of items in store
                        total_ifl_cnt:
                          type: integer
                          title: Total number of creators selling products
                        total_live_cnt:
                          type: integer
                          title: Total live streams
                        total_product_cnt:
                          type: integer
                          description: Including removed products
                          title: Historical number of items in store
                        total_sale_1d_cnt:
                          type: integer
                          title: Sales in the last 1 day (increment)
                        total_sale_30d_cnt:
                          type: integer
                          title: Sales in the last 30 day (increment)
                        total_sale_7d_cnt:
                          type: integer
                          title: Sales in the last 7 day (increment)
                        total_sale_90d_cnt:
                          type: integer
                          title: Sales in the last 90 day (increment)
                        total_sale_cnt:
                          type: integer
                          title: Total sales
                        total_sale_gmv_1d_amt:
                          type: integer
                          title: GMV (increment) from the last 1 day
                        total_sale_gmv_30d_amt:
                          type: integer
                          title: GMV (increment) from the last 30 day
                        total_sale_gmv_7d_amt:
                          type: integer
                          title: GMV (increment) from the last 7 day
                        total_sale_gmv_90d_amt:
                          type: integer
                          title: GMV (increment) from the last 90 day
                        total_sale_gmv_amt:
                          type: number
                          title: Total Sales GMV
                        total_video_cnt:
                          type: integer
                          title: Total number of sales videos
                        user_id:
                          type: string
                      x-apifox-orders:
                        - category_id
                        - category_l2_id
                        - category_l3_id
                        - cover_url
                        - first_crawl_dt
                        - from_flag
                        - most_product_category_list
                        - product_category_list
                        - rating
                        - region
                        - sales_flag
                        - sales_trend_flag
                        - seller_id
                        - seller_link
                        - seller_name
                        - spu_avg_price
                        - total_crawl_product_cnt
                        - total_ifl_cnt
                        - total_live_cnt
                        - total_product_cnt
                        - total_sale_1d_cnt
                        - total_sale_30d_cnt
                        - total_sale_7d_cnt
                        - total_sale_90d_cnt
                        - total_sale_cnt
                        - total_sale_gmv_1d_amt
                        - total_sale_gmv_30d_amt
                        - total_sale_gmv_7d_amt
                        - total_sale_gmv_90d_amt
                        - total_sale_gmv_amt
                        - total_video_cnt
                        - user_id
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8TJKXAHWC0JK4R93KT7T1CK
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8TJKXAHWC0JK4R93KT7T1CK:
                    $ref: '#/components/schemas/%E5%BA%97%E9%93%BA%E5%88%97%E8%A1%A8'
                x-apifox-ignore-properties:
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369404326-run
components:
  schemas:
    店铺列表:
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
                title: First-level category ID
              category_l2_id:
                type: string
                title: Secondary category ID
              category_l3_id:
                type: string
                title: Third-level category ID
              cover_url:
                type: string
                title: >-
                  Please use the download interface to download the store cover
                  image.
              first_crawl_dt:
                type: integer
                title: First store crawl time
              from_flag:
                type: integer
                title: Cross-border identification 1=Local 2=Cross-border
              most_product_category_list:
                type: string
                title: TOP1 Product Category
              product_category_list:
                type: string
                title: Product categories
              rating:
                type: integer
              region:
                type: string
              sales_flag:
                type: integer
                title: 'Main sales methods: 1. Video; 2. Live streaming'
              sales_trend_flag:
                type: integer
                title: Sales Trends
              seller_id:
                type: string
                title: Shop Id
              seller_link:
                type: 'null'
              seller_name:
                type: string
              spu_avg_price:
                type: number
                title: Average price of all SKUs in the store
              total_crawl_product_cnt:
                type: integer
                title: Number of items in store
              total_ifl_cnt:
                type: integer
                title: Total number of creators selling products
              total_live_cnt:
                type: integer
                title: Total live streams
              total_product_cnt:
                type: integer
                description: Including removed products
                title: Historical number of items in store
              total_sale_1d_cnt:
                type: integer
                title: Sales in the last 1 day (increment)
              total_sale_30d_cnt:
                type: integer
                title: Sales in the last 30 day (increment)
              total_sale_7d_cnt:
                type: integer
                title: Sales in the last 7 day (increment)
              total_sale_90d_cnt:
                type: integer
                title: Sales in the last 90 day (increment)
              total_sale_cnt:
                type: integer
                title: Total sales
              total_sale_gmv_1d_amt:
                type: integer
                title: GMV (increment) from the last 1 day
              total_sale_gmv_30d_amt:
                type: integer
                title: GMV (increment) from the last 30 day
              total_sale_gmv_7d_amt:
                type: integer
                title: GMV (increment) from the last 7 day
              total_sale_gmv_90d_amt:
                type: integer
                title: GMV (increment) from the last 90 day
              total_sale_gmv_amt:
                type: number
                title: Total Sales GMV
              total_video_cnt:
                type: integer
                title: Total number of sales videos
              user_id:
                type: string
            x-apifox-orders:
              - category_id
              - category_l2_id
              - category_l3_id
              - cover_url
              - first_crawl_dt
              - from_flag
              - most_product_category_list
              - product_category_list
              - rating
              - region
              - sales_flag
              - sales_trend_flag
              - seller_id
              - seller_link
              - seller_name
              - spu_avg_price
              - total_crawl_product_cnt
              - total_ifl_cnt
              - total_live_cnt
              - total_product_cnt
              - total_sale_1d_cnt
              - total_sale_30d_cnt
              - total_sale_7d_cnt
              - total_sale_90d_cnt
              - total_sale_cnt
              - total_sale_gmv_1d_amt
              - total_sale_gmv_30d_amt
              - total_sale_gmv_7d_amt
              - total_sale_gmv_90d_amt
              - total_sale_gmv_amt
              - total_video_cnt
              - user_id
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

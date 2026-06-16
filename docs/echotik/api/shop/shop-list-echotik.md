# Lista de Lojas — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369399356e0) · **`GET /api/v3/echotik/seller/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Lista lojas (sellers) do TikTok Shop a partir da biblioteca offline da EchoTik (atualizada em T+1), com filtros por categoria, tipo de loja (local/cross-border), canal de venda predominante e tendência, além de ordenação por vendas/GMV/preço médio. É o endpoint de **descoberta e ranking de lojas** em larga escala — ponto de entrada para explorar concorrência. Para detalhe de uma loja específica use `seller/detail`; para a evolução temporal use `seller/trend`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `category_id` | string | Não | id de categoria nível 1 | Filtra lojas pela categoria primária. Resolva o id via `category/l1`. |
| `category_l2_id` | string | Não | id de categoria nível 2 | Filtra pela subcategoria secundária. |
| `category_l3_id` | string | Não | id de categoria nível 3 | Filtra pela subcategoria de terceiro nível. |
| `from_flag` | integer | Não | `1` = loja local · `2` = loja cross-border | Filtra por origem da loja. |
| `sales_flag` | integer | Não | `1` = vídeo · `2` = live | Filtra pelo canal de venda predominante da loja. |
| `sales_trend_flag` | integer | Não | `0` = estável · `1` = subindo · `2` = caindo | Filtra pela tendência de vendas nos últimos 7 dias. |
| `seller_sort_field` | integer | Não | `1` = total_sale_cnt · `2` = total_sale_gmv_amt · `3` = spu_avg_price | Campo de ordenação da lista. |
| `sort_type` | integer | Não | `0` = ascendente · `1` = descendente | Direção da ordenação. |
| `region` | string | **Sim** | código de região, ex.: `BR`, `US` | Região do mercado. Para o SLEAG validado em `BR`. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx **10** | Itens por página. Limite rígido de 10. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/list?region=BR&seller_sort_field=2&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | Id da categoria primária da loja. Resolva via `category/l1`. |
| `category_l2_id` | string | Id da categoria secundária. |
| `category_l3_id` | string | Id da categoria de terceiro nível. |
| `cover_url` | string | URL da imagem de capa da loja. A EchoTik recomenda baixar via interface de download (o link direto pode expirar/ter controle de acesso). |
| `first_crawl_dt` | integer | Data/hora do primeiro rastreamento da loja pela EchoTik. (não documentado o formato — provavelmente timestamp epoch ou `yyyyMMdd` como inteiro.) |
| `from_flag` | integer | Origem: `1` = local · `2` = cross-border. |
| `most_product_category_list` | string | Categoria TOP1 de produtos da loja (a mais frequente). Vem como **string JSON** (ex.: `[{"category_name":"…","category_id":"…"}]`), precisa de parse. |
| `product_category_list` | string | Lista de categorias de produto da loja, também como **string JSON** a parsear. |
| `rating` | integer | Avaliação/nota da loja. (sem descrição na spec — provavelmente nota média de avaliações; tipo `integer` na spec, mas pode vir fracionado como em `seller/ranklist`.) |
| `region` | string | Região da loja (ex.: `BR`). |
| `sales_flag` | integer | Canal de venda predominante: `1` = vídeo · `2` = live. |
| `sales_trend_flag` | integer | Tendência de vendas: `0` = estável · `1` = subindo · `2` = caindo. |
| `seller_id` | string | **Id da loja** (chave primária da loja; usar nos demais endpoints `seller/*`). |
| `seller_link` | null | Link da loja. Vem como `null` na spec (não populado). (não documentado — provavelmente reservado para a URL pública da loja.) |
| `seller_name` | string | Nome da loja. (sem descrição na spec — nome de exibição do seller.) |
| `spu_avg_price` | number | Preço médio de todos os SKUs da loja. |
| `total_crawl_product_cnt` | integer | Nº de produtos atualmente catalogados na loja (coletados pela EchoTik). |
| `total_ifl_cnt` | integer | Nº total de criadores (influencers) que vendem produtos da loja. |
| `total_live_cnt` | integer | Nº total de lives da loja. |
| `total_product_cnt` | integer | Nº histórico de produtos da loja, **incluindo produtos removidos**. |
| `total_sale_1d_cnt` | integer | Vendas (unidades) no último 1 dia — valor **incremental** do período. |
| `total_sale_30d_cnt` | integer | Vendas (unidades) nos últimos 30 dias — incremental. |
| `total_sale_7d_cnt` | integer | Vendas (unidades) nos últimos 7 dias — incremental. |
| `total_sale_90d_cnt` | integer | Vendas (unidades) nos últimos 90 dias — incremental. |
| `total_sale_cnt` | integer | Vendas totais acumuladas (histórico). |
| `total_sale_gmv_1d_amt` | integer | GMV do último 1 dia — incremental (estimado). |
| `total_sale_gmv_30d_amt` | integer | GMV dos últimos 30 dias — incremental (estimado). |
| `total_sale_gmv_7d_amt` | integer | GMV dos últimos 7 dias — incremental (estimado). |
| `total_sale_gmv_90d_amt` | integer | GMV dos últimos 90 dias — incremental (estimado). |
| `total_sale_gmv_amt` | number | GMV total de vendas acumulado (estimado). |
| `total_video_cnt` | integer | Nº total de vídeos de venda associados à loja. |
| `user_id` | string | Id de usuário associado à loja (conta TikTok dona da loja). (sem descrição na spec — provavelmente o `user_id` do dono/conta principal da loja.) |

## Notas & gotchas
- **Strings numéricas**: `seller_id`, `user_id` e ids de categoria vêm como string (números longos) — não converter para `number`.
- **GMV é estimado** pela EchoTik, não é receita oficial; trate como ordem de grandeza.
- Métricas `*_1d/7d/30d/90d` são **incrementais** (variação do período), não acumuladas — não somar com `total_*_cnt`.
- `most_product_category_list` e `product_category_list` são **strings JSON** — exigem `JSON.parse`.
- `page_size` máximo **10**; para varrer mais lojas, paginar via `page_num`.
- Dado **offline T+1**: reflete o estado de ontem, não tempo real.

## Relevância para o SLEAG
- Alimenta o **ranking/descoberta de lojas** da área de Lojas/Concorrência: listar concorrentes por GMV/vendas, filtrar por categoria e tendência.
- Os campos de tendência (`sales_trend_flag`) e incrementos (`*_7d`) servem para destacar lojas em ascensão.
- `seller_id` é a chave para drill-down nos endpoints `seller/detail`, `seller/trend`, `seller/product/list`, `seller/influencer/list`, `seller/video/list`, `seller/live/list`.

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
  /api/v3/echotik/seller/list:
    get:
      summary: Shop List - EchoTik
      deprecated: false
      description: >-
        A small shop data providing EchoTik offline (T+1 update) library,
        suitable for scenarios requiring large-scale acquisition of shop data.
      tags:
        - Shop
      parameters:
        - name: category_id
          in: query
          description: Shop's primary category ID
          required: false
          schema:
            type: string
        - name: category_l2_id
          in: query
          description: Shop's secondary category ID
          required: false
          schema:
            type: string
        - name: category_l3_id
          in: query
          description: Shop's subcategory category ID
          required: false
          schema:
            type: string
        - name: from_flag
          in: query
          description: 1 = Local store 2 = Cross-border store
          required: false
          schema:
            type: integer
        - name: sales_flag
          in: query
          description: 'Main sales methods: 1. Video; 2. Live streaming'
          required: false
          schema:
            type: integer
        - name: sales_trend_flag
          in: query
          description: Sales trend in the past 7 days, 0=stable 1=up 2=down
          required: false
          schema:
            type: integer
        - name: seller_sort_field
          in: query
          description: >-
            List sorting enumeration.1=total_sale_cnt 2=total_sale_gmv_amt
            3=spu_avg_price
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order 0=asc 1=desc
          required: false
          schema:
            type: integer
        - name: region
          in: query
          description: Region code, region, such as US
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
                  - 01K8TJ76EK66T77NPY0HA23RPR
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8TJ76EK66T77NPY0HA23RPR:
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369399356-run
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

# Lista de Produtos da Loja — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369405117e0) · **`GET /api/v3/echotik/seller/product/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna **todos os produtos que a EchoTik coletou de uma loja** (`seller_id`), com métricas de venda, GMV, vídeos, lives, views e criadores recortadas por janelas (1/7/15/30/60/90 dias e total), ordenável por vendas/GMV/preço médio. É a visão "catálogo + performance" de uma loja. A própria EchoTik avisa que **não é tempo real** e que o nº de produtos coletados pode divergir do nº real da loja. O schema dos campos de produto é o mesmo do endpoint de lista de produtos (a doc remete a ele para descrições).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja | Loja-alvo. |
| `seller_product_sort_field` | integer | Não | `1` = total_sale_cnt · `2` = total_sale_gmv_amt · `3` = spu_avg_price · `4` = total_sale_7d_cnt · `5` = total_sale_gmv_7d_amt | Campo de ordenação. |
| `sort_type` | integer | Não | `0` = ascendente · `1` = descendente | Direção da ordenação. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | string | **Sim** | máx **10** | Itens por página. (na spec o tipo está como `string`, ao contrário dos outros endpoints onde é `integer` — provável inconsistência da EchoTik; envie `10`.) |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/product/list?seller_id=7495539486134995508&seller_product_sort_field=2&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

> A spec não documenta campo a campo aqui: o `title` do `data` diz "Please refer to the product list API for descriptions of the returned fields". As inferências abaixo seguem o padrão de nomenclatura da EchoTik.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | Id da categoria primária do produto. Resolve via `category/l1`. |
| `category_l2_id` | string | Id da categoria secundária. |
| `category_l3_id` | string | Id da categoria de terceiro nível. |
| `cover_url` | string | URL da capa/imagem do produto. Provavelmente baixar via interface de download. |
| `desc_detail` | string | Descrição detalhada do produto. (não documentado — provavelmente texto descritivo do PDP.) |
| `discount` | string | Desconto aplicado. (não documentado — provavelmente percentual/rótulo de desconto como string.) |
| `first_crawl_dt` | integer | Data/hora do primeiro rastreamento do produto. (formato não documentado — provavelmente epoch/`yyyyMMdd`.) |
| `free_shipping` | integer | Indicador de frete grátis (provável `1` = sim, `0` = não). (não documentado.) |
| `is_s_shop` | integer | Flag de loja "S" / loja oficial/selecionada (provável `1`/`0`). (não documentado — provavelmente marca loja oficial ou "Shop" verificada.) |
| `max_price` | number | Maior preço entre os SKUs do produto. |
| `min_price` | number | Menor preço entre os SKUs do produto. |
| `off_mark` | integer | Marca de produto removido/fora de linha (provável `1` = desativado). (não documentado.) |
| `product_commission_rate` | integer | Taxa de comissão de afiliado do produto. (não documentado — provavelmente percentual; conferir se é inteiro ou base 100/10000.) |
| `product_id` | string | Id do produto. Chave para drill-down no detalhe de produto. |
| `product_name` | string | Nome do produto. (não documentado.) |
| `product_rating` | number | Nota média do produto. (não documentado.) |
| `region` | string | Região do produto (ex.: `BR`). (não documentado.) |
| `review_count` | integer | Nº de avaliações do produto. (não documentado.) |
| `sale_props` | string | Propriedades de venda (atributos/variações, ex.: cor/tamanho). **String JSON** provável, precisa de parse. (não documentado.) |
| `sales_flag` | integer | Canal de venda predominante: `1` = vídeo · `2` = live (padrão EchoTik). (não documentado.) |
| `sales_trend_flag` | integer | Tendência de vendas: `0` = estável · `1` = subindo · `2` = caindo (padrão EchoTik). (não documentado.) |
| `seller_id` | string | Id da loja (eco do parâmetro). (não documentado.) |
| `skus` | string | Lista de SKUs do produto. **String JSON** provável, precisa de parse. (não documentado.) |
| `spu_avg_price` | number | Preço médio do SPU (produto). (não documentado.) |
| `total_ifl_cnt` | integer | Nº total de criadores que promovem o produto. (não documentado.) |
| `total_ifl_live_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Nº de criadores que promoveram o produto **em live** na janela indicada. (não documentado — incremental por período.) |
| `total_ifl_video_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Nº de criadores que promoveram o produto **em vídeo** na janela indicada. (não documentado — incremental por período.) |
| `total_live_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Nº de lives que promoveram o produto na janela. (não documentado — incremental.) |
| `total_live_cnt` | integer | Nº total de lives que promoveram o produto (acumulado). (não documentado.) |
| `total_live_sale_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Vendas (unid.) do produto **via live** na janela. (não documentado — incremental, estimado.) |
| `total_live_sale_gmv_{1d,7d,15d,30d,60d,90d}_amt` | integer | GMV do produto **via live** na janela. (não documentado — incremental, estimado.) |
| `total_sale_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Vendas (unid.) do produto na janela (todos os canais). (não documentado — incremental, estimado.) |
| `total_sale_cnt` | integer | Vendas totais acumuladas do produto. (não documentado — estimado.) |
| `total_sale_gmv_{1d,7d,15d,30d}_amt` | integer | GMV do produto na janela (1/7/15/30d como `integer`). (não documentado — incremental, estimado.) |
| `total_sale_gmv_{60d,90d}_amt` | number | GMV do produto na janela (60/90d como `number`). (não documentado — incremental, estimado. Tipos divergem do bloco acima.) |
| `total_sale_gmv_amt` | number | GMV total acumulado do produto. (não documentado — estimado.) |
| `total_video_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Nº de vídeos que promoveram o produto na janela. (não documentado — incremental.) |
| `total_video_cnt` | integer | Nº total de vídeos que promoveram o produto (acumulado). (não documentado.) |
| `total_views_{1d,7d,15d,30d,60d,90d}_cnt` | integer | Visualizações de conteúdo do produto na janela. (não documentado — incremental.) |
| `total_views_cnt` | integer | Visualizações totais acumuladas do produto. (não documentado.) |

> As janelas existentes para cada métrica de período são: **1d, 7d, 15d, 30d, 60d, 90d**. Veja a lista exata no `x-apifox-orders` da spec original abaixo.

## Notas & gotchas
- **Não é tempo real**: o nº de produtos coletados pode divergir do nº real da loja (aviso da própria EchoTik). Para tempo real, use `realtime/seller/product/list`.
- Campos **sem descrição na spec** — a doc remete ao endpoint de "product list" para significados. Inferências acima.
- **Inconsistência de tipos**: `total_sale_gmv_60d_amt` e `total_sale_gmv_90d_amt` são `number`, enquanto os demais `*_gmv_*` são `integer`. Trate todos como numéricos com cautela.
- `page_size` declarado como **`string`** na spec (diferente dos outros endpoints) — enviar `"10"`/`10`.
- `sale_props` e `skus` são provavelmente **strings JSON** a parsear.
- **Strings numéricas**: `product_id`, `seller_id`, ids de categoria como string.
- Métricas `*_1d/7d/15d/30d/60d/90d` são **incrementais**; `total_*_cnt`/`total_*_amt` (sem janela) são acumuladas. **GMV estimado**. Dado **offline T+1**.

## Relevância para o SLEAG
- Alimenta a aba **Produtos por loja** na área de Concorrência: ver o catálogo de um concorrente ordenado por GMV/vendas e por janela recente (7d).
- As métricas por janela alimentam o sinal "produtos mais vendidos" do dashboard quando recortado por loja.
- `product_id` liga ao detalhe/tendência de produto; `category_*` resolvem nomes via `category/l*`.

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
  /api/v3/echotik/seller/product/list:
    get:
      summary: Shop's product list - EchoTik
      deprecated: false
      description: >-
        Retrieve the list of all products EchoTik has collected for a store
        using the store's seller_id.

        Note: This interface is not real-time, and there may be a discrepancy
        between the number of products in the actual store and the number of
        products collected. We are working hard to improve product inclusion.
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: Shop Id
          required: true
          schema:
            type: string
        - name: seller_product_sort_field
          in: query
          description: >-
            List sorting enumeration.1=total_sale_cnt 2=total_sale_gmv_amt
            3=spu_avg_price 4=total_sale_7d_cnt 5=total_sale_gmv_7d_amt
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order 0=asc 1=desc
          required: false
          schema:
            type: integer
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
                  data: &ref_0
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
                          type: number
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
                        - total_live_sale_gmv_15d_amt
                        - total_live_sale_gmv_1d_amt
                        - total_live_sale_gmv_30d_amt
                        - total_live_sale_gmv_60d_amt
                        - total_live_sale_gmv_7d_amt
                        - total_live_sale_gmv_90d_amt
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
                        - total_views_15d_cnt
                        - total_views_1d_cnt
                        - total_views_30d_cnt
                        - total_views_60d_cnt
                        - total_views_7d_cnt
                        - total_views_90d_cnt
                        - total_views_cnt
                      x-apifox-ignore-properties: []
                    title: >-
                      Please refer to the product list API for descriptions of
                      the returned fields.
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8TJYT57SXCJBKWTYPP5NR2H
                x-apifox-refs:
                  01K8TJYT57SXCJBKWTYPP5NR2H:
                    $ref: >-
                      #/components/schemas/%E5%BA%97%E9%93%BA%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8
                    x-apifox-overrides:
                      data: *ref_0
                    required:
                      - data
                required:
                  - code
                  - message
                  - data
                  - requestId
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369405117-run
components:
  schemas:
    店铺商品列表:
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
                type: number
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
              - total_live_sale_gmv_15d_amt
              - total_live_sale_gmv_1d_amt
              - total_live_sale_gmv_30d_amt
              - total_live_sale_gmv_60d_amt
              - total_live_sale_gmv_7d_amt
              - total_live_sale_gmv_90d_amt
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
              - total_views_15d_cnt
              - total_views_1d_cnt
              - total_views_30d_cnt
              - total_views_60d_cnt
              - total_views_7d_cnt
              - total_views_90d_cnt
              - total_views_cnt
            x-apifox-ignore-properties: []
          title: 返回字段描述请参考 商品列表接口
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

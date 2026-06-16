# Influencer Product List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368758981e0) · **`GET /api/v3/echotik/influencer/product/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna os produtos promovidos por um criador, identificado por `user_id`. A fonte cobre os três canais: live commerce, vídeo e vitrine (showcase). Traz métricas agregadas por produto (vendas e GMV totais, e o split entre live e vídeo). **Não retorna dados detalhados do produto** — para isso, consulte o endpoint de detalhes de produto em lote usando o `product_id`. Use para mapear o portfólio comercial de um criador. Dados offline (T+1).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `user_id` | string | **Sim** | ID interno do criador | Identifica o criador. |
| `category_id` | string | Não | ID de categoria L1 | Filtra pela categoria primária do produto. |
| `influencer_product_sort_field` | integer | Não | `1`=total_sale_cnt, `2`=total_sale_gmv_amt, `3`=spu_avg_price, `4`=total_video_sale_cnt, `5`=total_video_sale_gmv_amt | Campo de ordenação. |
| `sort_type` | integer | Não | `0`=asc, `1`=desc | Direção da ordenação. |
| `page_num` | integer | **Sim** | `1`..`100000` | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx. `10` | Itens por página. Limite máximo de 10. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/product/list?user_id=6761507140245292038&influencer_product_sort_field=2&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data` (uma linha por produto)
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `category_id` | string | Não | ID da categoria primária (L1) do produto. |
| `cover_url` | string | Não | **JSON-array serializado (string)** com as capas do produto: `[{ "url": "...", "index": 0 }, ...]`. Não é uma URL única. As URLs expiram. |
| `product_id` | string | Não | ID do produto. Use-o no endpoint de detalhes de produto. |
| `product_name` | string | Não | Nome do produto. |
| `spu_avg_price` | number | Não | Preço médio do SKU/SPU do produto. |
| `total_live_cnt` | integer | Não | Número de lives associadas a este produto. |
| `total_live_sale_cnt` | integer | Não | Vendas via live associadas a este produto (estimado). |
| `total_live_sale_gmv_amt` | integer | Não | GMV de vendas via live associadas a este produto (estimado). |
| `total_sale_cnt` | integer | Não | Total de vendas do produto (todos os canais). |
| `total_sale_gmv_amt` | number | Não | GMV total de vendas do produto. |
| `total_video_cnt` | integer | Não | Número de vídeos associados a este produto. |
| `total_video_sale_cnt` | integer | Não | Vendas via vídeo associadas a este produto (estimado). |
| `total_video_sale_gmv_amt` | integer | Não | GMV de vendas via vídeo associadas a este produto (estimado). |
| `user_id` | string | Não | ID interno do criador (eco do parâmetro). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "category_id": "601450",
      "cover_url": "[{ \"url\":\"https://echosell-images.tos-ap-southeast-1.volces.com/product-cover/229/1729383941730701675_1.jpeg\",\"index\":1},{ \"url\":\"https://echosell-images.tos-ap-southeast-1.volces.com/product-cover/229/1729383941730701675_0.jpeg\",\"index\":0}]",
      "product_id": "1729383941730701675",
      "product_name": "Unbrush Detangling Hair Brush by FHI Heat",
      "spu_avg_price": 14.98,
      "total_live_cnt": 0,
      "total_live_sale_cnt": 0,
      "total_live_sale_gmv_amt": 0,
      "total_sale_cnt": 943075,
      "total_sale_gmv_amt": 9604137.31,
      "total_video_cnt": 1,
      "total_video_sale_cnt": 0,
      "total_video_sale_gmv_amt": 0,
      "user_id": "6813855719982466054"
    }
  ],
  "requestId": "b6a5f64d-d987-43a2-82c7-baad9131b17a"
}
```
> (Exemplo resumido — `cover_url` real traz 7 capas no array.)

## Notas & gotchas
- Endpoint só dá visão **agregada por produto sob a ótica do criador**; para ficha completa do produto, chame o endpoint de detalhes de produto com `product_id`.
- `cover_url` é um **array JSON dentro de string** (`[{url,index}]`), não uma URL simples — parseie no cliente. URLs expiram.
- `total_sale_gmv_amt` e `spu_avg_price` são **number**; os de canal (`*_live_*`, `*_video_*`) são integer. Todos os valores de venda/GMV são **estimados**.
- IDs (`category_id`, `product_id`, `user_id`) vêm como **string**.

## Relevância para o SLEAG
- Liga **criador → produtos** (que produtos um concorrente/criador empurra e com que canal vende mais).
- Apoia a métrica nº 1 do dashboard (produtos mais vendidos) cruzando com os criadores que os promovem.

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
  /api/v3/echotik/influencer/product/list:
    get:
      summary: Influencer Product List - EchoTik
      deprecated: false
      description: >-
        Retrieve product information promoted by influencers using user_id. Data
        source: live streaming e-commerce, video e-commerce, or product showcase
        e-commerce.

        This interface does not return detailed product data. If you need more
        product data, you can query in batches in the product details using
        product_id.
      tags:
        - Influencer
      parameters:
        - name: user_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: category_id
          in: query
          description: Product primary category ID filtering
          required: false
          schema:
            type: string
        - name: influencer_product_sort_field
          in: query
          description: >-
            List sorting field 1=total_sale_cnt 2=total_sale_gmv_amt
            3=spu_avg_price 4=total_video_sale_cnt 5=total_video_sale_gmv_amt
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
                          title: Product primary category ID
                        cover_url:
                          type: string
                          title: Product cover
                        product_id:
                          type: string
                        product_name:
                          type: string
                        spu_avg_price:
                          type: number
                          title: Average price of product SKU
                        total_live_cnt:
                          type: integer
                          title: >-
                            The live stream sessions associated with this
                            product
                        total_live_sale_cnt:
                          type: integer
                          title: >-
                            Live stream sales (estimated) associated with this
                            item
                        total_live_sale_gmv_amt:
                          type: integer
                          title: >-
                            GMV (estimated) of live stream sales associated with
                            this item
                        total_sale_cnt:
                          type: integer
                          title: Total sales of products
                        total_sale_gmv_amt:
                          type: number
                          title: Total sales gmv of products
                        total_video_cnt:
                          type: integer
                          title: The number of videos associated with this product
                        total_video_sale_cnt:
                          type: integer
                          title: >-
                            Estimated sales volume of the video associated with
                            this product.
                        total_video_sale_gmv_amt:
                          type: integer
                          title: >-
                            The GMV (estimated) of video sales associated with
                            this product
                        user_id:
                          type: string
                      x-apifox-orders:
                        - category_id
                        - cover_url
                        - product_id
                        - product_name
                        - spu_avg_price
                        - total_live_cnt
                        - total_live_sale_cnt
                        - total_live_sale_gmv_amt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - total_video_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
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
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368758981-run
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

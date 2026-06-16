# Lives Associadas ao Produto (Product Association Live Stream List - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369213085e0) · **`GET /api/v3/echotik/product/live/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Lista as **sessões de live (transmissões ao vivo) associadas a um produto** (`product_id`) — as lives em que aquele item foi vendido/exibido. Biblioteca offline T+1. Retorna, por live, capa, horário, pico de espectadores, total de produtos exibidos, vendas/GMV estimados atribuídos e total de espectadores. Filtra por faixa de data e ordena por views/vendas/GMV/nº de produtos. Complementa o endpoint de vídeos: cobre o canal **live commerce**.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | — | Produto cujas lives associadas se quer. |
| `min_create_time` | int | Não | timestamp | Início da faixa de data de criação da live (provavelmente epoch em segundos — ver `create_time` no response). |
| `max_create_time` | int | Não | timestamp | Fim da faixa de data de criação. |
| `product_live_sort_field` | int | Não | `1`=max_views_cnt, `2`=total_product_cnt, `3`=total_sale_cnt, `4`=total_sale_gmv_amt, `5`=total_views_cnt | Campo de ordenação. |
| `sort_type` | int | Não | `0`=asc, `1`=desc | Direção da ordenação. |
| `page_num` | int | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | int | Sim | **máx. 10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/live/list?product_id=1729382310407603945&product_live_sort_field=5&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por live)
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | ID da categoria de 1º nível do produto. |
| `cover_url` | string | URL da capa/thumbnail da live (pode expirar; usar download de imagem se necessário). |
| `create_time` | int | Momento de criação da live. No exemplo (`1708707773`) é **epoch em segundos**. |
| `max_views_cnt` | int | Pico de espectadores simultâneos na live (máximo de viewers). |
| `product_id` | string | ID do produto (ecoa o parâmetro). |
| `region` | string | Região da live (código tipo `ID`, `US`). |
| `room_id` | string | ID da sala/sessão de live (identificador único da transmissão). |
| `spu_avg_price` | number | Preço médio dos SKUs do produto. |
| `total_product_cnt` | int | Total de produtos exibidos/vendidos na live (não só este; quantidade total de itens da sessão). |
| `total_sale_cnt` | int | Vendas totais **estimadas** atribuídas à live. |
| `total_sale_gmv_amt` | int | GMV total **estimado** atribuído à live. |
| `total_views_cnt` | int | Total de espectadores (views acumuladas) da live. |
| `user_id` | string | ID do criador/host que conduziu a live. |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "category_id": "601450",
      "cover_url": "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/2dc4fa579f5d4ea7b7d7b79f1df72dfe~tplv-aphluv4xwc-resize-webp:800:800.webp?from=3429627512",
      "create_time": 1708707773,
      "max_views_cnt": 0,
      "product_id": "1729382310407603945",
      "region": "ID",
      "room_id": "7338843929776622341",
      "spu_avg_price": 4.23,
      "total_product_cnt": 54,
      "total_sale_cnt": 0,
      "total_sale_gmv_amt": 0,
      "total_views_cnt": 50194,
      "user_id": "6649568052278132738"
    }
  ],
  "requestId": "4a861e27-9962-4032-b82c-ee953efc0c53"
}
```

## Notas & gotchas
- `create_time` vem como **int** em **epoch segundos**.
- `max_views_cnt` é o **pico simultâneo**; `total_views_cnt` é o **acumulado** — não confunda.
- `total_product_cnt` é o total de itens da **live inteira**, não só deste produto.
- Vendas/GMV são **ESTIMATIVAS**; unidade do GMV não documentada.
- `cover_url` pode expirar. `page_size` máx. 10; dado T+1.

## Relevância para o SLEAG
- Cobre o canal **live commerce** na página de detalhe do produto (aba "lives").
- Concorrência: identificar quais hosts/lives movem um produto e o desempenho de cada sessão.
- Descoberta de criadores de live via `user_id` (cruza com seção de influenciadores).

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
  /api/v3/echotik/product/live/list:
    get:
      summary: Product Association Live Stream List - EchoTik
      deprecated: false
      description: >-
        Retrieve the list data of live streaming sessions associated with the
        product via the product's product_id.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: min_create_time
          in: query
          description: ''
          required: false
          schema:
            type: integer
        - name: max_create_time
          in: query
          description: ''
          required: false
          schema:
            type: integer
        - name: product_live_sort_field
          in: query
          description: >-
            List sorting enumeration.1=max_views_cnt 2=total_product_cnt
            3=total_sale_cnt 4=total_sale_gmv_amt 5=total_views_cnt
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
                          title: Live stream cover
                        create_time:
                          type: integer
                          title: Live stream creation time
                        max_views_cnt:
                          type: integer
                          title: Maximum number of viewers
                        product_id:
                          type: string
                        region:
                          type: string
                        room_id:
                          type: string
                        spu_avg_price:
                          type: number
                          title: Average price of product SKU
                        total_product_cnt:
                          type: integer
                          title: Total number of products
                        total_sale_cnt:
                          type: integer
                          title: Total sales (estimated)
                        total_sale_gmv_amt:
                          type: integer
                          title: Total sales GMV (estimated)
                        total_views_cnt:
                          type: integer
                          title: Total viewers
                        user_id:
                          type: string
                      x-apifox-orders:
                        - category_id
                        - cover_url
                        - create_time
                        - max_views_cnt
                        - product_id
                        - region
                        - room_id
                        - spu_avg_price
                        - total_product_cnt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - total_views_cnt
                        - user_id
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8T3Z6XT00XP94080QNRTWJ5
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8T3Z6XT00XP94080QNRTWJ5:
                    $ref: >-
                      #/components/schemas/%E5%95%86%E5%93%81%E5%85%B3%E8%81%94%E7%9B%B4%E6%92%AD%E5%88%97%E8%A1%A8
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - category_id: '601450'
                    cover_url: >-
                      https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/2dc4fa579f5d4ea7b7d7b79f1df72dfe~tplv-aphluv4xwc-resize-webp:800:800.webp?from=3429627512
                    create_time: 1708707773
                    max_views_cnt: 0
                    product_id: '1729382310407603945'
                    region: ID
                    room_id: '7338843929776622341'
                    spu_avg_price: 4.23
                    total_product_cnt: 54
                    total_sale_cnt: 0
                    total_sale_gmv_amt: 0
                    total_views_cnt: 50194
                    user_id: '6649568052278132738'
                requestId: 4a861e27-9962-4032-b82c-ee953efc0c53
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369213085-run
components:
  schemas:
    商品关联直播列表:
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
                title: Live stream cover
              create_time:
                type: integer
                title: Live stream creation time
              max_views_cnt:
                type: integer
                title: Maximum number of viewers
              product_id:
                type: string
              region:
                type: string
              room_id:
                type: string
              spu_avg_price:
                type: number
                title: Average price of product SKU
              total_product_cnt:
                type: integer
                title: Total number of products
              total_sale_cnt:
                type: integer
                title: Total sales (estimated)
              total_sale_gmv_amt:
                type: integer
                title: Total sales GMV (estimated)
              total_views_cnt:
                type: integer
                title: Total viewers
              user_id:
                type: string
            x-apifox-orders:
              - category_id
              - cover_url
              - create_time
              - max_views_cnt
              - product_id
              - region
              - room_id
              - spu_avg_price
              - total_product_cnt
              - total_sale_cnt
              - total_sale_gmv_amt
              - total_views_cnt
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

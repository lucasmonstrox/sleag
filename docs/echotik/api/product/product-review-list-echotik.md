# Lista de Avaliações do Produto (Product Review List - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/379355609e0) · **`GET /api/v3/echotik/product/comment`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna a **lista de avaliações/comentários** que a EchoTik já coletou para um produto (`product_id`), com filtro por faixa de nota. Biblioteca offline T+1 — atenção: só retorna os comentários **já indexados pela EchoTik**, não necessariamente todos os reviews do produto no TikTok ao vivo (para isso existe o endpoint de reviews em tempo-real). Use para análise de sentimento, prova social e entendimento de objeções de produto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | — | Produto cujas avaliações se quer. |
| `min_rating` | int | Não | 0..5 (ex.: `0`) | Nota mínima do review (inteiro de 0 a 5). |
| `max_rating` | int | Não | 0..5 | Nota máxima do review. |
| `page_num` | int | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | int | Sim | **máx. 10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/comment?product_id=1729471493154312768&min_rating=4&max_rating=5&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por review)
| Campo | Tipo | O que é |
|---|---|---|
| `display_text` | string | Texto do comentário/avaliação (ex.: "Soft, smooth"). |
| `product_id` | string | ID do produto avaliado (ecoa o parâmetro). |
| `rating` | int | Nota da avaliação, inteiro de 0 a 5. |
| `review_id` | string | ID único da avaliação. |
| `review_timestamp` | int | Momento da avaliação. No exemplo (`1721308360410`) é **timestamp em milissegundos** (epoch ms). |
| `sku_id` | string | ID do SKU específico avaliado (variante comprada). |
| `sku_specification` | string | Descrição da variante avaliada (ex.: `"Item: one-size, Pink"`). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "display_text": "Soft, smooth",
      "product_id": "1729471493154312768",
      "rating": 5,
      "review_id": "7392963066264504106",
      "review_timestamp": 1721308360410,
      "sku_id": "1729471493154378304",
      "sku_specification": "Item: one-size, Pink"
    }
  ],
  "requestId": "3c779a2c-f3b8-4393-9e11-243916dd32df"
}
```

## Notas & gotchas
- **Cobertura parcial:** só os reviews já indexados pela EchoTik. Para reviews ao vivo, use `product-review-list-real-time-interface`.
- `review_timestamp` está em **milissegundos** (epoch ms) no exemplo — divida por 1000 antes de converter para Date.
- `page_size` máx. 10.
- Notas são inteiras (0–5), sem casas decimais.

## Relevância para o TIKSPY
- **Análise de sentimento / prova social** na página de detalhe do produto.
- Insight de produto: entender por que um item vende (ou não) — objeções, elogios recorrentes.
- Uso secundário comparado a vendas/criativos, mas útil para validação de produtos vencedores.

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
  /api/v3/echotik/product/comment:
    get:
      summary: Product Review List - EchoTik
      deprecated: false
      description: >-
        Retrieve the list of comments collected by EchoTik using the product_id.

        Note: This API can only collect comment list data already indexed by
        EchoTik.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: min_rating
          in: query
          description: Score filtering; review scores are integers ranging from 0 to 5
          required: false
          example: 0
          schema:
            type: integer
        - name: max_rating
          in: query
          description: Score filtering; review scores are integers ranging from 0 to 5
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
                        display_text:
                          type: string
                          title: Comment content
                        product_id:
                          type: string
                        rating:
                          type: integer
                        review_id:
                          type: string
                        review_timestamp:
                          type: integer
                        sku_id:
                          type: string
                        sku_specification:
                          type: string
                      x-apifox-orders:
                        - display_text
                        - product_id
                        - rating
                        - review_id
                        - review_timestamp
                        - sku_id
                        - sku_specification
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01KAFMH1XSN6GASQQPMP69X55J
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01KAFMH1XSN6GASQQPMP69X55J:
                    $ref: >-
                      #/components/schemas/%E5%95%86%E5%93%81%E8%AF%84%E8%AE%BA%E5%88%97%E8%A1%A8
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - display_text: Soft, smooth
                    product_id: '1729471493154312768'
                    rating: 5
                    review_id: '7392963066264504106'
                    review_timestamp: 1721308360410
                    sku_id: '1729471493154378304'
                    sku_specification: 'Item: one-size, Pink'
                requestId: 3c779a2c-f3b8-4393-9e11-243916dd32df
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-379355609-run
components:
  schemas:
    商品评论列表:
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
              display_text:
                type: string
                title: Comment content
              product_id:
                type: string
              rating:
                type: integer
              review_id:
                type: string
              review_timestamp:
                type: integer
              sku_id:
                type: string
              sku_specification:
                type: string
            x-apifox-orders:
              - display_text
              - product_id
              - rating
              - review_id
              - review_timestamp
              - sku_id
              - sku_specification
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

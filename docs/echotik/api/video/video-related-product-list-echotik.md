# Video-related product list - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372698080e0) · **`GET /api/v3/echotik/video/product/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Dado um ou mais `video_ids`, retorna os produtos (TikTok Shop) associados a esses vídeos, junto de métricas do vídeo (views, curtidas, vendas/GMV estimados) e o endereço de reprodução. Use para ligar um criativo ao produto que ele divulga — descobrir "que produto este vídeo vende". Dados da biblioteca offline (T+1).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_ids` | string | Sim | ID(s) de vídeo; vários separados por vírgula ASCII (`,`). |
| `page_num` | integer | Não | Página, começa em 1, máximo 100000. |
| `page_size` | integer | Não | Itens por página, máximo **10**. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/video/product/list?video_ids=7590123280372190477&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` significa sucesso. `data` é um array de pares vídeo↔produto.

### Campos de `data`
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `create_time` | string | Não | Timestamp Unix (segundos, em string) da publicação do vídeo. |
| `data_size` | string | Não | Tamanho do arquivo de vídeo em bytes (peso do MP4). |
| `duration` | integer | Não | Duração do vídeo em segundos. |
| `hash_tag` | string | Não | Hashtags do vídeo, como string (ex.: `"#SmallBusiness #startup #proteinsnacks "`). |
| `height` | string | Não | Altura do vídeo em pixels. |
| `play_addr` | string | Não | URL de reprodução (stream) do vídeo no CDN do TikTok. Expira. |
| `product_id` | string | Não | ID do produto associado ao vídeo. |
| `ratio` | string | Não | Resolução/qualidade do vídeo (ex.: `540p`). |
| `reflow_cover` | string | Não | URL da thumbnail/capa. Expira — use o endpoint de download. |
| `region` | string | Não | Região/mercado do vídeo. |
| `total_comments_cnt` | integer | Não | Total de comentários acumulados. |
| `total_digg_cnt` | integer | Não | Total de curtidas acumuladas. |
| `total_favorites_cnt` | integer | Não | Total de salvamentos/favoritos acumulados. |
| `total_shares_cnt` | integer | Não | Total de compartilhamentos acumulados. |
| `total_video_sale_cnt` | integer | Não | Vendas estimadas atribuídas ao vídeo. |
| `total_video_sale_gmv_amt` | number | Não | GMV estimado atribuído ao vídeo (tipado como `number`, admite decimais). |
| `total_views_cnt` | integer | Não | Total de views acumuladas. |
| `user_id` | string | Não | ID interno do TikTok do criador. |
| `video_desc` | string | Não | Legenda/descrição (título) do vídeo. |
| `video_id` | string | Não | ID do vídeo no TikTok. |
| `width` | string | Não | Largura do vídeo em pixels. |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "create_time": "1751301603",
      "data_size": "6728409",
      "duration": 164,
      "hash_tag": "#SmallBusiness #startup #proteinsnacks ",
      "height": "1024",
      "play_addr": "https://v19.tiktokcdn-us.com/.../?mime_type=video_mp4...",
      "product_id": "1729422228922143703",
      "ratio": "540p",
      "reflow_cover": "https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/836/7521783049722285367.jpeg",
      "region": "US",
      "total_comments_cnt": 3926,
      "total_digg_cnt": 920727,
      "total_favorites_cnt": 51447,
      "total_shares_cnt": 6213,
      "total_video_sale_cnt": 4479,
      "total_video_sale_gmv_amt": 133621.6,
      "total_views_cnt": 33635675,
      "user_id": "7190508362273735722",
      "video_desc": "he made our entire week FR 🥹 #SmallBusiness #startup #proteinsnacks ",
      "video_id": "7521783049722285367",
      "width": "576"
    }
  ],
  "requestId": "6c7b787e-3d4c-4e8d-be55-b760b1a73ba4"
}
```

## Notas & gotchas
- Cada linha de `data` representa um par vídeo↔produto; um vídeo com vários produtos pode gerar várias linhas.
- `total_video_sale_gmv_amt` é `number` (admite casas decimais), diferente de outros endpoints onde é inteiro.
- Vendas/GMV são **estimativas**; `reflow_cover` e `play_addr` **expiram**.

## Relevância para o SLEAG
- Liga criativos a produtos: na página de detalhe de um produto, mostrar quais vídeos o vendem; na página de um vídeo, mostrar o produto promovido.
- `total_video_sale_*` por par vídeo↔produto sustenta o ranking de "criativos que mais vendem cada produto".

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
  /api/v3/echotik/video/product/list:
    get:
      summary: Video-related product list - EchoTik
      deprecated: false
      description: >-
        Retrieve the list of products associated with a video through the video
        ID. video_ids can be passed in bulk, with multiple values separated by
        English commas
      tags:
        - Video
      parameters:
        - name: video_ids
          in: query
          description: >-
            Video ID, multiple can be entered, multiple use English commas to
            separate
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
                        create_time:
                          type: string
                        data_size:
                          type: string
                        duration:
                          type: integer
                        hash_tag:
                          type: string
                        height:
                          type: string
                        play_addr:
                          type: string
                        product_id:
                          type: string
                        ratio:
                          type: string
                        reflow_cover:
                          type: string
                        region:
                          type: string
                        total_comments_cnt:
                          type: integer
                        total_digg_cnt:
                          type: integer
                        total_favorites_cnt:
                          type: integer
                        total_shares_cnt:
                          type: integer
                        total_video_sale_cnt:
                          type: integer
                          title: Video sales (estimated)
                        total_video_sale_gmv_amt:
                          type: number
                          title: Video sales GMV (estimated)
                        total_views_cnt:
                          type: integer
                        user_id:
                          type: string
                        video_desc:
                          type: string
                        video_id:
                          type: string
                        width:
                          type: string
                      x-apifox-orders:
                        - create_time
                        - data_size
                        - duration
                        - hash_tag
                        - height
                        - play_addr
                        - product_id
                        - ratio
                        - reflow_cover
                        - region
                        - total_comments_cnt
                        - total_digg_cnt
                        - total_favorites_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_cnt
                        - user_id
                        - video_desc
                        - video_id
                        - width
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
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372698080-run
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

# Batch fetch video details - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372694274e0) · **`GET /api/v3/echotik/video/detail`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna os detalhes de vários vídeos de uma só vez a partir de uma lista de `video_ids` (até 10 por chamada, separados por vírgula). É a forma de "hidratar" IDs de vídeo já conhecidos com métricas completas (views, curtidas, vendas estimadas, janelas 1d/7d/30d) sem listar/filtrar. Dados da biblioteca offline (T+1, atualização diária).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_ids` | string | Sim | Aceita lote de `video_id` separados por vírgula ASCII (`,`), até **10** por chamada. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/video/detail?video_ids=7618550044995669279,7590123280372190477" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` significa sucesso. `data` é um array de objetos de vídeo.

### Campos de `data`
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `create_time` | string | Não | Timestamp Unix (segundos, em string) da publicação. |
| `created_by_ai` | string | Não | `"true"`/`"false"` — se o vídeo foi gerado por IA. |
| `data_size` | string | Não | Tamanho do arquivo de vídeo em bytes (peso do MP4). |
| `duration` | integer | Não | Duração do vídeo em segundos. |
| `height` | string | Não | Altura do vídeo em pixels. |
| `ratio` | string | Não | Resolução/qualidade do vídeo (ex.: `720p`). |
| `reflow_cover` | string | Não | URL da thumbnail/capa. Expira — use o endpoint de download. |
| `region` | string | Não | Região/mercado do vídeo. |
| `sales_flag` | integer | Não | Método principal de venda: `0` = sem vendas, `1` = vendas por vídeo, `2` = vendas por live. |
| `total_comments_cnt` | integer | Não | Total de comentários acumulados. |
| `total_digg_1d_cnt` | integer | Não | Incremento de curtidas no último 1 dia. |
| `total_digg_30d_cnt` | integer | Não | Incremento de curtidas nos últimos 30 dias. |
| `total_digg_7d_cnt` | integer | Não | Incremento de curtidas nos últimos 7 dias. |
| `total_digg_cnt` | integer | Não | Total de curtidas. |
| `total_favorites_cnt` | integer | Não | Total de salvamentos/favoritos acumulados. |
| `total_shares_cnt` | integer | Não | Total de compartilhamentos acumulados. |
| `total_video_sale_cnt` | integer | Não | Vendas estimadas atribuídas ao vídeo. |
| `total_video_sale_gmv_amt` | integer | Não | GMV estimado atribuído ao vídeo. |
| `total_views_1d_cnt` | integer | Não | Incremento de views no último 1 dia. |
| `total_views_30d_cnt` | integer | Não | Incremento de views nos últimos 30 dias. |
| `total_views_7d_cnt` | integer | Não | Incremento de views nos últimos 7 dias. |
| `total_views_cnt` | integer | Não | Total de views acumuladas. |
| `unique_id` | string | Não | @handle do TikTok do criador. |
| `user_id` | string | Não | ID interno do TikTok do criador. |
| `video_desc` | string | Não | Legenda/descrição (título) do vídeo. |
| `video_id` | string | Não | ID do vídeo no TikTok. |
| `width` | string | Não | Largura do vídeo em pixels. |

> Nota: o **Example** da página traz campos adicionais (`avatar`, `is_ad`, `product_category_list`, `video_products`) que **não** aparecem na lista de campos do schema. São os mesmos de `video/list`; o endpoint os devolve na prática — trate-os como opcionais.

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "avatar": "https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/50/MS4wLjABAAAAUiCLfyIypDQ90ZZoWif7ed9qB-2VwSLk2_xBEn2TekGrw1Q4CYAHAzrozIinJgFy.jpg",
      "create_time": "1773831925",
      "created_by_ai": "false",
      "data_size": "9741401",
      "duration": 153,
      "height": "1280",
      "is_ad": 1,
      "product_category_list": "[]",
      "ratio": "720p",
      "reflow_cover": "https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/682/7618550044995669279.jpg",
      "region": "US",
      "sales_flag": 0,
      "total_comments_cnt": 41427,
      "total_digg_1d_cnt": 0,
      "total_digg_30d_cnt": 6625261,
      "total_digg_7d_cnt": 0,
      "total_digg_cnt": 6625261,
      "total_favorites_cnt": 629738,
      "total_shares_cnt": 1202761,
      "total_video_sale_cnt": 0,
      "total_video_sale_gmv_amt": 0,
      "total_views_1d_cnt": 0,
      "total_views_30d_cnt": 91589621,
      "total_views_7d_cnt": 0,
      "total_views_cnt": 91589621,
      "unique_id": "spidermanmovie",
      "user_id": "6699136201699640325",
      "video_desc": "A Brand New Day starts now. Watch the official trailer for #SpiderManBrandNewDay - exclusively in theatres July 31.",
      "video_id": "7618550044995669279",
      "video_products": "[]",
      "width": "720"
    }
  ],
  "requestId": "b818263e-dff8-443c-ac3a-7271fd42bcdd"
}
```

## Notas & gotchas
- Limite rígido de **10 IDs** por chamada; separador é a vírgula ASCII (`,`).
- Vários campos numéricos vêm como **string** (`create_time`, `data_size`, `height`, `width`, `created_by_ai`).
- Vendas/GMV são **estimativas**; thumbnails (`reflow_cover`) **expiram**.
- Janelas `_1d/_7d/_30d` são incrementos do período; `total_*_cnt` é acumulado.

## Relevância para o TIKSPY
- Hidratação eficiente de listas de vídeos já identificadas (ex.: enriquecer favoritos/coleções do usuário ou resultados de outra origem com métricas completas) em lotes de 10.
- Mesma estrutura de métricas de `video/list`, então serve a página de detalhe e os cards de "Criativos em alta".

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
  /api/v3/echotik/video/detail:
    get:
      summary: Batch fetch video details - EchoTik
      deprecated: false
      description: >-
        Retrieve video detail data in bulk via video_id, with a maximum of 10
        videos per request. Multiple videos can be separated using an English
        comma.
      tags:
        - Video
      parameters:
        - name: video_ids
          in: query
          description: >-
            Accept batch input of video_id, separated by English commas, up to a
            maximum of 10
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
                        create_time:
                          type: string
                        created_by_ai:
                          type: string
                        data_size:
                          type: string
                        duration:
                          type: integer
                        height:
                          type: string
                        ratio:
                          type: string
                        reflow_cover:
                          type: string
                          title: >-
                            For the video cover, please use the download
                            interface.
                        region:
                          type: string
                        sales_flag:
                          type: integer
                          title: Main sales methods, 0 represents non-sales videos.
                        total_comments_cnt:
                          type: integer
                        total_digg_1d_cnt:
                          type: integer
                          title: Recent 1-day like count increment
                        total_digg_30d_cnt:
                          type: integer
                          title: Recent 30-day like count increment
                        total_digg_7d_cnt:
                          type: integer
                          title: Recent 7-day like count increment
                        total_digg_cnt:
                          type: integer
                          title: Total likes
                        total_favorites_cnt:
                          type: integer
                        total_shares_cnt:
                          type: integer
                        total_video_sale_cnt:
                          type: integer
                          title: Total sales (estimated)
                        total_video_sale_gmv_amt:
                          type: integer
                          title: Total sales GMV (estimated)
                        total_views_1d_cnt:
                          type: integer
                          title: Increment in plays over the last 1 day
                        total_views_30d_cnt:
                          type: integer
                          title: Increment in plays over the last 30 day
                        total_views_7d_cnt:
                          type: integer
                          title: Increment in plays over the last 7 day
                        total_views_cnt:
                          type: integer
                        unique_id:
                          type: string
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
                        - created_by_ai
                        - data_size
                        - duration
                        - height
                        - ratio
                        - reflow_cover
                        - region
                        - sales_flag
                        - total_comments_cnt
                        - total_digg_1d_cnt
                        - total_digg_30d_cnt
                        - total_digg_7d_cnt
                        - total_digg_cnt
                        - total_favorites_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_1d_cnt
                        - total_views_30d_cnt
                        - total_views_7d_cnt
                        - total_views_cnt
                        - unique_id
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
              example:
                code: 0
                message: success
                data:
                  - avatar: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/50/MS4wLjABAAAAUiCLfyIypDQ90ZZoWif7ed9qB-2VwSLk2_xBEn2TekGrw1Q4CYAHAzrozIinJgFy.jpg
                    create_time: '1773831925'
                    created_by_ai: 'false'
                    data_size: '9741401'
                    duration: 153
                    height: '1280'
                    is_ad: 1
                    product_category_list: '[]'
                    ratio: 720p
                    reflow_cover: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/682/7618550044995669279.jpg
                    region: US
                    sales_flag: 0
                    total_comments_cnt: 41427
                    total_digg_1d_cnt: 0
                    total_digg_30d_cnt: 6625261
                    total_digg_7d_cnt: 0
                    total_digg_cnt: 6625261
                    total_favorites_cnt: 629738
                    total_shares_cnt: 1202761
                    total_video_sale_cnt: 0
                    total_video_sale_gmv_amt: 0
                    total_views_1d_cnt: 0
                    total_views_30d_cnt: 91589621
                    total_views_7d_cnt: 0
                    total_views_cnt: 91589621
                    unique_id: spidermanmovie
                    user_id: '6699136201699640325'
                    video_desc: >-
                      A Brand New Day starts now. Watch the official trailer for
                      #SpiderManBrandNewDay - exclusively in theatres July 31.
                    video_id: '7618550044995669279'
                    video_products: '[]'
                    width: '720'
                requestId: b818263e-dff8-443c-ac3a-7271fd42bcdd
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372694274-run
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

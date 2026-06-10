# Video List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372682468e0) · **`GET /api/v3/echotik/video/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Lista vídeos da biblioteca offline da EchoTik (atualização diária, T+1), com filtros ricos (região, autor, faixa de views, faixa de duração, janela de publicação, categoria de produto, vídeo de venda, vídeo de IA, anúncio) e ordenação. É o endpoint de aquisição em massa de vídeos. Por ser offline, os dados são consolidados uma vez por dia e não refletem o momento exato. Atenção: por custo, a EchoTik **não cobre todos os vídeos** existentes no TikTok — para cobertura completa de um perfil/hashtag específico use as interfaces real-time.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `region` | string | Sim | código de região, ex.: `US`, `BR` | Filtra vídeos por região/mercado. |
| `user_id` | string | Não | — | Filtra vídeos de um criador específico (ID interno do TikTok, não o @handle). |
| `sales_flag` | integer | Não | `1` = vídeo de divulgação de produto, `0` = não-divulgação | Filtra vídeos que promovem produto (TikTok Shop) vs. vídeos comuns. |
| `created_by_ai` | string | Não | `true` / `false` | Filtra apenas vídeos marcados como gerados por IA. |
| `min_create_time` | integer | Não | timestamp Unix (segundos) | Limite inferior da janela de publicação. |
| `max_create_time` | integer | Não | timestamp Unix (segundos) | Limite superior da janela de publicação. |
| `min_duration` | integer | Não | segundos | Duração mínima do vídeo. |
| `max_duration` | integer | Não | segundos | Duração máxima do vídeo. |
| `min_total_views_cnt` | integer | Não | — | Views totais mínimas (filtra por `total_views_cnt`). |
| `max_total_views_cnt` | integer | Não | — | Views totais máximas (filtra por `total_views_cnt`). |
| `video_sort_field` | integer | Não | `1` = curtidas (`total_digg_cnt`), `2` = data de publicação (`create_time`), `3` = views (`total_views_cnt`) | Campo de ordenação da lista. |
| `sort_type` | integer | Não | `0` = ascendente, `1` = descendente | Sentido da ordenação. |
| `product_category_id` | string | Não | — | ID de categoria de produto associado ao vídeo. |
| `is_ad` | integer | Não | `1` = anúncio, `0` = não-anúncio | Filtra vídeos que são peças publicitárias pagas. |
| `product_id` | string | Não | — | ID de produto associado ao vídeo. |
| `page_num` | integer | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | integer | Sim | máx **10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/video/list?region=BR&video_sort_field=3&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil do criador do vídeo. (não documentado pela EchoTik — provavelmente expira; baixe via endpoint de download.) |
| `create_time` | string | Timestamp Unix (segundos, em string) da publicação do vídeo. |
| `created_by_ai` | string | `"true"`/`"false"` — se o vídeo foi gerado por IA. |
| `data_size` | string | Tamanho do arquivo de vídeo em bytes (não documentado pela EchoTik — provavelmente o peso do MP4). |
| `duration` | integer | Duração do vídeo em segundos. |
| `height` | string | Altura do vídeo em pixels. |
| `is_ad` | integer | `1` = anúncio pago, `0` = não-anúncio. |
| `product_category_list` | string | JSON serializado (string) com as categorias dos produtos associados. Vem como `"[]"` quando não há. |
| `ratio` | string | Resolução/qualidade do vídeo (ex.: `720p`). |
| `reflow_cover` | string | URL da thumbnail/capa do vídeo. Expira — use o endpoint de download para acesso estável. |
| `region` | string | Região/mercado do vídeo. |
| `sales_flag` | integer | Principal método de venda: `0` = sem vendas, `1` = vendas por vídeo, `2` = vendas por live. |
| `total_comments_cnt` | integer | Total de comentários. |
| `total_digg_1d_cnt` | integer | Incremento de curtidas no último 1 dia. |
| `total_digg_30d_cnt` | integer | Incremento de curtidas nos últimos 30 dias. |
| `total_digg_7d_cnt` | integer | Incremento de curtidas nos últimos 7 dias. |
| `total_digg_cnt` | integer | Total de curtidas. |
| `total_favorites_cnt` | integer | Total de salvamentos/favoritos. |
| `total_shares_cnt` | integer | Total de compartilhamentos. |
| `total_video_sale_cnt` | integer | Vendas estimadas atribuídas ao vídeo. |
| `total_video_sale_gmv_amt` | integer | GMV (faturamento) estimado atribuído ao vídeo. |
| `total_views_1d_cnt` | integer | Incremento de views no último 1 dia. |
| `total_views_30d_cnt` | integer | Incremento de views nos últimos 30 dias. |
| `total_views_7d_cnt` | integer | Incremento de views nos últimos 7 dias. |
| `total_views_cnt` | integer | Total de views (acumulado). |
| `unique_id` | string | @handle do TikTok do criador. |
| `user_id` | string | ID interno do TikTok do criador. |
| `video_desc` | string | Legenda/descrição (título) do vídeo. |
| `video_id` | string | ID do vídeo no TikTok. |
| `video_products` | string | JSON serializado (string) com os produtos vinculados ao vídeo. Vem como `"[]"` quando não há. |
| `width` | string | Largura do vídeo em pixels. |

## Notas & gotchas
- `create_time`, `data_size`, `height`, `width`, `created_by_ai` e os JSONs (`product_category_list`, `video_products`) vêm como **string**, não como número/objeto — parseie no cliente.
- Vendas e GMV (`total_video_sale_*`) são **estimativas**, não números oficiais do TikTok Shop.
- Thumbnails (`reflow_cover`, `avatar`) **expiram**; persista via endpoint de download se precisar guardar.
- As janelas `_1d/_7d/_30d` são incrementos do período, úteis para detectar aceleração; `total_*_cnt` sem sufixo é o acumulado.
- Cobertura parcial: nem todo vídeo do TikTok está aqui. `page_size` máx 10 — paginação obrigatória para volume.

## Relevância para o TIKSPY
- Base direta da listagem `/videos`: filtros (região, duração, views, IA, anúncio), ordenação (`video_sort_field`/`sort_type`), título via `video_desc`, GMV/vendas estimadas e janelas de views.
- As janelas `total_views_1d/7d/30d_cnt` e `total_digg_*` alimentam a deteção de aceleração ("Criativos em alta").
- `sales_flag` e `video_products` distinguem criativos de venda (TikTok Shop) dos orgânicos.

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
  /api/v3/echotik/video/list:
    get:
      summary: Video List - EchoTik
      deprecated: false
      description: >-
        Provide video data from the EchoTik offline (T+1 update) library,
        suitable for scenarios requiring large-scale acquisition of video data.


        Note: Due to cost considerations, our collection and acquisition
        strategy will not cover all videos. For more videos, you can use the
        real-time video interface to obtain them.
      tags:
        - Video
      parameters:
        - name: region
          in: query
          description: Region code, region, such as US
          required: true
          schema:
            type: string
        - name: user_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: sales_flag
          in: query
          description: >-
            Whether it is a product promotion video, 1 = product promotion
            video, 0 = non - product promotion video
          required: false
          schema:
            type: integer
        - name: created_by_ai
          in: query
          description: true / false， Is AI video
          required: false
          schema:
            type: string
        - name: min_create_time
          in: query
          description: Publishing time range filter
          required: false
          schema:
            type: integer
        - name: max_create_time
          in: query
          description: Publishing time range filter
          required: false
          schema:
            type: integer
        - name: min_duration
          in: query
          description: Release duration range
          required: false
          schema:
            type: integer
        - name: max_duration
          in: query
          description: Release duration range
          required: false
          schema:
            type: integer
        - name: min_total_views_cnt
          in: query
          description: total_views_cnt range filter
          required: false
          schema:
            type: integer
        - name: max_total_views_cnt
          in: query
          description: total_views_cnt range filter
          required: false
          schema:
            type: integer
        - name: video_sort_field
          in: query
          description: >-
            List sorting enumeration 1=total_digg_cnt 2=create_time
            3=total_views_cnt
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order, 0=asc 1=desc
          required: false
          schema:
            type: integer
        - name: product_category_id
          in: query
          description: Category ID of associated products
          required: false
          schema:
            type: string
        - name: is_ad
          in: query
          description: >-
            Whether it is an advertisement video, 1 = advertisement video, 0 =
            non - advertisement video
          required: false
          schema:
            type: integer
        - name: product_id
          in: query
          description: Product ID associated with the video
          required: false
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
                        avatar:
                          type: string
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
                        is_ad:
                          type: integer
                        product_category_list:
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
                          title: Total number of comments
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
                          title: Total collections
                        total_shares_cnt:
                          type: integer
                          title: Total shares
                        total_video_sale_cnt:
                          type: integer
                          title: Total sales (estimated)
                        total_video_sale_gmv_amt:
                          type: integer
                          title: Total Sales GMV (estimated)
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
                          title: Total views
                        unique_id:
                          type: string
                          title: tiktok ID
                        user_id:
                          type: string
                        video_desc:
                          type: string
                          title: Video description
                        video_id:
                          type: string
                        video_products:
                          type: string
                        width:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - create_time
                        - created_by_ai
                        - data_size
                        - duration
                        - height
                        - is_ad
                        - product_category_list
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
                        - video_products
                        - width
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
                x-apifox-refs: {}
              example:
                code: 0
                message: success
                data:
                  - avatar: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/19/MS4wLjABAAAAP5MDMgXdMWNIPLlXvKUCd8Kl5CsZ49Q8MBCmrHrP_OemGSjkD6reMxXwIdixx4uK.jpg
                    create_time: '1767213318'
                    created_by_ai: 'false'
                    data_size: '1127263'
                    duration: 15
                    height: '1280'
                    is_ad: 1
                    product_category_list: '[]'
                    ratio: 720p
                    reflow_cover: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/653/7590123280372190477.jpg
                    region: US
                    sales_flag: 0
                    total_comments_cnt: 0
                    total_digg_1d_cnt: 0
                    total_digg_30d_cnt: 11
                    total_digg_7d_cnt: 0
                    total_digg_cnt: 11
                    total_favorites_cnt: 0
                    total_shares_cnt: 0
                    total_video_sale_cnt: 0
                    total_video_sale_gmv_amt: 0
                    total_views_1d_cnt: 0
                    total_views_30d_cnt: 174
                    total_views_7d_cnt: 0
                    total_views_cnt: 174
                    unique_id: ania.salon
                    user_id: '7263534769727816746'
                    video_desc: ''
                    video_id: '7590123280372190477'
                    video_products: '[]'
                    width: '720'
                requestId: f9edb062-585d-4cbd-a7f5-851067490ef1
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372682468-run
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

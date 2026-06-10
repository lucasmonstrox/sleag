# Video Ranking List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372721575e0) · **`GET /api/v3/echotik/video/ranklist`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna os rankings de vídeos de um período (diário, semanal ou mensal) para uma região, ordenados por tendência (views) ou por vendas. Os valores devolvidos são **incrementais do período** (o que o vídeo ganhou naquele dia/semana/mês), não o acumulado de toda a vida do vídeo. É a fonte canônica de "vídeos em alta". Dados da biblioteca offline (T+1, atualização diária).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `date` | string | Sim | Data do ranking (`yyyy-MM-dd`). Semanal = toda segunda-feira; mensal = primeiro dia do mês. |
| `region` | string | Sim | Código de região/mercado (ex.: `US`, `BR`). |
| `product_category_id` | string | Não | Filtra pelo ID de categoria de 1º nível do produto — usado no ranking de vídeos de venda em live. |
| `created_by_ai` | string | Não | `true` / `false` — se é vídeo de IA. |
| `video_rank_field` | integer | Sim | Campo do ranking: `1` = trending (`total_views_cnt`), `2` = vendas (`total_video_sale_cnt`). |
| `rank_type` | integer | Sim | Tipo de período: `1` = dia, `2` = semana, `3` = mês. |
| `page_num` | integer | Não | Página, começa em 1, máximo 100000. |
| `page_size` | integer | Não | Itens por página, máximo **10**. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/video/ranklist?date=2026-06-09&region=BR&video_rank_field=1&rank_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` significa sucesso. `data` é um array de itens de ranking.

### Campos de `data`
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `avatar` | string | Não | URL da foto de perfil/capa do criador. Expira — use o endpoint de download. |
| `category` | string | Não | Categoria do criador (nicho do influencer). |
| `create_time` | string | Não | Timestamp Unix (segundos, em string) da publicação do vídeo. |
| `duration` | integer | Não | Duração do vídeo em segundos. |
| `nick_name` | string | Não | Nome de exibição (público) do criador. |
| `product_category_list` | string | Não | JSON serializado (string) com as categorias dos produtos do vídeo. |
| `reflow_cover` | string | Não | URL da thumbnail/capa do vídeo. Expira — use o endpoint de download. |
| `region` | string | Não | Região/mercado do vídeo. |
| `sales_flag` | integer | Não | Método principal de venda: `0` = sem vendas, `1` = vendas por vídeo, `2` = vendas por live. |
| `total_comments_cnt` | integer | Não | Comentários no período (incremental). |
| `total_digg_cnt` | integer | Não | Curtidas no período (incremental). |
| `total_favorites_cnt` | integer | Não | Salvamentos/favoritos no período (incremental). |
| `total_shares_cnt` | integer | Não | Compartilhamentos no período (incremental). |
| `total_video_sale_cnt` | integer | Não | Vendas estimadas do vídeo no período. |
| `total_video_sale_gmv_amt` | integer | Não | GMV estimado do vídeo no período. |
| `total_views_cnt` | integer | Não | Views no período (incremental). |
| `unique_id` | string | Não | @handle (tiktok ID) do criador. |
| `user_id` | string | Não | ID interno do TikTok do criador. |
| `video_desc` | string | Não | Legenda/descrição (título) do vídeo. |
| `video_id` | string | Não | ID do vídeo no TikTok. |
| `video_products` | string | Não | JSON serializado (string) com os produtos vendidos pelo vídeo (ex.: `"[1729436418527695003]"`). |
| `created_by_ai` | string | Não | `"true"`/`"false"` — se o vídeo foi gerado por IA. |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "avatar": "https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/853/MS4wLjABAAAAJN3v63JkTkZW72ae9hb2Wlb70uzhU8H3AZEKxIVTg38lwBGTx0tSNH7IBcrocdKd.jpg",
      "category": "Other",
      "create_time": "1769838405",
      "created_by_ai": "false",
      "duration": 15,
      "nick_name": "ﾌひﾚﾉの",
      "product_category_list": "[{ \"category_name\":\"Beauty & Personal Care\",\"category_id\":\"601450\"}]",
      "reflow_cover": "https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/422/7601397977986501919.jpg",
      "region": "US",
      "sales_flag": 1,
      "total_comments_cnt": 0,
      "total_digg_cnt": 0,
      "total_favorites_cnt": 0,
      "total_shares_cnt": 0,
      "total_video_sale_cnt": 5508,
      "total_video_sale_gmv_amt": 44613,
      "total_views_cnt": 0,
      "unique_id": "iamjuliocr",
      "user_id": "6633792625097490438",
      "video_desc": "W huzz magnet 🧲 #fyp #ttshopfinds #seasaltspray #level3 #barbertok ",
      "video_id": "7601397977986501919",
      "video_products": "[1729436418527695003]"
    }
  ],
  "requestId": "b9ff3078-0b12-45b5-8b00-b7017ed18713"
}
```

## Notas & gotchas
- **Valores são incrementais do período**, não acumulados — não confunda com `video/list`/`video/detail`, onde `total_*_cnt` é acumulado.
- `date` precisa bater com a cadência: semanal só aceita segundas; mensal só aceita o dia 1.
- Vendas/GMV são **estimativas**; thumbnails (`avatar`, `reflow_cover`) **expiram**.
- `product_category_list` e `video_products` vêm como **string JSON** — parseie no cliente.

## Relevância para o TIKSPY
- **Base nº 1 de "Criativos em alta"**: `video_rank_field=1` (trending) e `=2` (vendas), em janelas diária/semanal/mensal por região, é exatamente o feed de tendências do dashboard.
- Já entrega ranking pronto sem precisar ordenar `video/list` no cliente; título via `video_desc`, GMV via `total_video_sale_gmv_amt`, criador via `unique_id`/`nick_name`/`avatar`.
- `product_category_id` permite a visão de tendências por categoria (ex.: "vídeos em alta em beleza").

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
  /api/v3/echotik/video/ranklist:
    get:
      summary: Video Ranking List - EchoTik
      deprecated: false
      description: >-
        1. The values ​​returned in the rankings are incremental data for the
        current period.


        2. The date field is in yyyy-MM-dd format. The rankings are divided into
        three categories: daily, weekly, and monthly. Weekly rankings are for
        every Monday, and monthly rankings are for the first day of every month.


        3.video_rank_field Explanation: video_rank_field=1 represents the
        trending list, video_rank_field=2 represents the sales ranking list.
      tags:
        - Video
      parameters:
        - name: date
          in: query
          description: Specific time of the yyyy-MM-dd format ranking list
          required: true
          schema:
            type: string
        - name: region
          in: query
          description: Region code, region, such as US
          required: true
          schema:
            type: string
        - name: product_category_id
          in: query
          description: >-
            Filtering by the first-level category ID of products, used for
            filtering product categories in the live-streaming sales video
            rankings
          required: false
          schema:
            type: string
        - name: created_by_ai
          in: query
          description: true / false, whether it is an AI video
          required: false
          schema:
            type: string
        - name: video_rank_field
          in: query
          description: Ranking field 1=total_views_cnt 2=total_video_sale_cnt
          required: true
          schema:
            type: integer
        - name: rank_type
          in: query
          description: Rank Type 1=day 2=week 3=month
          required: true
          schema:
            type: integer
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
                        avatar:
                          type: string
                          title: >-
                            The link to the influencer's profile picture/cover
                            is provided. Please use the download interface to
                            access it.
                        category:
                          type: string
                          title: Creator categories
                        create_time:
                          type: string
                        duration:
                          type: integer
                        nick_name:
                          type: string
                        product_category_list:
                          type: string
                          title: Product category information
                        reflow_cover:
                          type: string
                          title: >-
                            Video cover image URL; please use the download link
                            to access it.
                        region:
                          type: string
                        sales_flag:
                          type: integer
                          title: >-
                            Main sales methods: 0 (no sales), 1 (video sales), 2
                            (live streaming sales)
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
                          type: integer
                          title: Video sales GMV (estimated)
                        total_views_cnt:
                          type: integer
                        unique_id:
                          type: string
                          title: tiktok ID
                        user_id:
                          type: string
                        video_desc:
                          type: string
                        video_id:
                          type: string
                        video_products:
                          type: string
                          title: Video sales product information
                        created_by_ai:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - category
                        - create_time
                        - duration
                        - nick_name
                        - product_category_list
                        - reflow_cover
                        - region
                        - sales_flag
                        - total_comments_cnt
                        - total_digg_cnt
                        - total_favorites_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_cnt
                        - unique_id
                        - user_id
                        - video_desc
                        - video_id
                        - video_products
                        - created_by_ai
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372721575-run
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
